// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-menu a');
const hamburger = document.querySelector('.hamburger');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const closeMenu = document.querySelector('.close-menu');
const themeToggle = document.querySelector('.theme-toggle');
const backToTop = document.querySelector('.back-to-top');
const scrollProgress = document.querySelector('.scroll-progress');
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const contactForm = document.querySelector('#contact-form');
const copyBtn = document.querySelector('.copy-btn');
const toast = document.querySelector('.toast');
const portofolioTabs = document.querySelectorAll('.portofolio-tab');
const portofolioContents = document.querySelectorAll('.portofolio-content');

const currentYear = document.querySelector('#current-year');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    setupScrollEffects();
    setupNavigation();
    setupMobileMenu();
    setupThemeToggle();
    setupCustomCursor();
    setupFormValidation();
    setupBackToTop();
    // setupAnimations(); // Disabled animations
    setupPortfolioTabs();
    setupSkillCards();
    setupCertificateCards();
    updateCurrentYear();
    setupTypingAnimations(); // Add typing animations
    setupIntroAnimation(); // Add intro animation
    setupIdCardSwing(); // Add ID card swing animation
}

// Scroll Effects
function setupScrollEffects() {
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar shrink effect
        if (scrollTop > 100) {
            navbar.classList.add('shrink');
        } else {
            navbar.classList.remove('shrink');
        }

        // Update scroll progress
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.transform = `scaleX(${progress / 100})`;

        // Back to top button
        if (scrollTop > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        lastScrollTop = scrollTop;
    });
}

// Navigation
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update active link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');

                // Close mobile menu
                closeMobileMenu();
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;

        navLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const sectionTop = targetSection.offsetTop;
                const sectionHeight = targetSection.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

// Mobile Menu
function setupMobileMenu() {
    hamburger.addEventListener('click', toggleMobileMenu);
    closeMenu.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Close menu on link click
    document.querySelectorAll('.mobile-nav-menu a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function toggleMobileMenu() {
    mobileMenuOverlay.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    mobileMenuOverlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
}

// Theme Toggle
function setupThemeToggle() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon();
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon();
    });
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Custom Cursor
function setupCustomCursor() {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        cursorFollower.style.left = `${mouseX}px`;
        cursorFollower.style.top = `${mouseY}px`;

        requestAnimationFrame(updateCursor);
    }

    updateCursor();

    // Hide cursor on touch devices
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .btn, .skill-card, .project-card, .certificate-card, .timeline-item, .contact-item');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        el.addEventListener('mouseleave', () => {
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// Form Validation
function setupFormValidation() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submit-btn');
    const loadingSpinner = document.getElementById('loading-spinner');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset errors
        [nameError, emailError, messageError].forEach(error => {
            error.textContent = '';
            error.classList.remove('show');
        });

        let isValid = true;

        // Validate name
        if (!nameInput.value.trim()) {
            nameError.textContent = 'Name is required';
            nameError.classList.add('show');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            emailError.textContent = 'Email is required';
            emailError.classList.add('show');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email';
            emailError.classList.add('show');
            isValid = false;
        }

        // Validate message
        if (!messageInput.value.trim()) {
            messageError.textContent = 'Message is required';
            messageError.classList.add('show');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Prepare email parameters
            const templateParams = {
                from_name: nameInput.value.trim(),
                from_email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                to_email: 'maulaaqielnuri@gmail.com'
            };

            // Send email using EmailJS
            await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams);

            // Show success message
            showToast('Message sent successfully!', 'success');

            // Reset form
            contactForm.reset();

        } catch (error) {
            console.error('EmailJS error:', error);
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// Copy Email
function setupCopyEmail() {
    copyBtn.addEventListener('click', async () => {
        const email = copyBtn.getAttribute('data-copy');

        try {
            await navigator.clipboard.writeText(email);
            showToast('Email copied to clipboard!', 'success');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = email;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('Email copied to clipboard!', 'success');
        }
    });
}

// Back to Top
function setupBackToTop() {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0,
        rootMargin: '0px 0px 0px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all fade-in-up elements
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // Check for elements already in view on load
    setTimeout(() => {
        document.querySelectorAll('.fade-in-up').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('animate');
            }
        });
    }, 100);

    // Section scroll animations
    setupSectionAnimations();
}

function setupSectionAnimations() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = null;

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;

            if (entry.isIntersecting) {
                // Section is entering viewport
                if (currentSection && currentSection !== section) {
                    // Animate out previous section
                    currentSection.classList.remove('animate-in');
                    currentSection.classList.add('animate-out');
                }

                // Animate in current section
                section.classList.remove('animate-out');
                section.classList.add('animate-in');
                currentSection = section;
            } else {
                // Section is leaving viewport
                if (currentSection === section) {
                    section.classList.remove('animate-in');
                    section.classList.add('animate-out');
                    currentSection = null;
                }
            }
        });
    }, {
        threshold: 0.3, // Trigger when 30% of section is visible
        rootMargin: '-50px 0px -50px 0px'
    });

    // Observe all sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Update Current Year
