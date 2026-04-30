(function () {
  const introOverlay = document.getElementById("introOverlay");
  const writingMask = document.getElementById("writingMask");
  const writingText = document.getElementById("writingText");
  const pencil = document.getElementById("pencil");
  const waveTransition = document.getElementById("waveTransition");

  const sceneTitle = document.getElementById("titlePanel");
  const infoPanel = document.getElementById("infoPanel");
  const hoverTag = document.getElementById("hoverTag");
  const sceneWrap = document.getElementById("sceneWrap");
  const cards = document.querySelectorAll(".object-card, .wave-ribbon");

  const infoKicker = document.getElementById("infoKicker");
  const infoTitle = document.getElementById("infoTitle");
  const infoText = document.getElementById("infoText");

  let introDone = false;

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
    pencil.style.transform = "translateY(18px) translateX(-28px) rotate(-18deg)";
    waveTransition.style.transform = "translateY(0%)";

    setTimeout(function () {
      writingMask.style.transition = "width 2.2s ease-in-out";
      pencil.style.transition = "transform 2.2s ease-in-out";
      writingMask.style.width = textWidth + "px";
      pencil.style.transform =
        "translateY(18px) translateX(" + (textWidth + 12) + "px) rotate(-18deg)";
    }, 120);

    setTimeout(function () {
      waveTransition.style.transition = "transform 1.5s ease-in-out";
      waveTransition.style.transform = "translateY(-122%)";
      const writingStage = document.querySelector(".writing-stage");
      writingStage.style.transition = "opacity 1s ease, transform 1s ease, filter 1s ease";
      writingStage.style.opacity = "0";
      writingStage.style.transform = "translateY(-6px)";
      writingStage.style.filter = "blur(5px)";
    }, 2850);

    setTimeout(showScene, 4300);
    setTimeout(showScene, 5400);
  }

  function updateInfo(kicker, title, text) {
    infoKicker.textContent = kicker;
    infoTitle.textContent = title;
    infoText.textContent = text;
  }

  const infoMap = {
    "object-book": {
      kicker: "book",
      title: "희망도서 바로대출",
      text: "책 오브젝트를 클릭하면 희망도서 바로대출 서비스로 이동합니다."
    },
    "object-insta": {
      kicker: "instagram",
      title: "사장님 인스타 @briggeme",
      text: "인스타 카드에서 사장님 인스타그램으로 이동할 수 있습니다."
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
    card.addEventListener("mouseenter", function (e) {
      const cls = Array.from(card.classList).find(function (name) {
        return infoMap[name];
      });

      if (cls) {
        updateInfo(
          infoMap[cls].kicker,
          infoMap[cls].title,
          infoMap[cls].text
        );
        hoverTag.textContent = infoMap[cls].title;
        hoverTag.classList.add("is-visible");
      }
    });

    card.addEventListener("mousemove", function (e) {
      hoverTag.style.left = e.clientX + "px";
      hoverTag.style.top = e.clientY + "px";
    });

    card.addEventListener("mouseleave", function () {
      hoverTag.classList.remove("is-visible");
    });
  });

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("mousemove", function (e) {
    if (!introDone) return;

    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    cards.forEach(function (el) {
      const depth = Number(el.dataset.depth || 10);
      const tx = mouseX * depth * 0.35;
      const ty = mouseY * depth * 0.25;
      el.style.transform = "translate(" + tx + "px, " + ty + "px)";
    });
  });

  updateInfo(
    "welcome",
    "작은 책방 세계를 둘러보세요",
    "책, 카드, 메모, 입간판, 시계 카드를 클릭하면 필요한 정보로 연결됩니다."
  );

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(runIntro);
  } else {
    setTimeout(runIntro, 120);
  }
})();