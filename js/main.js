/* =============================================
   SURAJ DOBALE - Portfolio JavaScript v2
   Modern UI/UX Interactivity & Animations
   ============================================= */

// =============================================
// PRELOADER
// =============================================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('hidden');
    setTimeout(() => {
      if (preloader.parentNode) preloader.style.display = 'none';
    }, 700);
  }
});

// =============================================
// UNIFIED UNIVERSE CANVAS (Merged Stars + Interactive Particles)
// Replaces the old separate ParticleSystem + GalaxyStarShower
// =============================================
class UnifiedParticles {
  constructor() {
    this.canvas = document.getElementById('universe-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Stars (from GalaxyStarShower)
    this.stars = [];
    this.shootingStars = [];
    this.lastShootingStar = 0;

    // Interactive particles (from ParticleSystem)
    this.particles = [];

    // Shared mouse state
    this.mouse = { x: null, y: null, targetX: null, targetY: null, radius: 150 };

    this.resize();
    this.createStars();
    this.createParticles();
    this.animate();
    this.bindEvents();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.w = this.canvas.width;
    this.h = this.canvas.height;
  }

  // --- Stars (from GalaxyStarShower) ---
  createStars() {
    this.stars = [];
    const count = Math.floor((this.w * this.h) / 2500);
    for (let i = 0; i < Math.max(count, 200); i++) {
      const size = Math.random() * 2.5 + 0.5;
      const isBright = Math.random() < 0.15;
      this.stars.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        size,
        baseSize: size,
        opacity: Math.random() * 0.6 + 0.2,
        baseOpacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        isBright,
        color: isBright
          ? ['255, 215, 0', '255, 255, 255', '200, 220, 255', '255, 200, 150'][Math.floor(Math.random() * 4)]
          : ['180, 180, 220', '200, 180, 220', '220, 200, 255', '180, 200, 255'][Math.floor(Math.random() * 4)],
        driftX: (Math.random() - 0.5) * 0.15,
        driftY: (Math.random() - 0.5) * 0.15,
      });
    }
  }

  createShootingStar() {
    const angle = Math.random() * Math.PI * 0.5 - Math.PI * 0.25;
    return {
      x: Math.random() * this.w * 0.8 + this.w * 0.1,
      y: Math.random() * this.h * 0.4,
      length: Math.random() * 60 + 40,
      speed: Math.random() * 12 + 6,
      angle,
      life: 1,
      decay: Math.random() * 0.01 + 0.008,
      color: `255, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 50 + 200)}`,
    };
  }

  drawNebula(x, y, radius, color) {
    const ctx = this.ctx;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(${color}, 0.03)`);
    gradient.addColorStop(0.5, `rgba(${color}, 0.015)`);
    gradient.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Interactive particles (from ParticleSystem) ---
  createParticles() {
    this.particles = [];
    const count = Math.floor((this.w * this.h) / 12000);
    const pColors = ['rgba(108, 99, 255, ', 'rgba(0, 212, 170, ', 'rgba(107, 203, 255, '];
    for (let i = 0; i < Math.max(count, 30); i++) {
      this.particles.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        size: Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.5 + 0.15,
        color: pColors[Math.floor(Math.random() * pColors.length)],
      });
    }
  }

  // --- Events ---
  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createStars();
      this.createParticles();
    });

    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      this.mouse.x = touch.clientX;
      this.mouse.y = touch.clientY;
    }, { passive: true });
  }

  // --- Main animation loop ---
  animate() {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    const mx = this.mouse.x;
    const my = this.mouse.y;

    ctx.clearRect(0, 0, w, h);

    // ---- LAYER 1: Nebula clouds (bottom) ----
    this.drawNebula(w * 0.2, h * 0.3, 300, '255, 45, 149');
    this.drawNebula(w * 0.8, h * 0.6, 350, '108, 99, 255');
    this.drawNebula(w * 0.5, h * 0.2, 250, '0, 212, 170');

    // ---- LAYER 2: Stars ----
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinklePhase) * 0.4 + 0.6;
      const currentOpacity = star.baseOpacity * twinkle;

      star.x += star.driftX;
      star.y += star.driftY;
      if (star.x < -10) star.x = w + 10;
      if (star.x > w + 10) star.x = -10;
      if (star.y < -10) star.y = h + 10;
      if (star.y > h + 10) star.y = -10;

      // Gentle mouse attraction
      if (mx !== null && my !== null) {
        const dx = mx - star.x;
        const dy = my - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          const force = (200 - dist) / 200;
          star.x -= dx * force * 0.003;
          star.y -= dy * force * 0.003;
        }
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color}, ${currentOpacity})`;
      ctx.fill();

      if (star.isBright && star.size > 1.5) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${currentOpacity * 0.08})`;
        ctx.fill();
      }
    }

    // ---- LAYER 3: Interactive particles with connections ----
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x > w) p.x = 0;
      if (p.x < 0) p.x = w;
      if (p.y > h) p.y = 0;
      if (p.y < 0) p.y = h;

      if (mx !== null && my !== null) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.x -= dx * force * 0.02;
          p.y -= dy * force * 0.02;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.opacity})`;
      ctx.fill();

      // Particle connection lines
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = p.x - this.particles[j].x;
        const dy = p.y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108, 99, 255, ${0.06 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(this.particles[j].x, this.particles[j].y);
          ctx.stroke();
        }
      }
    }

    // ---- LAYER 4: Shooting stars (top) ----
    const now = Date.now();
    if (now - this.lastShootingStar > 3000 + Math.random() * 4000) {
      this.shootingStars.push(this.createShootingStar());
      this.lastShootingStar = now;
    }

    this.shootingStars = this.shootingStars.filter((ss) => {
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.life -= ss.decay;
      if (ss.life <= 0) return false;

      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.length, ss.y - Math.sin(ss.angle) * ss.length);
      ctx.strokeStyle = `rgba(${ss.color}, ${ss.life * 0.8})`;
      ctx.lineWidth = ss.life * 2 + 0.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(ss.x, ss.y, ss.life * 3 + 1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ss.color}, ${ss.life * 0.2})`;
      ctx.fill();
      return true;
    });

    requestAnimationFrame(() => this.animate());
  }
}

// =============================================
// TYPING EFFECT
// =============================================
class TypingEffect {
  constructor(element, words, typeSpeed = 75, deleteSpeed = 35, pauseTime = 2200) {
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
// SCROLL PROGRESS
// =============================================
class ScrollProgress {
  constructor() {
    this.bar = document.querySelector('.scroll-progress');
    if (!this.bar) return;
    this.update();
  }

  update() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      this.bar.style.width = progress + '%';
    });
  }
}

// =============================================
// BACK TO TOP
// =============================================
class BackToTop {
  constructor() {
    this.button = document.querySelector('.back-to-top');
    if (!this.button) return;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        this.button.classList.add('visible');
      } else {
        this.button.classList.remove('visible');
      }
    });

    this.button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// =============================================
// SCROLL REVEAL (with stagger support)
// =============================================
class ScrollReveal {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;

            if (el.classList.contains('stagger-children')) {
              el.classList.add('visible');
            }
            else if (el.classList.contains('skill-bar-fill')) {
              const width = el.dataset.width || '85';
              setTimeout(() => {
                el.style.width = width + '%';
              }, 300);
            }
            else {
              el.classList.add('visible');
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    this.init();
  }

  init() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach((el) => {
      this.observer.observe(el);
    });

    document.querySelectorAll('.skill-bar-fill').forEach((el) => {
      this.observer.observe(el);
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
    const suffix = element.textContent.includes('+') ? '+' : '';

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = current + suffix;
    }, stepTime);

    this.observer.unobserve(element);
  }
}

// =============================================
// MOUSE FOLLOWER EFFECT
// =============================================
class MouseFollower {
  constructor() {
    this.follower = document.querySelector('.mouse-follower');
    if (!this.follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animate = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      this.follower.style.left = followerX + 'px';
      this.follower.style.top = followerY + 'px';
      requestAnimationFrame(animate);
    };
    animate();

    document.querySelectorAll('a, button, .btn, .skill-tag, .project-card, .avatar-frame').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        this.follower.style.width = '36px';
        this.follower.style.height = '36px';
        this.follower.style.background = 'rgba(108, 99, 255, 0.2)';
        this.follower.style.borderColor = 'rgba(108, 99, 255, 0.4)';
      });
      el.addEventListener('mouseleave', () => {
        this.follower.style.width = '16px';
        this.follower.style.height = '16px';
        this.follower.style.background = 'rgba(108, 99, 255, 0.1)';
        this.follower.style.borderColor = 'rgba(108, 99, 255, 0.2)';
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
    this.isOpen = false;

    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      this.navbar.classList.toggle('scrolled', window.scrollY > 50);
      this.updateActiveLink();
    });

    if (this.hamburger) {
      this.hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    }

    this.links.forEach((link) => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });

    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.navbar.contains(e.target)) {
        this.closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.hamburger.classList.toggle('active');
    this.hamburger.setAttribute('aria-expanded', this.isOpen);
    this.navLinks.classList.toggle('open');
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isOpen = false;
    this.hamburger?.classList.remove('active');
    this.hamburger?.setAttribute('aria-expanded', 'false');
    this.navLinks?.classList.remove('open');
    document.body.style.overflow = '';
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
// THEME TOGGLE (Dark/Light/Galaxy mode with system preference)
// =============================================
class ThemeToggle {
  constructor() {
    this.toggle = document.querySelector('.theme-toggle');
    this.icon = this.toggle?.querySelector('.icon');
    this.themes = ['dark', 'light', 'galaxy'];
    this.icons = ['☀️', '🌙', '🌌'];
    this.init();
  }

  init() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      this.currentIndex = this.themes.indexOf(savedTheme);
      if (this.currentIndex === -1) this.currentIndex = prefersDark ? 0 : 1;
    } else {
      this.currentIndex = prefersDark ? 0 : 1;
    }

    this.applyTheme();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.currentIndex = e.matches ? 0 : 1;
        this.applyTheme();
      }
    });

    this.toggle?.addEventListener('click', () => {
      this.currentIndex = (this.currentIndex + 1) % this.themes.length;
      localStorage.setItem('theme', this.themes[this.currentIndex]);
      this.applyTheme();
    });
  }

  applyTheme() {
    const theme = this.themes[this.currentIndex];
    this.icon.textContent = this.icons[this.currentIndex];

    // Activate smooth CSS transition for all themed properties
    document.documentElement.classList.add('theme-switching');
    document.documentElement.setAttribute('data-theme', theme);

    // Swap favicon to match the current theme
    const faviconMap = {
      dark: 'favicon.svg',
      light: 'favicon-light.svg',
      galaxy: 'favicon-galaxy.svg',
    };
    const link = document.querySelector('link[rel="icon"]');
    if (link) {
      link.href = faviconMap[theme] || 'favicon.svg';
    }

    // Remove transition guard after animation completes
    // so hover/active transitions resume normally
    setTimeout(() => {
      document.documentElement.classList.remove('theme-switching');
    }, 700);
  }
}

// =============================================
// BUTTON RIPPLE EFFECT
// =============================================
class ButtonRipple {
  constructor() {
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = Math.max(rect.width, rect.height);

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${x - size / 2}px;
          top: ${y - size / 2}px;
        `;
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }
}

