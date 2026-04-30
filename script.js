(function () {
  const introOverlay = document.getElementById("introOverlay");
  const introWriting = document.getElementById("introWriting");
  const writingMask = document.getElementById("writingMask");
  const writingText = document.getElementById("writingText");
  const pencil = document.getElementById("pencil");
  const waveTransition = document.getElementById("waveTransition");

  const sceneTitle = document.getElementById("sceneTitle");
  const infoPanel = document.getElementById("infoPanel");
  const hoverTag = document.getElementById("hoverTag");

  const infoKicker = document.getElementById("infoKicker");
  const infoTitle = document.getElementById("infoTitle");
  const infoText = document.getElementById("infoText");

  const panel = document.getElementById("photoPanel");
  const panelClose = document.getElementById("photoPanelClose");
  const panelDim = document.getElementById("panelDim");
  const panelImage = document.getElementById("panelImage");
  const panelKicker = document.getElementById("panelKicker");
  const panelTitle = document.getElementById("panelTitle");
  const panelText = document.getElementById("panelText");
  const panelLink = document.getElementById("panelLink");

  const sceneItems = document.querySelectorAll(
    ".object-card, .wave-ribbon, .ambient-card"
  );
  const objectCards = document.querySelectorAll(".object-card");

  let introDone = false;
  let panelOpen = false;

  function updateInfo(kicker, title, text) {
    infoKicker.textContent = kicker || "welcome";
    infoTitle.textContent = title || "필요한 기능을 바로 이용해보세요";
    infoText.textContent = text || "오브젝트를 누르면 실제 책방 사진과 함께 정보가 열립니다.";
  }

  function showScene() {
    if (introDone) return;
    introDone = true;

    introOverlay.classList.add("is-hidden");
    sceneTitle.classList.add("is-visible");
    infoPanel.classList.add("is-visible");

    setTimeout(function () {
      introOverlay.style.display = "none";
    }, 850);
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

      introWriting.style.opacity = "0";
      introWriting.style.transform = "translateY(-6px)";
      introWriting.style.filter = "blur(5px)";
    }, 2800);

    setTimeout(showScene, 4300);
    setTimeout(showScene, 5200);
  }

  function openPanel(card) {
    const kicker = card.dataset.kicker || "object";
    const title = card.dataset.title || "열흘책방 물결상점";
    const text = card.dataset.text || "";
    const link = card.dataset.link || "";
    const image = card.dataset.image || "";
    const alt = card.dataset.alt || "";

    panelKicker.textContent = kicker;
    panelTitle.textContent = title;
    panelText.textContent = text;
    panelImage.src = image;
    panelImage.alt = alt;

    if (link) {
      panelLink.href = link;
      panelLink.classList.remove("is-hidden");
    } else {
      panelLink.removeAttribute("href");
      panelLink.classList.add("is-hidden");
    }

    panel.classList.add("is-open");
    panelDim.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    panelOpen = true;

    updateInfo(kicker, title, text);
  }

  function closePanel() {
    panel.classList.remove("is-open");
    panelDim.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    panelOpen = false;
  }

  objectCards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      updateInfo(card.dataset.kicker, card.dataset.title, card.dataset.text);
      hoverTag.textContent = card.dataset.label || card.dataset.title || "";
      hoverTag.classList.add("is-visible");
    });

    card.addEventListener("mousemove", function (e) {
      hoverTag.style.left = e.clientX + "px";
      hoverTag.style.top = e.clientY + "px";
    });

    card.addEventListener("mouseleave", function () {
      hoverTag.classList.remove("is-visible");
    });

    card.addEventListener("click", function () {
      openPanel(card);
    });
  });

  panelClose.addEventListener("click", closePanel);
  panelDim.addEventListener("click", closePanel);

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panelOpen) {
      closePanel();
    }
  });

  window.addEventListener("mousemove", function (e) {
    if (!introDone) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    sceneItems.forEach(function (el) {
      const depth = Number(el.dataset.depth || 10);
      const tx = x * depth * 0.35;
      const ty = y * depth * 0.24;

      if (el.classList.contains("object-time") && window.innerWidth <= 640) {
        el.style.transform =
          "translateX(-50%) translate(" + tx + "px, " + ty + "px)";
      } else {
        el.style.transform = "translate(" + tx + "px, " + ty + "px)";
      }
    });

    if (sceneTitle.classList.contains("is-visible")) {
      const titleX = x * 10;
      const titleY = y * 8;
      sceneTitle.style.transform =
        "translate(" + titleX + "px, " + titleY + "px)";
    }
  });

  updateInfo(
    "welcome",
    "필요한 기능을 바로 이용해보세요",
    "오브젝트를 누르면 실제 책방 사진과 함께 정보가 열립니다."
  );

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(runIntro).catch(showScene);
  } else {
    setTimeout(runIntro, 120);
  }
})();