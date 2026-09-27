/* =====================================================
   NOTRE ESPACE — script.js
   Tout est sauvegardé dans localStorage, rien ne se perd
   au rafraîchissement de la page.
   ===================================================== */

(() => {
  "use strict";

  const STORAGE_KEY = "notre-espace-v1";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------
     ÉTAT PAR DÉFAUT
     ----------------------------------------------------- */
  const defaultState = {
    theme: "matcha",
    title: "Notre petit monde matcha & câlins",
    subtitle: "Un coin d'internet rien qu'à nous, doux comme un latte partagé un dimanche pluvieux.",
    motDuJour: "Chaque jour à tes côtés a le goût d'un matcha bien préparé : réconfortant et un peu magique.",
    lettre: `Mon petit matcha latte,

Je voulais te laisser ces quelques mots ici, dans notre espace, pour que tu puisses les relire quand tu veux — même à trois heures du matin en pyjama.

Merci d'exister, merci de rester, merci pour tout ce qu'on construit doucement, jour après jour. J'ai hâte de continuer cette histoire avec toi, une tasse chaude à la main et ton rire pas loin.

Je t'aime, fort.`,
    counterMode: "since", // off | since | countdown
    counterDate: "",
    photos: [], // { id, src, caption }
    bucketList: [
      { id: "b1", text: "Se faire un matcha latte ensemble", done: false },
      { id: "b2", text: "Voyage improvisé un week-end", done: false },
      { id: "b3", text: "Soirée film + plaid + popcorn", done: false }
    ],
    volume: 40
  };

  const penseesDouces = [
    "Tu es la personne la plus douce que je connaisse.",
    "Ton rire est mon son préféré au monde.",
    "Avec toi, même les journées grises ont l'air d'aller.",
    "Tu rends les petites choses du quotidien précieuses.",
    "Je suis fier·e de tout ce que tu deviens, jour après jour.",
    "Ta présence suffit à me rassurer.",
    "Tu as un cœur immense, ne le laisse jamais s'endurcir.",
    "Chaque câlin avec toi est un petit refuge.",
    "Tu mérites autant de douceur que celle que tu donnes.",
    "Je choisirais encore et toujours de marcher à tes côtés.",
    "Tu es ma personne préférée à qui raconter ma journée.",
    "Ta patience avec moi ne passe jamais inaperçue."
  ];

  let state = loadState();

  /* -----------------------------------------------------
     PERSISTANCE
     ----------------------------------------------------- */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredCloneSafe(defaultState);
      const parsed = JSON.parse(raw);
      return { ...structuredCloneSafe(defaultState), ...parsed };
    } catch (e) {
      console.warn("Lecture localStorage impossible, valeurs par défaut utilisées.", e);
      return structuredCloneSafe(defaultState);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Sauvegarde impossible (localStorage plein ou indisponible).", e);
      showToast("⚠️ Impossible de sauvegarder (stockage plein ?)");
    }
  }

  function structuredCloneSafe(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /* -----------------------------------------------------
     TOAST
     ----------------------------------------------------- */
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => { toast.hidden = true; }, 300);
    }, 2200);
  }

  /* -----------------------------------------------------
     RENDU DU CONTENU TEXTE
     ----------------------------------------------------- */
  function renderTexts() {
    document.body.setAttribute("data-theme", state.theme);
    document.getElementById("mainTitle").textContent = state.title;
    document.getElementById("mainSubtitle").textContent = state.subtitle;
    document.getElementById("motDuJour").textContent = state.motDuJour;
    document.getElementById("lettreAmour").textContent = state.lettre;

    document.getElementById("cfgTitle").value = state.title;
    document.getElementById("cfgSubtitle").value = state.subtitle;
    document.getElementById("cfgMot").value = state.motDuJour;
    document.getElementById("cfgLettre").value = state.lettre;
    document.getElementById("cfgCounterMode").value = state.counterMode;
    document.getElementById("cfgCounterDate").value = state.counterDate;

    document.querySelectorAll(".theme-swatch").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.theme === state.theme);
    });
  }

  /* -----------------------------------------------------
     COMPTEUR DE JOURS
     ----------------------------------------------------- */
  function renderCounter() {
    const widget = document.getElementById("counterWidget");
    const numberEl = document.getElementById("counterNumber");
    const labelEl = document.getElementById("counterLabel");

    if (state.counterMode === "off" || !state.counterDate) {
      widget.style.display = "none";
      return;
    }
    widget.style.display = "inline-flex";

    const target = new Date(state.counterDate + "T00:00:00");
    const now = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;

    if (state.counterMode === "since") {
      const diff = Math.floor((now - target) / msPerDay);
      numberEl.textContent = diff >= 0 ? diff : 0;
      labelEl.textContent = diff === 1 ? "jour ensemble 💗" : "jours ensemble 💗";
    } else if (state.counterMode === "countdown") {
      const diff = Math.ceil((target - now) / msPerDay);
      if (diff > 0) {
        numberEl.textContent = diff;
        labelEl.textContent = diff === 1 ? "jour avant le grand jour ✨" : "jours avant le grand jour ✨";
      } else {
        numberEl.textContent = "🎉";
        labelEl.textContent = "c'est aujourd'hui !";
      }
    }
  }

  /* -----------------------------------------------------
     GÉNÉRATEUR DE PENSÉES DOUCES
     ----------------------------------------------------- */
  function initPensees() {
    const btn = document.getElementById("btnPensee");
    const affichage = document.getElementById("penseeAffichage");
    btn.addEventListener("click", () => {
      const random = penseesDouces[Math.floor(Math.random() * penseesDouces.length)];
      affichage.textContent = "💌 " + random;
      affichage.classList.remove("pop");
      void affichage.offsetWidth; // relance l'animation
      affichage.classList.add("pop");
    });
  }

  /* -----------------------------------------------------
     GALERIE DE SOUVENIRS
     ----------------------------------------------------- */
  function renderGallery() {
    const grid = document.getElementById("galerieGrid");
    grid.innerHTML = "";

    if (!state.photos.length) {
      const empty = document.createElement("p");
      empty.className = "galerie-empty";
      empty.textContent = "Aucune photo pour l'instant — ajoute vos premiers souvenirs ! 🌱";
      grid.appendChild(empty);
      return;
    }

    state.photos.forEach(photo => {
      const fig = document.createElement("figure");
      fig.className = "polaroid";

      const wrap = document.createElement("div");
      wrap.className = "photo-wrap";
      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.caption || "Souvenir";
      wrap.appendChild(img);

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-photo";
      removeBtn.type = "button";
      removeBtn.textContent = "✕";
      removeBtn.setAttribute("aria-label", "Supprimer cette photo");
      removeBtn.addEventListener("click", () => {
        state.photos = state.photos.filter(p => p.id !== photo.id);
        saveState();
        renderGallery();
        showToast("Photo supprimée");
      });

      const caption = document.createElement("figcaption");
      const captionInput = document.createElement("input");
      captionInput.type = "text";
      captionInput.placeholder = "Ajouter une légende…";
      captionInput.value = photo.caption || "";
      captionInput.maxLength = 60;
      captionInput.addEventListener("input", () => {
        photo.caption = captionInput.value;
        saveState();
      });
      caption.appendChild(captionInput);

      fig.appendChild(wrap);
      fig.appendChild(removeBtn);
      fig.appendChild(caption);
      grid.appendChild(fig);
    });
  }

  function initGalleryUpload() {
    const input = document.getElementById("photoInput");
    const zone = document.querySelector(".upload-zone");

    input.addEventListener("change", () => handleFiles(input.files));

    ["dragover", "dragenter"].forEach(evt =>
      zone.addEventListener(evt, e => { e.preventDefault(); zone.style.background = "rgba(255,255,255,.5)"; })
    );
    ["dragleave", "drop"].forEach(evt =>
      zone.addEventListener(evt, e => { e.preventDefault(); zone.style.background = ""; })
    );
    zone.addEventListener("drop", e => {
      if (e.dataTransfer && e.dataTransfer.files) handleFiles(e.dataTransfer.files);
    });
  }

  function handleFiles(fileList) {
    const files = Array.from(fileList).filter(f => f.type.startsWith("image/"));
    if (!files.length) return;

    let remaining = files.length;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        state.photos.push({
          id: "p" + Date.now() + Math.random().toString(36).slice(2, 7),
          src: reader.result,
          caption: ""
        });
        remaining--;
        if (remaining === 0) {
          saveState();
          renderGallery();
          showToast("📷 Photo(s) ajoutée(s)");
        }
      };
      reader.onerror = () => showToast("⚠️ Impossible de lire cette image");
      reader.readAsDataURL(file);
    });
  }

  /* -----------------------------------------------------
     BUCKET LIST
     ----------------------------------------------------- */
  function renderBucketList() {
    const ul = document.getElementById("bucketListItems");
    ul.innerHTML = "";

    state.bucketList.forEach(item => {
      const li = document.createElement("li");
      li.className = item.done ? "done" : "";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.done;
      checkbox.setAttribute("aria-label", "Marquer comme fait : " + item.text);
      checkbox.addEventListener("change", () => {
        item.done = checkbox.checked;
        saveState();
        renderBucketList();
      });

      const span = document.createElement("span");
      span.className = "bucket-text";
      span.textContent = item.text;

      const removeBtn = document.createElement("button");
      removeBtn.className = "bucket-remove";
      removeBtn.type = "button";
      removeBtn.textContent = "🗑️";
      removeBtn.setAttribute("aria-label", "Supprimer ce souhait");
      removeBtn.addEventListener("click", () => {
        state.bucketList = state.bucketList.filter(i => i.id !== item.id);
        saveState();
        renderBucketList();
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(removeBtn);
      ul.appendChild(li);
    });
  }

  function initBucketForm() {
    const form = document.getElementById("bucketForm");
    const input = document.getElementById("bucketInput");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      state.bucketList.push({ id: "b" + Date.now(), text, done: false });
      input.value = "";
      saveState();
      renderBucketList();
    });
  }

  /* -----------------------------------------------------
     PANNEAUX FLOTTANTS (config / audio)
     ----------------------------------------------------- */
  function initPanels() {
    const openConfig = document.getElementById("openConfig");
    const openAudio = document.getElementById("openAudio");
    const configPanel = document.getElementById("configPanel");
    const audioPanel = document.getElementById("audioPanel");

    openConfig.addEventListener("click", () => togglePanel(configPanel, true));
    openAudio.addEventListener("click", () => togglePanel(audioPanel, true));

    document.querySelectorAll("[data-close]").forEach(btn => {
      btn.addEventListener("click", () => {
        togglePanel(document.getElementById(btn.dataset.close), false);
      });
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        togglePanel(configPanel, false);
        togglePanel(audioPanel, false);
      }
    });
  }

  function togglePanel(panel, show) {
    panel.hidden = !show;
  }

  function initConfigInputs() {
    const themeButtons = document.querySelectorAll(".theme-swatch");
    themeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        state.theme = btn.dataset.theme;
        renderTexts();
        saveState();
        showToast("🎨 Ambiance changée");
      });
    });

    bindTextField("cfgTitle", "title");
    bindTextField("cfgSubtitle", "subtitle");
    bindTextField("cfgMot", "motDuJour");
    bindTextField("cfgLettre", "lettre");

    document.getElementById("cfgCounterMode").addEventListener("change", e => {
      state.counterMode = e.target.value;
      saveState();
      renderCounter();
    });
    document.getElementById("cfgCounterDate").addEventListener("change", e => {
      state.counterDate = e.target.value;
      saveState();
      renderCounter();
    });

    document.getElementById("btnResetAll").addEventListener("click", () => {
      if (confirm("Réinitialiser tout le contenu (textes, photos, thème, souhaits) ? Cette action est irréversible.")) {
        localStorage.removeItem(STORAGE_KEY);
        state = structuredCloneSafe(defaultState);
        renderAll();
        showToast("♻️ Contenu réinitialisé");
      }
    });
  }

  function bindTextField(inputId, stateKey) {
    const el = document.getElementById(inputId);
    el.addEventListener("input", () => {
      state[stateKey] = el.value;
      document.getElementById(mapKeyToDisplayId(stateKey)).textContent = el.value;
      saveState();
    });
  }

  function mapKeyToDisplayId(stateKey) {
    return {
      title: "mainTitle",
      subtitle: "mainSubtitle",
      motDuJour: "motDuJour",
      lettre: "lettreAmour"
    }[stateKey];
  }

  /* -----------------------------------------------------
     AUDIO — Web Audio API (synthé, aucun fichier externe)
     ----------------------------------------------------- */
  const AudioEngine = (() => {
    let ctx = null;
    let masterGain = null;
    let isPlaying = false;
    let currentAmbiance = "piano";
    let scheduledNodes = [];
    let loopTimer = null;

    function ensureContext() {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = ctx.createGain();
        masterGain.gain.value = (state.volume || 40) / 100 * 0.5;
        masterGain.connect(ctx.destination);
      }
    }

    function setVolume(v) {
      if (masterGain) masterGain.gain.setTargetAtTime(v / 100 * 0.5, ctx.currentTime, 0.1);
    }

    function stopAll() {
      clearTimeout(loopTimer);
      scheduledNodes.forEach(n => { try { n.stop(); } catch (e) {} });
      scheduledNodes = [];
    }

    function playTone(freq, start, duration, type = "sine", gainValue = 0.3) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(gainValue, start + 0.4);
      g.gain.linearRampToValueAtTime(0, start + duration);
      osc.connect(g).connect(masterGain);
      osc.start(start);
      osc.stop(start + duration + 0.1);
      scheduledNodes.push(osc);
    }

    function createNoiseBuffer(durationSec) {
      const bufferSize = ctx.sampleRate * durationSec;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      return buffer;
    }

    /* --- Ambiance : Piano doux --- */
    function loopPiano() {
      const chords = [
        [261.63, 329.63, 392.00], // Do maj
        [220.00, 261.63, 329.63], // La min
        [174.61, 220.00, 261.63], // Fa maj
        [196.00, 246.94, 293.66]  // Sol maj
      ];
      let i = 0;
      const step = () => {
        if (!isPlaying || currentAmbiance !== "piano") return;
        const now = ctx.currentTime;
        chords[i % chords.length].forEach((f, idx) => {
          playTone(f, now + idx * 0.06, 3.2, "sine", 0.16);
          playTone(f * 2, now + idx * 0.06, 2.2, "triangle", 0.05);
        });
        i++;
        loopTimer = setTimeout(step, 3400);
      };
      step();
    }

    /* --- Ambiance : Pluie & café --- */
    let rainSource = null;
    let rainFilter = null;
    function loopPluie() {
      const noiseBuffer = createNoiseBuffer(4);
      rainSource = ctx.createBufferSource();
      rainSource.buffer = noiseBuffer;
      rainSource.loop = true;

      rainFilter = ctx.createBiquadFilter();
      rainFilter.type = "bandpass";
      rainFilter.frequency.value = 2200;
      rainFilter.Q.value = 0.6;

      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.35;

      rainSource.connect(rainFilter).connect(rainGain).connect(masterGain);
      rainSource.start();
      scheduledNodes.push(rainSource);

      // petits "cliquetis" de tasse aléatoires
      const clink = () => {
        if (!isPlaying || currentAmbiance !== "pluie") return;
        const now = ctx.currentTime;
        playTone(1200 + Math.random() * 400, now, 0.25, "triangle", 0.04);
        loopTimer = setTimeout(clink, 2500 + Math.random() * 3500);
      };
      clink();
    }

    /* --- Ambiance : Lofi matcha --- */
    function loopLofi() {
      const notes = [220.0, 246.94, 261.63, 293.66, 329.63];
      const noiseBuffer = createNoiseBuffer(6);
      const crackle = ctx.createBufferSource();
      crackle.buffer = noiseBuffer;
      crackle.loop = true;
      const crackleFilter = ctx.createBiquadFilter();
      crackleFilter.type = "highpass";
      crackleFilter.frequency.value = 6000;
      const crackleGain = ctx.createGain();
      crackleGain.gain.value = 0.03;
      crackle.connect(crackleFilter).connect(crackleGain).connect(masterGain);
      crackle.start();
      scheduledNodes.push(crackle);

      const step = () => {
        if (!isPlaying || currentAmbiance !== "lofi") return;
        const now = ctx.currentTime;
        const n1 = notes[Math.floor(Math.random() * notes.length)];
        const n2 = notes[Math.floor(Math.random() * notes.length)];
        playTone(n1, now, 2.6, "sine", 0.12);
        playTone(n2 * 1.5, now + 0.5, 2.0, "sine", 0.07);
        loopTimer = setTimeout(step, 2600);
      };
      step();
    }

    function startAmbiance(name) {
      stopAll();
      currentAmbiance = name;
      if (name === "piano") loopPiano();
      else if (name === "pluie") loopPluie();
      else if (name === "lofi") loopLofi();
    }

    function play(ambiance) {
      ensureContext();
      if (ctx.state === "suspended") ctx.resume();
      isPlaying = true;
      startAmbiance(ambiance);
    }

    function pause() {
      isPlaying = false;
      stopAll();
    }

    function changeAmbiance(name) {
      if (isPlaying) {
        play(name);
      } else {
        currentAmbiance = name;
      }
    }

    return { play, pause, changeAmbiance, setVolume, get isPlaying() { return isPlaying; } };
  })();

  function initAudioControls() {
    const playPauseBtn = document.getElementById("playPauseBtn");
    const ambianceSelect = document.getElementById("ambianceSelect");
    const volumeRange = document.getElementById("volumeRange");
    const visual = document.getElementById("audioVisual");

    volumeRange.value = state.volume;

    playPauseBtn.addEventListener("click", () => {
      if (AudioEngine.isPlaying) {
        AudioEngine.pause();
        playPauseBtn.textContent = "▶️ Lecture";
        visual.classList.remove("playing");
      } else {
        AudioEngine.play(ambianceSelect.value);
        playPauseBtn.textContent = "⏸️ Pause";
        visual.classList.add("playing");
      }
    });

    ambianceSelect.addEventListener("change", () => {
      AudioEngine.changeAmbiance(ambianceSelect.value);
    });

    volumeRange.addEventListener("input", () => {
      state.volume = Number(volumeRange.value);
      AudioEngine.setVolume(state.volume);
      saveState();
    });
  }

  /* -----------------------------------------------------
     FOND ANIMÉ — pluie de cœurs / étincelles légère
     ----------------------------------------------------- */
  function initBackgroundAnimation() {
    if (prefersReducedMotion) return;

    const canvas = document.getElementById("bg-canvas");
    const ctx2d = canvas.getContext("2d");
    let particles = [];
    let width, height;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    function themeParticles() {
      const cs = getComputedStyle(document.body);
      return [
        cs.getPropertyValue("--particle").replace(/['"]/g, "").trim() || "🍃",
        cs.getPropertyValue("--particle-2").replace(/['"]/g, "").trim() || "💗"
      ];
    }

    function spawn() {
      const symbols = themeParticles();
      particles.push({
        x: Math.random() * width,
        y: height + 20,
        size: 14 + Math.random() * 14,
        speed: 0.3 + Math.random() * 0.6,
        drift: (Math.random() - 0.5) * 0.6,
        symbol: symbols[Math.random() < 0.5 ? 0 : 1],
        opacity: 0.25 + Math.random() * 0.4,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02
      });
      if (particles.length > 26) particles.shift();
    }

    let spawnTimer = setInterval(spawn, 900);

    function animate() {
      ctx2d.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y -= p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        ctx2d.save();
        ctx2d.globalAlpha = p.opacity;
        ctx2d.translate(p.x, p.y);
        ctx2d.rotate(p.angle);
        ctx2d.font = p.size + "px sans-serif";
        ctx2d.textAlign = "center";
        ctx2d.fillText(p.symbol, 0, 0);
        ctx2d.restore();
      });
      particles = particles.filter(p => p.y > -40);
      requestAnimationFrame(animate);
    }
    animate();

    // nettoyage si l'onglet est masqué longtemps (évite l'accumulation)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearInterval(spawnTimer);
      } else {
        spawnTimer = setInterval(spawn, 900);
      }
    });
  }

  /* -----------------------------------------------------
     INITIALISATION GLOBALE
     ----------------------------------------------------- */
  function renderAll() {
    renderTexts();
    renderCounter();
    renderGallery();
    renderBucketList();
  }

  function init() {
    document.getElementById("footerYear").textContent = new Date().getFullYear();
    renderAll();
    initPensees();
    initGalleryUpload();
    initBucketForm();
    initPanels();
    initConfigInputs();
    initAudioControls();
    initBackgroundAnimation();

    // Recalcule le compteur chaque minute (utile si "aujourd'hui" bascule)
    setInterval(renderCounter, 60000);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
