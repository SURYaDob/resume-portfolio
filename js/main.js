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
// PARTICLES BACKGROUND (Canvas)
// =============================================
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };

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
    const count = Math.floor((this.canvas.width * this.canvas.height) / 10000);
    for (let i = 0; i < Math.max(count, 50); i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const colors = ['rgba(108, 99, 255, ', 'rgba(0, 212, 170, ', 'rgba(107, 203, 255, '];
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
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

      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x -= dx * force * 0.02;
          p.y -= dy * force * 0.02;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.color}${p.opacity})`;
      this.ctx.fill();

      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = p.x - this.particles[j].x;
        const dy = p.y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(108, 99, 255, ${0.06 * (1 - dist / 140)})`;
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

    document.querySelectorAll('a, button, .btn, .skill-tag, .project-card, .cert-card, .avatar-frame').forEach((el) => {
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
// GALAXY STAR SHOWER (Canvas Background Animation)
// =============================================
class GalaxyStarShower {
  constructor() {
    this.canvas = document.getElementById('galaxy-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.shootingStars = [];
    this.mouse = { x: -1000, y: -1000 };
    this.lastShootingStar = 0;

    this.resize();
    this.createStars();
    this.animate();
    this.bindEvents();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createStars() {
    this.stars = [];
    const count = Math.floor((this.canvas.width * this.canvas.height) / 2500);
    const minStars = 200;
    for (let i = 0; i < Math.max(count, minStars); i++) {
      this.stars.push(this.createStar());
    }
  }

  createStar() {
    const size = Math.random() * 2.5 + 0.5;
    const isBright = Math.random() < 0.15;
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: size,
      baseSize: size,
      opacity: Math.random() * 0.6 + 0.2,
      baseOpacity: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      isBright: isBright,
      color: isBright
        ? ['255, 215, 0', '255, 255, 255', '200, 220, 255', '255, 200, 150'][Math.floor(Math.random() * 4)]
        : ['180, 180, 220', '200, 180, 220', '220, 200, 255', '180, 200, 255'][Math.floor(Math.random() * 4)],
      driftX: (Math.random() - 0.5) * 0.15,
      driftY: (Math.random() - 0.5) * 0.15,
    };
  }

  createShootingStar() {
    const angle = Math.random() * Math.PI * 0.5 - Math.PI * 0.25;
    const speed = Math.random() * 12 + 6;
    return {
      x: Math.random() * this.canvas.width * 0.8 + this.canvas.width * 0.1,
      y: Math.random() * this.canvas.height * 0.4,
      length: Math.random() * 60 + 40,
      speed: speed,
      angle: angle,
      opacity: 1,
      life: 1,
      decay: Math.random() * 0.01 + 0.008,
      color: `255, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 50 + 200)}`,
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createStars();
    });

    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  drawNebula(x, y, radius, color) {
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(${color}, 0.03)`);
    gradient.addColorStop(0.5, `rgba(${color}, 0.015)`);
    gradient.addColorStop(1, `rgba(${color}, 0)`);
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw subtle nebula clouds
    this.drawNebula(this.canvas.width * 0.2, this.canvas.height * 0.3, 300, '255, 45, 149');
    this.drawNebula(this.canvas.width * 0.8, this.canvas.height * 0.6, 350, '108, 99, 255');
    this.drawNebula(this.canvas.width * 0.5, this.canvas.height * 0.2, 250, '0, 212, 170');

    // Update & draw stars
    this.stars.forEach((star) => {
      // Twinkle effect
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = Math.sin(star.twinklePhase) * 0.4 + 0.6;
      const currentOpacity = star.baseOpacity * twinkle;

      // Gentle drift
      star.x += star.driftX;
      star.y += star.driftY;

      // Wrap around
      if (star.x < -10) star.x = this.canvas.width + 10;
      if (star.x > this.canvas.width + 10) star.x = -10;
      if (star.y < -10) star.y = this.canvas.height + 10;
      if (star.y > this.canvas.height + 10) star.y = -10;

      // Mouse interaction — gentle attraction
      const dx = this.mouse.x - star.x;
      const dy = this.mouse.y - star.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200 && dist > 0) {
        const force = (200 - dist) / 200;
        star.x -= dx * force * 0.003;
        star.y -= dy * force * 0.003;
      }

      // Draw star
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${star.color}, ${currentOpacity})`;
      this.ctx.fill();

      // Glow for bright stars
      if (star.isBright && star.size > 1.5) {
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${star.color}, ${currentOpacity * 0.08})`;
        this.ctx.fill();
      }
    });

    // Shooting stars
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

      this.ctx.beginPath();
      this.ctx.moveTo(ss.x, ss.y);
      this.ctx.lineTo(
        ss.x - Math.cos(ss.angle) * ss.length,
        ss.y - Math.sin(ss.angle) * ss.length
      );
      this.ctx.strokeStyle = `rgba(${ss.color}, ${ss.life * 0.8})`;
      this.ctx.lineWidth = ss.life * 2 + 0.5;
      this.ctx.stroke();

      // Glow at head
      this.ctx.beginPath();
      this.ctx.arc(ss.x, ss.y, ss.life * 3 + 1, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${ss.color}, ${ss.life * 0.2})`;
      this.ctx.fill();

      return true;
    });

    requestAnimationFrame(() => this.animate());
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
// 3D TILT & PARALLAX EFFECT
// Applies to: Project Cards (strong), Certificate Cards (moderate), Avatar Frame (gentle)
// =============================================
class TiltEffect {
  constructor() {
    // Project cards — existing strong tilt
    document.querySelectorAll('.project-card').forEach((card) => {
      this.addTilt(card, { intensity: 15, translateY: -8, scale: 1.02 });
    });

    // Certificate cards — moderate tilt
    document.querySelectorAll('.cert-card').forEach((card) => {
      this.addTilt(card, { intensity: 20, translateY: -4, scale: 1.02 });
    });

    // Avatar frame — gentle tilt with extra glow depth
    const avatar = document.querySelector('.avatar-frame');
    if (avatar) {
      this.addTilt(avatar, { intensity: 25, translateY: 0, scale: 1 });

      // Also tilt the inner placeholder slightly more for a parallax feel
      const placeholder = avatar.querySelector('.avatar-placeholder');
      if (placeholder) {
        let tiltX = 0, tiltY = 0;
        avatar.addEventListener('mousemove', (e) => {
          const rect = avatar.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          tiltX = (y - centerY) / 30;
          tiltY = (centerX - x) / 30;
          placeholder.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.08)`;
        });
        avatar.addEventListener('mouseleave', () => {
          placeholder.style.transform = '';
        });
      }
    }
  }

  addTilt(element, opts) {
    const { intensity, translateY, scale } = opts;

    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / intensity;
      const rotateY = (centerX - x) / intensity;
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${translateY}px) scale(${scale})`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
      element.style.transition = 'transform 0.5s ease';
      setTimeout(() => {
        element.style.transition = '';
      }, 500);
    });
  }
}

// =============================================
// CERTIFICATE LIGHTBOX
// =============================================
class CertificateLightbox {
  constructor() {
    this.lightbox = document.getElementById('certLightbox');
    if (!this.lightbox) return;

    this.closeBtn = this.lightbox.querySelector('.cert-lightbox-close');
    this.titleEl = this.lightbox.querySelector('.cert-lightbox-title');
    this.subtitleEl = this.lightbox.querySelector('.cert-lightbox-subtitle');
    this.linksContainer = this.lightbox.querySelector('.cert-lightbox-links');

    this.init();
  }

  init() {
    document.querySelectorAll('.cert-card').forEach((card) => {
      card.addEventListener('click', () => {
        const title = card.querySelector('h4')?.textContent || 'Certificate';
        const subtitle = card.querySelector('p')?.textContent || '';
        const link = card.querySelector('a')?.getAttribute('href') || '';
        const linkText = card.querySelector('a')?.textContent?.trim() || 'View Document';

        this.titleEl.textContent = title;
        this.subtitleEl.textContent = subtitle;

        this.linksContainer.innerHTML = '';
        if (link) {
          const a = document.createElement('a');
          a.href = link;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'btn btn-primary btn-small';
          a.innerHTML = `<span class="btn-text">📄 ${linkText}</span>`;
          this.linksContainer.appendChild(a);
        }

        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn btn-outline btn-small';
        closeBtn.innerHTML = '<span class="btn-text">✕ Close</span>';
        closeBtn.addEventListener('click', () => this.close());
        this.linksContainer.appendChild(closeBtn);

        this.open();
      });
    });

    this.closeBtn?.addEventListener('click', () => this.close());

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  open() {
    this.lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.lightbox.classList.remove('open');
    document.body.style.overflow = '';
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
// CONTACT FORM — Dual-mode: Spring Boot API then Formspree fallback
// =============================================
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.recipientEmail = 'surajdobale29@gmail.com';
    this.backendUrl = 'http://localhost:8080/api/contact';
    this.init();
  }

  init() {
    this.form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = this.form.querySelector('.btn');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="btn-text">⏳ Sending...</span>';
      submitBtn.disabled = true;

      try {
        // Try Spring Boot backend first
        const formData = new FormData(this.form);
        const jsonData = {};
        formData.forEach((value, key) => { jsonData[key] = value; });

        let response;
        let usedBackend = false;
        try {
          response = await fetch(this.backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData),
          });
          usedBackend = true;
        } catch (e) {
          // Backend not available — use mailto fallback
          usedBackend = false;
        }

        if (usedBackend && response.ok) {
          // Success via backend
          this.showSuccessMessage();
        } else {
          // Backend unavailable or failed — open mailto link
          this.openMailTo(jsonData);
        }
      } catch (err) {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
      }
    });
  }

  /**
   * Show success message replacing the form.
   */
  showSuccessMessage() {
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
      text-align: center;
      padding: 40px;
      background: var(--bg-glass);
      backdrop-filter: blur(12px);
      border-radius: var(--border-radius);
      border: 1px solid rgba(108, 99, 255, 0.15);
      animation: fadeInUp 0.5s ease;
    `;
    successMsg.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 16px;">🎉</div>
      <h3 style="margin-bottom: 8px;">Message Sent Successfully!</h3>
      <p style="color: var(--text-secondary);">Thank you for reaching out. I'll respond within 24 hours.</p>
    `;
    this.form.innerHTML = '';
    this.form.style.display = 'flex';
    this.form.appendChild(successMsg);
  }

  /**
   * Fallback: open the visitor's email client with pre-filled details.
   * This is reliable because it doesn't depend on any third-party service.
   */
  openMailTo(jsonData) {
    const name = jsonData.name || '';
    const email = jsonData.email || '';
    const subject = jsonData.subject || 'Portfolio Inquiry';
    const message = jsonData.message || '';

    const mailBody = `Hi Suraj,%0D%0A%0D%0AMy name is ${encodeURIComponent(name)}.${encodeURIComponent(message) ? '%0D%0A%0D%0A' + encodeURIComponent(message) : ''}%0D%0A%0D%0AYou can reach me at: ${encodeURIComponent(email)}`;
    const mailSubject = encodeURIComponent(subject);
    const mailtoLink = `mailto:${this.recipientEmail}?subject=${mailSubject}&body=${mailBody}`;

    // Show a prompt explaining what to do
    const promptEl = document.createElement('div');
    promptEl.style.cssText = `
      text-align: center;
      padding: 32px 24px;
      background: var(--bg-glass);
      backdrop-filter: blur(12px);
      border-radius: var(--border-radius);
      border: 1px solid rgba(108, 99, 255, 0.15);
      animation: fadeInUp 0.5s ease;
    `;
    promptEl.innerHTML = `
      <div style="font-size: 2.5rem; margin-bottom: 12px;">📧</div>
      <h3 style="margin-bottom: 8px;">Almost Done!</h3>
      <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 0.95rem;">
        The direct send is not available. Please click below to send via your email client —<br>
        the message details are already filled in.
      </p>
      <a href="${mailtoLink}" class="btn btn-primary" style="text-decoration: none;">
        <span class="btn-text">✉️ Open Email Client</span>
      </a>
      <p style="margin-top: 16px; font-size: 0.8rem; color: var(--text-secondary); opacity: 0.7;">
        Or email directly: <strong>${this.recipientEmail}</strong>
      </p>
    `;
    this.form.innerHTML = '';
    this.form.style.display = 'flex';
    this.form.appendChild(promptEl);
  }
}

// =============================================
// INITIALIZE EVERYTHING
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem();
  new ScrollProgress();
  new BackToTop();

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
  }, 100);

  new GalaxyStarShower();
  new Navigation();
  new ThemeToggle();
  new ButtonRipple();
  new TiltEffect();
  new CertificateLightbox();
  new SmoothAnchors();
  new ContactForm();

  if (!('ontouchstart' in window)) {
    setTimeout(() => new MouseFollower(), 200);
  }
});
