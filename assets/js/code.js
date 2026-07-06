'use strict';

/* =========================================================
   1. BACKGROUND PARTICLE EFFECT (hearts + sparkles)
   Lightweight canvas animation, capped particle count so it
   stays smooth on both desktop and mobile.
========================================================== */

(function backgroundParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  const PARTICLE_COUNT = window.innerWidth < 640 ? 16 : 28;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function makeParticle() {
    const isHeart = Math.random() > 0.4;
    return {
      x: Math.random() * width,
      y: height + Math.random() * height,
      size: isHeart ? 8 + Math.random() * 10 : 2 + Math.random() * 3,
      speed: 0.2 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.4,
      opacity: 0.15 + Math.random() * 0.25,
      isHeart,
      angle: Math.random() * Math.PI * 2,
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle());

  function drawHeart(x, y, size, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = '#E8AEB7';
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.fill();
    ctx.restore();
  }

  function drawSparkle(x, y, size, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = '#E7CE8D';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -20) Object.assign(p, makeParticle(), { y: height + 20 });
      if (p.isHeart) drawHeart(p.x, p.y, p.size, p.opacity);
      else drawSparkle(p.x, p.y, p.size, p.opacity);
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* =========================================================
   2. HERO FLOATING HEARTS (CSS-driven, decorative)
========================================================== */
(function heroHearts() {
  const container = document.getElementById('hero-hearts');
  const HEART_COUNT = 12;
  for (let i = 0; i < HEART_COUNT; i++) {
    const heart = document.createElement('div');
    heart.className = 'hero-heart';
    heart.textContent = '♥';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.bottom = '-10%';
    heart.style.fontSize = (12 + Math.random() * 18) + 'px';
    heart.style.color = Math.random() > 0.5 ? '#E8AEB7' : '#E7CE8D';
    heart.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    heart.style.animationDuration = (8 + Math.random() * 10) + 's';
    heart.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(heart);
  }
})();

/* =========================================================
   3. GIFT BOX INTERACTION
========================================================== */
(function giftBox() {
  const box = document.getElementById('gift-box');
  const card = document.getElementById('gift-card');
  const hint = document.getElementById('gift-hint');
  const sparkleContainer = document.getElementById('sparkle-container');
  let opened = false;

  function burstSparkles() {
    for (let i = 0; i < 18; i++) {
      const s = document.createElement('span');
      s.className = 'gift-sparkle';
      const size = 4 + Math.random() * 6;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.left = '50%';
      s.style.top = '40%';
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 100;
      s.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
      s.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
      s.style.animation = 'sparkleBurst 0.9s ease-out forwards';
      sparkleContainer.appendChild(s);
      setTimeout(() => s.remove(), 950);
    }
  }

  box.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    const lid = box.querySelector('.gift-lid');
    lid.classList.add('open');
    box.classList.add('open-ribbons');
    burstSparkles();
    hint.style.opacity = '0';

    setTimeout(() => {
      box.classList.add('shrink');
    }, 350);

    setTimeout(() => {
      card.classList.remove('hidden');
      card.classList.add('card-pop');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 700);
  });
})();

/* =========================================================
   4. "REASONS" ACCORDION CARDS
========================================================== */
(function reasonCards() {
  document.querySelectorAll('.reason-card').forEach((cardBtn) => {
    const inner = cardBtn.querySelector('.reason-inner');
    const icon = cardBtn.querySelector('.reason-icon');

    cardBtn.addEventListener('click', () => {
      const isOpen = inner.style.maxHeight && inner.style.maxHeight !== '0px';
      if (isOpen) {
        inner.style.maxHeight = '0px';
        inner.style.opacity = '0';
        icon.style.transform = 'rotate(0deg)';
      } else {
        inner.style.maxHeight = inner.scrollHeight + 'px';
        inner.style.opacity = '1';
        icon.style.transform = 'rotate(45deg)';
      }
    });
  });
})();

/* =========================================================
   5. MUSIC TOGGLE
========================================================== */
(function musicToggle() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');
  const label = document.getElementById('music-label');
  let playing = false;

  btn.addEventListener('click', () => {
    if (!playing) {
      audio.play().catch(() => { /* autoplay restrictions - user gesture already given here */ });
      btn.classList.remove('paused');
      label.textContent = 'Now playing';
      playing = true;
    } else {
      audio.pause();
      btn.classList.add('paused');
      label.textContent = 'Play a song';
      playing = false;
    }
  });
})();

/* =========================================================
   6. SCROLL-REVEAL ANIMATIONS
========================================================== */
(function scrollReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((item) => observer.observe(item));
})();