/* =====================================================
   GIRLFRIENDS' DAY SURPRISE — script.js
   Edit CONFIG below to customize login credentials & content.
===================================================== */

const CONFIG = {
    // 🔐 Change these to your own secret login details
    username: "Lil Pigeon",
    password: "My Gal",

    // Page order used for Continue / Back navigation
    pageOrder: ["login", "2", "3", "4", "5", "6", "final"],

    // The full affirmations message typed out on Page 2
    affirmationsText:
        `you're beautiful — inside and out, in every version of you I've known.

I know you are enough. You have always been enough for me, exactly as you are.

I appreciate you more than words could ever fully capture.

I love you — deeply, patiently, and without conditions.

You are my peace, in a world that rarely slows down. I feel it every time I'm near you.

I always find my safe place in you, no matter what.

I believe you are my answered prayer, the one I didn't even know I was hoping for.

I notice how you make my life brighter, simply by being in it.

I want you to have real, lasting, uncomplicated happiness.

I promise you genuine love, the kind that never makes you question it.

I give you my loyalty, without exceptions and without doubt.

And I choose to reassure you of all of this, every single day.`
};

/* =====================================================
   STATE
===================================================== */
let currentPageIndex = 0;
let isNavigating = false;
let typewriterSession = 0; // increments each time Page 2 is entered, invalidating older typing loops
let photoSwapInterval = null;
let confettiAnimationId = null;

/* =====================================================
   DOM REFERENCES
===================================================== */
const bgMusic = document.getElementById("bgMusic");
const playPauseBtn = document.getElementById("playPauseBtn");
const volUpBtn = document.getElementById("volUpBtn");
const volDownBtn = document.getElementById("volDownBtn");

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

const floatersLayer = document.getElementById("floatersLayer");
const starsLayer = document.getElementById("starsLayer");
const bokehLayer = document.getElementById("bokehLayer");

