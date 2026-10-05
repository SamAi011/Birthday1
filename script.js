document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------------------------------------------- //
    // 1. COUNTDOWN LOGIC
    // ---------------------------------------------------------------- //

    const targetBirthday = new Date("2026-03-18T00:00:00").getTime();

    const countdownEl   = document.getElementById("countdown");
    const bdayMessageEl = document.getElementById("bday-message");
    const daysEl        = document.getElementById("days");
    const hoursEl       = document.getElementById("hours");
    const minutesEl     = document.getElementById("minutes");
    const secondsEl     = document.getElementById("seconds");

    function updateTimer() {
        const now      = new Date().getTime();
        const distance = targetBirthday - now;

        if (distance <= 0) {
            if (countdownEl) countdownEl.classList.add("hidden");
            if (bdayMessageEl) bdayMessageEl.classList.remove("hidden");
            triggerConfettiCelebration();
            return;
        }

        const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl)    daysEl.textContent    = days    < 10 ? "0" + days    : days;
        if (hoursEl)   hoursEl.textContent   = hours   < 10 ? "0" + hours   : hours;
        if (minutesEl) minutesEl.textContent = minutes < 10 ? "0" + minutes : minutes;
        if (secondsEl) secondsEl.textContent = seconds < 10 ? "0" + seconds : seconds;
    }

    updateTimer();
    setInterval(updateTimer, 1000);

    // ---------------------------------------------------------------- //
    // 2. CONFETTI EFFECT
    // ---------------------------------------------------------------- //

    function randomConfetti() {
        if (typeof confetti !== "function") return;
        confetti({ particleCount: 80, angle: 60,  spread: 60, origin: { x: 0 }, colors: ['#ffb6c1','#ffc0cb','#ffd700','#ffffff'] });
        confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#ffb6c1','#ffc0cb','#ffd700','#ffffff'] });
    }

    // Removed random background confetti as per user request
    // setInterval(randomConfetti, 12000);
    // setTimeout(randomConfetti, 1000);

    function triggerConfettiCelebration() {
        if (typeof confetti !== "function") return;
        const duration    = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults    = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        function randomInRange(min, max) { return Math.random() * (max - min) + min; }

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    // ---------------------------------------------------------------- //
    // 3. WEB AUDIO — POP SOUND
    // ---------------------------------------------------------------- //

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playPopSound(freq = 600) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const oscillator = audioCtx.createOscillator();
        const gainNode   = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.12);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.12);
    }

    // ---------------------------------------------------------------- //
    // 4. ROMANTIC MUSIC PLAYER
    // ---------------------------------------------------------------- //

    const playBtn  = document.getElementById("play-btn");
    const bgMusic  = document.getElementById("bg-music");
    let isPlaying  = false;

    if (playBtn && bgMusic) {
        bgMusic.volume = 0.4;
        playBtn.addEventListener("click", () => {
            if (isPlaying) {
                bgMusic.pause();
                playBtn.textContent = "▶️";
            } else {
                bgMusic.play().catch(e => console.log("Audio play failed:", e));
                playBtn.textContent = "⏸️";
            }
            isPlaying = !isPlaying;
        });
    }

    // ---------------------------------------------------------------- //
    // 5. REASONS I LOVE YOU CAROUSEL
    // ---------------------------------------------------------------- //

    const track    = document.querySelector('.carousel-track');
    const slides   = Array.from(track ? track.children : []);
    const nextBtn  = document.querySelector('.next-btn');
    const prevBtn  = document.querySelector('.prev-btn');
    const dotsNav  = document.querySelector('.carousel-nav');
    const dots     = Array.from(dotsNav ? dotsNav.children : []);

    if (slides.length > 0) {
        const slideWidth = slides[0].getBoundingClientRect().width;

        slides.forEach((slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        });

        const moveToSlide = (currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-indicator');
            targetDot.classList.add('current-indicator');
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const currentSlide = track.querySelector('.current-slide');
                const nextSlide    = currentSlide.nextElementSibling || slides[0];
                const currentDot   = dotsNav.querySelector('.current-indicator');
                const nextDot      = currentDot.nextElementSibling || dots[0];
                moveToSlide(currentSlide, nextSlide);
                updateDots(currentDot, nextDot);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const currentSlide = track.querySelector('.current-slide');
                const prevSlide    = currentSlide.previousElementSibling || slides[slides.length - 1];
                const currentDot   = dotsNav.querySelector('.current-indicator');
                const prevDot      = currentDot.previousElementSibling || dots[dots.length - 1];
                moveToSlide(currentSlide, prevSlide);
                updateDots(currentDot, prevDot);
            });
        }

        if (dotsNav) {
            dotsNav.addEventListener('click', e => {
                const targetDot = e.target.closest('button');
                if (!targetDot) return;
                const currentSlide = track.querySelector('.current-slide');
                const currentDot   = dotsNav.querySelector('.current-indicator');
                const targetIndex  = dots.findIndex(dot => dot === targetDot);
                moveToSlide(currentSlide, slides[targetIndex]);
                updateDots(currentDot, targetDot);
            });
        }
    }

    // ---------------------------------------------------------------- //
    // 6. DYNAMIC GALLERY & PHOTO LIGHTBOX
    // ---------------------------------------------------------------- //

    const allImages = [
        "images/photo_8_2026-10-05_22-21-24.jpg",
        "images/photo_9_2026-10-05_22-21-24.jpg",
        "images/photo_10_2026-10-05_22-21-24.jpg",
        "images/photo_12_2026-10-05_22-21-24.jpg",
        "images/photo_13_2026-10-05_22-21-24.jpg",
        "images/photo_14_2026-10-05_22-21-24.jpg",
        "images/photo_16_2026-10-05_22-21-24.jpg",
        "images/photo_17_2026-10-05_22-21-24.jpg",
        "images/photo_18_2026-10-05_22-21-24.jpg",
        "images/photo_21_2026-10-05_22-21-24.jpg",
        "images/photo_23_2026-10-05_22-21-24.jpg",
        "images/photo_24_2026-10-05_22-21-24.jpg",
        "images/photo_25_2026-10-05_22-21-24.jpg",
        "images/photo_26_2026-10-05_22-21-24.jpg",
        "images/photo_27_2026-10-05_22-21-24.jpg",
        "images/photo_28_2026-10-05_22-21-24.jpg",
        "images/photo_30_2026-10-05_22-21-24.jpg",
        "images/photo_31_2026-10-05_22-21-24.jpg",
        "images/photo_32_2026-10-05_22-21-24.jpg",
        "images/photo_33_2026-10-05_22-21-24.jpg",
        "images/photo_34_2026-10-05_22-21-24.jpg",
        "images/photo_35_2026-10-05_22-21-24.jpg",
        "images/photo_36_2026-10-05_22-21-24.jpg"
    ];

    // Preload
    allImages.forEach(src => { const img = new Image(); img.src = src; });

    const allWishes = [
        "Happy Birthday to my everything! 💖 Every day with you feels like a dream I never want to wake up from.",
        "You are my greatest blessing. ✨ I am so incredibly lucky to walk this journey holding your hand.",
        "Here's to a lifetime of memories together! 🥂 Thank you for being my rock, my peace, and my adventure.",
        "I love you more than words can say. 🥰 Watching you grow and shine is the greatest privilege of my life.",
        "Every moment with you is magic. ✨ You make the ordinary feel extraordinary just by being there.",
        "You light up my entire world! 🌟 Thank you for showing me what true, unconditional love feels like.",
        "Wishing you all the joy you bring to me! 🎂 You deserve all the happiness the universe has to offer.",
        "Forever and always yours. ❤️ From the moment I met you, I knew you were the one.",
        "My beautiful soulmate, happy birthday! 🌹 You understand me in ways nobody else does.",
        "Today is all about celebrating YOU! 🎉 The most beautiful woman inside and out.",
        "You make every day an adventure. 🗺️ I cherish every memory we've made together.",
        "I'm so lucky to have you in my life. 🍀 Your kindness inspires me to be a better person every day.",
        "To the woman who stole my heart! 💘 Thank you for choosing me. I promise to cherish our love always.",
        "Your smile is my favorite thing. 😊 I hope this birthday brings you endless reasons to smile.",
        "Happy Birthday to my dream come true! 🌙 You are everything I ever wanted and so much more.",
        "I cherish every second with you. ⏳ You are my absolute favorite person in the whole world.",
        "May all your wishes come true today! 🌠 Never stop dreaming big, my love.",
        "You are my sunshine on a rainy day! ☀️ I love you deeper than the oceans.",
        "Life is just better with you by my side. 👩‍❤️‍👨 Happy birthday to my gorgeous girlfriend.",
        "I love you to the moon and back! 🚀 Our love story is my favorite one ever told."
    ];

    const dynamicPhotoGrid = document.getElementById('dynamic-photo-grid');
    const lightbox         = document.getElementById('lightbox');
    const lightboxImg      = document.getElementById('lightbox-img');
    const lightboxWish     = document.getElementById('lightbox-wish');
    const closeLightbox    = document.querySelector('.close-lightbox');

    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    if (dynamicPhotoGrid) {
        const personalImages  = dynamicPhotoGrid.querySelectorAll('.personal-image');
        let availableImages   = shuffleArray([...allImages]);
        let availableWishes   = shuffleArray([...allWishes]);
        let displayedImages   = availableImages.splice(0, 6);
        let displayedWishes   = availableWishes.splice(0, 6);

        personalImages.forEach((img, index) => {
            img.src = displayedImages[index];
            img.dataset.wishIndex = index;
            img.addEventListener('click', () => {
                playPopSound();
                lightboxImg.src = img.src;
                lightboxWish.textContent = displayedWishes[img.dataset.wishIndex];
                lightbox.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        });

        setInterval(() => {
            const randomSlotIndex = Math.floor(Math.random() * 6);
            if (availableImages.length === 0) availableImages = shuffleArray([...allImages]);
            if (availableWishes.length === 0) availableWishes = shuffleArray([...allWishes]);
            const newImage = availableImages.pop();
            const newWish  = availableWishes.pop();
            displayedImages[randomSlotIndex] = newImage;
            displayedWishes[randomSlotIndex] = newWish;
            const targetImgElement = personalImages[randomSlotIndex];
            targetImgElement.style.opacity = 0;
            setTimeout(() => {
                targetImgElement.src = newImage;
                targetImgElement.style.opacity = 1;
            }, 150);
        }, 300);

        if (closeLightbox) {
            closeLightbox.addEventListener('click', () => {
                lightbox.classList.add('hidden');
                document.body.style.overflow = 'auto';
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ---------------------------------------------------------------- //
    // 7. FALLING ROSE PETALS
    // ---------------------------------------------------------------- //

    const petalsContainer = document.getElementById('petals-container');

    if (petalsContainer) {
        const createPetal = () => {
            const petal    = document.createElement('div');
            petal.classList.add('petal');
            const size     = Math.random() * 15 + 10;
            const left     = Math.random() * 100;
            const duration = Math.random() * 5 + 5;
            const delay    = Math.random() * 5;
            petal.style.width           = `${size}px`;
            petal.style.height          = `${size}px`;
            petal.style.left            = `${left}vw`;
            petal.style.animationDuration = `${duration}s`;
            petal.style.animationDelay  = `${delay}s`;
            petalsContainer.appendChild(petal);
            setTimeout(() => petal.remove(), (duration + delay) * 1000);
        };

        for (let i = 0; i < 20; i++) createPetal();
        setInterval(createPetal, 400);
    }

    // ---------------------------------------------------------------- //
    // 8. RANDOM MEMORY POPUP
    // ---------------------------------------------------------------- //

    const randomPopup = document.getElementById('random-popup');
    const closePopup  = document.getElementById('close-popup');
    const popupImg    = document.getElementById('popup-img');
    const popupMsg    = document.getElementById('popup-msg');

    const sweetMessages = [
        "A special memory just popped up! 🥰",
        "Thinking about this amazing day... ✨",
        "You look so beautiful here! 💖",
        "One of my favorite moments with you 🌹",
        "Can't wait to make more memories like this! ✈️"
    ];

    if (randomPopup && allImages && allImages.length > 0) {
        const showRandomMemory = () => {
            popupImg.src      = allImages[Math.floor(Math.random() * allImages.length)];
            popupMsg.textContent = sweetMessages[Math.floor(Math.random() * sweetMessages.length)];
            randomPopup.classList.remove('hidden');
            randomPopup.classList.remove('hiding');
            setTimeout(hidePopup, 8000);
        };

        const hidePopup = () => {
            if (!randomPopup.classList.contains('hidden')) {
                randomPopup.classList.add('hiding');
                setTimeout(() => {
                    randomPopup.classList.add('hidden');
                    randomPopup.classList.remove('hiding');
                }, 480);
            }
        };

        if (closePopup) closePopup.addEventListener('click', hidePopup);

        setTimeout(() => {
            showRandomMemory();
            setInterval(showRandomMemory, Math.random() * 15000 + 30000);
        }, 10000);
    }

    // ================================================================ //
    // NEW FEATURE 1: CLICK-TO-BURST HEART FIREWORKS
    // ================================================================ //

    const HEARTS = ['❤️', '💖', '💕', '💗', '💓', '🌹', '✨', '💝'];

    document.addEventListener('click', (e) => {
        // Don't fire on interactive elements (buttons, links, images)
        if (['BUTTON', 'A', 'IMG', 'INPUT'].includes(e.target.tagName)) return;

        const count = 7; // hearts per click

        for (let i = 0; i < count; i++) {
            const heart = document.createElement('span');
            heart.classList.add('click-heart');
            heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];

            // Position at cursor
            heart.style.left = e.clientX + 'px';
            heart.style.top  = e.clientY + 'px';

            // Random scatter direction
            const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.8;
            const dist  = Math.random() * 70 + 40;
            heart.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
            heart.style.setProperty('--dy', `${Math.sin(angle) * dist - 30}px`);

            document.body.appendChild(heart);
            // Clean up after animation
            heart.addEventListener('animationend', () => heart.remove());
        }
    });

    // ================================================================ //
    // NEW FEATURE 2: 3D GIFT BOX UNBOXING
    // ================================================================ //

    const giftBox        = document.getElementById('gift-box');
    const giftClickHint  = document.getElementById('gift-click-hint');
    const surpriseContent = document.getElementById('surprise-content');
    let giftClickCount   = 0;

    if (giftBox) {
        giftBox.addEventListener('click', () => {
            if (giftClickCount >= 3) return; // Already opened
            giftClickCount++;

            if (giftClickCount === 1) {
                playPopSound(400);
                giftBox.classList.add('shaking');
                giftClickHint.textContent = "She's moving... 🎀 One more click!";
                giftBox.addEventListener('animationend', () => {
                    giftBox.classList.remove('shaking');
                }, { once: true });

            } else if (giftClickCount === 2) {
                playPopSound(500);
                giftBox.classList.add('shaking');
                giftClickHint.textContent = "So close! 🎉 One last click to open!";
                giftBox.addEventListener('animationend', () => {
                    giftBox.classList.remove('shaking');
                }, { once: true });

            } else if (giftClickCount === 3) {
                // OPEN THE BOX!
                playPopSound(800);
                giftBox.classList.add('opened');
                giftClickHint.textContent = "🎊 It's open! 🎊";
                giftBox.style.cursor = 'default';

                // Confetti burst
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 150,
                        spread: 90,
                        origin: { y: 0.6 },
                        colors: ['#ffb3c6', '#d14271', '#ffd700', '#ffffff', '#ff8fab']
                    });
                }

                // Reveal surprise content after lid animation
                setTimeout(() => {
                    if (surpriseContent) {
                        surpriseContent.classList.remove('hidden');
                        surpriseContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 700);
            }
        });
    }

    // ================================================================ //
    // NEW FEATURE 3: INTERACTIVE TIMELINE (IntersectionObserver)
    // ================================================================ //

    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timelineItems.length > 0 && 'IntersectionObserver' in window) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Add staggered delay based on index
                    const index = Array.from(timelineItems).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.12}s`;
                    entry.target.classList.add('in-view');
                    timelineObserver.unobserve(entry.target); // Fire once
                }
            });
        }, { threshold: 0.2 });

        timelineItems.forEach(item => timelineObserver.observe(item));
    } else {
        // Fallback: show all if IntersectionObserver not supported
        timelineItems.forEach(item => item.classList.add('in-view'));
    }

    // ================================================================ //
    // NEW FEATURE 4: NIGHT MODE TOGGLE + STARS
    // ================================================================ //

    const themeToggle  = document.getElementById('theme-toggle');
    const starsContainer = document.getElementById('stars-container');
    let isNightMode    = false;
    let starsCreated   = false;

    function createStars() {
        if (starsCreated) return;
        starsCreated = true;
        for (let i = 0; i < 120; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            const size     = Math.random() * 3 + 1;
            const left     = Math.random() * 100;
            const top      = Math.random() * 100;
            const duration = Math.random() * 3 + 2;
            const delay    = Math.random() * 4;
            star.style.width  = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left   = `${left}%`;
            star.style.top    = `${top}%`;
            star.style.animationDuration = `${duration}s`;
            star.style.animationDelay    = `${delay}s`;
            starsContainer.appendChild(star);
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            isNightMode = !isNightMode;
            document.body.classList.toggle('night-mode', isNightMode);
            themeToggle.textContent = isNightMode ? '☀️' : '🌙';

            if (isNightMode) {
                createStars(); // Only create DOM nodes once
            }

            // Play a subtle toggle sound
            playPopSound(isNightMode ? 300 : 700);
        });
    }

});
