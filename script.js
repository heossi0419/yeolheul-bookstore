import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { RoundedBoxGeometry } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/geometries/RoundedBoxGeometry.js";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";

const canvas = document.getElementById("world");
const infoKicker = document.getElementById("infoKicker");
const infoTitle = document.getElementById("infoTitle");
const infoText = document.getElementById("infoText");
const hoverTag = document.getElementById("hoverTag");

const introOverlay = document.getElementById("introOverlay");
const writingMask = document.getElementById("writingMask");
const writingText = document.getElementById("writingText");
const pencilCursor = document.getElementById("pencilCursor");
const waveWash = document.getElementById("waveWash");
const introSub = document.getElementById("introSub");

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xf7f2e8, 12, 24);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const camera = new THREE.PerspectiveCamera(
  42,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 4.8, 9.8);

const cameraBase = new THREE.Vector3(0, 4.8, 9.8);
const mouseScene = { x: 0, y: 0 };

const world = new THREE.Group();
scene.add(world);

const palette = {
  ivory: 0xf7f2e8,
  paper: 0xfffaf3,
  sky: 0xdff2ff,
  skyDeep: 0xa9daff,
  blue: 0x4da9e6,
  blueDeep: 0x226b9f,
  ink: 0x22303b,
  peach: 0xffe7c9,
  yellow: 0xfff3c8,
};

const ambient = new THREE.AmbientLight(0xffffff, 1.35);
scene.add(ambient);

const hemi = new THREE.HemisphereLight(0xeaf8ff, 0xf2e7d5, 1.15);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.position.set(6, 10, 4);
sun.castShadow = true;
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 30;
sun.shadow.camera.left = -10;
sun.shadow.camera.right = 10;
sun.shadow.camera.top = 10;
sun.shadow.camera.bottom = -10;
scene.add(sun);

function makeMaterial(color, extra = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.72,
    metalness: 0.04,
    ...extra,
  });
}

const clickable = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hovered = null;

const desk = new THREE.Mesh(
  new RoundedBoxGeometry(11.5, 0.8, 8, 10, 0.25),
  makeMaterial(palette.paper, { roughness: 0.92 })
);
desk.position.set(0, -1.5, 0);
desk.receiveShadow = true;
desk.castShadow = true;
world.add(desk);

const rug = new THREE.Mesh(
  new RoundedBoxGeometry(9.5, 0.06, 6.4, 10, 0.18),
  makeMaterial(0xcbe9ff, { roughness: 1 })
);
rug.position.set(0, -1.1, 0.2);
rug.receiveShadow = true;
world.add(rug);

