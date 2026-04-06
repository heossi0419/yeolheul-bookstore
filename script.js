console.log("Yeolheul Bookstore premium interaction loaded");

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1) Reveal animation
  const revealTargets = document.querySelectorAll(
    ".hero-copy, .hero-visual, .intro-title, .intro-body, .section-head, .link-card, .value-card, .community-copy, .community-panel, .info-card, .mini-card, .closing-box, .panel-item, .time-item"
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.transitionDelay = `${Math.min(index * 40, 220)}ms`;
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));

  // 2) Smooth anchor scroll
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    });
  });

  if (prefersReducedMotion) return;

  // 3) Premium card tilt
  const tiltTargets = document.querySelectorAll(
    ".link-card, .value-card, .mini-card, .info-card, .visual-main, .visual-card"
  );

  tiltTargets.forEach((card) => {
    let rafId = null;

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 4;
      const rotateX = ((centerY - y) / centerY) * 4;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        card.style.transform = `
          perspective(1200px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateY(-4px)
        `;
      });
    });

    card.addEventListener("mouseleave", () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = "";
    });
  });

  // 4) Magnetic buttons
  const magneticTargets = document.querySelectorAll(".btn, .text-link, .card-arrow");

  magneticTargets.forEach((element) => {
    let rafId = null;

    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      const moveX = x * 0.12;
      const moveY = y * 0.12;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });

    element.addEventListener("mouseleave", () => {
      if (rafId) cancelAnimationFrame(rafId);
      element.style.transform = "";
    });
  });

  // 5) Hero parallax
  const heroVisual = document.querySelector(".hero-visual");
  const visualMain = document.querySelector(".visual-main");
  const visualCards = document.querySelectorAll(".visual-card");

  if (heroVisual && visualMain) {
    let rafId = null;

    heroVisual.addEventListener("mousemove", (event) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const moveX = (x - centerX) / centerX;
      const moveY = (y - centerY) / centerY;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        visualMain.style.transform = `
          translate3d(${moveX * 10}px, ${moveY * 10}px, 0)
          rotateX(${moveY * -2.5}deg)
          rotateY(${moveX * 2.5}deg)
        `;

        visualCards.forEach((card, index) => {
          const depth = index === 0 ? 16 : 22;
          const rotate = index === 0 ? -6 : 5;

          card.style.transform = `
            translate3d(${moveX * depth}px, ${moveY * depth}px, 0)
            rotate(${rotate}deg)
          `;
        });
      });
    });

    heroVisual.addEventListener("mouseleave", () => {
      if (rafId) cancelAnimationFrame(rafId);

      visualMain.style.transform = "";
      visualCards.forEach((card, index) => {
        card.style.transform = index === 0 ? "rotate(-6deg)" : "rotate(5deg)";
      });
    });
  }

  // 6) Header shadow on scroll
  const header = document.querySelector(".site-header");

  const handleHeaderShadow = () => {
    if (!header) return;
    if (window.scrollY > 10) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  handleHeaderShadow();
  window.addEventListener("scroll", handleHeaderShadow, { passive: true });
});