function updateCurrentYear() {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// Portofolio Tabs
function setupPortfolioTabs() {
    // Set Projects as default active tab
    const defaultTab = document.querySelector('.portofolio-tab[data-tab="projects"]');
    if (defaultTab) {
        defaultTab.classList.add('active');
        defaultTab.setAttribute('aria-selected', 'true');
        const defaultContent = document.getElementById('projects-tab');
        if (defaultContent) {
            defaultContent.classList.add('active');
        }
    }

    portofolioTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');

            // Remove active class from all tabs
            portofolioTabs.forEach(t => t.classList.remove('active'));
            portofolioTabs.forEach(t => t.setAttribute('aria-selected', 'false'));

            // Add active class to clicked tab
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Hide all tab contents
            portofolioContents.forEach(content => content.classList.remove('active'));

            // Show selected tab content
            const selectedContent = document.getElementById(`${tabName}-tab`);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
        });
    });
}

// Skill Cards Expand/Collapse
function setupSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle expanded class
            card.classList.toggle('expanded');

            // Update aria-expanded attribute
            const isExpanded = card.classList.contains('expanded');
            card.setAttribute('aria-expanded', isExpanded);

            // Close other expanded cards (optional - remove if you want multiple open)
            skillCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                    otherCard.setAttribute('aria-expanded', false);
                }
            });
        });
    });
}

// Certificate Cards Expand/Collapse
function setupCertificateCards() {
    const certificateCards = document.querySelectorAll('.certificate-card');

    certificateCards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle expanded class
            card.classList.toggle('expanded');

            // Update aria-expanded attribute
            const isExpanded = card.classList.contains('expanded');
            card.setAttribute('aria-expanded', isExpanded);

            // Close other expanded cards (optional - remove if you want multiple open)
            certificateCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                    otherCard.setAttribute('aria-expanded', false);
                }
            });
        });
    });
}

// Show Toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Typing Animations
function setupTypingAnimations() {
    // Select all text elements to animate
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, li, a, button, .btn-text');

    textElements.forEach((element, index) => {
        // Skip elements that shouldn't be animated (like icons, inputs, etc.)
        if (element.querySelector('i') || element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' ||
            element.classList.contains('sr-only') || element.getAttribute('aria-hidden') === 'true') {
            return;
        }

        const originalText = element.textContent.trim();
        if (originalText) {
            element.textContent = '';
            element.style.opacity = '1'; // Ensure visibility

            // Start typing animation with delay based on index
            setTimeout(() => {
                typeText(element, originalText);
            }, index * 100); // Stagger animations
        }
    });

    // Setup search input typing animation
    setupSearchTypingAnimation();
}

function typeText(element, text) {
    let index = 0;
    const typingSpeed = 50; // milliseconds per character

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, typingSpeed);
        }
    }

    type();
}

// Search Input Typing Animation
function setupSearchTypingAnimation() {
    const searchInput = document.getElementById('portfolio-search');
    if (!searchInput) return;

    const placeholders = [
        'Search my portfolio...',
        'Find projects...',
        'Explore skills...',
        'Discover certificates...'
    ];

    let currentPlaceholderIndex = 0;
    let currentCharIndex = 0;
    let isTyping = true;
    let timeoutId;

    function typePlaceholder() {
        const currentPlaceholder = placeholders[currentPlaceholderIndex];

        if (isTyping) {
            if (currentCharIndex < currentPlaceholder.length) {
                searchInput.placeholder += currentPlaceholder.charAt(currentCharIndex);
                currentCharIndex++;
                timeoutId = setTimeout(typePlaceholder, 100); // Typing speed
            } else {
                // Finished typing, wait before erasing
                isTyping = false;
                timeoutId = setTimeout(typePlaceholder, 2000); // Wait 2 seconds
            }
        } else {
            if (currentCharIndex > 0) {
                searchInput.placeholder = searchInput.placeholder.slice(0, -1);
                currentCharIndex--;
                timeoutId = setTimeout(typePlaceholder, 50); // Erasing speed
            } else {
                // Finished erasing, move to next placeholder
                isTyping = true;
                currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholders.length;
                timeoutId = setTimeout(typePlaceholder, 500); // Wait before typing next
            }
        }
    }

    // Start the animation after a delay
    setTimeout(typePlaceholder, 2000);

    // Clear timeout on page unload
    window.addEventListener('beforeunload', () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    });

    // Setup search functionality
    setupPortfolioSearch();
}

// Portfolio Search Functionality
function setupPortfolioSearch() {
    const searchInput = document.getElementById('portfolio-search');
    const searchBtn = document.querySelector('.search-btn');

    if (!searchInput || !searchBtn) return;

    // Stop placeholder animation when user starts typing
    searchInput.addEventListener('focus', () => {
        searchInput.placeholder = 'Search my portfolio...';
    });

    // Handle search button click
    searchBtn.addEventListener('click', () => {
        performSearch();
    });

    // Handle Enter key press
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Real-time search as user types (optional)
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch();
        }, 300); // Debounce search
    });
}

