
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Liste de Mots Doux Thématiques (Matcha, Douceur & Hello Kitty)
  const notes = [
    "« Tu es encore plus réconfortante qu'un bon Matcha Latte chaud un jour de pluie 🍵 »",
    "« Sache que tu es la personne la plus mignonne que je connaisse (après Hello Kitty 😉) 🎀 »",
    "« Merci d'apporter autant de douceur et de bonnes ondes dans ma vie au quotidien. »",
    "« J'ai trop hâte qu'on se fasse notre prochaine pause café / matcha ensemble ! »",
    "« Juste un petit rappel : tu es formidable et je suis trop content d'être avec toi ✨ »",
    "« Ton sourire me fait toujours le même effet. Passe une belle journée ma précieuse ! 🌸 »"
  ];

  const noteDisplay = document.getElementById('noteDisplay');
  const newNoteBtn = document.getElementById('newNoteBtn');
  let lastIndex = -1;

  newNoteBtn.addEventListener('click', () => {
    noteDisplay.style.opacity = '0';

    setTimeout(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * notes.length);
      } while (randomIndex === lastIndex && notes.length > 1);
      
      lastIndex = randomIndex;
      noteDisplay.querySelector('.note-text').innerText = notes[randomIndex];
      noteDisplay.style.opacity = '1';
    }, 200);
  });

  // 2. Sauvegarde des cases cochées
  const checkboxes = document.querySelectorAll('.bucket-item input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    const savedState = localStorage.getItem('hk_matcha_' + checkbox.id);
    if (savedState === 'true') checkbox.checked = true;

    checkbox.addEventListener('change', (e) => {
      localStorage.setItem('hk_matcha_' + e.target.id, e.target.checked);
    });
  });

  // 3. Audio Lofi Relaxant
  let audioCtx = null;
  let isPlaying = false;
  const audioBtn = document.getElementById('audioBtn');

  audioBtn.addEventListener('click', () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    if (!isPlaying) {
      isPlaying = true;
      audioBtn.querySelector('span:last-child').innerText = 'Musique active 🎵';
      playLofiNote();
    }
  });

  function playLofiNote() {
    if (!isPlaying) return;
    const chords = [261.63, 329.63, 392.00, 440.00, 349.23];
    const freq = chords[Math.floor(Math.random() * chords.length)];
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 2.5);
    
    setTimeout(playLofiNote, 1100);
  }
});