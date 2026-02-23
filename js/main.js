// ================================
// MOBILE NAV TOGGLE
// ================================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  // Close menu on link click (mobile)
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
    });
  });
}

// Smooth scroll for in-page nav links
document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ================================
// ACTIVE LINK + HEADER ON SCROLL
// ================================
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");
const headerEl = document.querySelector(".header");
const heroEl = document.querySelector(".hero");

window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navItems.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });

  // Header elevation similar to Sarvam-style sites
  if (headerEl) {
    if (scrollY > 4) {
      headerEl.classList.add("scrolled");
    } else {
      headerEl.classList.remove("scrolled");
    }
  }

  // Subtle parallax hero background
  if (heroEl) {
    const offset = scrollY * -0.04;
    heroEl.style.backgroundPosition = `center calc(50% + ${offset}px)`;
  }
});

// ================================
// BUTTON RIPPLE EFFECT
// ================================
document.querySelectorAll(".btn").forEach(button => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    const rect = button.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// ================================
// SCROLL REVEAL ANIMATIONS
// ================================
const revealTargets = document.querySelectorAll(
  ".hero-auth-card, .feature-card, .tool-card, .analytics-card, .stat-card, .why-card, .contact-card"
);

revealTargets.forEach(el => el.classList.add("scroll-fade"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealTargets.forEach(el => observer.observe(el));
} else {
  // Fallback for old browsers
  revealTargets.forEach(el => el.classList.add("is-visible"));
}

// ================================
// BACKGROUND MUSIC TOGGLE
// ================================
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");

if (bgMusic && musicToggle && musicIcon) {
  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic
        .play()
        .then(() => {
          musicIcon.classList.remove("fa-play");
          musicIcon.classList.add("fa-pause");
        })
        .catch(() => {
          // Autoplay might be blocked; just ignore
        });
    } else {
      bgMusic.pause();
      musicIcon.classList.remove("fa-pause");
      musicIcon.classList.add("fa-play");
    }
  });
}