// =============================================
// 3D TILT EFFECT (Simplified)
// Gentle tilt on project cards and avatar frame only
// =============================================
class TiltEffect {
  constructor() {
    document.querySelectorAll('.project-card, .avatar-frame').forEach((el) => {
      const isAvatar = el.classList.contains('avatar-frame');
      const intensity = isAvatar ? 30 : 25;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / intensity;
        const rotateY = (centerX - x) / intensity;
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.4s ease';
        setTimeout(() => { el.style.transition = ''; }, 400);
      });
    });
  }
}

// =============================================
// SMOOTH ANCHOR SCROLL
// =============================================
class SmoothAnchors {
  constructor() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const navHeight = 70;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });
      });
    });
  }
}

// =============================================
// INTERACTIVE GRADIENT MESH BACKGROUND
// =============================================
class GradientMesh {
  constructor() {
    this.canvas = document.getElementById('gradient-mesh');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    this.time = 0;

    this.resize();
    this.animate();
    this.bindEvents();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.w = this.canvas.width;
    this.h = this.canvas.height;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    document.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX / this.w;
      this.mouse.targetY = e.clientY / this.h;
    });

    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      this.mouse.targetX = touch.clientX / this.w;
      this.mouse.targetY = touch.clientY / this.h;
    }, { passive: true });
  }

  animate() {
    // Respect reduced motion preference — draw a static frame instead
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.drawStaticMesh();
      return;
    }

    this.time += 0.003;

    // Smooth mouse follow
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;

    ctx.clearRect(0, 0, w, h);

    // Get theme colors
    const root = getComputedStyle(document.documentElement);
    const primary = root.getPropertyValue('--primary').trim() || '#6c63ff';
    const secondary = root.getPropertyValue('--secondary').trim() || '#00d4aa';
    const accent3 = root.getPropertyValue('--accent3').trim() || '#6bcbff';

    // Create a smooth flowing mesh with 4 control points
    const mx = this.mouse.x * w;
    const my = this.mouse.y * h;

    const p1 = { x: w * 0.2 + Math.sin(this.time) * 80, y: h * 0.3 + Math.cos(this.time * 0.7) * 60 };
    const p2 = { x: w * 0.8 + Math.cos(this.time * 0.5) * 100, y: h * 0.7 + Math.sin(this.time * 0.8) * 80 };
    const p3 = { x: w * 0.5 + Math.sin(this.time * 1.2) * 120, y: h * 0.2 + Math.cos(this.time * 0.6) * 50 };
    const p4 = { x: mx + Math.cos(this.time * 0.3) * 40, y: my + Math.sin(this.time * 0.4) * 40 };

    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '108, 99, 255';
    };

    const colors = [
      `rgba(${hexToRgb(primary)}, 0.08)`,
      `rgba(${hexToRgb(secondary)}, 0.06)`,
      `rgba(${hexToRgb(accent3)}, 0.05)`,
      `rgba(${hexToRgb(primary)}, 0.04)`,
    ];

    // Draw 4 intersecting radial gradients for a fluid mesh feel
    const drawBlob = (cx, cy, radius, color) => {
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const maxRadius = Math.max(w, h) * 0.45;

    drawBlob(p1.x, p1.y, maxRadius, colors[0]);
    drawBlob(p2.x, p2.y, maxRadius * 0.9, colors[1]);
    drawBlob(p3.x, p3.y, maxRadius * 0.8, colors[2]);
    drawBlob(p4.x, p4.y, maxRadius * 0.6, colors[3]);

    requestAnimationFrame(() => this.animate());
  }

  drawStaticMesh() {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    ctx.clearRect(0, 0, w, h);

    const root = getComputedStyle(document.documentElement);
    const primary = root.getPropertyValue('--primary').trim() || '#6c63ff';
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '108, 99, 255';
    };

    const gradient = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.5);
    gradient.addColorStop(0, `rgba(${hexToRgb(primary)}, 0.06)`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }
}

