document.addEventListener('DOMContentLoaded', () => {

  // --- 1. SPLIT SLIDER CONTROLLER ---
  const redLayer = document.getElementById('redLayer');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const percentage = (mouseX / window.innerWidth) * 100;
    if (redLayer) {
      redLayer.style.width = `${percentage}%`;
    }
  });


  // --- 2. ULTRA-SMOOTH SIMULTANEOUS FLOATING SCROLL ANIMATION ---
  const aboutSection = document.querySelector('.about-section');
  const revealTexts = document.querySelectorAll('.reveal-text');

  let targetProgress = 0;
  let currentProgress = 0;

  function calculateTargetProgress() {
    if (!aboutSection) return;
    const rect = aboutSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    let rawProgress = (windowHeight - rect.top) / (windowHeight + rect.height * 0.2);
    targetProgress = Math.max(0, Math.min(1, rawProgress));
  }

  window.addEventListener('scroll', calculateTargetProgress);
  calculateTargetProgress();

  function updateScrollAnimation() {
    currentProgress += (targetProgress - currentProgress) * 0.08;

    revealTexts.forEach((el) => {
      const translateY = (1 - currentProgress) * 140;
      const opacity = currentProgress;

      el.style.transform = `translate3d(0, ${translateY}px, 0)`;
      el.style.opacity = opacity;
    });

    requestAnimationFrame(updateScrollAnimation);
  }

  requestAnimationFrame(updateScrollAnimation);


  // --- 3. PEEKING DOG SCROLL TRIGGER ---
  const dogWrapper = document.querySelector('.peeking-dog-wrapper');

  function checkBottomScroll() {
    if (!dogWrapper) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const bodyHeight = document.documentElement.scrollHeight;

    // Triggers visibility when user scrolls within 150px of the bottom
    if (bodyHeight - scrollPosition < 150) {
      dogWrapper.classList.add('visible');
    } else {
      dogWrapper.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', checkBottomScroll);
  checkBottomScroll();


  // --- 4. CONNECT MODAL CONTROLLER ---
  const connectBtns = document.querySelectorAll('.nav-btn');
  const modalOverlay = document.getElementById('connectModal');
  const closeModalBtn = document.getElementById('closeModal');

  connectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (modalOverlay) {
        modalOverlay.classList.add('active');
      }
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      modalOverlay.classList.remove('active');
    }
  });


  // --- 5. LADYBUG & TRAIL CANVAS ANIMATION ---
  const canvas = document.getElementById('trailCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let bugX = window.innerWidth / 2;
    let bugY = window.innerHeight / 2;
    let particles = [];

    class Particle {
      constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 10;
        this.y = y + (Math.random() - 0.5) * 10;
        this.size = Math.random() * 6 + 3;
        this.alpha = 1;
        this.decay = Math.random() * 0.025 + 0.015;
        this.color = '#ff3b30';
      }

      update() {
        this.alpha -= this.decay;
        this.size *= 0.95;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function drawLadybug(x, y, angle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);

      // Legs
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      [-1, 1].forEach(side => {
        ctx.beginPath();
        ctx.moveTo(side * 6, -6); ctx.lineTo(side * 18, -12);
        ctx.moveTo(side * 8, 0);  ctx.lineTo(side * 20, 0);
        ctx.moveTo(side * 6, 6);  ctx.lineTo(side * 18, 12);
        ctx.stroke();
      });

      // Antennae
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-3, -14); ctx.lineTo(-8, -22);
      ctx.moveTo(3, -14);  ctx.lineTo(8, -22);
      ctx.stroke();

      // Head
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, -10, 8, 0, Math.PI * 2);
      ctx.fill();

      // Red Shell
      ctx.fillStyle = '#ff2424';
      ctx.beginPath();
      ctx.ellipse(0, 4, 14, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center Line
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(0, 22);
      ctx.stroke();

      // Black Spots
      ctx.fillStyle = '#000000';
      const spots = [
        { x: -6, y: -3 }, { x: 6, y: -3 },
        { x: -7, y: 7 },  { x: 7, y: 7 },
        { x: 0, y: 14 }
      ];
      spots.forEach(spot => {
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dx = mouseX - bugX;
      const dy = mouseY - bugY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.hypot(dx, dy);

      bugX += dx * 0.08;
      bugY += dy * 0.08;

      if (distance > 2) {
        particles.push(new Particle(bugX, bugY));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      drawLadybug(bugX, bugY, angle);

      requestAnimationFrame(animateCanvas);
    }

    animateCanvas();
  }

});