console.log("Yeolheul Bookstore immersive premium version loaded");

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
  const progressBar = document.querySelector(".scroll-progress-bar");

  const handleScrollUi = () => {
    if (header) {
      if (window.scrollY > 10) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    if (progressBar) {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
  };

  handleScrollUi();
  window.addEventListener("scroll", handleScrollUi, { passive: true });

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

  const heroStage = document.getElementById("heroStage");
  const stageItems = heroStage ? heroStage.querySelectorAll(".stage-depth-1, .stage-depth-2, .stage-depth-3, .stage-depth-4") : [];

  if (heroStage && stageItems.length) {
    let rafId = null;

    heroStage.addEventListener("mousemove", (event) => {
      const rect = heroStage.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const dx = (x - centerX) / centerX;
      const dy = (y - centerY) / centerY;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        heroStage.style.transform = `rotateX(${dy * -1.2}deg) rotateY(${dx * 1.2}deg)`;

        stageItems.forEach((item) => {
          let depth = 10;
          if (item.classList.contains("stage-depth-2")) depth = 16;
          if (item.classList.contains("stage-depth-3")) depth = 22;
          if (item.classList.contains("stage-depth-4")) depth = 28;

          const tx = dx * depth;
          const ty = dy * depth;

          let baseTransform = "";

          if (item.classList.contains("floating-card-top")) baseTransform = "rotate(-6deg)";
          if (item.classList.contains("floating-card-bottom")) baseTransform = "rotate(5deg)";
          if (item.classList.contains("floating-band")) baseTransform = "translateX(-50%)";

          item.style.transform = `${baseTransform} translate3d(${tx}px, ${ty}px, 0)`;
        });
      });
    });

    heroStage.addEventListener("mouseleave", () => {
      if (rafId) cancelAnimationFrame(rafId);

      heroStage.style.transform = "";
      stageItems.forEach((item) => {
        if (item.classList.contains("floating-card-top")) {
          item.style.transform = "rotate(-6deg)";
        } else if (item.classList.contains("floating-card-bottom")) {
          item.style.transform = "rotate(5deg)";
        } else if (item.classList.contains("floating-band")) {
          item.style.transform = "translateX(-50%)";
        } else {
          item.style.transform = "";
        }
      });
    });
  }
});