console.log("열흘책방 물결상점 리디자인 버전 연결 완료");

const revealTargets = document.querySelectorAll(
  ".hero-copy, .hero-visual, .intro-title, .intro-body, .section-head, .link-card, .value-card, .community-copy, .community-panel, .info-card, .mini-card, .closing-box"
);

revealTargets.forEach((element) => {
  element.classList.add("reveal");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
  }
);

revealTargets.forEach((element) => observer.observe(element));