/* =====================================================
   INITIALIZE ON LOAD
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    buildStars(60);
    buildBokeh(14);
    startFloaters();
    bindNavigationButtons();
    bindMusicControls();
    bindLoginForm();
    bindGiftBox();
    bindCloseButton();

    // Music starts muted-by-default browsers block autoplay; we start on first login success instead.
    bgMusic.volume = 0.6;
});

/* =====================================================
   BACKGROUND DECOR GENERATORS
===================================================== */
function buildStars(count) {
    for (let i = 0; i < count; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${2 + Math.random() * 3}s`;
        starsLayer.appendChild(star);
    }
}

function buildBokeh(count) {
    const colors = ["rgba(255,214,232,0.6)", "rgba(227,212,255,0.6)", "rgba(247,212,136,0.5)", "rgba(232,180,184,0.5)"];
    for (let i = 0; i < count; i++) {
        const b = document.createElement("div");
        b.className = "bokeh";
        const size = 40 + Math.random() * 90;
        b.style.width = `${size}px`;
        b.style.height = `${size}px`;
        b.style.left = `${Math.random() * 100}%`;
        b.style.background = colors[Math.floor(Math.random() * colors.length)];
        b.style.animationDuration = `${14 + Math.random() * 12}s`;
        b.style.animationDelay = `${Math.random() * 10}s`;
        bokehLayer.appendChild(b);
    }
}

const FLOATER_EMOJIS = ["❤️", "🥹", "💕", "💖", "🌹", "✨", "😘", "💞"];

function startFloaters() {
    // continuously spawn floating emojis
    setInterval(() => {
        if (document.hidden) return;
        spawnFloater();
    }, 550);
}

function spawnFloater() {
    const el = document.createElement("span");
    el.className = "floater";
    el.textContent = FLOATER_EMOJIS[Math.floor(Math.random() * FLOATER_EMOJIS.length)];
    const size = 1 + Math.random() * 1.6;
    el.style.fontSize = `${size}rem`;
    el.style.left = `${Math.random() * 100}%`;
    const duration = 8 + Math.random() * 8;
    el.style.animationDuration = `${duration}s`;
    el.style.opacity = "0";
    floatersLayer.appendChild(el);

    // cleanup after animation completes
    setTimeout(() => el.remove(), duration * 1000 + 500);
}

/* =====================================================
   MUSIC CONTROLS
   The <audio> element lives outside the page sections,
   so it is never re-created or restarted on navigation.
===================================================== */
function bindMusicControls() {
    playPauseBtn.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(() => {});
            playPauseBtn.textContent = "⏸";
        } else {
            bgMusic.pause();
            playPauseBtn.textContent = "▶";
        }
    });

    volUpBtn.addEventListener("click", () => {
        bgMusic.volume = Math.min(1, bgMusic.volume + 0.1);
    });

    volDownBtn.addEventListener("click", () => {
        bgMusic.volume = Math.max(0, bgMusic.volume - 0.1);
    });
}

function startMusicIfNeeded() {
    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            playPauseBtn.textContent = "⏸";
        }).catch(() => {
            // Autoplay may be blocked until further user interaction; controls remain usable.
            playPauseBtn.textContent = "▶";
        });
    }
}

/* =====================================================
   LOGIN
===================================================== */
function bindLoginForm() {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const enteredUser = usernameInput.value.trim();
        const enteredPass = passwordInput.value.trim();

        if (enteredUser === CONFIG.username && enteredPass === CONFIG.password) {
            errorMessage.classList.remove("show");
            startMusicIfNeeded();
            goToPage("2");
        } else {
            errorMessage.classList.add("show");
            errorMessage.style.animation = "none";
            // restart shake animation
            void errorMessage.offsetWidth;
            errorMessage.style.animation = "shake 0.5s ease";
        }
    });
}

/* =====================================================
   NAVIGATION (SPA — hidden sections, music persists)
===================================================== */
function bindNavigationButtons() {
    document.querySelectorAll(".continue-btn").forEach((btn) => {
        // Skip the login submit button — it's handled by the form's submit event instead
        if (btn.id === "loginSubmitBtn") return;
        btn.addEventListener("click", () => {
            const next = getAdjacentPage(1);
            if (next) goToPage(next);
        });
    });

    document.querySelectorAll(".back-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const prev = getAdjacentPage(-1);
            if (prev) goToPage(prev);
        });
    });
}

function getAdjacentPage(direction) {
    const activePage = document.querySelector(".page.active");
    const currentKey = activePage ? activePage.dataset.page : "login";
    const idx = CONFIG.pageOrder.indexOf(currentKey);
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= CONFIG.pageOrder.length) return null;
    return CONFIG.pageOrder[targetIdx];
}

function goToPage(pageKey) {
    if (isNavigating) return;
    isNavigating = true;

    const current = document.querySelector(".page.active");
    const target = document.querySelector(`[data-page="${pageKey}"]`);
    if (!target) { isNavigating = false; return; }

    if (current) {
        current.classList.add("page-exit");
        current.classList.remove("page-enter");
    }

    setTimeout(() => {
        if (current) {
            current.classList.remove("active", "page-exit");
        }
        target.classList.add("active", "page-enter");
        window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

        // Page-specific triggers
        if (pageKey === "2") triggerTypewriter();
        if (pageKey === "6") startPhotoSwap();
        else stopPhotoSwap();
        if (pageKey === "final") triggerFinalEffects();
        else stopFinalEffects();

        setTimeout(() => {
            target.classList.remove("page-enter");
            isNavigating = false;
        }, 900);
    }, current ? 480 : 0);
}

/* =====================================================
   PAGE 2 — TYPEWRITER EFFECT
===================================================== */
function triggerTypewriter() {
    const el = document.getElementById("typewriterText");
    el.textContent = "";

    // Give this run its own session id. If Page 2 is re-entered before this
    // finishes, the old loop below will see a stale id and stop itself instead
    // of continuing to type — this is what was causing the scrambled/garbled text.
    typewriterSession++;
    const mySession = typewriterSession;

    const text = CONFIG.affirmationsText;
    let i = 0;

    function typeNext() {
        if (mySession !== typewriterSession) return; // a newer run has taken over
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            const delay = text.charAt(i - 1) === "\n" ? 220 : 28;
            setTimeout(typeNext, delay);
        }
    }
    typeNext();
}

/* =====================================================
   PAGE 3 — GIFT BOX OPEN
===================================================== */
function bindGiftBox() {
    const openBtn = document.getElementById("openGiftBtn");
    const giftWrap = document.getElementById("giftWrap");
    const revealWrap = document.getElementById("revealPhotoWrap");

    openBtn.addEventListener("click", () => {
        giftWrap.classList.add("opening");
        setTimeout(() => {
            revealWrap.classList.remove("hidden");
            spawnBurst(revealWrap);
        }, 550);
    });
}

function spawnBurst(container) {
    for (let i = 0; i < 12; i++) {
        const el = document.createElement("span");
        el.className = "floater";
        el.textContent = FLOATER_EMOJIS[Math.floor(Math.random() * FLOATER_EMOJIS.length)];
        el.style.position = "absolute";
        el.style.left = `${40 + Math.random() * 20}%`;
        el.style.bottom = "20%";
        el.style.fontSize = `${1 + Math.random()}rem`;
        el.style.animationDuration = `${3 + Math.random() * 3}s`;
        floatersLayer.appendChild(el);
        setTimeout(() => el.remove(), 6000);
    }
}

/* =====================================================
   PAGE 6 — DUAL PHOTO ZOOM SWAP
===================================================== */
function startPhotoSwap() {
    stopPhotoSwap();
    const photoA = document.getElementById("photoA");
    const photoB = document.getElementById("photoB");
    let swapped = false;

    photoSwapInterval = setInterval(() => {
        swapped = !swapped;
        photoA.classList.toggle("swapped", swapped);
        photoB.classList.toggle("swapped", swapped);
    }, 6000);
}

function stopPhotoSwap() {
    if (photoSwapInterval) {
        clearInterval(photoSwapInterval);
        photoSwapInterval = null;
    }
}

/* =====================================================
   FINAL PAGE — CONFETTI + FIREFLIES
===================================================== */
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");
let confettiParticles = [];
let fireflies = [];

function triggerFinalEffects() {
    confettiCanvas.classList.add("active");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    confettiParticles = createConfetti(90);
    fireflies = createFireflies(28);

    runConfettiLoop();
}

function stopFinalEffects() {
    confettiCanvas.classList.remove("active");
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
    }
    window.removeEventListener("resize", resizeCanvas);
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

function createConfetti(count) {
    const colors = ["#ff6fa5", "#f7d488", "#e3d4ff", "#e8b4b8", "#fffaf9"];
    const arr = [];
    for (let i = 0; i < count; i++) {
        arr.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * -confettiCanvas.height,
            size: 4 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: 1 + Math.random() * 2.5,
            speedX: Math.sin(Math.random() * Math.PI) * 1.5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 6
        });
    }
    return arr;
}

function createFireflies(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
        arr.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height,
            radius: 1 + Math.random() * 2,
            angle: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.6,
            flicker: Math.random()
        });
    }
    return arr;
}

function runConfettiLoop() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    // Draw confetti
    confettiParticles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;
        if (p.y > confettiCanvas.height + 20) {
            p.y = -20;
            p.x = Math.random() * confettiCanvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
    });

    // Draw fireflies
    fireflies.forEach((f) => {
        f.angle += 0.01;
        f.x += Math.cos(f.angle) * f.speed;
        f.y += Math.sin(f.angle * 1.3) * f.speed;
        f.flicker += 0.05;
        const glow = (Math.sin(f.flicker) + 1) / 2;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * (0.7 + glow * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 220, 150, ${0.4 + glow * 0.5})`;
        ctx.shadowColor = "rgba(255, 220, 150, 0.9)";
        ctx.shadowBlur = 10;
        ctx.fill();
    });

    confettiAnimationId = requestAnimationFrame(runConfettiLoop);
}

