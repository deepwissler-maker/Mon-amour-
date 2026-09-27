document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Particules d'arrière-plan
  const particlesContainer = document.getElementById('particlesContainer');
  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    particlesContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 8000);
  }
  setInterval(createParticle, 350);

  // 2. Mots Doux & Pensees (Facile à enrichir !)
  const notes = [
    "« Sache que ton bonheur compte énormément pour moi au quotidien. »",
    "« J'adore nos discussions et la complicité qu'on crée jour après jour. »",
    "« Merci d'être toi-même, c'est ce qui fait tout ton charme. »",
    "« Chaque petit moment passé avec toi est un vrai plaisir. »",
    "« Tu as cette capacité unique de me faire sourire sans même forcer. »",
    "« Hâte de cocher tous nos projets ensemble ! »"
  ];

  const noteDisplay = document.getElementById('noteDisplay');
  const newNoteBtn = document.getElementById('newNoteBtn');
  let lastIndex = -1;

  newNoteBtn.addEventListener('click', () => {
    noteDisplay.style.opacity = '0';
    noteDisplay.style.transform = 'translateY(5px)';

    setTimeout(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * notes.length);
      } while (randomIndex === lastIndex && notes.length > 1);
      
      lastIndex = randomIndex;
      noteDisplay.querySelector('.note-text').innerText = notes[randomIndex];
      
      noteDisplay.style.opacity = '1';
      noteDisplay.style.transform = 'translateY(0)';
    }, 250);
  });

  // 3. Sauvegarde automatique des cases cochées (dans le navigateur)
  const checkboxes = document.querySelectorAll('.bucket-item input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    const savedState = localStorage.getItem(checkbox.id);
    if (savedState === 'true') checkbox.checked = true;

    checkbox.addEventListener('change', (e) => {
      localStorage.setItem(e.target.id, e.target.checked);
    });
  });

  // 4. Synthesizer Musique Douce
  let audioCtx = null;
  let isPlaying = false;
  const audioBtn = document.getElementById('audioBtn');

  audioBtn.addEventListener('click', () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    if (!isPlaying) {
      isPlaying = true;
      audioBtn.querySelector('span').innerText = 'Musique active';
      playSoftTune();
    }
  });

  function playSoftTune() {
    if (!isPlaying) return;
    const freqs = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23];
    const freq = freqs[Math.floor(Math.random() * freqs.length)];
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.025, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.2);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 2.2);
    
    setTimeout(playSoftTune, 900);
  }
});