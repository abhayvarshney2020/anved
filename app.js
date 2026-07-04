/* ==========================================================================
   ANVED CONSULTANCY - MULTI-PAGE ADVISORY & ADMIN STORAGE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Set to Formspree endpoint (e.g. 'https://formspree.io/f/xxxx') to trigger email notifications!
    const FORMSPREE_ENDPOINT = '';

    const getCategoryTagHTML = (cat) => {
        const category = cat.toUpperCase().trim();
        let colorStyle = 'background-color: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE;'; // Default Blue
        if (category.includes('TAX')) {
            colorStyle = 'background-color: #FEF3C7; color: #D97706; border: 1px solid #FCD34D;'; // Amber
        } else if (category.includes('GST')) {
            colorStyle = 'background-color: #D1FAE5; color: #059669; border: 1px solid #A7F3D0;'; // Emerald
        } else if (category.includes('LLP') || category.includes('ROC') || category.includes('SECRETARIAL')) {
            colorStyle = 'background-color: #EEF2FF; color: #4F46E5; border: 1px solid #C7D2FE;'; // Indigo
        } else if (category.includes('FEMA') || category.includes('RBI')) {
            colorStyle = 'background-color: #FCE7F3; color: #DB2777; border: 1px solid #FBCFE8;'; // Pink
        }
        return `<span class="insight-tag" style="padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.72rem; display: inline-block; letter-spacing: 0.02em; ${colorStyle}">${cat}</span>`;
    };

    /* --- Database Initialization (localStorage fallback) --- */
    const defaultInsights = [];
    const defaultCareers = [];

    // Seed database if not set
    if (!localStorage.getItem('anved_insights')) {
        localStorage.setItem('anved_insights', JSON.stringify(defaultInsights));
    }
    if (!localStorage.getItem('anved_careers')) {
        localStorage.setItem('anved_careers', JSON.stringify(defaultCareers));
    }

    /* --- Navigation Elements --- */
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navDropdowns = document.querySelectorAll('.nav-item.dropdown');
    const backToTop = document.getElementById('backToTop');

    /* --- Header Scroll Effect --- */
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            if (backToTop) {
                if (window.scrollY > 500) {
                    backToTop.classList.add('active');
                } else {
                    backToTop.classList.remove('active');
                }
            }
        });
    }

    /* --- Mobile Menu drawer --- */
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Mobile drop-down clicks (touch devices support)
    navDropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        if (link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault(); 
                    dropdown.classList.toggle('open');
                }
            });
        }
    });

    // Close menu when clicked outside
    document.addEventListener('click', (e) => {
        if (header && !header.contains(e.target) && navMenu && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navDropdowns.forEach(d => d.classList.remove('open'));
        }
    });

    // Smooth Back-to-Top scrolling
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       PAGE: SERVICES.HTML (TABS SWITCH ENGINE - 8 PRACTICE AREAS)
       ========================================================================= */
    const tabButtons = document.querySelectorAll('.services-tab-btn');
    const panels = document.querySelectorAll('.services-tab-panel');

    const switchTab = (targetId) => {
        tabButtons.forEach(btn => {
            if (btn.getAttribute('data-target') === targetId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        panels.forEach(panel => {
            if (panel.getAttribute('id') === targetId) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    };

    const validTabs = [
        'direct-tax', 'indirect-tax', 'secretarial', 'payroll',
        'advisory', 'litigation', 'transfer-pricing', 'statutory-audit'
    ];

    if (tabButtons.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                switchTab(targetId);
                history.pushState(null, null, '#' + targetId);
            });
        });

        const handleHashChange = () => {
            const hash = window.location.hash.slice(1);
            if (hash && validTabs.includes(hash)) {
                switchTab(hash);
                const container = document.querySelector('.services-tabs-container');
                if (container) {
                    window.scrollTo({
                        top: container.offsetTop - 120,
                        behavior: 'smooth'
                    });
                }
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
    }

    /* ==========================================================================
       PAGE: INDEX.HTML (DYNAMIC RECENT INSIGHTS FEED)
       ========================================================================== */
    const homeInsightsGrid = document.getElementById('homeInsightsGrid');

    const renderHomeInsights = () => {
        if (!homeInsightsGrid) return;
        
        homeInsightsGrid.innerHTML = '';
        const articles = JSON.parse(localStorage.getItem('anved_insights')) || [];

        if (articles.length === 0) {
            homeInsightsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px 0; border: 1.5px dashed var(--border-color); border-radius: var(--border-radius-lg); background: white;">
                    <h3 style="font-weight:800; color:var(--text-title); margin-bottom:8px;">No Recent Updates</h3>
                    <p style="color:var(--text-muted); font-size:0.9rem;">There are no recent regulatory alerts published. Check back soon!</p>
                </div>
            `;
            return;
        }

        // Display up to 3 latest articles
        const latest = articles.slice(0, 3);
        latest.forEach(art => {
            const card = document.createElement('div');
            card.className = 'insight-card';
            card.innerHTML = `
                <div class="insight-card-body">
                    ${getCategoryTagHTML(art.category)}
                    <h3 style="margin-top: 10px;">${art.title}</h3>
                    <p>${art.desc}</p>
                    <div class="insight-meta">
                        <span>${art.date}</span>
                        <a href="insights.html" class="text-orange">Read Article &rarr;</a>
                    </div>
                </div>
            `;
            homeInsightsGrid.appendChild(card);
        });
    };

    renderHomeInsights();

    /* ==========================================================================
       PAGE: INSIGHTS.HTML (DYNAMIC RENDERING & SEARCH ENGINE)
       ========================================================================== */
    const insightsSearch = document.getElementById('insightsSearch');
    const btnSearch = document.getElementById('btnSearch');
    const insightsGrid = document.getElementById('insightsGrid');
    const insightEmpty = document.getElementById('insightEmpty');

    const renderInsightsFeed = () => {
        if (!insightsGrid) return;
        
        // Clear all current items (except the empty state)
        const oldCards = insightsGrid.querySelectorAll('.insight-card');
        oldCards.forEach(c => c.remove());

        const articles = JSON.parse(localStorage.getItem('anved_insights')) || [];

        articles.forEach(art => {
            const card = document.createElement('div');
            card.className = 'insight-card';
            card.innerHTML = `
                <div class="insight-card-body">
                    ${getCategoryTagHTML(art.category)}
                    <h3 style="margin-top: 10px;">${art.title}</h3>
                    <p>${art.desc}</p>
                    <div class="insight-meta">
                        <span>${art.date}</span>
                        <span class="text-orange" style="cursor:pointer;">Download PDF &darr;</span>
                    </div>
                </div>
            `;
            // Insert before the empty state card
            insightsGrid.insertBefore(card, insightEmpty);
        });
    };

    const runInsightsFilter = () => {
        const query = insightsSearch.value.trim().toLowerCase();
        const cards = insightsGrid.querySelectorAll('.insight-card');
        let matchCount = 0;

        cards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            const text = card.querySelector('p').innerText.toLowerCase();
            const tag = card.querySelector('.insight-tag').innerText.toLowerCase();

            if (title.includes(query) || text.includes(query) || tag.includes(query)) {
                card.style.display = 'flex';
                matchCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (matchCount === 0) {
            insightEmpty.style.display = 'block';
        } else {
            insightEmpty.style.display = 'none';
        }
    };

    if (insightsGrid) {
        renderInsightsFeed();

        if (insightsSearch) {
            insightsSearch.addEventListener('input', runInsightsFilter);
            btnSearch.addEventListener('click', runInsightsFilter);
            insightsSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    runInsightsFilter();
                }
            });
        }
    }

    /* ==========================================================================
       PAGE: CAREERS.HTML (DYNAMIC RENDERING & APPLY HANDLERS)
       ========================================================================== */
    const jobsListContainer = document.getElementById('jobsListContainer');
    const appPosition = document.getElementById('appPosition');
    const careerForm = document.getElementById('careerForm');
    const appResume = document.getElementById('appResume');
    const uploadStatus = document.getElementById('uploadStatus');
    const resumeLabel = document.getElementById('resumeLabel');
    const appSuccessModal = document.getElementById('appSuccessModal');
    const btnAppClose = document.getElementById('btnAppClose');

    const renderCareersFeed = () => {
        if (!jobsListContainer) return;

        jobsListContainer.innerHTML = '';
        const openings = JSON.parse(localStorage.getItem('anved_careers')) || [];

        if (openings.length === 0) {
            jobsListContainer.innerHTML = `
                <div style="text-align: center; padding: 40px 0; border: 1.5px dashed var(--border-color); border-radius: var(--border-radius-lg); background: white;">
                    <h3 style="font-weight:800; color:var(--text-title); margin-bottom:8px;">No Open Positions</h3>
                    <p style="color:var(--text-muted); font-size:0.9rem;">We currently have no active hiring pipelines. You can submit a general application below.</p>
                </div>
            `;
            
            // Populate select dropdown with just general option
            if (appPosition) {
                appPosition.innerHTML = `<option value="general">General Application / Intern</option>`;
            }
            return;
        }

        // Render job cards
        openings.forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
                <div class="job-card-header">
                    <h3>${job.title}</h3>
                    <span class="job-type">${job.type}</span>
                </div>
                <div class="job-meta-row">
                    <span>${job.location}</span>
                    <span>${job.meta}</span>
                </div>
                <p>${job.desc}</p>
                <span class="job-apply-link" data-role="${job.title}">Apply For Role &rarr;</span>
            `;
            jobsListContainer.appendChild(card);
        });

        // Re-populate target select dropdown options matching actual database!
        if (appPosition) {
            appPosition.innerHTML = '';
            openings.forEach(job => {
                const opt = document.createElement('option');
                opt.value = job.title.toLowerCase().replace(/\s+/g, '-');
                opt.textContent = job.title;
                appPosition.appendChild(opt);
            });
            const generalOpt = document.createElement('option');
            generalOpt.value = 'general';
            generalOpt.textContent = 'General Application / Intern';
            appPosition.appendChild(generalOpt);
        }
    };

    if (jobsListContainer) {
        renderCareersFeed();

        // Event delegation for "Apply For Role" dynamic links
        jobsListContainer.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('job-apply-link')) {
                const targetRole = e.target.getAttribute('data-role');
                
                if (appPosition) {
                    for (let i = 0; i < appPosition.options.length; i++) {
                        if (appPosition.options[i].text === targetRole) {
                            appPosition.selectedIndex = i;
                            break;
                        }
                    }
                }

                // Scroll to application card
                const formCard = document.querySelector('.careers-form-card');
                if (formCard) {
                    window.scrollTo({
                        top: formCard.offsetTop - 120,
                        behavior: 'smooth'
                    });
                    
                    const nameInput = document.getElementById('appName');
                    if (nameInput) setTimeout(() => nameInput.focus(), 600);
                }
            }
        });
    }

    // Display filename upon upload
    if (appResume) {
        appResume.addEventListener('change', () => {
            const file = appResume.files[0];
            if (file) {
                uploadStatus.innerText = file.name;
                resumeLabel.style.borderColor = 'var(--primary)';
                resumeLabel.style.color = 'var(--primary)';
                document.getElementById('resumeError').style.display = 'none';
            } else {
                uploadStatus.innerText = "Upload Document";
                resumeLabel.style.borderColor = '';
                resumeLabel.style.color = '';
            }
        });
    }

    /* ==========================================================================
       FORM FLOATING LABELS INPUT VALIDATORS
       ========================================================================== */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateGroup = (inputElement, condition) => {
        const group = inputElement.closest('.form-group');
        if (condition) {
            group.classList.remove('error');
            return true;
        } else {
            group.classList.add('error');
            return false;
        }
    };

    const clearErrorOnInput = (elementsArray) => {
        elementsArray.forEach(el => {
            if (el) {
                el.addEventListener('input', () => {
                    el.closest('.form-group').classList.remove('error');
                });
            }
        });
    };

    /* --- Career Form Submission --- */
    if (careerForm) {
        const appName = document.getElementById('appName');
        const appEmail = document.getElementById('appEmail');
        const appMessage = document.getElementById('appMessage');

        clearErrorOnInput([appName, appEmail, appMessage]);

        careerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateGroup(appName, appName.value.trim() !== '');
            const isEmailValid = validateGroup(appEmail, emailRegex.test(appEmail.value.trim()));
            const isMsgValid = validateGroup(appMessage, appMessage.value.trim() !== '');
            
            let isResumeValid = true;
            if (!appResume.files[0]) {
                document.getElementById('resumeError').style.display = 'block';
                resumeLabel.style.borderColor = '#EF4444';
                isResumeValid = false;
            } else {
                document.getElementById('resumeError').style.display = 'none';
            }

            if (isNameValid && isEmailValid && isMsgValid && isResumeValid) {
                const submission = {
                    id: Date.now(),
                    name: appName.value.trim(),
                    email: appEmail.value.trim(),
                    position: appPosition.options[appPosition.selectedIndex].text,
                    resumeName: appResume.files[0].name,
                    coverInfo: appMessage.value.trim(),
                    timestamp: new Date().toLocaleString()
                };

                const submissions = JSON.parse(localStorage.getItem('anved_career_submissions')) || [];
                submissions.unshift(submission);
                localStorage.setItem('anved_career_submissions', JSON.stringify(submissions));

                // Dispatch Email via Formspree if endpoint is set
                if (FORMSPREE_ENDPOINT) {
                    fetch(FORMSPREE_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            form_type: 'Job Application',
                            name: submission.name,
                            email: submission.email,
                            position: submission.position,
                            resume_attached: submission.resumeName,
                            cover_note: submission.coverInfo,
                            _subject: `Anved Job Application: ${submission.position} - ${submission.name}`
                        })
                    }).catch(err => console.error("Career Formspree failed:", err));
                }

                careerForm.reset();
                uploadStatus.innerText = "Upload Document";
                resumeLabel.style.borderColor = '';
                resumeLabel.style.color = '';

                appSuccessModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        btnAppClose.addEventListener('click', () => {
            appSuccessModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        appSuccessModal.addEventListener('click', (e) => {
            if (e.target === appSuccessModal) {
                appSuccessModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* --- Contact Page Form Submission --- */
    const contactForm = document.getElementById('contactForm');
    const contactSuccessModal = document.getElementById('contactSuccessModal');
    const btnContactClose = document.getElementById('btnContactClose');

    if (contactForm) {
        const contactName = document.getElementById('contactName');
        const contactEmail = document.getElementById('contactEmail');
        const contactMessage = document.getElementById('contactMessage');

        clearErrorOnInput([contactName, contactEmail, contactMessage]);

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateGroup(contactName, contactName.value.trim() !== '');
            const isEmailValid = validateGroup(contactEmail, emailRegex.test(contactEmail.value.trim()));
            const isMsgValid = validateGroup(contactMessage, contactMessage.value.trim() !== '');

            if (isNameValid && isEmailValid && isMsgValid) {
                const query = {
                    id: Date.now(),
                    name: contactName.value.trim(),
                    email: contactEmail.value.trim(),
                    service: document.getElementById('contactService').value,
                    message: contactMessage.value.trim(),
                    timestamp: new Date().toLocaleString()
                };

                const queries = JSON.parse(localStorage.getItem('anved_contact_submissions')) || [];
                queries.unshift(query);
                localStorage.setItem('anved_contact_submissions', JSON.stringify(queries));

                // Dispatch Email via Formspree if endpoint is set
                if (FORMSPREE_ENDPOINT) {
                    fetch(FORMSPREE_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            form_type: 'Contact Inquiry',
                            name: query.name,
                            email: query.email,
                            service: query.service,
                            message: query.message,
                            _subject: `New Anved Inquiry from ${query.name}`
                        })
                    }).catch(err => console.error("Contact Formspree failed:", err));
                }

                contactForm.reset();
                contactSuccessModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        btnContactClose.addEventListener('click', () => {
            contactSuccessModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        contactSuccessModal.addEventListener('click', (e) => {
            if (e.target === contactSuccessModal) {
                contactSuccessModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Pre-select service in dropdown if query parameter exists
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        if (serviceParam) {
            const selectEl = document.getElementById('contactService');
            if (selectEl) {
                for (let i = 0; i < selectEl.options.length; i++) {
                    if (selectEl.options[i].value === serviceParam) {
                        selectEl.selectedIndex = i;
                        break;
                    }
                }
            }
        }
    }

    /* --- Newsletter Form Submission --- */
    const newsletterForm = document.getElementById('newsletterForm');
    const newsModal = document.getElementById('newsModal');
    const btnNewsClose = document.getElementById('btnNewsClose');

    if (newsletterForm) {
        const newsEmail = document.getElementById('newsEmail');

        clearErrorOnInput([newsEmail]);

        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isEmailValid = validateGroup(newsEmail, emailRegex.test(newsEmail.value.trim()));

            if (isEmailValid) {
                const sub = {
                    id: Date.now(),
                    email: newsEmail.value.trim(),
                    timestamp: new Date().toLocaleString()
                };

                const subs = JSON.parse(localStorage.getItem('anved_newsletter_subscribers')) || [];
                subs.unshift(sub);
                localStorage.setItem('anved_newsletter_subscribers', JSON.stringify(subs));

                newsletterForm.reset();
                newsModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        btnNewsClose.addEventListener('click', () => {
            newsModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        newsModal.addEventListener('click', (e) => {
            if (e.target === newsModal) {
                newsModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* ==========================================================================
       INTERACTIVE LIVE ENGINE: PRELOADER, SCROLL REVEAL, STAT COUNTERS, ACCORDIONS
       ========================================================================== */

    // 1. Preloader Screen fade out
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
            }, 600); // 600ms load window delay
        });
        // Safety fallback if load event is missed
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 2000);
    }

    // 2. Scroll Reveal Animations (using Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 3. Stats Count-Up Animation
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const runCounterAnimation = (counterElement) => {
            const target = parseInt(counterElement.getAttribute('data-target'));
            const duration = 1600; // 1.6s counting animation
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;
            
            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    counterElement.innerText = target;
                    clearInterval(timer);
                } else {
                    counterElement.innerText = current;
                }
            }, stepTime);
        };

        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const subCounters = el.querySelectorAll('.counter');
                    subCounters.forEach(c => runCounterAnimation(c));
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.2 });

        const statsContainer = document.querySelector('.hero-stats-row');
        if (statsContainer) statsObserver.observe(statsContainer);
    }

    // 4. FAQ Accordion Expanding panels
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Collapse all other accordion items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-content').style.maxHeight = '0';
                    }
                });

                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    content.style.maxHeight = '0';
                } else {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });

    // 5. Scroll Header Glassmorphic background state transition
    const navbarHeader = document.querySelector('.navbar-header');
    if (navbarHeader) {
        const toggleHeaderScrolled = () => {
            if (window.scrollY > 24) {
                navbarHeader.classList.add('scrolled');
            } else {
                navbarHeader.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', toggleHeaderScrolled);
        toggleHeaderScrolled(); // Run once on load
    }



});
