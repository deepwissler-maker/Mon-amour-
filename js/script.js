document.addEventListener('DOMContentLoaded', () => {

  // 1. Gestion du Panneau d'administration
  const togglePanelBtn = document.getElementById('togglePanelBtn');
  const panelContent = document.getElementById('panelContent');

  togglePanelBtn.addEventListener('click', () => {
    panelContent.classList.toggle('open');
  });

  // 2. Changer le thème de couleurs
  const themeSelect = document.getElementById('themeSelect');
  const savedTheme = localStorage.getItem('user_theme') || 'matcha';
  document.body.setAttribute('data-theme', savedTheme);
  themeSelect.value = savedTheme;

  themeSelect.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    document.body.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('user_theme', selectedTheme);
  });

  // 3. Sauvegarde automatique des textes modifiables
  const editableIds = ['mainTitle', 'subTitle', 'loveLetterText'];
  editableIds.forEach((id) => {
    const el = document.getElementById(id);
    const savedVal = localStorage.getItem('user_text_' + id);
    if (savedVal) el.innerText = savedVal;

    el.addEventListener('input', () => {
      localStorage.setItem('user_text_' + id, el.innerText);
    });
  });

  // 4. Import et affichage des photos depuis l'appareil
  const photoInput = document.getElementById('photoInput');
  const photoGallery = document.getElementById('photoGallery');

  function loadPhotos() {
    const savedPhotos = JSON.parse(localStorage.getItem('user_photos') || '[]');
    photoGallery.innerHTML = '';
    savedPhotos.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      img.className = 'photo-item';
      photoGallery.appendChild(img);
    });
  }

  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const savedPhotos = JSON.parse(localStorage.getItem('user_photos') || '[]');
        savedPhotos.push(event.target.result);
        localStorage.setItem('user_photos', JSON.stringify(savedPhotos));
        loadPhotos();
      };
      reader.readAsDataURL(file);
    }
  });

  loadPhotos();

  // 5. Synthétiseur de musique romantique d'ambiance
  let audioCtx = null;
  let isPlaying = false;
  const audioToggle = document.getElementById('audioToggle');
  const musicSelect = document.getElementById('musicSelect');

  audioToggle.addEventListener('click', () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    isPlaying = !isPlaying;
    document.getElementById('musicTitle').innerText = isPlaying ? 'Pause Musique' : 'Lancer la musique';
    
    if (isPlaying) playMusicTrack();
  });

  function playMusicTrack() {
    if (!isPlaying) return;
    
    const style = musicSelect.value;
    let notes = [261.63, 329.63, 392.00, 440.00]; // Lofi Matcha
    if (style === 'piano') notes = [293.66, 349.23, 440.00, 523.25]; // Piano
    if (style === 'ambient') notes = [220.00, 277.18, 329.63, 415.30]; // Relaxing

    const freq = notes[Math.floor(Math.random() * notes.length)];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = style === 'piano' ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.0);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 3.0);

    setTimeout(playMusicTrack, 1200);
  }
});