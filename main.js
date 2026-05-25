/* -------------------------------------------------------------
 * CORE PORTFOLIO ENGINE & INTERACTIVE LOGIC
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Global reference to loaded configuration
  const config = window.PORTFOLIO_CONFIG;
  
  if (!config) {
    console.error("Portfolio configuration could not be found! Make sure config.js is loaded first.");
    return;
  }

  // Initialize all components
  initContent(config);
  initNavigation();
  initCanvas();
  initCustomCursor();
  initObservers();
  initTabs();
  initProjectFilters(config.projects);
  initContactForm(config.personal.email);
});

/* -------------------------------------------------------------
 * 1. DYNAMIC CONTENT RENDERING
 * ------------------------------------------------------------- */
function initContent(config) {
  const p = config.personal;
  
  // Set browser page title
  document.title = `${p.name} | Portfolio`;

  // Hero Section Binding
  const nameEl = document.getElementById('hero-name');
  const titleEl = document.getElementById('hero-title');
  const descEl = document.getElementById('hero-desc');
  const avatarEl = document.getElementById('hero-avatar');
  
  if (nameEl) nameEl.textContent = p.name;
  if (titleEl) titleEl.innerHTML = p.title.replace('&', '<span>&</span>');
  if (descEl) descEl.textContent = p.subtitle || p.subTitle;
  
  // Dynamic typing animation in subtitle
  if (descEl && p.subtitle) {
    setupTypingEffect(descEl, p.subtitle);
  }

  // Portrait Avatar image loading (with fallbacks)
  if (avatarEl) {
    avatarEl.src = p.avatar;
    avatarEl.alt = p.name;
    avatarEl.onerror = () => {
      // If the image fails to load (e.g. doesn't exist yet), render a stunning SVG avatar
      avatarEl.style.display = 'none';
      const container = avatarEl.parentElement;
      const svgAvatar = `
        <svg viewBox="0 0 100 100" class="svg-avatar" style="width: 100%; height: 100%; fill: none; stroke: var(--accent-color); stroke-width: 1.5; background: var(--bg-tertiary);">
          <circle cx="50" cy="40" r="18" />
          <path d="M20,85 C20,70 30,62 50,62 C70,62 80,70 80,85" />
          <defs>
            <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--accent-color)" />
              <stop offset="100%" stop-color="hsl(calc(var(--hue-accent) + 40), 90%, 60%)" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" stroke="url(#avatarGrad)" stroke-width="2" />
        </svg>
      `;
      container.insertAdjacentHTML('beforeend', svgAvatar);
    };
  }

  // About Bio
  const bioEl = document.getElementById('about-bio-text');
  if (bioEl) bioEl.textContent = p.bio;

  // Timeline (Experience & Education) Rendering
  renderTimeline('experience-timeline', config.experience, 'experience');
  renderTimeline('education-timeline', config.education, 'education');

  // Skills List Rendering
  renderSkills(config.skills);

  // Projects Grid Rendering
  renderProjects(config.projects);

  // Contact info
  const emailValEl = document.getElementById('contact-email-value');
  const emailLinkEl = document.getElementById('contact-email-link');
  if (emailValEl) emailValEl.textContent = p.email;
  if (emailLinkEl) emailLinkEl.href = `mailto:${p.email}`;

  // Footer Branding & copyright
  const footerCopyright = document.getElementById('footer-copyright-text');
  if (footerCopyright) {
    footerCopyright.innerHTML = `Designed & Developed by <a href="#home" style="color: var(--accent-color); font-weight: 500;">prath.dev</a>`;
  }

  // Social Links
  const socialContainers = document.querySelectorAll('.social-links');
  socialContainers.forEach(container => {
    container.innerHTML = `
      <a href="${p.github}" target="_blank" class="social-btn" aria-label="GitHub"><i class="fab fa-github"></i></a>
      <a href="${p.linkedin}" target="_blank" class="social-btn" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
      <a href="${p.twitter}" target="_blank" class="social-btn" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
    `;
  });
}

