// ===== CURSOR ORB =====
const cursorOrb = document.getElementById('cursor-orb');
let mx = -100, my = -100, cx = -100, cy = -100;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursorOrb.style.left = cx + 'px';
  cursorOrb.style.top = cy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ===== FIREFLIES — YELLOW/GOLD ONLY =====
const canvas = document.getElementById('firefly-canvas');
const ctx = canvas.getContext('2d');
let flies = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createFly() {
  // hue range 38–52 = pure yellow/amber gold only
  const hue = 38 + Math.random() * 14;
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.2 + 0.8,
    alpha: Math.random() * 0.5 + 0.15,
    alphaDir: (Math.random() > 0.5 ? 1 : -1) * 0.005,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    hue: hue,
    sat: 95 + Math.random() * 5,
    light: 65 + Math.random() * 20
  };
}

for (let i = 0; i < 60; i++) flies.push(createFly());

function drawFlies() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  flies.forEach(f => {
    f.x += f.vx;
    f.y += f.vy;
    f.alpha += f.alphaDir;
    if (f.alpha > 0.8 || f.alpha < 0.05) f.alphaDir *= -1;
    if (f.x < 0) f.x = canvas.width;
    if (f.x > canvas.width) f.x = 0;
    if (f.y < 0) f.y = canvas.height;
    if (f.y > canvas.height) f.y = 0;

    const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 6);
    grd.addColorStop(0, `hsla(${f.hue},${f.sat}%,${f.light}%,${f.alpha})`);
    grd.addColorStop(0.4, `hsla(${f.hue},${f.sat}%,${f.light - 10}%,${f.alpha * 0.5})`);
    grd.addColorStop(1, `hsla(${f.hue},80%,50%,0)`);

    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r * 6, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
  });
  requestAnimationFrame(drawFlies);
}
drawFlies();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== MOBILE NAV =====
document.getElementById('nav-toggle').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('nav-links').classList.remove('open'));
});

// ===== MUSIC =====
const music = document.getElementById('bg-music');
const musicControl = document.getElementById('music-control');
const musicIcon = document.getElementById('music-icon');
const musicLabel = document.getElementById('music-label');
let musicPlaying = false;

musicControl.addEventListener('click', () => {
  if (musicPlaying) {
    music.pause();
    musicIcon.className = 'fas fa-volume-mute';
    musicLabel.textContent = 'Muted';
    musicPlaying = false;
  } else {
    music.play().catch(() => {});
    musicIcon.className = 'fas fa-music';
    musicLabel.textContent = 'Music';
    musicPlaying = true;
  }
});

window.addEventListener('click', () => {
  if (!musicPlaying) {
    music.play().then(() => { musicPlaying = true; }).catch(() => {});
  }
}, { once: true });

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      const fill = e.target.querySelector('.skill-fill');
      if (fill) {
        setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, 200);
      }
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== MODALS =====
function openModal(name) {
  const m = document.getElementById('modal-' + name);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModalBtn(name) {
  const m = document.getElementById('modal-' + name);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
function closeModal(e, name) {
  if (e.target === document.getElementById('modal-' + name)) closeModalBtn(name);
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open'); document.body.style.overflow = '';
    });
  }
});

// ===== CONTACT FORM =====
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.submit-btn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
    document.getElementById('form-success').style.display = 'block';
    e.target.reset();
    setTimeout(() => { document.getElementById('form-success').style.display = 'none'; }, 5000);
  }, 1500);
}