document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. Custom Cursor & Glow Follower --- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorGlow = document.getElementById('cursor-glow');

  if (cursorDot && cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;
      cursorDot.style.left = `${x}px`;
      cursorDot.style.top = `${y}px`;

      cursorGlow.animate({
        left: `${x}px`,
        top: `${y}px`
      }, { duration: 500, fill: "forwards" });
    });
  }

  /* --- 2. Interactive Background Particle Canvas --- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 183, 213, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ffb7d5";
        ctx.fill();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 183, 213, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }

  /* --- 3. Hero Subtitle Typewriter Effect --- */
  const words = [
    "Full-Stack Web Architectures.",
    "C++ Algorithmic Engines.",
    "Scalable Digital Systems.",
    "Interactive Web Experiences."
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterElement = document.getElementById('typewriter');

  if (typewriterElement) {
    function typeEffect() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400;
      }

      setTimeout(typeEffect, typeSpeed);
    }
    typeEffect();
  }

  /* --- 4. Stat Counter Animation --- */
  const statNumbers = document.querySelectorAll('.stat-num');
  let animatedStats = false;

  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animatedStats = true;
          statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            let count = 0;
            const speed = target / 50;

            const updateCount = () => {
              count += speed;
              if (count < target) {
                stat.textContent = Math.ceil(count);
                setTimeout(updateCount, 30);
              } else {
                stat.textContent = target + (target === 99 ? '%' : '+');
              }
            };
            updateCount();
          });
        }
      });
    }, { threshold: 0.3 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) observer.observe(aboutSection);
  }

  /* --- 5. Project Category Filtering --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --- 6. CLI Terminal Logic --- */
  const terminalModal = document.getElementById('terminal-modal');
  const terminalOpenBtn = document.getElementById('terminal-open-btn');
  const terminalCloseBtn = document.getElementById('terminal-close-btn');
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');

  function toggleTerminal() {
    if (terminalModal) {
      terminalModal.classList.toggle('active');
      if (terminalModal.classList.contains('active') && terminalInput) {
        terminalInput.focus();
      }
    }
  }

  if (terminalOpenBtn) terminalOpenBtn.addEventListener('click', toggleTerminal);
  if (terminalCloseBtn) terminalCloseBtn.addEventListener('click', toggleTerminal);

  if (terminalInput && terminalBody) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const inputVal = terminalInput.value.trim().toLowerCase();
        if (inputVal === '') return;

        const userLine = document.createElement('div');
        userLine.className = 'terminal-line';
        userLine.innerHTML = `<span class="prompt">vaishnavi@dev:~$</span> ${inputVal}`;
        terminalBody.appendChild(userLine);

        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-line';

        switch (inputVal) {
          case 'help':
            responseLine.innerHTML = `Available commands:<br>
              - <span class="highlight-cmd">about</span> : Display biography<br>
              - <span class="highlight-cmd">skills</span> : List tech stack<br>
              - <span class="highlight-cmd">projects</span> : View engineering works<br>
              - <span class="highlight-cmd">contact</span> : Show contact info<br>
              - <span class="highlight-cmd">clear</span> : Clear terminal screen<br>
              - <span class="highlight-cmd">exit</span> : Close CLI window`;
            break;
          case 'about':
            responseLine.innerHTML = "Vaishnavi Sinha — CS & IT Student passionate about full-stack engineering, algorithms in C++, and system design.";
            break;
          case 'skills':
            responseLine.innerHTML = "Stack: C++, JavaScript (ES6+), HTML5, CSS3 Glassmorphic UI, Git, OOP & Data Structures.";
            break;
          case 'projects':
            responseLine.innerHTML = "1. WebDev Bookstore Platform<br>2. Interactive Task Tracker<br>3. E2B Business Architecture Dashboard";
            break;
          case 'contact':
            responseLine.innerHTML = "Use the transmission form below or navigate to #contact section.";
            break;
          case 'clear':
            terminalBody.innerHTML = '';
            terminalInput.value = '';
            return;
          case 'exit':
            toggleTerminal();
            terminalInput.value = '';
            return;
          default:
            responseLine.innerHTML = `Command not recognized: '${inputVal}'. Type <span class="highlight-cmd">'help'</span> for system commands.`;
        }

        terminalBody.appendChild(responseLine);
        terminalInput.value = '';
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    });
  }

  /* --- 7. Interactive Form Handler --- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("Transmission Received! Thank you for reaching out, Vaishnavi will respond shortly.");
      contactForm.reset();
    });
  }
});