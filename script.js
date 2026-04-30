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
  const cards = document.querySelectorAll(".object-card, .wave-ribbon");

  const infoKicker = document.getElementById("infoKicker");
  const infoTitle = document.getElementById("infoTitle");
  const infoText = document.getElementById("infoText");

  let introDone = false;
  let introStarted = false;
  let fallbackTimer = null;

  function updateInfo(kicker, title, text) {
    if (infoKicker) infoKicker.textContent = kicker;
    if (infoTitle) infoTitle.textContent = title;
    if (infoText) infoText.textContent = text;
  }

  function showScene() {
    if (introDone) return;
    introDone = true;

    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }

    if (introOverlay) introOverlay.classList.add("is-hidden");
    if (sceneTitle) sceneTitle.classList.add("is-visible");
    if (infoPanel) infoPanel.classList.add("is-visible");

    setTimeout(function () {
      if (introOverlay) {
        introOverlay.style.display = "none";
      }
    }, 850);
  }

  function skipIntro() {
    if (!introOverlay || introDone) return;

    if (introWriting) {
      introWriting.style.opacity = "0";
      introWriting.style.transform = "translateY(-6px)";
      introWriting.style.filter = "blur(5px)";
    }

    if (waveTransition) {
      waveTransition.style.transition = "transform 0.8s ease-in-out";
      waveTransition.style.transform = "translateY(-122%)";
    }

    setTimeout(showScene, 500);
  }

  function getSafeTextWidth() {
    if (!writingText) return 320;

    const rectWidth = Math.ceil(writingText.getBoundingClientRect().width);
    const offsetWidth = Math.ceil(writingText.offsetWidth);
    const scrollWidth = Math.ceil(writingText.scrollWidth);

    const width = Math.max(rectWidth, offsetWidth, scrollWidth);

    return width > 0 ? width : 320;
  }

  function runIntro() {
    if (introStarted) return;
    introStarted = true;

    if (!writingMask || !writingText || !pencil || !waveTransition) {
      showScene();
      return;
    }

    const textWidth = getSafeTextWidth();

    writingMask.style.width = "0px";
    writingMask.style.transition = "none";

    pencil.style.transition = "none";
    pencil.style.transform = window.innerWidth <= 640
      ? "translateY(12px) translateX(-28px) rotate(-18deg)"
      : "translateY(18px) translateX(-28px) rotate(-18deg)";

    waveTransition.style.transition = "none";
    waveTransition.style.transform = "translateY(0%)";

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        writingMask.style.transition = "width 2.1s ease-in-out";
        pencil.style.transition = "transform 2.1s ease-in-out";

        writingMask.style.width = textWidth + "px";

        pencil.style.transform = window.innerWidth <= 640
          ? "translateY(12px) translateX(" + (textWidth + 12) + "px) rotate(-18deg)"
          : "translateY(18px) translateX(" + (textWidth + 12) + "px) rotate(-18deg)";
      });
    });

    setTimeout(function () {
      if (waveTransition) {
        waveTransition.style.transition = "transform 1.45s ease-in-out";
        waveTransition.style.transform = "translateY(-122%)";
      }

      if (introWriting) {
        introWriting.style.opacity = "0";
        introWriting.style.transform = "translateY(-6px)";
        introWriting.style.filter = "blur(5px)";
      }
    }, 2800);

    setTimeout(showScene, 4300);

    fallbackTimer = setTimeout(function () {
      showScene();
    }, 4800);
  }

  function enableHoverInfo() {
    document.querySelectorAll(".object-card").forEach(function (card) {
      card.addEventListener("mouseenter", function () {
        const kicker = card.dataset.kicker || "object";
        const title = card.dataset.title || "열흘책방 물결상점";
        const text = card.dataset.text || "";

        updateInfo(kicker, title, text);

        if (hoverTag) {
          hoverTag.textContent = card.dataset.label || title;
          hoverTag.classList.add("is-visible");
        }
      });

      card.addEventListener("mousemove", function (e) {
        if (!hoverTag) return;
        hoverTag.style.left = e.clientX + "px";
        hoverTag.style.top = e.clientY + "px";
      });

      card.addEventListener("mouseleave", function () {
        if (hoverTag) hoverTag.classList.remove("is-visible");
      });

      card.addEventListener("click", function () {
        const kicker = card.dataset.kicker || "object";
        const title = card.dataset.title || "열흘책방 물결상점";
        const text = card.dataset.text || "";
        updateInfo(kicker, title, text);
      });
    });
  }

  function enableParallax() {
    window.addEventListener("mousemove", function (e) {
      if (!introDone) return;

      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      cards.forEach(function (el) {
        const depth = Number(el.dataset.depth || 10);
        const tx = x * depth * 0.35;
        const ty = y * depth * 0.25;

        if (el.classList.contains("object-time") && window.innerWidth <= 640) {
          el.style.transform =
            "translateX(-50%) translate(" + tx + "px, " + ty + "px)";
        } else {
          el.style.transform = "translate(" + tx + "px, " + ty + "px)";
        }
      });

      if (sceneTitle && sceneTitle.classList.contains("is-visible")) {
        const titleX = x * 10;
        const titleY = y * 8;
        sceneTitle.style.transform =
          "translate(" + titleX + "px, " + titleY + "px)";
      }
    });
  }

  function startWhenReady() {
    updateInfo(
      "welcome",
      "필요한 기능을 바로 이용해보세요",
      "원하는 오브젝트를 클릭하면 해당 페이지로 바로 이동합니다."
    );

    enableHoverInfo();
    enableParallax();

    if (introOverlay) {
      introOverlay.addEventListener("click", skipIntro);
    }

    if (document.fonts && document.fonts.ready) {
      Promise.race([
        document.fonts.ready,
        new Promise(function (resolve) {
          setTimeout(resolve, 700);
        })
      ])
        .then(runIntro)
        .catch(runIntro);
    } else {
      setTimeout(runIntro, 120);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startWhenReady);
  } else {
    startWhenReady();
  }
})();