// =============================================
// MAGNETIC BUTTON EFFECT
// Buttons subtly follow the cursor when hovered
// =============================================
class MagneticButtons {
  constructor() {
    document.querySelectorAll('.btn, .contact-card, .overlay-link').forEach((el) => {
      this.makeMagnetic(el);
    });
  }

  makeMagnetic(element) {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = element.classList.contains('btn') ? 0.15 : 0.08;
      element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
      element.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => {
        element.style.transition = '';
      }, 400);
    });
  }
}

// =============================================
// TEXT SCRAMBLE EFFECT
// Animates section titles with a scramble/decode reveal
// =============================================
class TextScrambleEffect {
  constructor() {
    this.els = document.querySelectorAll('.section-title');
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            if (el.dataset.scrambled !== 'done') {
              el.dataset.scrambled = 'done';
              this.scramble(el);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    this.els.forEach((el) => this.observer.observe(el));
  }

  scramble(element) {
    // Respect reduced motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const originalText = element.textContent;
    const chars = '!@#$%^&*()_+-={}[]|:;<>,.?/~`';
    let iteration = 0;
    const maxIterations = 12;
    const frameRate = 50;

    const interval = setInterval(() => {
      element.textContent = originalText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(interval);
        element.textContent = originalText;
      }

      iteration += Math.ceil(originalText.length / maxIterations);
    }, frameRate);
  }
}

