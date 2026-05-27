/* =============================================
   SURAJ DOBALE - Portfolio JavaScript
   All interactivity, animations & dynamic effects
   ============================================= */

// =============================================
// PRELOADER
// =============================================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 800);
  }
});

// =============================================
// PARTICLES BACKGROUND (Canvas)
// =============================================
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 120 };

    this.resize();
    this.init();
    this.animate();
    this.bindEvents();
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  init() {
    const count = Math.floor((this.canvas.width * this.canvas.height) / 12000);
    for (let i = 0; i < Math.max(count, 40); i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: (Math.random() - 0.5) * 1.2,
      opacity: Math.random() * 0.5 + 0.2,
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.particles = [];
      this.init();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x > this.canvas.width) p.x = 0;
      if (p.x < 0) p.x = this.canvas.width;
      if (p.y > this.canvas.height) p.y = 0;
      if (p.y < 0) p.y = this.canvas.height;

      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x -= dx * force * 0.03;
          p.y -= dy * force * 0.03;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(108, 99, 255, ${p.opacity})`;
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = p.x - this.particles[j].x;
        const dy = p.y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(108, 99, 255, ${0.08 * (1 - dist / 120)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// =============================================
// TYPING EFFECT
// =============================================
class TypingEffect {
  constructor(element, words, typeSpeed = 80, deleteSpeed = 40, pauseTime = 2000) {
    this.element = element;
    this.words = words;
    this.typeSpeed = typeSpeed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.cursor = element.querySelector('.cursor');
    this.textNode = document.createTextNode('');
    this.element.insertBefore(this.textNode, this.cursor);
    this.type();
  }

  type() {
    const currentWord = this.words[this.wordIndex];

    if (this.isDeleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }

    this.textNode.textContent = currentWord.substring(0, this.charIndex);

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      setTimeout(() => {
        this.isDeleting = true;
        this.type();
      }, this.pauseTime);
      return;
    }

    if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      setTimeout(() => this.type(), 300);
      return;
    }

    const speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
    setTimeout(() => this.type(), speed);
  }
}

// =============================================
// SCROLL REVEAL
// =============================================
class ScrollReveal {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Animate skill bars when section becomes visible
            if (entry.target.closest('#skills') || entry.target.classList.contains('skill-bar-fill')) {
              this.animateSkillBars(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    this.init();
  }

  init() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
      this.observer.observe(el);
    });
  }

  animateSkillBars(target) {
    const section = target.closest('#skills') || document;
    const bars = section.querySelectorAll('.skill-bar-fill');
    bars.forEach((bar) => {
      const width = bar.dataset.width || '85';
      setTimeout(() => {
        bar.style.width = width + '%';
      }, 300);
    });
  }
}

// =============================================
// COUNTER ANIMATION
// =============================================
class CounterAnimation {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('.stat-number').forEach((el) => {
      this.observer.observe(el);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
    if (isNaN(target)) return;

    let current = 0;
    const increment = Math.ceil(target / 60);
    const duration = 1500;
    const stepTime = duration / (target / increment);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = current + (element.textContent.includes('+') ? '+' : '');
    }, stepTime);

    this.observer.unobserve(element);
  }
}

// =============================================
// MOUSE FOLLOWER EFFECT
// =============================================
class MouseFollower {
  constructor() {
    this.follower = document.createElement('div');
    this.follower.className = 'mouse-follower';
    this.follower.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(108, 99, 255, 0.15);
      border: 1px solid rgba(108, 99, 255, 0.3);
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      transition: width 0.3s, height 0.3s, background 0.3s;
      backdrop-filter: blur(4px);
    `;
    document.body.appendChild(this.follower);

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth follow animation
    const animate = () => {
      followerX += (mouseX - followerX) * 0.08;
      followerY += (mouseY - followerY) * 0.08;
      this.follower.style.left = followerX + 'px';
      this.follower.style.top = followerY + 'px';
      requestAnimationFrame(animate);
    };
    animate();

    // Enlarge on interactive elements
    document.querySelectorAll('a, button, .btn, .skill-tag, .project-card, .cert-card').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        this.follower.style.width = '40px';
        this.follower.style.height = '40px';
        this.follower.style.background = 'rgba(108, 99, 255, 0.25)';
      });
      el.addEventListener('mouseleave', () => {
        this.follower.style.width = '20px';
        this.follower.style.height = '20px';
        this.follower.style.background = 'rgba(108, 99, 255, 0.15)';
      });
    });
  }
}