function setupTypingEffect(element, text) {
  element.textContent = '';
  let i = 0;
  const speed = 40; // typing speed in ms
  function typeWriter() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }
  typeWriter();
}

function renderTimeline(containerId, items, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = `<p class="text-muted">No items available.</p>`;
    return;
  }

  container.innerHTML = items.map(item => {
    if (type === 'experience') {
      return `
        <div class="timeline-item reveal-el">
          <div class="timeline-dot"></div>
          <div class="timeline-header">
            <h4 class="timeline-role">${item.role}</h4>
            <span class="timeline-duration">${item.duration}</span>
          </div>
          <div class="timeline-company">${item.company}</div>
          <p class="timeline-desc">${item.description}</p>
        </div>
      `;
    } else {
      return `
        <div class="timeline-item reveal-el">
          <div class="timeline-dot"></div>
          <div class="timeline-header">
            <h4 class="timeline-role">${item.degree}</h4>
            <span class="timeline-duration">${item.duration}</span>
          </div>
          <div class="timeline-company">${item.school}</div>
          <p class="timeline-desc">${item.description}</p>
        </div>
      `;
    }
  }).join('');
}

function renderSkills(skills) {
  const container = document.getElementById('skills-list-container');
  if (!container) return;

  if (!skills || skills.length === 0) {
    container.innerHTML = `<p class="text-muted">No skills available.</p>`;
    return;
  }

  container.innerHTML = skills.map(group => `
    <div class="skill-group reveal-el">
      <h4 class="skill-group-title">${group.category}</h4>
      <div class="skills-list">
        ${group.items.map(skill => `
          <div class="skill-bar-wrapper">
            <div class="skill-info">
              <span class="skill-name">${skill.name}</span>
              <span class="skill-percent">${skill.level}%</span>
            </div>
            <div class="skill-bar-track">
              <div class="skill-bar-fill" data-level="${skill.level}"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderProjects(projects, activeCategory = 'All') {
  const grid = document.getElementById('projects-grid-container');
  if (!grid) return;

  if (!projects || projects.length === 0) {
    grid.innerHTML = `<p class="text-muted">No projects available.</p>`;
    return;
  }

  // Filter projects by category
  const filtered = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(activeCategory.toLowerCase())));

  grid.innerHTML = filtered.map((proj, idx) => `
    <article class="project-card reveal-el" data-category="${proj.category}" style="transition-delay: ${idx * 0.1}s">
      <div class="project-image-box">
        <span class="project-category">${proj.category}</span>
        <img id="img-${proj.id}" src="${proj.image}" alt="${proj.title}">
      </div>
      <div class="project-content">
        <h3 class="project-title">${proj.title}</h3>
        <p class="project-desc">${proj.description}</p>
        <div class="project-tags">
          ${proj.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
        <div class="project-links">
          <a href="${proj.demoUrl}" class="project-link demo-link" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>
          <a href="${proj.sourceUrl}" class="project-link code-link" target="_blank"><i class="fab fa-github"></i> Source</a>
        </div>
      </div>
    </article>
  `).join('');

  // Attach img fallback handlers for project mocks
  filtered.forEach(proj => {
    const imgEl = document.getElementById(`img-${proj.id}`);
    if (imgEl) {
      imgEl.onerror = () => {
        imgEl.style.display = 'none';
        const imgBox = imgEl.parentElement;
        // Inject a premium glassmorphic vector placeholder instead of empty image
        const svgMockup = `
          <div class="project-svg-fallback" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center; background: var(--bg-tertiary); position:relative; overflow:hidden;">
            <div style="width: 70%; height: 60%; background: rgba(255,255,255,0.03); border:1px solid var(--glass-border); border-radius: 8px; box-shadow: var(--glass-shadow); padding: 12px; display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; gap:4px;">
                <span style="width:6px; height:6px; background: #ff5f56; border-radius:50%;"></span>
                <span style="width:6px; height:6px; background: #ffbd2e; border-radius:50%;"></span>
                <span style="width:6px; height:6px; background: #27c93f; border-radius:50%;"></span>
              </div>
              <div style="flex-grow:1; display:flex; flex-direction:column; justify-content:center; align-items:center; gap:6px;">
                <i class="fas fa-laptop-code" style="font-size: 28px; color: var(--accent-color); opacity: 0.8;"></i>
                <span style="font-size: 10px; font-weight: 500; font-family: 'Outfit'; color: var(--text-secondary); text-transform:uppercase; letter-spacing:0.1em;">${proj.title}</span>
              </div>
            </div>
            <div style="position:absolute; width:150px; height:150px; border-radius:50%; background: var(--accent-gradient); filter:blur(40px); opacity:0.15; top:-30px; right:-30px;"></div>
          </div>
        `;
        imgBox.insertAdjacentHTML('beforeend', svgMockup);
      };
    }
  });

  // Re-observe elements that are dynamically generated
  setTimeout(triggerObserverCheck, 100);
}