/* =====================================================
   CLOSE SURPRISE → RESET EVERYTHING
===================================================== */
function bindCloseButton() {
    const closeBtn = document.getElementById("closeSurpriseBtn");
    closeBtn.addEventListener("click", () => {
        document.body.classList.add("closing-app");

        setTimeout(() => {
            // Stop music completely
            bgMusic.pause();
            bgMusic.currentTime = 0;
            playPauseBtn.textContent = "⏸";

            // Stop final page effects
            stopFinalEffects();
            stopPhotoSwap();

            // Reset typewriter state so it re-types cleanly next time
            typewriterSession++;
            document.getElementById("typewriterText").textContent = "";

            // Reset gift box state
            document.getElementById("giftWrap").classList.remove("opening");
            document.getElementById("revealPhotoWrap").classList.add("hidden");

            // Reset dual photo swap classes
            document.getElementById("photoA").classList.remove("swapped");
            document.getElementById("photoB").classList.remove("swapped");

            // Clear login form + error
            loginForm.reset();
            errorMessage.classList.remove("show");

            // Return to login page instantly (no transition needed after fade-to-black)
            document.querySelectorAll(".page").forEach((p) => {
                p.classList.remove("active", "page-enter", "page-exit");
            });
            document.getElementById("page-login").classList.add("active");

            // Remove fade overlay
            document.body.classList.remove("closing-app");
        }, 1500);
    });
}