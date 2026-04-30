(function () {
  const introOverlay = document.getElementById("introOverlay");
  const writingMask = document.getElementById("writingMask");
  const writingText = document.getElementById("writingText");
  const pencil = document.getElementById("pencil");
  const waveTransition = document.getElementById("waveTransition");

  const sceneTitle = document.getElementById("sceneTitle");
  const infoPanel = document.getElementById("infoPanel");
  const hoverTag = document.getElementById("hoverTag");
  const sceneWrap = document.getElementById("sceneWrap");
  const cards = document.querySelectorAll(".object-card, .wave-ribbon");

  const infoKicker = document.getElementById("infoKicker");
  const infoTitle = document.getElementById("infoTitle");
  const infoText = document.getElementById("infoText");

  let introDone = false;

  function updateInfo(kicker, title, text) {
    infoKicker.textContent = kicker;
    infoTitle.textContent = title;
    infoText.textContent = text;
  }

  function showScene() {
    if (introDone) return;
    introDone = true;
    introOverlay.classList.add("is-hidden");
    sceneTitle.classList.add("is-visible");
    infoPanel.classList.add("is-visible");
    setTimeout(function () {
      introOverlay.style.display = "none";
    }, 800);
  }

  function runIntro() {
    const textWidth = Math.ceil(writingText.getBoundingClientRect().width);

    writingMask.style.width = "0px";
    waveTransition.style.transform = "translateY(0%)";
    pencil.style.transition = "none";
    writingMask.style.transition = "none";
    waveTransition.style.transition = "none";

    setTimeout(function () {
      writingMask.style.transition = "width 2.1s ease-in-out";
      pencil.style.transition = "transform 2.1s ease-in-out";
      writingMask.style.width = textWidth + "px";
      pencil.style.transform =
        "translateY(18px) translateX(" + (textWidth + 12) + "px) rotate(-18deg)";
    }, 100);

    setTimeout(function () {
      waveTransition.style.transition = "transform 1.45s ease-in-out";
      waveTransition.style.transform = "translateY(-122%)";

      const stage = document.querySelector(".intro-writing");
      stage.style.transition = "opacity 1s ease, transform 1s ease, filter 1s ease";
      stage.style.opacity = "0";
      stage.style.transform = "translateY(-6px)";
      stage.style.filter = "blur(5px)";
    }, 2800);

    setTimeout(showScene, 4300);
    setTimeout(showScene, 5200);
  }

  const infoMap = {
    "object-book": {
      kicker: "book",
      title: "희망도서 바로대출",
      text: "원하는 책을 바로대출 서비스로 편하게 신청할 수 있습니다."
    },
    "object-insta": {
      kicker: "instagram",
      title: "사장님 인스타 @briggeme",
      text: "인스타그램에서 책방의 분위기와 소식을 확인할 수 있습니다."
    },
    "object-blog": {
      kicker: "blog",
      title: "블로그",
      text: "메모 오브젝트를 클릭하면 블로그로 이동합니다."
    },
    "object-map": {
      kicker: "guide",
      title: "길 안내",
      text: "입간판 오브젝트를 클릭하면 길 안내로 이동합니다."
    },
    "object-time": {
      kicker: "hours",
      title: "운영 시간",
      text: "월 · 화 · 수 · 목 12:00 ~ 17:00"
    }
  };

  document.querySelectorAll(".object-card").forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      const cls = Array.from(card.classList).find(function (name) {
        return infoMap[name];
      });
      if (!cls) return;

      updateInfo(
        infoMap[cls].kicker,
        infoMap[cls].title,
        infoMap[cls].text
      );

      hoverTag.textContent = infoMap[cls].title;
      hoverTag.classList.add("is-visible");
    });

    card.addEventListener("mousemove", function (e) {
      hoverTag.style.left = e.clientX + "px";
      hoverTag.style.top = e.clientY + "px";
    });

    card.addEventListener("mouseleave", function () {
      hoverTag.classList.remove("is-visible");
    });
  });

  window.addEventListener("mousemove", function (e) {
    if (!introDone) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    cards.forEach(function (el) {
      const depth = Number(el.dataset.depth || 10);
      const tx = x * depth * 0.35;
      const ty = y * depth * 0.25;

      if (el.classList.contains("object-time") && window.innerWidth <= 640) {
        el.style.transform = "translateX(-50%) translate(" + tx + "px, " + ty + "px)";
      } else {
        el.style.transform = "translate(" + tx + "px, " + ty + "px)";
      }
    });

    const titleX = x * 10;
    const titleY = y * 8;
    sceneTitle.style.transform =
      "translate(" + titleX + "px, " + titleY + "px)";
    sceneTitle.classList.add("is-visible");
  });

  updateInfo(
    "welcome",
    "필요한 기능을 바로 이용해보세요",
    "원하는 오브젝트를 클릭하면 해당 페이지로 바로 이동합니다."
  );

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(runIntro);
  } else {
    setTimeout(runIntro, 120);
  }
})();