/* =============================================
   인재캐치중 | JavaScript
   ============================================= */

// ---- Navbar scroll behavior ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger-btn');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ---- Radar canvas animation ----
const canvas = document.getElementById('radar-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.6 + 0.2;
    this.color = Math.random() > 0.5 ? '78, 205, 196' : '108, 99, 255';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.fill();
  }
}

// Init particles
for (let i = 0; i < 120; i++) {
  particles.push(new Particle());
}

let radarAngle = 0;
const cx = () => canvas.width / 2;
const cy = () => canvas.height / 2;
const maxRadius = () => Math.max(canvas.width, canvas.height) * 0.55;

function drawRadar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Radar rings
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath();
    ctx.arc(cx(), cy(), (maxRadius() / 4) * i, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(78, 205, 196, ${0.06 - i * 0.01})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Cross hairs
  ctx.strokeStyle = 'rgba(78, 205, 196, 0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx() - maxRadius(), cy());
  ctx.lineTo(cx() + maxRadius(), cy());
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx(), cy() - maxRadius());
  ctx.lineTo(cx(), cy() + maxRadius());
  ctx.stroke();

  // Sweep gradient
  const gradient = ctx.createConicalGradient
    ? null
    : null;

  // Sweep sector
  ctx.save();
  ctx.translate(cx(), cy());
  ctx.rotate(radarAngle);

  const sweepGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius());
  sweepGrad.addColorStop(0, 'rgba(78, 205, 196, 0.15)');
  sweepGrad.addColorStop(1, 'rgba(78, 205, 196, 0)');

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, maxRadius(), -Math.PI / 8, 0);
  ctx.closePath();
  ctx.fillStyle = sweepGrad;
  ctx.fill();
  ctx.restore();

  // Sweep line
  ctx.save();
  ctx.translate(cx(), cy());
  ctx.rotate(radarAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(maxRadius(), 0);
  ctx.strokeStyle = 'rgba(78, 205, 196, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Particles
  particles.forEach(p => { p.update(); p.draw(); });

  // Connection lines between nearby particles
  particles.forEach((p, i) => {
    particles.slice(i + 1).forEach(p2 => {
      const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
      if (dist < 80) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(78, 205, 196, ${(1 - dist / 80) * 0.12})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  });

  radarAngle += 0.008;
  animationFrame = requestAnimationFrame(drawRadar);
}
drawRadar();


// ---- Counter animation ----
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const increment = target / 80;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('ko-KR');
  }, 20);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num[data-target]');
      statNums.forEach(el => {
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.getElementById('hero-stats');
if (heroStats) statsObserver.observe(heroStats);


// ---- Scroll reveal ----
const revealEls = [
  'about-text', 'about-features',
  'solutions-grid', 'solution-card-1', 'solution-card-2', 'solution-card-3',
  'journey-timeline', 'journey-step-1', 'journey-step-2', 'journey-step-3', 'journey-step-4', 'journey-step-5',
  'testimonial-grid', 'test-card-1', 'test-card-2', 'test-card-3',
  'business-grid', 'biz-card-1', 'biz-card-2', 'biz-card-3',
  'contact-box'
];

revealEls.forEach((id, i) => {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ---- Solution cards hover glow ----
document.querySelectorAll('.solution-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});


// ---- Form submission ----
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  btn.querySelector('.btn-text').style.display = 'none';
  btn.querySelector('.btn-loading').style.display = 'inline';
  btn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'block';
    // Scroll to success
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1800);
}


// ---- Smooth nav active state ----
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });


// ---- Parallax hero ----
window.addEventListener('scroll', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && window.scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }
}, { passive: true });


// ---- Journey steps entrance stagger ----
const journeySteps = document.querySelectorAll('.journey-step');
const journeyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      journeySteps.forEach((step, i) => {
        setTimeout(() => {
          step.style.opacity = '1';
          step.style.transform = 'translateY(0)';
        }, i * 150);
      });
      journeyObserver.disconnect();
    }
  });
}, { threshold: 0.2 });

journeySteps.forEach(step => {
  step.style.opacity = '0';
  step.style.transform = 'translateY(20px)';
  step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

const journeySection = document.getElementById('journey');
if (journeySection) journeyObserver.observe(journeySection);
