document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. PRELOADER & LOADING SCREEN
    // ==========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
                // Trigger animations for elements visible in the hero section immediately
                revealOnScroll();
            }, 800); // Small delay to enjoy the elegant intro
        });
    }

    // ==========================================
    // 2. STICKY GLASSMORPHIC HEADER
    // ==========================================
    const header = document.querySelector('header');
    const handleScrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Trigger initially in case page is refreshed while scrolled

    // ==========================================
    // 3. MOBILE NAVIGATION HAMBURGER MENU
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Toggle body scroll locking when mobile menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================
    // 4. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal, .zoom-in');
    
    const revealOnScroll = () => {
        const triggerBottom = (window.innerHeight / 10) * 9.5;
        
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('visible');
            }
        });
    };

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Animate once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll();
    }

    // ==========================================
    // 5. SERVICES FILTER SYSTEM
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Animate transition using fade effects
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    // ==========================================
    // 6. ANIMATED COUNTERS & STATS
    // ==========================================
    const stats = document.querySelectorAll('.stat-num');
    
    const animateCounter = (element) => {
        const target = parseFloat(element.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        const speed = 2000; // time in ms
        const increment = target / (speed / 16); // 60 FPS approx.
        let current = 0;

        const updateCount = () => {
            current += increment;
            if (current < target) {
                if (isDecimal) {
                    element.innerText = current.toFixed(1);
                } else {
                    element.innerText = Math.floor(current);
                }
                requestAnimationFrame(updateCount);
            } else {
                element.innerText = isDecimal ? target.toFixed(1) : target;
            }
        };

        updateCount();
    };

    if ('IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => statsObserver.observe(stat));
    } else {
        // Fallback: animate immediately
        stats.forEach(stat => animateCounter(stat));
    }

    // ==========================================
    // 7. TESTIMONIAL CAROUSEL
    // ==========================================
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const nextBtn = document.querySelector('.carousel-btn.next');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const dotsNav = document.querySelector('.carousel-dots');
    
    if (track && slides.length > 0) {
        let currentSlideIndex = 0;

        // Create navigation dots dynamically
        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (idx === 0) dot.classList.add('active');
            dotsNav.appendChild(dot);
        });

        const dots = Array.from(dotsNav.querySelectorAll('.carousel-dot'));

        const moveToSlide = (targetIndex) => {
            track.style.transform = `translateX(-${targetIndex * 100}%)`;
            dots[currentSlideIndex].classList.remove('active');
            dots[targetIndex].classList.add('active');
            currentSlideIndex = targetIndex;
        };

        nextBtn.addEventListener('click', () => {
            let nextIndex = currentSlideIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0; // loop back
            moveToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = currentSlideIndex - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1; // loop to end
            moveToSlide(prevIndex);
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                moveToSlide(index);
            });
        });

        // Auto slide every 6 seconds
        let autoSlideTimer = setInterval(() => {
            nextBtn.click();
        }, 6000);

        // Reset timer on user interaction
        const resetAutoSlide = () => {
            clearInterval(autoSlideTimer);
            autoSlideTimer = setInterval(() => {
                nextBtn.click();
            }, 6000);
        };

        nextBtn.addEventListener('click', resetAutoSlide);
        prevBtn.addEventListener('click', resetAutoSlide);
        dots.forEach(dot => dot.addEventListener('click', resetAutoSlide));
    }

    // ==========================================
    // 8. INTERACTIVE BEFORE/AFTER HAIR SLIDER
    // ==========================================
    const container = document.querySelector('.before-after-container');
    const afterImageWrapper = document.querySelector('.ba-after-wrapper');
    const divider = document.querySelector('.ba-divider');
    const imgBefore = document.querySelector('.ba-img-before');
    const imgAfter = document.querySelector('.ba-img-after');

    if (container && afterImageWrapper && divider && imgBefore && imgAfter) {
        // Dynamic Canvas Image Splitter
        const splitImage = () => {
            const tempImg = new Image();
            tempImg.src = '/assets/before_after_hair.png';
            tempImg.onload = () => {
                const W = tempImg.naturalWidth;
                const H = tempImg.naturalHeight;
                const halfW = W / 2;

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.height = H;

                // 1. Crop Left Half (Before Treatment)
                canvas.width = halfW;
                ctx.drawImage(tempImg, 0, 0, halfW, H, 0, 0, halfW, H);
                imgBefore.src = canvas.toDataURL('image/png');
                imgBefore.onload = () => imgBefore.classList.add('loaded');

                // 2. Crop Right Half (After Treatment)
                ctx.clearRect(0, 0, halfW, H);
                ctx.drawImage(tempImg, halfW, 0, halfW, H, 0, 0, halfW, H);
                imgAfter.src = canvas.toDataURL('image/png');
                imgAfter.onload = () => imgAfter.classList.add('loaded');
            };
        };
        splitImage();

        // Smooth Drag Animation using LERP (Linear Interpolation)
        let targetX = 50; // target percentage
        let currentX = 50; // animated percentage
        let isDragging = false;

        const updatePosition = (clientX) => {
            const rect = container.getBoundingClientRect();
            let x = clientX - rect.left;
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            targetX = (x / rect.width) * 100;
        };

        // Mouse Listeners
        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            updatePosition(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updatePosition(e.clientX);
        });

        // Touch Listeners (Mobile support)
        container.addEventListener('touchstart', (e) => {
            isDragging = true;
            updatePosition(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updatePosition(e.touches[0].clientX);
        }, { passive: true });

        // Animation loop utilizing LERP for framer-motion like easing
        const animate = () => {
            currentX += (targetX - currentX) * 0.15;
            
            // Bound safety
            if (currentX < 0) currentX = 0;
            if (currentX > 100) currentX = 100;

            afterImageWrapper.style.clipPath = `polygon(0 0, ${currentX}% 0, ${currentX}% 100%, 0 100%)`;
            divider.style.left = `${currentX}%`;

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    // ==========================================
    // 9. LUXURY GALLERY LIGHTBOX
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    
    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevArrow = lightbox.querySelector('.lightbox-nav.prev');
        const nextArrow = lightbox.querySelector('.lightbox-nav.next');
        
        let currentItemIndex = 0;
        const itemsList = Array.from(galleryItems);

        const openLightbox = (index) => {
            currentItemIndex = index;
            const el = itemsList[index];
            const imgSrc = el.getAttribute('data-src') || el.querySelector('img').src;
            const title = el.querySelector('.gallery-title').innerText;
            const category = el.querySelector('.gallery-category').innerText;
            
            lightboxImg.src = imgSrc;
            lightboxCaption.innerHTML = `${title} <span style="display:block; font-size:0.85rem; color:#B76E79; font-style:italic; font-family:'Cormorant Garamond'; margin-top:5px;">${category}</span>`;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock page scroll
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const showNextImage = () => {
            let nextIdx = currentItemIndex + 1;
            if (nextIdx >= itemsList.length) nextIdx = 0;
            openLightbox(nextIdx);
        };

        const showPrevImage = () => {
            let prevIdx = currentItemIndex - 1;
            if (prevIdx < 0) prevIdx = itemsList.length - 1;
            openLightbox(prevIdx);
        };

        itemsList.forEach((item, idx) => {
            item.addEventListener('click', () => {
                openLightbox(idx);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        nextArrow.addEventListener('click', showNextImage);
        prevArrow.addEventListener('click', showPrevImage);

        // Click outside image to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
                closeLightbox();
            }
        });

        // Keyboard Controls
        window.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        });
    }

    // ==========================================
    // 10. MOCK FORM SUBMISSIONS
    // ==========================================
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const email = input.value.trim();
            
            if (email) {
                // Style alert dynamically for luxury feel
                const alertBox = document.createElement('div');
                alertBox.style.position = 'fixed';
                alertBox.style.bottom = '30px';
                alertBox.style.right = '30px';
                alertBox.style.background = '#0F0F0F';
                alertBox.style.border = '1px solid #D4AF37';
                alertBox.style.color = '#FAF7F2';
                alertBox.style.padding = '15px 30px';
                alertBox.style.zIndex = '10000';
                alertBox.style.fontFamily = "'Poppins', sans-serif";
                alertBox.style.fontSize = '0.85rem';
                alertBox.style.letterSpacing = '1px';
                alertBox.innerText = `Thank you! VIP newsletter invite sent to ${email}.`;
                
                document.body.appendChild(alertBox);
                input.value = '';
                
                setTimeout(() => {
                    alertBox.style.opacity = '0';
                    alertBox.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => alertBox.remove(), 500);
                }, 4000);
            }
        });
    }

});