function performSearch() {
    const searchInput = document.getElementById('portfolio-search');
    const query = searchInput.value.toLowerCase().trim();

    if (!query) {
        // If search is empty, show all content
        resetSearchResults();
        return;
    }

    // Search in different sections
    searchProjects(query);
    searchSkills(query);
    searchCertificates(query);

    // Switch to relevant tab if results found
    switchToRelevantTab(query);
}

function searchProjects(query) {
    const projectCards = document.querySelectorAll('.project-card');
    let hasResults = false;

    projectCards.forEach(card => {
        const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
        const description = card.querySelector('p')?.textContent.toLowerCase() || '';

        if (title.includes(query) || description.includes(query)) {
            card.style.display = 'block';
            hasResults = true;
        } else {
            card.style.display = 'none';
        }
    });

    return hasResults;
}

function searchSkills(query) {
    const skillCards = document.querySelectorAll('.skill-card');
    let hasResults = false;

    skillCards.forEach(card => {
        const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.skill-content p')?.textContent.toLowerCase() || '';

        if (title.includes(query) || description.includes(query)) {
            card.style.display = 'flex';
            hasResults = true;
        } else {
            card.style.display = 'none';
        }
    });

    return hasResults;
}

function searchCertificates(query) {
    const certificateCards = document.querySelectorAll('.certificate-card');
    let hasResults = false;

    certificateCards.forEach(card => {
        const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.certificate-content p')?.textContent.toLowerCase() || '';

        if (title.includes(query) || description.includes(query)) {
            card.style.display = 'block';
            hasResults = true;
        } else {
            card.style.display = 'none';
        }
    });

    return hasResults;
}

function switchToRelevantTab(query) {
    const projectsTab = document.querySelector('.portofolio-tab[data-tab="projects"]');
    const skillsTab = document.querySelector('.portofolio-tab[data-tab="skills"]');
    const certificatesTab = document.querySelector('.portofolio-tab[data-tab="certificates"]');

    // Check which sections have results
    const hasProjects = searchProjects(query);
    const hasSkills = searchSkills(query);
    const hasCertificates = searchCertificates(query);

    // Switch to the first tab that has results
    if (hasProjects) {
        projectsTab.click();
    } else if (hasSkills) {
        skillsTab.click();
    } else if (hasCertificates) {
        certificatesTab.click();
    }
}

function resetSearchResults() {
    // Show all items
    document.querySelectorAll('.project-card, .skill-card, .certificate-card').forEach(card => {
        card.style.display = card.classList.contains('skill-card') ? 'flex' : 'block';
    });
}

// Global search function for external use
function searchPortfolio() {
    performSearch();
}
// Intro Animation
function setupIntroAnimation() {
    const introOverlay = document.getElementById('intro-overlay');
    const typingText = document.getElementById('typing-text');

    if (!introOverlay || !typingText) return;

    // Show intro overlay immediately and expose to assistive tech while visible
    introOverlay.style.display = 'flex';
    introOverlay.setAttribute('aria-hidden', 'false');

    // Set the full text immediately for better visibility
    const welcomeText = 'Welcome to my Portfolio';
    typingText.textContent = welcomeText;

    // Add fade-in animation class if used in CSS
    typingText.classList.add('fade-in-full');

    // Respect reduced-motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Short default display time so background content is visible quickly.
    // Use 200ms when reduced-motion is preferred, otherwise 1200ms.
    const displayTime = prefersReduced ? 200 : 1200;

    let autoHideTimer = null;

    const hideOverlay = () => {
        if (introOverlay.classList.contains('hide')) return;
        introOverlay.classList.add('hide');
        introOverlay.setAttribute('aria-hidden', 'true');

        // after CSS fade-out completes, remove display so it no longer blocks layout/interaction
        setTimeout(() => {
            try {
                introOverlay.style.display = 'none';
            } catch (e) { /* ignore */ }
        }, 1600); // matches CSS transition 1.5s + small slack

        // cleanup event listeners if still attached
        document.removeEventListener('keydown', onUserInteraction);
        document.removeEventListener('click', onUserInteraction);
    };

    const onUserInteraction = () => {
        if (autoHideTimer) {
            clearTimeout(autoHideTimer);
            autoHideTimer = null;
        }
        hideOverlay();
    };

    // Auto hide after short delay
    autoHideTimer = setTimeout(hideOverlay, displayTime);

    // Allow immediate dismissal by user interaction (click / any key)
    document.addEventListener('click', onUserInteraction, { once: true, passive: true });
    document.addEventListener('keydown', onUserInteraction, { once: true, passive: true });
}

// ID Card Swing Animation
function setupIdCardSwing() {
    const idCard = document.getElementById('id-card');
    const idCardContainer = document.getElementById('id-card-container');

    if (!idCard || !idCardContainer) return;

    // Add hover effect for swing animation
    idCardContainer.addEventListener('mouseenter', () => {
        idCard.classList.add('swing');
    });

    idCardContainer.addEventListener('mouseleave', () => {
        idCard.classList.remove('swing');
    });

    // Add click effect for swing animation
    idCardContainer.addEventListener('click', () => {
        idCard.classList.add('swing');
        // Remove swing class after animation completes
        setTimeout(() => {
            idCard.classList.remove('swing');
        }, 600); // Match the animation duration
    });
}