function createWaveRibbon(x, z, scale = 1) {
  const group = new THREE.Group();

  const ribbon = new THREE.Mesh(
    new RoundedBoxGeometry(1.4 * scale, 0.18, 0.5 * scale, 8, 0.09),
    makeMaterial(palette.blue, { emissive: palette.blue, emissiveIntensity: 0.08 })
  );
  ribbon.rotation.z = Math.PI * 0.14;
  group.add(ribbon);

  const ribbon2 = new THREE.Mesh(
    new RoundedBoxGeometry(1.1 * scale, 0.16, 0.42 * scale, 8, 0.09),
    makeMaterial(0x8fd0f7, { emissive: 0x8fd0f7, emissiveIntensity: 0.05 })
  );
  ribbon2.position.set(0.4 * scale, 0.18, 0.05);
  ribbon2.rotation.z = -Math.PI * 0.12;
  group.add(ribbon2);

  group.position.set(x, -0.66, z);
  world.add(group);

  gsap.to(group.rotation, {
    y: group.rotation.y + 0.24,
    duration: 3.6 + Math.random(),
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  gsap.to(group.position, {
    y: group.position.y + 0.08,
    duration: 2.8 + Math.random(),
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

createWaveRibbon(-3.8, 2.1, 0.8);
createWaveRibbon(-2.8, 2.4, 0.9);
createWaveRibbon(3.4, 2.1, 0.85);
createWaveRibbon(2.4, 2.35, 0.75);

function createStore() {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new RoundedBoxGeometry(3.8, 2.4, 2.6, 10, 0.18),
    makeMaterial(0xfffaf3)
  );
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const roof = new THREE.Mesh(
    new RoundedBoxGeometry(4.2, 0.4, 3, 10, 0.18),
    makeMaterial(0xb8ddf8)
  );
  roof.position.y = 1.45;
  roof.castShadow = true;
  group.add(roof);

  const awning = new THREE.Mesh(
    new RoundedBoxGeometry(3.1, 0.24, 0.5, 10, 0.12),
    makeMaterial(0x7bc2ee)
  );
  awning.position.set(0, 0.7, 1.28);
  awning.castShadow = true;
  group.add(awning);

  const door = new THREE.Mesh(
    new RoundedBoxGeometry(0.88, 1.55, 0.14, 8, 0.06),
    makeMaterial(0x9fd7fb)
  );
  door.position.set(0, -0.42, 1.36);
  group.add(door);

  const leftWindow = new THREE.Mesh(
    new RoundedBoxGeometry(0.96, 0.9, 0.12, 8, 0.05),
    makeMaterial(0xdff2ff)
  );
  leftWindow.position.set(-1.15, 0.08, 1.35);
  group.add(leftWindow);

  const rightWindow = leftWindow.clone();
  rightWindow.position.x = 1.15;
  group.add(rightWindow);

  const sign = new THREE.Mesh(
    new RoundedBoxGeometry(2, 0.48, 0.16, 8, 0.08),
    makeMaterial(0xfff2d3)
  );
  sign.position.set(0, 1.02, 1.34);
  sign.castShadow = true;
  group.add(sign);

  const signDotL = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    makeMaterial(palette.blue)
  );
  signDotL.position.set(-0.82, 1.02, 1.45);
  group.add(signDotL);

  const signDotR = signDotL.clone();
  signDotR.position.x = 0.82;
  group.add(signDotR);

  group.position.set(0, 0.02, -1.95);
  world.add(group);

  gsap.to(group.rotation, {
    y: 0.08,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}
createStore();

function registerInteractive(mesh, data) {
  mesh.userData = { ...data };
  clickable.push(mesh);
}

function animateFloat(target, y = 0.12, r = 0.12, duration = 2.6) {
  gsap.to(target.position, {
    y: target.position.y + y,
    duration,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.to(target.rotation, {
    y: target.rotation.y + r,
    duration: duration + 0.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

function createBook() {
  const group = new THREE.Group();

  const cover = new THREE.Mesh(
    new RoundedBoxGeometry(1.35, 0.28, 1.85, 10, 0.08),
    makeMaterial(0x5fb1ea)
  );
  cover.castShadow = true;
  group.add(cover);

  const pages = new THREE.Mesh(
    new RoundedBoxGeometry(1.14, 0.18, 1.56, 8, 0.06),
    makeMaterial(0xfffaf3)
  );
  pages.position.y = 0.16;
  pages.position.z = 0.02;
  group.add(pages);

  const bookmark = new THREE.Mesh(
    new RoundedBoxGeometry(0.14, 0.08, 0.58, 6, 0.04),
    makeMaterial(0xffd9b6)
  );
  bookmark.position.set(0.36, 0.16, 0.72);
  group.add(bookmark);

  group.position.set(-2.9, -0.67, 1.2);
  group.rotation.set(-0.12, 0.45, 0.08);
  world.add(group);

  registerInteractive(cover, {
    kicker: "book",
    title: "희망도서 바로대출",
    text: "책 오브젝트를 클릭하면 희망도서 바로대출 서비스로 이동합니다.",
    link: "https://library.busan.go.kr:8585/baro/homepage/main.do",
    label: "희망도서 바로대출",
  });

  animateFloat(group, 0.08, 0.2, 2.8);
}
createBook();

function createInstagramCard() {
  const group = new THREE.Group();

  const base = new THREE.Mesh(
    new RoundedBoxGeometry(1.45, 0.24, 1.45, 10, 0.12),
    makeMaterial(0xe6f6ff)
  );
  base.castShadow = true;
  group.add(base);

  const frame = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.06, 16, 40),
    makeMaterial(0x66b7eb)
  );
  frame.rotation.x = Math.PI / 2;
  frame.position.y = 0.16;
  group.add(frame);

  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    makeMaterial(0x66b7eb)
  );
  dot.position.set(0.22, 0.16, -0.22);
  group.add(dot);

  group.position.set(3.05, -0.55, 1.12);
  group.rotation.set(-0.1, -0.52, -0.08);
  world.add(group);

  registerInteractive(base, {
    kicker: "instagram",
    title: "사장님 인스타 @briggeme",
    text: "카드를 클릭하면 사장님 인스타그램으로 이동합니다.",
    link: "https://www.instagram.com/briggeme",
    label: "사장님 인스타",
  });

  animateFloat(group, 0.08, -0.18, 2.5);
}
createInstagramCard();

function createBlogNote() {
  const group = new THREE.Group();

  const note = new THREE.Mesh(
    new RoundedBoxGeometry(1.55, 0.22, 1.2, 10, 0.08),
    makeMaterial(0xfff4d8)
  );
  note.castShadow = true;
  group.add(note);

  const clip = new THREE.Mesh(
    new RoundedBoxGeometry(0.42, 0.06, 0.2, 6, 0.04),
    makeMaterial(0x90caef)
  );
  clip.position.set(0, 0.15, -0.36);
  group.add(clip);

  const line1 = new THREE.Mesh(
    new RoundedBoxGeometry(0.84, 0.02, 0.04, 4, 0.01),
    makeMaterial(0xb7dff9)
  );
  line1.position.set(0, 0.14, -0.02);
  group.add(line1);

  const line2 = line1.clone();
  line2.position.z = 0.18;
  group.add(line2);

  group.position.set(-0.7, -0.64, 2.05);
  group.rotation.set(-0.1, 0.12, -0.06);
  world.add(group);

  registerInteractive(note, {
    kicker: "blog",
    title: "블로그",
    text: "메모 노트를 클릭하면 열흘책방 관련 블로그로 이동합니다.",
    link: "https://blog.naver.com/brigge",
    label: "블로그",
  });

  animateFloat(group, 0.06, 0.12, 2.7);
}
createBlogNote();

function createGuideSign() {
  const group = new THREE.Group();

  const pole = new THREE.Mesh(
    new RoundedBoxGeometry(0.16, 1.2, 0.16, 6, 0.05),
    makeMaterial(0x9fd7fb)
  );
  pole.position.y = 0.56;
  pole.castShadow = true;
  group.add(pole);

  const panel = new THREE.Mesh(
    new RoundedBoxGeometry(1.28, 0.62, 0.18, 8, 0.08),
    makeMaterial(0xeaf7ff)
  );
  panel.position.set(0, 1.02, 0);
  panel.castShadow = true;
  group.add(panel);

  const arrow = new THREE.Mesh(
    new RoundedBoxGeometry(0.3, 0.08, 0.3, 6, 0.04),
    makeMaterial(0x66b7eb)
  );
  arrow.rotation.y = Math.PI / 4;
  arrow.position.set(0.22, 1.02, 0.02);
  group.add(arrow);

  group.position.set(2.2, -1.08, -0.7);
  group.rotation.y = -0.45;
  world.add(group);

  registerInteractive(panel, {
    kicker: "guide",
    title: "길 안내",
    text: "입간판을 클릭하면 네이버 지도 길 안내로 이동합니다.",
    link: "https://naver.me/FsoFHJME",
    label: "길 안내",
  });

  gsap.to(group.rotation, {
    z: 0.05,
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}
createGuideSign();

function createHoursCard() {
  const group = new THREE.Group();

  const card = new THREE.Mesh(
    new RoundedBoxGeometry(1.42, 0.2, 1.42, 10, 0.08),
    makeMaterial(0xf7fbff)
  );
  card.castShadow = true;
  group.add(card);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.35, 0.06, 16, 40),
    makeMaterial(0x7ec4ef)
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.14;
  group.add(ring);

  const hand1 = new THREE.Mesh(
    new RoundedBoxGeometry(0.06, 0.02, 0.28, 4, 0.01),
    makeMaterial(0x226b9f)
  );
  hand1.position.set(0, 0.14, 0.08);
  hand1.rotation.y = Math.PI / 4;
  group.add(hand1);

  const hand2 = new THREE.Mesh(
    new RoundedBoxGeometry(0.05, 0.02, 0.2, 4, 0.01),
    makeMaterial(0x226b9f)
  );
  hand2.position.set(0, 0.14, -0.02);
  hand2.rotation.y = -Math.PI / 6;
  group.add(hand2);

  group.position.set(-2.55, -0.62, -1.05);
  group.rotation.set(-0.1, 0.42, -0.06);
  world.add(group);

  registerInteractive(card, {
    kicker: "hours",
    title: "운영 시간",
    text: "월 · 화 · 수 · 목 12:00 ~ 17:00",
    label: "운영 시간",
  });

  animateFloat(group, 0.05, -0.16, 2.9);
}
createHoursCard();

function createPostcard() {
  const group = new THREE.Group();

  const card = new THREE.Mesh(
    new RoundedBoxGeometry(1.5, 0.18, 0.96, 10, 0.06),
    makeMaterial(0xfffaf3)
  );
  group.add(card);

  const stamp = new THREE.Mesh(
    new RoundedBoxGeometry(0.24, 0.02, 0.24, 4, 0.02),
    makeMaterial(0xa8dcff)
  );
  stamp.position.set(0.45, 0.1, -0.26);
  group.add(stamp);

  group.position.set(1.05, -0.64, 1.95);
  group.rotation.set(-0.1, -0.2, 0.04);
  world.add(group);

  gsap.to(group.position, {
    y: group.position.y + 0.05,
    duration: 2.6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}
createPostcard();

function updateInfo(data) {
  infoKicker.textContent = data.kicker ?? "object";
  infoTitle.textContent = data.title ?? "열흘책방 물결상점";
  infoText.textContent = data.text ?? "";
}

const sceneTarget = new THREE.Vector3(0, 0.4, 0);
const baseWorldRotation = { x: -0.06, y: -0.24 };
world.rotation.x = baseWorldRotation.x;
world.rotation.y = baseWorldRotation.y;

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragBaseRotationX = baseWorldRotation.x;
let dragBaseRotationY = baseWorldRotation.y;

function getIntersects(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  return raycaster.intersectObjects(clickable, false);
}

function clearHover(mesh) {
  if (!mesh) return;
  const mat = mesh.material;
  if (mat && "emissiveIntensity" in mat) {
    gsap.to(mat, { emissiveIntensity: 0, duration: 0.18 });
  }
  gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.18 });
}

function applyHover(mesh) {
  const mat = mesh.material;
  if (mat && "emissive" in mat) {
    mat.emissive = new THREE.Color(palette.blue);
    gsap.to(mat, { emissiveIntensity: 0.18, duration: 0.18 });
  }
  gsap.to(mesh.scale, { x: 1.06, y: 1.06, z: 1.06, duration: 0.18 });
}

window.addEventListener("pointermove", (event) => {
  mouseScene.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseScene.y = (event.clientY / window.innerHeight) * 2 - 1;

  if (isDragging) {
    const deltaX = (event.clientX - dragStartX) * 0.005;
    const deltaY = (event.clientY - dragStartY) * 0.003;
    world.rotation.y = dragBaseRotationY + deltaX;
    world.rotation.x = THREE.MathUtils.clamp(dragBaseRotationX + deltaY, -0.26, 0.1);
    return;
  }

  if (introOverlay.style.display === "none") {
    const intersects = getIntersects(event);

    if (hovered && (!intersects.length || hovered !== intersects[0].object)) {
      clearHover(hovered);
      hovered = null;
    }

    if (intersects.length) {
      const target = intersects[0].object;

      if (hovered !== target) {
        if (hovered) clearHover(hovered);
        hovered = target;
        applyHover(hovered);
        updateInfo(hovered.userData);
      }

      hoverTag.textContent = target.userData.label || target.userData.title || "";
      hoverTag.style.left = `${event.clientX}px`;
      hoverTag.style.top = `${event.clientY}px`;
      hoverTag.classList.add("is-visible");
      document.body.style.cursor = "pointer";
    } else {
      hoverTag.classList.remove("is-visible");
      document.body.style.cursor = "default";
    }
  }
});

window.addEventListener("pointerdown", (event) => {
  if (introOverlay.style.display !== "none") return;
  isDragging = true;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragBaseRotationX = world.rotation.x;
  dragBaseRotationY = world.rotation.y;
});

window.addEventListener("pointerup", (event) => {
  if (introOverlay.style.display !== "none") return;

  const moved =
    Math.abs(event.clientX - dragStartX) > 6 || Math.abs(event.clientY - dragStartY) > 6;

  isDragging = false;

  if (moved) return;

  const intersects = getIntersects(event);
  if (!intersects.length) return;

  const target = intersects[0].object;
  const data = target.userData;
  updateInfo(data);

  gsap.fromTo(
    target.scale,
    { x: 1.02, y: 1.02, z: 1.02 },
    { x: 1.12, y: 1.12, z: 1.12, yoyo: true, repeat: 1, duration: 0.12 }
  );

  if (data.link) {
    gsap.delayedCall(0.18, () => {
      window.open(data.link, "_blank", "noopener,noreferrer");
    });
  }
});

window.addEventListener("pointerleave", () => {
  isDragging = false;
  hoverTag.classList.remove("is-visible");
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function playIntro() {
  const targetWidth = writingText.getBoundingClientRect().width;

  gsap.set(writingMask, { width: 0 });
  gsap.set(pencilCursor, { x: -24, opacity: 1 });
  gsap.set(introSub, { y: 10, opacity: 0 });
  gsap.set([".title-panel", ".info-panel"], { autoAlpha: 0, y: 20 });
  gsap.set(world.scale, { x: 0.92, y: 0.92, z: 0.92 });

  const tl = gsap.timeline();

  tl.to(writingMask, {
    width: targetWidth,
    duration: 2.3,
    ease: "power2.inOut",
  });

  tl.to(
    pencilCursor,
    {
      x: targetWidth + 12,
      duration: 2.3,
      ease: "power2.inOut",
    },
    "<"
  );

  tl.to(
    introSub,
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    },
    "-=0.2"
  );

  tl.to({}, { duration: 0.45 });

  tl.to(waveWash, {
    yPercent: -122,
    duration: 1.55,
    ease: "power2.inOut",
  });

  tl.to(
    ".writing-stage",
    {
      y: -6,
      autoAlpha: 0,
      filter: "blur(6px)",
      duration: 1.15,
      ease: "power2.out",
    },
    "<0.08"
  );

  tl.to(
    ".intro-paper",
    {
      y: -18,
      scale: 0.985,
      autoAlpha: 0,
      duration: 1.15,
      ease: "power2.out",
    },
    "<"
  );

  tl.to(
    introOverlay,
    {
      autoAlpha: 0,
      duration: 0.55,
      ease: "power2.out",
      onComplete: () => {
        introOverlay.style.display = "none";
      },
    },
    "-=0.35"
  );

  tl.to(
    world.scale,
    {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      ease: "power2.out",
    },
    "-=0.25"
  );

  tl.to(
    ".title-panel",
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
      ease: "power2.out",
    },
    "-=0.85"
  );

  tl.to(
    ".info-panel",
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
      ease: "power2.out",
    },
    "-=0.65"
  );
}

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();

  const idleX = Math.sin(elapsed * 0.4) * 0.02;
  const idleY = Math.cos(elapsed * 0.3) * 0.03;

  if (!isDragging) {
    world.rotation.x += (baseWorldRotation.x + idleX - world.rotation.x) * 0.02;
    world.rotation.y += (baseWorldRotation.y + idleY - world.rotation.y) * 0.02;
  }

  camera.position.x += ((cameraBase.x + mouseScene.x * 0.38) - camera.position.x) * 0.03;
  camera.position.y += ((cameraBase.y + mouseScene.y * -0.18) - camera.position.y) * 0.03;
  camera.position.z += ((cameraBase.z + Math.abs(mouseScene.x) * 0.08) - camera.position.z) * 0.03;

  camera.lookAt(sceneTarget);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

updateInfo({
  kicker: "welcome",
  title: "작은 책방 세계를 둘러보세요",
  text: "책, 카드, 메모, 입간판, 시계 카드를 클릭하면 필요한 정보로 연결됩니다.",
});

playIntro();
animate();