/* -------------------------------------------------------------
 * 2. CANVAS PARTICLE SYSTEM
 * ------------------------------------------------------------- */
function initCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null, radius: 180 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  // Particle Blueprint
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
    }

    draw() {
      const activeHue = getComputedStyle(document.documentElement).getPropertyValue('--hue-accent').trim();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${activeHue}, 90%, 65%, 0.25)`;
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off screen boundaries
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      // Interactive mouse attraction force
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const pull = force * 0.08;
          this.vx += (dx / dist) * pull;
          this.vy += (dy / dist) * pull;
          
          // Terminal velocity damping
          const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (speed > 1.2) {
            this.vx = (this.vx / speed) * 1.2;
            this.vy = (this.vy / speed) * 1.2;
          }
        }
      }
    }
  }

  function initParticles() {
    particles = [];
    const density = Math.floor((canvas.width * canvas.height) / 18000);
    const count = Math.min(density, 90); // Cap at 90 particles for performance
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const activeHue = getComputedStyle(document.documentElement).getPropertyValue('--hue-accent').trim();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (120 - dist) / 120 * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(${activeHue}, 90%, 65%, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animate();
}

/* -------------------------------------------------------------
 * 3. NAVIGATION MANAGEMENT
 * ------------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('header');
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  // Add scroll class to header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Highlight links on scroll
    updateActiveNavLink();
  });

  // Mobile navigation drawer toggle
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
  }

  // Close nav on click (mobile layout)
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });

  function updateActiveNavLink() {
    let scrollPos = window.scrollY + 120;
    const sections = document.querySelectorAll('section');
    
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* -------------------------------------------------------------
 * 4. INTERACTIVE TABS (ABOUT SECTION)
 * ------------------------------------------------------------- */
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      // Set active button
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Set active content
      contents.forEach(content => {
        content.classList.remove('active');
        if (content.getAttribute('id') === `${target}-tab`) {
          content.classList.add('active');
        }
      });
      
      // Trigger animations for skill bars if tab is switched
      if (target === 'skills') {
        const fillBars = document.querySelectorAll('.skill-bar-fill');
        fillBars.forEach(bar => {
          const val = bar.getAttribute('data-level');
          bar.style.width = `${val}%`;
        });
      }
    });
  });
}

/* -------------------------------------------------------------
 * 5. PROJECT SHOWCASE FILTERING
 * ------------------------------------------------------------- */
function initProjectFilters(projects) {
  const filters = document.querySelectorAll('.filter-btn');
  
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      renderProjects(projects, category);
    });
  });
}

/* -------------------------------------------------------------
 * 6. SCROLL REVEAL OBSERVERS
 * ------------------------------------------------------------- */
let scrollObserver;

function initObservers() {
  // Reveal elements on scroll
  const revealElements = document.querySelectorAll('.reveal-el');
  
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Specially animate skill bars when the skills list container reveals
        if (entry.target.id === 'skills-list-container' || entry.target.classList.contains('skill-group')) {
          const fills = entry.target.querySelectorAll('.skill-bar-fill');
          fills.forEach(bar => {
            const level = bar.getAttribute('data-level');
            bar.style.width = `${level}%`;
          });
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, options);

  revealElements.forEach(el => scrollObserver.observe(el));
}

function triggerObserverCheck() {
  // Re-run observe registrations for dynamically created markup
  const revealElements = document.querySelectorAll('.reveal-el:not(.visible)');
  if (scrollObserver) {
    revealElements.forEach(el => scrollObserver.observe(el));
  }
}

/* -------------------------------------------------------------
 * 7. DUAL CURSOR EASE TRACKING
 * ------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const outline = document.querySelector('.custom-cursor-outline');
  
  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let outlineX = 0, outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.body.classList.add('cursor-active');
  });

  window.addEventListener('mouseout', () => {
    document.body.classList.remove('cursor-active');
  });

  // Ease function loop
  function tick() {
    // Dot moves instantly
    dotX = mouseX;
    dotY = mouseY;
    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;

    // Outline moves with an interpolation lag
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;

    requestAnimationFrame(tick);
  }
  tick();

  // Grow outer ring when cursor hovers over interactive tags
  const selectInteractives = 'a, button, .social-btn, .tab-btn, .filter-btn, .footer-editor-trigger, .editor-trigger';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(selectInteractives)) {
      outline.classList.add('hover-grow');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(selectInteractives)) {
      outline.classList.remove('hover-grow');
    }
  });
}

/* -------------------------------------------------------------
 * 8. GLASSMORPHIC CONTACT FORM VALIDATION & SUBMIT
 * ------------------------------------------------------------- */
function initContactForm(emailAddress) {
  const form = document.getElementById('contact-form');
  const overlay = document.getElementById('contact-form-overlay');
  
  if (!form) return;

  const inputs = form.querySelectorAll('.form-input');

  inputs.forEach(input => {
    // Simple inline feedback as users type
    input.addEventListener('input', () => {
      validateField(input);
    });

    input.addEventListener('blur', () => {
      validateField(input);
    });
  });

  function validateField(input) {
    if (input.value.trim() === '') {
      input.classList.remove('is-valid');
      input.classList.remove('is-invalid');
      return false;
    }

    if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(input.value)) {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
        return true;
      } else {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        return false;
      }
    }

    // Default text fields
    if (input.value.trim().length >= 3) {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
      return true;
    } else {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      return false;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    inputs.forEach(input => {
      const isValid = validateField(input);
      if (!isValid) allValid = false;
    });

    if (!allValid) {
      alert("Please complete the form fields correctly before submitting.");
      return;
    }

    // Trigger overlay mock submission status
    overlay.classList.add('active');
    overlay.innerHTML = `
      <div class="loader-spinner" style="width: 50px; height: 50px; border: 4px solid var(--bg-tertiary); border-top: 4px solid var(--accent-color); border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <h3 style="font-family:'Outfit'; font-size:18px;">Transmitting Message...</h3>
    `;

    // Inject spin keyframe in document dynamic styles if not defined
    if (!document.getElementById('dynamic-spin-style')) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "dynamic-spin-style";
      styleSheet.innerText = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
      document.head.appendChild(styleSheet);
    }

    setTimeout(() => {
      // Transition to success screen
      overlay.innerHTML = `
        <div class="success-checkmark"><i class="fas fa-check"></i></div>
        <h3 style="font-family:'Outfit'; font-size: 22px; color: #10b981; margin-top:8px;">Transmission Successful!</h3>
        <p style="font-size:14px; color:var(--text-secondary); text-align:center; max-width:280px; margin-top:4px;">
          Your message has been logged. Pratyush will connect with you shortly.
        </p>
      `;

      setTimeout(() => {
        // Reset and clear overlay
        overlay.classList.remove('active');
        form.reset();
        inputs.forEach(input => {
          input.classList.remove('is-valid');
          input.classList.remove('is-invalid');
        });
      }, 3500);

    }, 2000);
  });
}
