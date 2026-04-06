console.log("열흘책방 물결상점 premium version loaded");

const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const heroStage = document.getElementById("heroStage");
const depthTargets = heroStage ? heroStage.querySelectorAll("[data-depth]") : [];

if (heroStage && window.innerWidth > 820) {
  heroStage.addEventListener("mousemove", (event) => {
    const rect = heroStage.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = ((centerY - y) / centerY) * 5;

    heroStage.style.transform = `rotateX(${rotateX * 0.18}deg) rotateY(${rotateY * 0.18}deg)`;

    depthTargets.forEach((target) => {
      const depth = Number(target.dataset.depth || 0);
      const moveX = ((x - centerX) / centerX) * depth;
      const moveY = ((y - centerY) / centerY) * depth;

      target.style.transform += ` translate(${moveX * 0.18}px, ${moveY * 0.18}px)`;
    });
  });

  heroStage.addEventListener("mouseleave", () => {
    heroStage.style.transform = "rotateX(0deg) rotateY(0deg)";

    depthTargets.forEach((target) => {
      if (target.classList.contains("stack-card-top")) {
        target.style.transform = "rotate(-7deg) translateZ(38px)";
      } else if (target.classList.contains("stack-card-mid")) {
        target.style.transform = "rotate(6deg) translateZ(56px)";
      } else if (target.classList.contains("stack-card-bottom")) {
        target.style.transform = "rotate(-4deg) translateZ(24px)";
      } else if (target.classList.contains("float-card-left")) {
        target.style.transform = "translateZ(70px) rotate(-8deg)";
      } else if (target.classList.contains("float-card-right")) {
        target.style.transform = "translateZ(88px) rotate(7deg)";
      } else {
        target.style.transform = "";
      }
    });
  });
}