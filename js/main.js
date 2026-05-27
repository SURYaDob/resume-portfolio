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
      // Ensure preloader is removed after transition
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

      // Mouse interaction
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

      // Draw connections
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

            // Handle stagger-children containers
            if (el.classList.contains('stagger-children')) {
              el.classList.add('visible');
            }
            // Handle skill bars
            else if (el.classList.contains('skill-bar-fill')) {
              const width = el.dataset.width || '85';
              setTimeout(() => {
                el.style.width = width + '%';
              }, 300);
            }
            // Handle regular reveal elements
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
    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach((el) => {
      this.observer.observe(el);
    });

    // Observe skill bars
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

    // Enlarge on interactive elements
    document.querySelectorAll('a, button, .btn, .skill-tag, .project-card, .cert-card').forEach((el) => {
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
    // Scroll effect
    window.addEventListener('scroll', () => {
      this.navbar.classList.toggle('scrolled', window.scrollY > 50);
      this.updateActiveLink();
    });

    // Hamburger toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    }

    // Close menu on link click
    this.links.forEach((link) => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.navbar.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Close on escape
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
// THEME TOGGLE (Dark/Light mode with system preference)
// =============================================
class ThemeToggle {
  constructor() {
    this.toggle = document.querySelector('.theme-toggle');
    this.icon = this.toggle?.querySelector('.icon');
    this.init();
  }

  init() {
    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    // Use saved theme, or system preference, default to dark
    this.isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    // Apply theme
    this.applyTheme();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only update if user hasn't set a manual preference
      if (!localStorage.getItem('theme')) {
        this.isDark = e.matches;
        this.applyTheme();
      }
    });

    // Toggle on click
    this.toggle?.addEventListener('click', () => {
      this.isDark = !this.isDark;
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      this.applyTheme();
    });
  }

  applyTheme() {
    this.icon.textContent = this.isDark ? '☀️' : '🌙';
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
  }
}

// Smooth scroll is handled by CSS `scroll-behavior: smooth`

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
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      });
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
    // Open lightbox on cert card click
    document.querySelectorAll('.cert-card').forEach((card) => {
      card.addEventListener('click', () => {
        const title = card.querySelector('h4')?.textContent || 'Certificate';
        const subtitle = card.querySelector('p')?.textContent || '';
        const link = card.querySelector('a')?.getAttribute('href') || '';
        const linkText = card.querySelector('a')?.textContent?.trim() || 'View Document';

        this.titleEl.textContent = title;
        this.subtitleEl.textContent = subtitle;

        // Update links
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

    // Close button
    this.closeBtn?.addEventListener('click', () => this.close());

    // Close on backdrop click
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });

    // Close on Escape
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
// SMOOTH ANCHOR SCROLL (enhanced)
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
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="btn-text">⏳ Sending...</span>';
      submitBtn.disabled = true;

      try {
        const data = new FormData(this.form);
        const response = await fetch(this.form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          // Show success message
          const formContainer = this.form.parentElement;
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
        } else {
          throw new Error('Failed to send');
        }
      } catch (err) {
        submitBtn.innerHTML = originalHTML;
        // Show error inline
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
          padding: 12px 16px;
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.2);
          border-radius: 8px;
          color: var(--accent);
          font-size: 0.9rem;
          text-align: center;
        `;
        errorMsg.textContent = '❌ Could not send. Please email me directly at surajdobale29@gmail.com.';
        if (!this.form.querySelector('.form-error')) {
          errorMsg.className = 'form-error';
          this.form.insertBefore(errorMsg, submitBtn);
          setTimeout(() => errorMsg.remove(), 5000);
        }
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
}

// =============================================
// INITIALIZE EVERYTHING
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize core features
  new ParticleSystem();
  new ScrollProgress();
  new BackToTop();

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

  // Initialize scroll-based features
  setTimeout(() => {
    new ScrollReveal();
    new CounterAnimation();
  }, 100);

  // Initialize interaction features
  new Navigation();
  new ThemeToggle();
  new ButtonRipple();
  new TiltEffect();
  new CertificateLightbox();
  new SmoothAnchors();
  new ContactForm();

  // Initialize mouse follower (only on non-touch devices)
  if (!('ontouchstart' in window)) {
    setTimeout(() => new MouseFollower(), 200);
  }
});
