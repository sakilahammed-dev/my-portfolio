/* ==========================================================================
   PRODUCTION JAVASCRIPT - MAIN CONTROLLER
   Typewriter Loop + Dual Hero Slider Carousel + Ambient Particles
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. DUAL HERO SLIDER CAROUSEL (Modeled after Clark's 2-Slide Hero Carousel)
  // ------------------------------------------------------------------------
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let autoSlideTimer = null;
  const slideDuration = 5500; // 5.5 seconds per slide

  function goToSlide(index) {
    if (!slides.length) return;
    
    // Normalize index
    currentSlide = (index + slides.length) % slides.length;

    // Update slides visibility & animations
    slides.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update pagination dots
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoSlideTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, slideDuration);
  }

  function stopAutoPlay() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  // Click listener for manual dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', function() {
      const targetIndex = parseInt(this.getAttribute('data-slide'), 10);
      goToSlide(targetIndex);
      startAutoPlay(); // Restart timer after user interaction
    });
  });

  // Start the slider
  if (slides.length > 1) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('slide') === '2') {
      goToSlide(1);
    }
    startAutoPlay();
  }

  // ------------------------------------------------------------------------
  // 2. TYPEWRITER EFFECT (Dynamic Roles)
  // ------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriter');
  const roles = [
    "AI Automation Specialist",
    "Autonomous Workflow Architect",
    "Full-Stack Web & App Developer",
    "Digital Growth & Marketing Problem Solver"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeLoop() {
    if (!typewriterElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2200; // Hold at full text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next word
    }

    setTimeout(typeLoop, typingSpeed);
  }

  typeLoop();

  // ------------------------------------------------------------------------
  // 3. AMBIENT PARTICLES CANVAS
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      const sidebarWidth = window.innerWidth > 900 ? 280 : 0;
      canvas.width = window.innerWidth - sidebarWidth;
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
        this.size = Math.random() * 2 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.45 + 0.15;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.fillStyle = `rgba(255, 180, 0, ${this.alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 22000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    initParticles();
    window.addEventListener('resize', initParticles);

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let p of particles) {
        p.update();
        p.draw();
      }
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // ------------------------------------------------------------------------
  // 4. NAVIGATION ACTIVE STATE & SCROLL SPY
  // ------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.pushState(null, null, '#home');
      }
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Also bind top-left brand logo and any other #home links
  document.querySelectorAll('a[href="#home"]:not(.nav-link)').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#home');
      });
      history.pushState(null, null, '#home');
    });
  });

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 250;
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  });

  // ------------------------------------------------------------------------
  // 5. MOBILE DRAWER NAVIGATION CONTROLLER
  // ------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebarDock = document.getElementById('sidebar-dock');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  function openMobileMenu() {
    if (sidebarDock) sidebarDock.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (sidebarDock) sidebarDock.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeMobileMenu);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Open menu if requested via URL param (e.g. for previewing)
  const urlParamsMobile = new URLSearchParams(window.location.search);
  if (urlParamsMobile.get('menu') === 'open') {
    openMobileMenu();
  }

  // Close on nav link click in mobile view
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        closeMobileMenu();
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeProjectModal();
    }
  });

  // ------------------------------------------------------------------------
  // 6. PORTFOLIO INTERACTIVE MODAL & LIKES CONTROLLER
  // ------------------------------------------------------------------------
  const projectsData = {
    1: {
      category: "AI AUTOMATION",
      title: "Autonomous Multi-Agent Workflow Engine",
      image: "./assets/images/portfolio/portfolio-01.jpg",
      highlight: "85% Manual Task Reduction",
      desc: "An enterprise-grade autonomous operations system engineered with autonomous AI agents, dynamic webhook orchestrations, and real-time CRM synchronization to eliminate manual operational bottlenecks and 24/7 repetitive tasks.",
      tech: ["Python", "LangChain", "n8n", "Claude API", "PostgreSQL", "Docker", "REST Webhooks"],
      likes: 750
    },
    2: {
      category: "APP DEVELOPMENT",
      title: "On-Demand Food & Grocery Mobile App",
      image: "./assets/images/portfolio/portfolio-02.jpg",
      highlight: "Real-Time Geolocation & Live Order Tracking",
      desc: "A high-performance cross-platform mobile application featuring interactive food discovery, dynamic multi-vendor cart management, live driver GPS tracking, and secure digital payment checkout.",
      tech: ["Flutter", "Dart", "Firebase", "Node.js", "Google Maps API", "Stripe API"],
      likes: 820
    },
    3: {
      category: "WEB DEVELOPMENT",
      title: "Modern Travel Booking & Tour Web Platform",
      image: "./assets/images/portfolio/portfolio-03.jpg",
      highlight: "Instant SSR & Automated Reservation Pipeline",
      desc: "A modern, ultra-responsive web application engineered with modular frontend architecture, lightning-fast server-side rendering, dynamic reservation workflows, and automated booking confirmations.",
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Stripe", "Supabase"],
      likes: 690
    },
    4: {
      category: "SOCIAL MARKETING",
      title: "Automated Lead Funnel & CRM Sync Pipeline",
      image: "./assets/images/portfolio/portfolio-04.jpg",
      highlight: "40% Increase in Qualified Sales Pipeline",
      desc: "An omni-channel growth automation pipeline integrating Facebook/Meta Lead Ads, WhatsApp Business API, and automated email nurturing sequences to qualify leads and trigger instant sales follow-ups.",
      tech: ["Meta Graph API", "WhatsApp Cloud API", "Make.com", "HubSpot CRM", "Zapier"],
      likes: 910
    },
    5: {
      category: "AI AUTOMATION",
      title: "Intelligent Voice AI & Support Concierge",
      image: "./assets/images/portfolio/portfolio-05.jpg",
      highlight: "Sub-Second Latency & Natural Voice Synthesis",
      desc: "An intelligent real-time conversational agent capable of handling voice calls, appointment scheduling, and customer inquiries with human-like latency, custom tone prompting, and CRM memory.",
      tech: ["OpenAI Whisper", "ElevenLabs API", "Twilio Voice", "FastAPI", "Vector Embeddings"],
      likes: 780
    },
    6: {
      category: "WEB DEVELOPMENT",
      title: "Headless E-Commerce & Dynamic Inventory Hub",
      image: "./assets/images/portfolio/portfolio-06.jpg",
      highlight: "Lightning 99 Lighthouse Score & Instant Checkout",
      desc: "Scalable e-commerce web platform engineered for instant page loads, automated inventory reconciliation across multi-warehouses, real-time analytics dashboards, and frictionless payments.",
      tech: ["Next.js", "Node.js", "GraphQL", "Redis", "Tailwind CSS", "PostgreSQL"],
      likes: 640
    }
  };

  const projectModalBackdrop = document.getElementById('projectModalBackdrop');
  const projectModalCloseBtn = document.getElementById('projectModalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalHighlightText = document.getElementById('modalHighlightText');
  const modalDesc = document.getElementById('modalDesc');
  const modalTechTags = document.getElementById('modalTechTags');
  const modalLikesCount = document.getElementById('modalLikesCount');
  const modalLikeBtn = document.getElementById('modalLikeBtn');
  const modalActionBtn = document.getElementById('modalActionBtn');

  let activeModalProjectId = null;
  const likedProjects = new Set();

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data || !projectModalBackdrop) return;

    activeModalProjectId = projectId;
    modalImg.src = data.image;
    modalImg.alt = data.title;
    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalHighlightText.textContent = data.highlight;
    modalDesc.textContent = data.desc;

    // Render Tech Stack Tags
    modalTechTags.innerHTML = '';
    data.tech.forEach(tag => {
      const pill = document.createElement('span');
      pill.className = 'tech-tag-pill';
      pill.textContent = tag;
      modalTechTags.appendChild(pill);
    });

    // Update Likes State
    updateModalLikesDisplay(projectId);

    // Show Modal
    projectModalBackdrop.classList.add('open');
    projectModalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModalBackdrop) return;
    projectModalBackdrop.classList.remove('open');
    projectModalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeModalProjectId = null;
  }

  function updateModalLikesDisplay(projectId) {
    const data = projectsData[projectId];
    if (!data) return;
    const isLiked = likedProjects.has(projectId);
    const count = data.likes + (isLiked ? 1 : 0);

    modalLikesCount.textContent = count;
    modalLikeBtn.classList.toggle('liked', isLiked);
    const icon = modalLikeBtn.querySelector('i');
    if (icon) {
      icon.className = isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    }

    // Sync card UI
    const card = document.querySelector(`.portfolio-card[data-project-id="${projectId}"]`);
    if (card) {
      const cardLikes = card.querySelector('.portfolio-likes');
      const cardCount = card.querySelector('.likes-count');
      const cardIcon = card.querySelector('.portfolio-likes i');
      if (cardCount) cardCount.textContent = count;
      if (cardLikes) cardLikes.classList.toggle('liked', isLiked);
      if (cardIcon) cardIcon.className = isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    }
  }

  function toggleLike(projectId) {
    if (!projectId) return;
    if (likedProjects.has(projectId)) {
      likedProjects.delete(projectId);
    } else {
      likedProjects.add(projectId);
    }
    updateModalLikesDisplay(projectId);
  }

  // Card click listeners
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  portfolioCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicked specifically on the heart icon, just toggle like without opening modal
      const likeBox = e.target.closest('.portfolio-likes');
      const projectId = parseInt(card.getAttribute('data-project-id'), 10);
      if (likeBox) {
        e.stopPropagation();
        toggleLike(projectId);
        return;
      }
      openProjectModal(projectId);
    });
  });

  // Modal Close Listeners
  if (projectModalCloseBtn) {
    projectModalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModalBackdrop) {
    projectModalBackdrop.addEventListener('click', (e) => {
      if (e.target === projectModalBackdrop) {
        closeProjectModal();
      }
    });
  }

  // Modal Like Button Listener
  if (modalLikeBtn) {
    modalLikeBtn.addEventListener('click', () => {
      if (activeModalProjectId) {
        toggleLike(activeModalProjectId);
      }
    });
  }

  // Modal Live Demo Button
  if (modalActionBtn) {
    modalActionBtn.addEventListener('click', () => {
      alert('বন্ধু শাকিল, তোমার নির্দেশনা অনুযায়ী এটি ডেমো মোডে প্রদর্শিত হচ্ছে। পরবর্তীতে তোমার আসল লাইভ প্রজেক্টের ইউআরএল এখানে যুক্ত করা হবে।');
    });
  }

  // Download CV Button
  const downloadCvBtn = document.getElementById('downloadCvBtn');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('বন্ধু শাকিল, তোমার নির্দেশনা অনুযায়ী সিভি পরে যোগ করা হবে।');
    });
  }

  // Open modal if requested via URL param (e.g. for previewing / testing)
  const urlParamsModal = new URLSearchParams(window.location.search);
  const modalParam = urlParamsModal.get('modal');
  if (modalParam) {
    const pId = parseInt(modalParam, 10);
    if (!isNaN(pId) && projectsData[pId]) {
      setTimeout(() => openProjectModal(pId), 150);
    }
  }

  // ------------------------------------------------------------------------
  // 7. RESUME TABS & SKILL BARS CONTROLLER
  // ------------------------------------------------------------------------
  const resumeTabBtns = document.querySelectorAll('.resume-tab-btn');
  const resumeTabPanes = document.querySelectorAll('.resume-tab-pane');

  function animateSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    skillFills.forEach(fill => {
      const targetWidth = fill.getAttribute('data-width') || '0%';
      fill.style.width = '0%';
      setTimeout(() => {
        fill.style.width = targetWidth;
      }, 50);
    });
  }

  function switchResumeTab(tabKey) {
    if (!tabKey) return;

    // Update buttons
    resumeTabBtns.forEach(btn => {
      const isActive = btn.getAttribute('data-tab') === tabKey;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update panes
    resumeTabPanes.forEach(pane => {
      const targetPaneId = 'pane-' + tabKey;
      if (pane.id === targetPaneId) {
        pane.classList.add('active');
        if (tabKey === 'skills') {
          animateSkillBars();
        }
      } else {
        pane.classList.remove('active');
      }
    });
  }

  resumeTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabKey = btn.getAttribute('data-tab');
      switchResumeTab(tabKey);
    });
  });

  // Open specific resume tab via URL param (e.g. ?tab=skills)
  const tabParam = urlParamsModal.get('tab');
  if (tabParam) {
    switchResumeTab(tabParam);
  } else {
    // Animate initial skill bars if skills pane is open
    const activePane = document.querySelector('.resume-tab-pane.active');
    if (activePane && activePane.id === 'pane-skills') {
      animateSkillBars();
    }
  }

  // ------------------------------------------------------------------------
  // 8. INTERACTIVE CONTACT FORM CONTROLLER (Strict Validation & Live Gmail Delivery)
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');

  // Input Elements
  const inputName = document.getElementById('clientName');
  const inputPhone = document.getElementById('clientPhone');
  const inputEmail = document.getElementById('clientEmail');
  const inputSubject = document.getElementById('clientSubject');
  const inputMessage = document.getElementById('clientMessage');

  // Error Spans
  const errName = document.getElementById('nameError');
  const errPhone = document.getElementById('phoneError');
  const errEmail = document.getElementById('emailError');
  const errSubject = document.getElementById('subjectError');
  const errMessage = document.getElementById('messageError');

  // Helper to show field error
  function setFieldError(input, errorSpan, message) {
    if (!input) return;
    input.classList.add('has-error');
    if (errorSpan) {
      errorSpan.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
      errorSpan.classList.add('active');
    }
  }

  // Helper to clear field error
  function clearFieldError(input, errorSpan) {
    if (!input) return;
    input.classList.remove('has-error');
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.classList.remove('active');
    }
  }

  let feedbackTimer = null;

  // Helper to hide and reset form feedback cleanly with fade-out
  function hideFormFeedback() {
    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
      feedbackTimer = null;
    }
    if (formFeedback && formFeedback.style.display !== 'none') {
      formFeedback.style.opacity = '0';
      formFeedback.style.transform = 'translateY(-4px)';
      setTimeout(() => {
        formFeedback.style.display = 'none';
        formFeedback.innerHTML = '';
        formFeedback.className = 'form-feedback';
        formFeedback.style.opacity = '1';
        formFeedback.style.transform = 'translateY(0)';
      }, 300);
    }
  }

  // Helper to escape HTML entities to prevent DOM XSS
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Helper to show success feedback with auto-dismiss timer
  function showSuccessFeedback(htmlMessage, autoDismissSeconds = 6) {
    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
    }
    formFeedback.className = 'form-feedback success';
    formFeedback.innerHTML = htmlMessage;
    formFeedback.style.display = 'block';
    formFeedback.style.opacity = '1';
    formFeedback.style.transform = 'translateY(0)';

    if (autoDismissSeconds > 0) {
      feedbackTimer = setTimeout(() => {
        hideFormFeedback();
      }, autoDismissSeconds * 1000);
    }
  }

  // Centralized Error Clearer (Dismisses all red error borders & messages)
  function clearAllContactErrors() {
    [
      { input: inputName, span: errName },
      { input: inputPhone, span: errPhone },
      { input: inputEmail, span: errEmail },
      { input: inputSubject, span: errSubject },
      { input: inputMessage, span: errMessage }
    ].forEach(pair => {
      clearFieldError(pair.input, pair.span);
    });
    if (formFeedback && formFeedback.classList.contains('error')) {
      hideFormFeedback();
    }
  }

  // 1. Auto-dismiss errors AND success feedback when clicking outside
  document.addEventListener('click', (e) => {
    // If clicked outside contact form, clear validation errors
    if (!e.target.closest('#contactForm')) {
      clearAllContactErrors();
    }
    // If feedback is visible and user clicked anywhere outside the feedback box itself, dismiss it immediately
    if (formFeedback && formFeedback.style.display !== 'none' && !e.target.closest('#formFeedback') && !e.target.closest('#contactSubmitBtn')) {
      hideFormFeedback();
    }
  });

  // 2. Real-time per-field error & feedback clearing when typing
  [
    { input: inputName, span: errName },
    { input: inputPhone, span: errPhone },
    { input: inputEmail, span: errEmail },
    { input: inputSubject, span: errSubject },
    { input: inputMessage, span: errMessage }
  ].forEach(pair => {
    if (pair.input) {
      pair.input.addEventListener('input', () => {
        clearFieldError(pair.input, pair.span);
        const remaining = document.querySelectorAll('.form-control.has-error');
        if (remaining.length === 0 && formFeedback && formFeedback.classList.contains('error')) {
          hideFormFeedback();
        }
      });
      // Also clear success feedback if user starts typing in any input field again
      pair.input.addEventListener('focus', () => {
        if (formFeedback && formFeedback.classList.contains('success')) {
          hideFormFeedback();
        }
      });
    }
  });

  // 3. Auto-dismiss all errors & feedback when navigating to any section (HOME, ABOUT, etc.)
  document.querySelectorAll('.nav-link, a[href="#home"], .brand-logo').forEach(link => {
    link.addEventListener('click', () => {
      clearAllContactErrors();
      hideFormFeedback();
    });
  });

  // 4. Auto-dismiss all errors & feedback when scrolling away from contact section
  window.addEventListener('scroll', () => {
    const contactSec = document.getElementById('contact');
    if (contactSec) {
      const rect = contactSec.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        clearAllContactErrors();
        hideFormFeedback();
      }
    }
  });

  if (contactForm && formFeedback && contactSubmitBtn) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Clear previous states
      clearFieldError(inputName, errName);
      clearFieldError(inputPhone, errPhone);
      clearFieldError(inputEmail, errEmail);
      clearFieldError(inputSubject, errSubject);
      clearFieldError(inputMessage, errMessage);
      formFeedback.style.display = 'none';

      const nameVal = inputName ? inputName.value.trim() : '';
      const phoneVal = inputPhone ? inputPhone.value.trim() : '';
      const emailVal = inputEmail ? inputEmail.value.trim() : '';
      const subjectVal = inputSubject ? inputSubject.value.trim() : '';
      const messageVal = inputMessage ? inputMessage.value.trim() : '';

      let hasError = false;
      let firstInvalidInput = null;

      // 1. Validate Name (Mandatory)
      if (!nameVal) {
        setFieldError(inputName, errName, 'Your name is required.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = inputName;
      }

      // 2. Validate Phone Number (Mandatory per user requirement)
      if (!phoneVal) {
        setFieldError(inputPhone, errPhone, 'Phone number is required to contact you.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = inputPhone;
      } else if (phoneVal.replace(/\D/g, '').length < 6) {
        setFieldError(inputPhone, errPhone, 'Please enter a valid phone number (minimum 6 digits).');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = inputPhone;
      }

      // 3. Validate Email (Mandatory per user requirement)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        setFieldError(inputEmail, errEmail, 'Email address is required.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = inputEmail;
      } else if (!emailRegex.test(emailVal)) {
        setFieldError(inputEmail, errEmail, 'Please enter a valid email address (e.g. client@gmail.com).');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = inputEmail;
      }

      // 4. Validate Message (Mandatory)
      if (!messageVal) {
        setFieldError(inputMessage, errMessage, 'Please write your message here.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = inputMessage;
      }

      // If any of the 3 required info (Name, Phone, Email) or Message is missing -> STOP!
      if (hasError) {
        formFeedback.className = 'form-feedback error';
        formFeedback.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Please fill out all required fields marked in red above before sending.';
        formFeedback.style.display = 'block';

        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return; // NEVER send unless all 3 details are provided!
      }

      // UI Sending State
      const originalBtnHTML = contactSubmitBtn.innerHTML;
      contactSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>SENDING TO GMAIL...</span>';
      contactSubmitBtn.disabled = true;

      try {
        // Send directly to Sakil's Gmail via FormSubmit AJAX API
        const response = await fetch('https://formsubmit.co/ajax/sakilahammed114@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: nameVal,
            phone: phoneVal,
            email: emailVal,
            _replyto: emailVal,
            _subject: `Portfolio Inquiry from ${nameVal}: ${subjectVal || 'New Project Lead'}`,
            message: messageVal,
            _template: 'table',
            _captcha: 'false'
          })
        });

        const data = await response.json();

        if (response.ok && (data.success === 'true' || data.success === true || response.status === 200)) {
          showSuccessFeedback(`<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${escapeHtml(nameVal)}</strong>! Your message has been sent directly to Sakil's Gmail (<strong>sakilahammed114@gmail.com</strong>). I will respond to your inquiry at <strong>${escapeHtml(emailVal)}</strong> shortly.`, 6);
          contactForm.reset();
        } else if (data.message && data.message.toLowerCase().includes('activation')) {
          showSuccessFeedback(`<i class="fa-solid fa-envelope-circle-check"></i> <strong>অ্যাক্টিভেশন ইমেইল পাঠানো হয়েছে!</strong> FormSubmit থেকে তোমার <strong>sakilahammed114@gmail.com</strong> ইনবক্সে একটি অ্যাক্টিভেশন মেইল পাঠানো হয়েছে। জিমেইল খুলে একবার <em>"Activate Form"</em> বাটনে ক্লিক করে দাও, তাহলেই ফর্মটি পুরোপুরি লাইভ হয়ে যাবে!`, 10);
        } else if (window.location.protocol === 'file:' || (data.message && data.message.toLowerCase().includes('web server'))) {
          formFeedback.className = 'form-feedback error';
          const mailtoUrl = `mailto:sakilahammed114@gmail.com?subject=${encodeURIComponent('[Portfolio Inquiry] ' + (subjectVal || 'New Project Lead'))}&body=${encodeURIComponent(`Name: ${nameVal}\nPhone: ${phoneVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}`)}`;
          formFeedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>লোকাল ফাইল নোটিস:</strong> সিকিউরিটির জন্য FormSubmit সরাসরি লোকাল ফাইল (file:///) থেকে লাইভ সেন্ড ব্লক করে। এটি ওয়েব সার্ভার (<a href="http://localhost:5500" target="_blank" style="color: #ff014f; text-decoration: underline; font-weight: 700;">http://localhost:5500</a>) বা লাইভ ডোমেইনে সরাসরি জিমেইলে যাবে। লোকাল ফাইল থেকে এখনই সরাসরি মেইল পাঠাতে <a href="${mailtoUrl}" class="mailto-fallback-link" style="color: #ffffff; text-decoration: underline; font-weight: 700;">এখানে ক্লিক করে সরাসরি জিমেইল অ্যাপের মাধ্যমে পাঠান</a>।`;
          formFeedback.style.display = 'block';
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        console.warn('FormSubmit AJAX fallback:', err);
        // Fallback: If network block or AJAX fails, offer mailto direct send
        const mailtoUrl = `mailto:sakilahammed114@gmail.com?subject=${encodeURIComponent('[Portfolio Inquiry] ' + (subjectVal || 'New Project Lead'))}&body=${encodeURIComponent(`Name: ${nameVal}\nPhone: ${phoneVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}`)}`;
        
        formFeedback.className = 'form-feedback error';
        formFeedback.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Network delivery notice: <a href="${mailtoUrl}" class="mailto-fallback-link" style="color: #ffffff; text-decoration: underline; font-weight: 700;">Click here to send directly via Gmail app</a> or email to <strong>sakilahammed114@gmail.com</strong>.`;
        formFeedback.style.display = 'block';
      } finally {
        contactSubmitBtn.innerHTML = originalBtnHTML;
        contactSubmitBtn.disabled = false;
      }
    });
  }
});