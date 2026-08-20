document.addEventListener('DOMContentLoaded', () => {
    // --- INITIALIZE REVEAL ON SCROLL ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- STICKY NAVBAR & ACTIVE SECTION HIGHLIGHT ---
    const header = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.main-navigation a, .mobile-nav-overlay a');
    const sections = document.querySelectorAll('section, .hero-section');
    
    // Sticky scroll threshold
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Active link scroll spy
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-10% 0px -60% 0px'
    });

    sections.forEach(sec => {
        if (sec.getAttribute('id')) {
            sectionObserver.observe(sec);
        }
    });

    // --- MOBILE HAMBURGER MENU ---
    const hamburger = document.querySelector('.header-action .action-link');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const overlayLinks = document.querySelectorAll('.mobile-nav-overlay a');
    
    if (hamburger && mobileOverlay) {
        let isOpen = false;
        
        const toggleMenu = (e) => {
            if (e) e.preventDefault();
            isOpen = !isOpen;
            
            if (isOpen) {
                mobileOverlay.classList.add('open');
                document.body.style.overflow = 'hidden'; // Lock scrolling
                hamburger.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                `;
            } else {
                mobileOverlay.classList.remove('open');
                document.body.style.overflow = ''; // Unlock scrolling
                hamburger.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <line x1="4" y1="12" x2="20" y2="12"></line>
                    </svg>
                `;
            }
        };

        hamburger.addEventListener('click', toggleMenu);
        
        // Close menu when clicking nav links
        overlayLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isOpen) toggleMenu();
            });
        });
    }

    // --- ROTATING TYPING ANIMATION ---
    const typedTextEl = document.querySelector('.typed-text');
    const phrases = ["Full Stack Developer", "Frontend Developer", "Problem Solver", "AI Enthusiast"];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeAnimation = () => {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            typedTextEl.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // Faster when backspacing
        } else {
            typedTextEl.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIdx === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingSpeed = 500; // Pause before starting next word
        }

        setTimeout(typeAnimation, typingSpeed);
    };

    if (typedTextEl) {
        setTimeout(typeAnimation, 1000);
    }

    // --- BUTTON RIPPLE EFFECT ---
    const buttons = document.querySelectorAll('.btn, .social-icon');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Ripple container position calculation
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const rippleSpan = document.createElement('span');
            rippleSpan.classList.add('ripple');
            rippleSpan.style.left = `${x}px`;
            rippleSpan.style.top = `${y}px`;
            
            this.appendChild(rippleSpan);
            
            setTimeout(() => {
                rippleSpan.remove();
            }, 600);
        });
    });

    // --- VIEW PROJECTS SMOOTH SCROLL ---
    const viewProjectsBtn = document.getElementById('view-projects-btn');
    if (viewProjectsBtn) {
        viewProjectsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectsSec = document.getElementById('projects');
            if (projectsSec) {
                projectsSec.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- DOWNLOAD RESUME HANDLER ---
    const downloadResumeBtn = document.getElementById('download-resume-btn');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', (e) => {
            // Check if actual file is linked; otherwise trigger virtual download for user experience
            const fileHref = downloadResumeBtn.getAttribute('href');
            if (fileHref === '#' || fileHref === '') {
                e.preventDefault();
                
                // Create a temporary simulated file download
                const dummyContent = "Ayush Pathak - Computer Engineering Student Portfolio Resume Placeholder Content.";
                const blob = new Blob([dummyContent], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const tempLink = document.createElement('a');
                tempLink.href = url;
                tempLink.download = 'Ayush_Pathak_Resume.pdf';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                URL.revokeObjectURL(url);
                
                // Notification/Visual Feedback
                const originalText = downloadResumeBtn.innerHTML;
                downloadResumeBtn.innerHTML = 'Downloaded ✓';
                downloadResumeBtn.style.borderColor = '#c9a44c';
                setTimeout(() => {
                    downloadResumeBtn.innerHTML = originalText;
                    downloadResumeBtn.style.borderColor = '';
                }, 2000);
            }
        });
    }

    // --- ANIMATED COUNT-UP STATS ---
    const stats = document.querySelectorAll('.stat-number');
    
    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // Animation duration in ms
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Ease out quad formula
            const easeProgress = progress * (2 - progress);
            const currentVal = Math.floor(easeProgress * target);
            
            element.textContent = `${currentVal}+`;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = `${target}+`;
            }
        };
        
        requestAnimationFrame(updateNumber);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                countUp(element);
                statsObserver.unobserve(element); // Animate only once
            }
        });
    }, {
        threshold: 0.5
    });

    stats.forEach(stat => statsObserver.observe(stat));
});