/* -------------------------------------------------------------
 * VISUAL LIVE CUSTOMIZER LOGIC
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.PORTFOLIO_CONFIG;
  if (!config) return;

  // Insert Customizer drawer HTML elements dynamically if not already in index.html
  setupEditorDOM();

  const editorPanel = document.getElementById('editor-panel');
  const triggerBtn = document.getElementById('editor-trigger');
  const closeBtn = document.getElementById('editor-close-btn');
  const footerTrigger = document.getElementById('footer-editor-trigger');

  // Toggle Panel Open/Close
  if (triggerBtn && editorPanel) {
    triggerBtn.addEventListener('click', () => {
      editorPanel.classList.add('open');
    });
  }

  if (closeBtn && editorPanel) {
    closeBtn.addEventListener('click', () => {
      editorPanel.classList.remove('open');
    });
  }

  if (footerTrigger && editorPanel) {
    footerTrigger.addEventListener('click', () => {
      editorPanel.classList.add('open');
      editorPanel.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Generate form controls
  generateFormControls(config);
  setupColorThemeSwatches();
  setupExporter(config);
});

/* -------------------------------------------------------------
 * 1. DYNAMIC DRAWER SETUP
 * ------------------------------------------------------------- */
function setupEditorDOM() {
  // Check if drawer already exists
  if (document.getElementById('editor-panel')) return;

  // Append float trigger
  const triggerHTML = `
    <button id="editor-trigger" class="editor-trigger" aria-label="Customize Portfolio Theme">
      <i class="fas fa-sliders-h"></i>
    </button>
  `;
  document.body.insertAdjacentHTML('beforeend', triggerHTML);

  // Append sliding drawer panel
  const drawerHTML = `
    <aside id="editor-panel" class="editor-panel">
      <div class="editor-header">
        <h3 class="editor-title"><i class="fas fa-magic"></i> Live Customizer</h3>
        <button id="editor-close-btn" class="editor-close-btn" aria-label="Close Customizer"><i class="fas fa-times"></i></button>
      </div>
      <div class="editor-body" id="editor-form-body">
        <!-- Input fields will be dynamically injected here -->
      </div>
      <div class="editor-footer">
        <button id="btn-copy-config" class="btn-glass" style="width: 100%; justify-content: center;"><i class="far fa-copy"></i> Copy Config Code</button>
        <button id="btn-download-config" class="btn-glass btn-primary" style="width: 100%; justify-content: center;"><i class="fas fa-download"></i> Download config.js</button>
        <p class="editor-help-text">Download and replace the config.js file in your project folder to save permanently.</p>
      </div>
    </aside>

    <!-- Modal for showing code export -->
    <div id="export-modal" class="export-modal">
      <div class="export-card">
        <div class="export-header">
          <h3 style="font-family:'Outfit'; font-size:18px;"><i class="far fa-file-code"></i> Config Code Exported</h3>
          <button id="export-modal-close" class="editor-close-btn" style="font-size:16px;"><i class="fas fa-times"></i></button>
        </div>
        <div class="export-code-box" id="export-code-box"></div>
        <div class="export-footer">
          <button id="export-modal-copy" class="btn-glass btn-primary">Copy to Clipboard</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', drawerHTML);
}

/* -------------------------------------------------------------
 * 2. FORM ELEMENTS GENERATION
 * ------------------------------------------------------------- */
function generateFormControls(config) {
  const container = document.getElementById('editor-form-body');
  if (!container) return;

  const p = config.personal;

  let formHTML = `
    <!-- Accent Color Swatches -->
    <div class="editor-section">
      <h4 class="editor-section-title">Color System Theme</h4>
      <div class="editor-field">
        <label class="editor-label">Select Accent Theme</label>
        <div class="editor-swatches" id="editor-swatches-container">
          <button class="swatch-btn swatch-violet active" data-hue="260" title="Neon Violet"></button>
          <button class="swatch-btn swatch-cyan" data-hue="190" title="Ocean Cyan"></button>
          <button class="swatch-btn swatch-mint" data-hue="145" title="Emerald Mint"></button>
          <button class="swatch-btn swatch-orange" data-hue="25" title="Sunset Amber"></button>
          <button class="swatch-btn swatch-blue" data-hue="210" title="Royal Blue"></button>
        </div>
      </div>
    </div>

    <!-- Personal Profile Section -->
    <div class="editor-section">
      <h4 class="editor-section-title">Personal Profile Details</h4>
      
      <div class="editor-field">
        <label class="editor-label" for="edit-name">Full Name</label>
        <input type="text" id="edit-name" class="editor-input" value="${p.name}">
      </div>

      <div class="editor-field">
        <label class="editor-label" for="edit-title">Job Title</label>
        <input type="text" id="edit-title" class="editor-input" value="${p.title}">
      </div>

      <div class="editor-field">
        <label class="editor-label" for="edit-subtitle">Subtitle</label>
        <input type="text" id="edit-subtitle" class="editor-input" value="${p.subtitle || p.subTitle}">
      </div>

      <div class="editor-field">
        <label class="editor-label" for="edit-avatar">Avatar Image Path</label>
        <input type="text" id="edit-avatar" class="editor-input" value="${p.avatar}">
      </div>

      <div class="editor-field">
        <label class="editor-label" for="edit-bio">Detailed Bio</label>
        <textarea id="edit-bio" class="editor-textarea" rows="4">${p.bio}</textarea>
      </div>
    </div>

    <!-- Contact & Social Details -->
    <div class="editor-section">
      <h4 class="editor-section-title">Contact & Socials</h4>

      <div class="editor-field">
        <label class="editor-label" for="edit-email">Email Address</label>
        <input type="email" id="edit-email" class="editor-input" value="${p.email}">
      </div>

      <div class="editor-field">
        <label class="editor-label" for="edit-github">GitHub Link</label>
        <input type="url" id="edit-github" class="editor-input" value="${p.github}">
      </div>

      <div class="editor-field">
        <label class="editor-label" for="edit-linkedin">LinkedIn Link</label>
        <input type="url" id="edit-linkedin" class="editor-input" value="${p.linkedin}">
      </div>

      <div class="editor-field">
        <label class="editor-label" for="edit-twitter">Twitter Link</label>
        <input type="url" id="edit-twitter" class="editor-input" value="${p.twitter}">
      </div>
    </div>

    <!-- Projects Listing Form -->
    <div class="editor-section">
      <h4 class="editor-section-title">Projects Content</h4>
      ${config.projects.map((proj, idx) => `
        <div style="background:var(--bg-tertiary); padding: 12px; border-radius:var(--radius-md); border:1px solid var(--glass-border); margin-bottom:10px;">
          <h5 style="font-family:'Outfit'; font-size:12px; color:var(--accent-color); margin-bottom:8px;">Project ${idx + 1} (${proj.category})</h5>
          <div class="editor-field" style="margin-bottom:8px;">
            <label class="editor-label" style="font-size:10px;">Title</label>
            <input type="text" class="editor-input edit-project-title" data-index="${idx}" value="${proj.title}">
          </div>
          <div class="editor-field">
            <label class="editor-label" style="font-size:10px;">Description</label>
            <textarea class="editor-textarea edit-project-desc" data-index="${idx}" rows="2" style="font-size:12px;">${proj.description}</textarea>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = formHTML;

  // Attach live input events for instant changes
  
  // Name binding
  const inputName = document.getElementById('edit-name');
  if (inputName) {
    inputName.addEventListener('input', (e) => {
      p.name = e.target.value;
      const heroName = document.getElementById('hero-name');
      if (heroName) heroName.textContent = p.name;
    });
  }

  // Job Title binding
  const inputTitle = document.getElementById('edit-title');
  if (inputTitle) {
    inputTitle.addEventListener('input', (e) => {
      p.title = e.target.value;
      const heroTitle = document.getElementById('hero-title');
      if (heroTitle) heroTitle.innerHTML = p.title.replace('&', '<span>&</span>');
    });
  }

  // Subtitle binding
  const inputSub = document.getElementById('edit-subtitle');
  if (inputSub) {
    inputSub.addEventListener('input', (e) => {
      p.subtitle = e.target.value;
      p.subTitle = e.target.value;
      const heroDesc = document.getElementById('hero-desc');
      if (heroDesc) heroDesc.textContent = p.subtitle;
    });
  }

  // Bio binding
  const inputBio = document.getElementById('edit-bio');
  if (inputBio) {
    inputBio.addEventListener('input', (e) => {
      p.bio = e.target.value;
      const bioText = document.getElementById('about-bio-text');
      if (bioText) bioText.textContent = p.bio;
    });
  }

  // Avatar path binding
  const inputAvatar = document.getElementById('edit-avatar');
  if (inputAvatar) {
    inputAvatar.addEventListener('input', (e) => {
      p.avatar = e.target.value;
      const avatarImg = document.getElementById('hero-avatar');
      const svgAvatar = document.querySelector('.svg-avatar');
      
      if (avatarImg) {
        avatarImg.src = p.avatar;
        avatarImg.style.display = 'block';
        if (svgAvatar) svgAvatar.remove();
      }
    });
  }

  // Contact details binding
  const inputEmail = document.getElementById('edit-email');
  if (inputEmail) {
    inputEmail.addEventListener('input', (e) => {
      p.email = e.target.value;
      const emailText = document.getElementById('contact-email-value');
      const emailLink = document.getElementById('contact-email-link');
      if (emailText) emailText.textContent = p.email;
      if (emailLink) emailLink.href = `mailto:${p.email}`;
    });
  }

  const inputGit = document.getElementById('edit-github');
  const inputLink = document.getElementById('edit-linkedin');
  const inputTwit = document.getElementById('edit-twitter');
  
  const updateSocials = () => {
    if (inputGit) p.github = inputGit.value;
    if (inputLink) p.linkedin = inputLink.value;
    if (inputTwit) p.twitter = inputTwit.value;

    const socialContainers = document.querySelectorAll('.social-links');
    socialContainers.forEach(container => {
      container.innerHTML = `
        <a href="${p.github}" target="_blank" class="social-btn" aria-label="GitHub"><i class="fab fa-github"></i></a>
        <a href="${p.linkedin}" target="_blank" class="social-btn" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
        <a href="${p.twitter}" target="_blank" class="social-btn" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
      `;
    });
  };

  [inputGit, inputLink, inputTwit].forEach(inp => {
    if (inp) inp.addEventListener('input', updateSocials);
  });

  // Projects live binding
  const projTitles = document.querySelectorAll('.edit-project-title');
  projTitles.forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      config.projects[idx].title = e.target.value;
      // Re-render project cards dynamically to see updates
      const activeFilterBtn = document.querySelector('.filter-btn.active');
      const filter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'All';
      window.PORTFOLIO_CONFIG.projects = config.projects;
      // Trigger project list update function if available globally, otherwise fetch elements
      const cards = document.querySelectorAll('.project-card');
      if (cards[idx]) {
        const titleEl = cards[idx].querySelector('.project-title');
        if (titleEl) titleEl.textContent = e.target.value;
      }
    });
  });

  const projDescs = document.querySelectorAll('.edit-project-desc');
  projDescs.forEach(textarea => {
    textarea.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      config.projects[idx].description = e.target.value;
      const cards = document.querySelectorAll('.project-card');
      if (cards[idx]) {
        const descEl = cards[idx].querySelector('.project-desc');
        if (descEl) descEl.textContent = e.target.value;
      }
    });
  });
}

/* -------------------------------------------------------------
 * 3. HSL ACCENT THEME TOGGLE
 * ------------------------------------------------------------- */
function setupColorThemeSwatches() {
  const swatches = document.querySelectorAll('.swatch-btn');
  
  // Set initial active based on style variables
  const rootStyle = getComputedStyle(document.documentElement);
  const initialHue = rootStyle.getPropertyValue('--hue-accent').trim();

  swatches.forEach(swatch => {
    const hue = swatch.getAttribute('data-hue');
    if (hue === initialHue) {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
    }

    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const selectedHue = swatch.getAttribute('data-hue');
      
      // Update DOM root properties directly
      document.documentElement.style.setProperty('--hue-accent', selectedHue);
      
      // Also update the canvas connectivity particle colors by trigger
      const canvas = document.getElementById('particle-canvas');
      if (canvas) {
        // Redraw triggers automatically within the main requestAnimationFrame loop
      }
    });
  });
}

/* -------------------------------------------------------------
 * 4. CONFIG EXPORTER UTILITIES (COPY & DOWNLOAD)
 * ------------------------------------------------------------- */
function setupExporter(config) {
  const copyBtn = document.getElementById('btn-copy-config');
  const downloadBtn = document.getElementById('btn-download-config');
  
  const modal = document.getElementById('export-modal');
  const modalClose = document.getElementById('export-modal-close');
  const modalCopy = document.getElementById('export-modal-copy');
  const codeBox = document.getElementById('export-code-box');

  const generateConfigJSContent = () => {
    // Read the dynamic theme value to save in configuration
    const activeHue = getComputedStyle(document.documentElement).getPropertyValue('--hue-accent').trim();
    
    // Inject code format
    let jsContent = `// Portfolio Website Configuration Data\n`;
    jsContent += `window.PORTFOLIO_CONFIG = {\n`;
    
    // Personal Details
    jsContent += `  personal: {\n`;
    jsContent += `    name: "${config.personal.name}",\n`;
    jsContent += `    title: "${config.personal.title}",\n`;
    jsContent += `    subtitle: "${config.personal.subtitle || config.personal.subTitle}",\n`;
    jsContent += `    avatar: "${config.personal.avatar}",\n`;
    jsContent += `    bio: ${JSON.stringify(config.personal.bio)},\n`;
    jsContent += `    email: "${config.personal.email}",\n`;
    jsContent += `    github: "${config.personal.github}",\n`;
    jsContent += `    linkedin: "${config.personal.linkedin}",\n`;
    jsContent += `    twitter: "${config.personal.twitter}"\n`;
    jsContent += `  },\n`;

    // Skills Details
    jsContent += `  skills: ${JSON.stringify(config.skills, null, 4).replace(/\n/g, '\n  ')},\n`;

    // Experience details
    jsContent += `  experience: ${JSON.stringify(config.experience, null, 4).replace(/\n/g, '\n  ')},\n`;

    // Education details
    jsContent += `  education: ${JSON.stringify(config.education, null, 4).replace(/\n/g, '\n  ')},\n`;

    // Projects Details
    jsContent += `  projects: ${JSON.stringify(config.projects, null, 4).replace(/\n/g, '\n  ')}\n`;
    
    jsContent += `};\n`;
    
    return jsContent;
  };

  // Copy Config to Clipboard
  if (copyBtn && modal && codeBox) {
    copyBtn.addEventListener('click', () => {
      const code = generateConfigJSContent();
      codeBox.textContent = code;
      modal.classList.add('active');
    });
  }

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modalCopy && codeBox) {
    modalCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(codeBox.textContent)
        .then(() => {
          modalCopy.textContent = "Copied!";
          modalCopy.style.background = "#10b981";
          modalCopy.style.color = "#000";
          setTimeout(() => {
            modalCopy.textContent = "Copy to Clipboard";
            modalCopy.style.background = "";
            modalCopy.style.color = "";
          }, 2000);
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
          alert("Unable to copy to clipboard automatically. Please select all code in the box and copy manually.");
        });
    });
  }

  // Download Config File as config.js
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const code = generateConfigJSContent();
      
      const blob = new Blob([code], { type: 'application/javascript;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'config.js');
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    });
  }
}
