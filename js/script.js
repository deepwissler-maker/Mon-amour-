document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Génération de particules discrètes en arrière-plan ---
  const particlesContainer = document.getElementById('particlesContainer');
  
  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    particle.style.opacity = Math.random() * 0.7 + 0.3;
    
    particlesContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 8000);
  }
  setInterval(createParticle, 300);

  // --- 2. Navigation entre les étapes ---
  const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');
  const continueBtn = document.getElementById('continueBtn');
  
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');

  function switchStep(currentStep, nextStep) {
    currentStep.classList.remove('active');
    setTimeout(() => {
      nextStep.classList.add('active');
    }, 300);
  }

  openEnvelopeBtn.addEventListener('click', () => switchStep(step1, step2));
  continueBtn.addEventListener('click', () => switchStep(step2, step3));

  // --- 3. Esquive du bouton "Non" ---
  const noBtn = document.getElementById('noBtn');
  function dodgeButton() {
    const randomX = Math.random() * 160 - 80;
    const randomY = Math.random() * 100 - 50;
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }
  noBtn.addEventListener('touchstart', dodgeButton);
  noBtn.addEventListener('mouseover', dodgeButton);

  // --- 4. Validation et Écran Final ---
  const yesBtn = document.getElementById('yesBtn');
  const victoryModal = document.getElementById('victoryModal');

  yesBtn.addEventListener('click', () => {
    victoryModal.style.styleDisplay = 'flex';
    victoryModal.style.display = 'flex';
  });

  // --- 5. Lecteur de Musique Synthesizer ---
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
    const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 392.00];
    const selectedNote = notes[Math.floor(Math.random() * notes.length)];
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(selectedNote, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 2);
    
    setTimeout(playSoftTune, 800);
  }
});