// =============================================
// FLOATING RESUME CTA VISIBILITY
// =============================================
class FloatingResume {
  constructor() {
    this.btn = document.querySelector('.float-resume');
    if (!this.btn) return;
    this.init();
  }

  init() {
    const checkVisibility = () => {
      const heroSection = document.getElementById('home');
      if (!heroSection) return;
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const shouldShow = window.scrollY > heroBottom - window.innerHeight + 100;
      this.btn.classList.toggle('visible', shouldShow);
    };

    window.addEventListener('scroll', checkVisibility, { passive: true });
    checkVisibility();
  }
}

// =============================================
// SKILL TAG FLOAT ANIMATION
// Adds subtle floating motion to skill tags
// =============================================
class SkillFloat {
  constructor() {
    document.querySelectorAll('.skill-tag').forEach((tag, i) => {
      const delay = Math.random() * 4;
      const duration = Math.random() * 2 + 2;
      tag.style.setProperty('--float-delay', `${delay}s`);
      tag.style.setProperty('--float-duration', `${duration}s`);
      tag.style.animation = `skillFloat var(--float-duration) ease-in-out var(--float-delay) infinite`;
    });
  }
}

// =============================================
// INITIALIZE EVERYTHING
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  new UnifiedParticles();
  new ScrollProgress();
  new BackToTop();
  new FloatingResume();
  new GradientMesh();

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

  setTimeout(() => {
    new ScrollReveal();
    new CounterAnimation();
    new SkillFloat();
    new TextScrambleEffect();
  }, 100);

  new Navigation();
  new ThemeToggle();
  new ButtonRipple();
  new TiltEffect();
  new SmoothAnchors();
  new MagneticButtons();

  if (!('ontouchstart' in window)) {
    setTimeout(() => new MouseFollower(), 200);
  }
});
