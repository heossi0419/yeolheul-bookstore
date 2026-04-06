console.log("Yeolheul Bookstore final premium version loaded");

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealTargets = document.querySelectorAll(".reveal");
  revealTargets.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 35, 220)}ms`;
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
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    });
  });

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

  if (prefersReducedMotion) return;

  const tiltTargets = document.querySelectorAll(".tilt-card");

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

      if (card.classList.contains("floating-card-top")) {
        card.style.transform = "rotate(-6deg)";
      } else if (card.classList.contains("floating-card-bottom")) {
        card.style.transform = "rotate(5deg)";
      } else {
        card.style.transform = "";
      }
    });
  });

  const magneticTargets = document.querySelectorAll(".magnetic");

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

  const heroVisual = document.getElementById("heroVisual");
  const heroMainCard = document.querySelector(".hero-main-card");
  const floatingCards = document.querySelectorAll(".floating-card");

  if (heroVisual && heroMainCard) {
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
        heroMainCard.style.transform = `
          translate3d(${moveX * 10}px, ${moveY * 10}px, 0)
          rotateX(${moveY * -2.5}deg)
          rotateY(${moveX * 2.5}deg)
        `;

        floatingCards.forEach((card, index) => {
          const depth = index === 0 ? 16 : 22;
          const baseRotate = index === 0 ? -6 : 5;

          card.style.transform = `
            translate3d(${moveX * depth}px, ${moveY * depth}px, 0)
            rotate(${baseRotate}deg)
          `;
        });
      });
    });

    heroVisual.addEventListener("mouseleave", () => {
      if (rafId) cancelAnimationFrame(rafId);

      heroMainCard.style.transform = "";
      floatingCards.forEach((card, index) => {
        card.style.transform = index === 0 ? "rotate(-6deg)" : "rotate(5deg)";
      });
    });
  }
});