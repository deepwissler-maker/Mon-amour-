/* ==========================================================================
   CONFIGURABLE PLAYLIST & APP LOGIC
   ========================================================================== */

// 🎵 1. TA PLAYLIST MUSICALE (MODIFIE OU AJOUTE TES MORCEAUX ICI)
const playlist = [
  {
    title: "Lofi Romance",
    artist: "Doux Souvenirs",
    // Exemple d'audio en ligne (remplace le lien MP3 par tes propres fichiers si besoin)
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    coverSrc: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=300&q=80"
  },
  {
    title: "Piano Douceur",
    artist: "Nuit Étoilée",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=relaxing-piano-10701.mp3",
    coverSrc: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=300&q=80"
  }
];

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 2. ÉDITION & SAUVEGARDE DYNAMIQUE DES TEXTES
  // ==========================================
  const togglePanelBtn = document.getElementById('togglePanelBtn');
  const panelContent = document.querySelector('.panel-content');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');

  const inputTitle = document.getElementById('inputTitle');
  const inputSubtitle = document.getElementById('inputSubtitle');
  const inputMessage = document.getElementById('inputMessage');

  const displayTitle = document.getElementById('displayTitle');
  const displaySubtitle = document.getElementById('displaySubtitle');
  const displayMessage = document.getElementById('displayMessage');

  // Ouvrir/Fermer le panneau d'édition
  togglePanelBtn.addEventListener('click', () => {
    panelContent.classList.toggle('open');
  });

  // Charger les données sauvegardées (localStorage)
  function loadSavedData() {
    const savedTitle = localStorage.getItem('love_site_title');
    const savedSubtitle = localStorage.getItem('love_site_subtitle');
    const savedMessage = localStorage.getItem('love_site_message');

    if (savedTitle) {
      displayTitle.innerText = savedTitle;
      inputTitle.value = savedTitle;
    }
    if (savedSubtitle) {
      displaySubtitle.innerText = savedSubtitle;
      inputSubtitle.value = savedSubtitle;
    }
    if (savedMessage) {
      displayMessage.innerText = savedMessage;
      inputMessage.value = savedMessage;
    }
  }

  // Enregistrer les modifications
  saveSettingsBtn.addEventListener('click', () => {
    if (inputTitle.value.trim() !== "") {
      displayTitle.innerText = inputTitle.value;
      localStorage.setItem('love_site_title', inputTitle.value);
    }
    if (inputSubtitle.value.trim() !== "") {
      displaySubtitle.innerText = inputSubtitle.value;
      localStorage.setItem('love_site_subtitle', inputSubtitle.value);
    }
    if (inputMessage.value.trim() !== "") {
      displayMessage.innerText = inputMessage.value;
      localStorage.setItem('love_site_message', inputMessage.value);
    }

    panelContent.classList.remove('open');
  });

  loadSavedData();

  // ==========================================
  // 3. GESTION DU CHARGEMENT DE PHOTOS
  // ==========================================
  const photoUploader = document.getElementById('photoUploader');
  const photoGrid = document.getElementById('photoGrid');

  function loadSavedPhotos() {
    const savedPhotos = JSON.parse(localStorage.getItem('love_site_photos') || '[]');
    if (savedPhotos.length > 0) {
      photoGrid.innerHTML = ''; // Effacer les images par défaut
      savedPhotos.forEach((src, idx) => {
        addPhotoToGrid(src, `Souvenir ${idx + 1}`);
      });
    }
  }

  function addPhotoToGrid(src, caption) {
    const photoDiv = document.createElement('div');
    photoDiv.className = 'photo-item';
    photoDiv.innerHTML = `
      <img src="${src}" alt="Souvenir">
      <span class="photo-caption">${caption}</span>
    `;
    photoGrid.appendChild(photoDiv);
  }

  photoUploader.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const savedPhotos = JSON.parse(localStorage.getItem('love_site_photos') || '[]');

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Img = event.target.result;
          savedPhotos.push(base64Img);
          localStorage.setItem('love_site_photos', JSON.stringify(savedPhotos));
          addPhotoToGrid(base64Img, 'Nouveau Souvenir ❤️');
        };
        reader.readAsDataURL(file);
      });
    }
  });

  loadSavedPhotos();

  // ==========================================
  // 4. LECTEUR AUDIO COMPLET & PERFORMANT
  // ==========================================
  const audioPlayer = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('playBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const trackCover = document.getElementById('trackCover');
  const trackTitle = document.getElementById('trackTitle');
  const trackArtist = document.getElementById('trackArtist');
  const progressBar = document.getElementById('progressBar');
  const progressContainer = document.getElementById('progressContainer');
  const currentTimeEl = document.getElementById('currentTime');
  const durationTimeEl = document.getElementById('durationTime');
  const volumeSlider = document.getElementById('volumeSlider');

  let currentTrackIndex = 0;
  let isPlaying = false;

  function loadTrack(index) {
    const track = playlist[index];
    trackTitle.innerText = track.title;
    trackArtist.innerText = track.artist;
    trackCover.src = track.coverSrc;
    audioPlayer.src = track.audioSrc;
  }

  function playTrack() {
    isPlaying = true;
    audioPlayer.play();
    playBtn.innerText = '⏸️';
  }

  function pauseTrack() {
    isPlaying = false;
    audioPlayer.pause();
    playBtn.innerText = '▶️';
  }

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  });

  prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
  });

  nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
  });

  // Mise à jour de la barre de progression
  audioPlayer.addEventListener('timeupdate', (e) => {
    const { currentTime, duration } = e.target;
    if (duration) {
      const progressPercent = (currentTime / duration) * 100;
      progressBar.style.width = `${progressPercent}%`;

      // Formatage du temps (MM:SS)
      const formatTime = (time) => Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2);
      currentTimeEl.innerText = formatTime(currentTime);
      durationTimeEl.innerText = formatTime(duration);
    }
  });

  // Navigation dans la chanson via la barre
  progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
  });

  // Gestion du Volume
  volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value;
  });

  // Morceau suivant automatique quand un titre se termine
  audioPlayer.addEventListener('ended', () => {
    nextBtn.click();
  });

  // Initialisation du premier morceau
  loadTrack(currentTrackIndex);

  // ==========================================
  // 5. ANIMATION DE CŒURS EN ARRIÈRE-PLAN
  // ==========================================
  const heartsContainer = document.getElementById('heartsContainer');

  function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerText = ['❤️', '💖', '🌹', '✨', '💕'][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 4 + 6 + 's';
    heart.style.fontSize = Math.random() * 0.8 + 1 + 'rem';

    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 10000);
  }

  setInterval(createFloatingHeart, 600);
});