// =============================================
// NAVIGATION
// =============================================
class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.querySelector('.hamburger');
    this.navLinks = document.querySelector('.nav-links');
    this.links = document.querySelectorAll('.nav-links a');

    this.init();
  }

  init() {
    // Scroll effect
    window.addEventListener('scroll', () => {
      this.navbar.classList.toggle('scrolled', window.scrollY > 50);
      this.updateActiveLink();
    });

    // Hamburger toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => {
        this.hamburger.classList.toggle('active');
        this.navLinks.classList.toggle('open');
      });
    }

    // Close menu on link click
    this.links.forEach((link) => {
      link.addEventListener('click', () => {
        this.hamburger?.classList.remove('active');
        this.navLinks?.classList.remove('open');
      });
    });
  }

  updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          this.links.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
}

// =============================================
// THEME TOGGLE (Dark/Light mode)
// =============================================
class ThemeToggle {
  constructor() {
    this.toggle = document.querySelector('.theme-toggle');
    this.icon = this.toggle?.querySelector('.icon');
    this.isDark = localStorage.getItem('theme') !== 'light';
    this.init();
  }

  init() {
    // Apply saved preference on load
    this.applyTheme();

    this.toggle?.addEventListener('click', () => {
      this.isDark = !this.isDark;
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      this.applyTheme();
    });
  }

  applyTheme() {
    this.icon.textContent = this.isDark ? '☀️' : '🌙';

    if (!this.isDark) {
      document.documentElement.style.setProperty('--bg-primary', '#f8f9ff');
      document.documentElement.style.setProperty('--bg-secondary', '#eef0ff');
      document.documentElement.style.setProperty('--bg-card', '#ffffff');
      document.documentElement.style.setProperty('--bg-card-hover', '#f0f0ff');
      document.documentElement.style.setProperty('--text-primary', '#1a1a2e');
      document.documentElement.style.setProperty('--text-secondary', '#4a4a6a');
      document.documentElement.style.setProperty('--text-muted', '#8888aa');
      document.documentElement.style.setProperty('--gradient-hero', 'linear-gradient(135deg, #f8f9ff 0%, #e8e8ff 50%, #f8f9ff 100%)');
    } else {
      document.documentElement.style.setProperty('--bg-primary', '#0a0a1a');
      document.documentElement.style.setProperty('--bg-secondary', '#12122a');
      document.documentElement.style.setProperty('--bg-card', '#1a1a3e');
      document.documentElement.style.setProperty('--bg-card-hover', '#222255');
      document.documentElement.style.setProperty('--text-primary', '#f0f0ff');
      document.documentElement.style.setProperty('--text-secondary', '#a0a0d0');
      document.documentElement.style.setProperty('--text-muted', '#6a6a9a');
      document.documentElement.style.setProperty('--gradient-hero', 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0a0a1a 100%)');
    }
  }
}

// Smooth scroll is handled by CSS `scroll-behavior: smooth` on html element
// No JS needed — native browser smooth scrolling is faster and more accessible

// =============================================
// PROJECT CARD 3D TILT EFFECT
// =============================================
class TiltEffect {
  constructor() {
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 12;
        const rotateY = (centerX - x) / 12;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }
}

// =============================================
// FORM HANDLING
// =============================================
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }

  init() {
    this.form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = this.form.querySelector('.btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual form action)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      const formContainer = this.form.parentElement;
      const successMsg = document.createElement('div');
      successMsg.style.cssText = `
        text-align: center;
        padding: 40px;
        background: var(--bg-card);
        border-radius: var(--border-radius);
        border: 1px solid rgba(108, 99, 255, 0.2);
      `;
      successMsg.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 16px;">🎉</div>
        <h3>Message Sent Successfully!</h3>
        <p style="color: var(--text-secondary); margin-top: 8px;">Thank you for reaching out. I'll get back to you soon.</p>
      `;

      this.form.innerHTML = '';
      this.form.appendChild(successMsg);
      submitBtn.disabled = false;
    });
  }
}

// Skill bars are animated by ScrollReveal on scroll — no separate handler needed.

// =============================================
// INITIALIZE EVERYTHING
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize particles
  new ParticleSystem();

  // Initialize typing effect
  const typingElement = document.querySelector('.hero-typing');
  if (typingElement) {
    new TypingEffect(typingElement, [
      'Full Stack Developer',
      'Java & Spring Boot Expert',
      'PG-DAC Certified',
      'Problem Solver',
      'Tech Enthusiast'
    ]);
  }

  // Initialize scroll reveal
  new ScrollReveal();

  // Initialize counter animation
  new CounterAnimation();

  // Initialize navigation
  new Navigation();

  // Initialize theme toggle
  new ThemeToggle();

  // Initialize tilt effect
  new TiltEffect();

  // Initialize contact form
  new ContactForm();

  // Initialize mouse follower (disable on touch devices)
  if (!('ontouchstart' in window)) {
    new MouseFollower();
  }
});
