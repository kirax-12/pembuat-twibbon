"use strict";

const SIZE = 1080;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const photoInput = document.getElementById("photo-input");
const frameInput = document.getElementById("frame-input");
const frameSelect = document.getElementById("frame-select");
const frameTextInput = document.getElementById("frame-text");
const customFrameField = document.getElementById("custom-frame-field");
const frameTextField = document.getElementById("frame-text-field");
const zoomInput = document.getElementById("zoom");
const zoomLabel = document.getElementById("zoom-label");
const statusEl = document.getElementById("status");

const state = {
  photo: null,
  frameImg: null,
  zoom: 1,
  offX: 0,
  offY: 0,
};

// Titik confetti dibuat sekali dengan pola tetap supaya tidak berubah tiap gambar ulang.
const confetti = (() => {
  let seed = 42;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const colors = ["#FF90E8", "#FFD23F", "#7AB8FF", "#4ADE80", "#FF7A45"];
  return Array.from({ length: 90 }, () => ({
    x: rnd() * SIZE, y: rnd() * SIZE, r: 5 + rnd() * 9, c: colors[Math.floor(rnd() * colors.length)],
  }));
})();

function fitFont(text, maxWidth, startSize, weight) {
  let size = startSize;
  do {
    ctx.font = `${weight} ${size}px "Space Grotesk", sans-serif`;
    if (ctx.measureText(text).width <= maxWidth || size <= 20) break;
    size -= 4;
  } while (true);
  return size;
}

function drawPhoto() {
  if (!state.photo) {
    ctx.fillStyle = "#EDEAE2";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = "#55534e";
    ctx.font = '700 44px "Space Grotesk", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("Upload foto dulu ya", SIZE / 2, SIZE / 2 - 10);
    ctx.font = '400 30px "Space Mono", monospace';
    ctx.fillText("pratinjau muncul di sini", SIZE / 2, SIZE / 2 + 44);
    return;
  }
  const iw = state.photo.naturalWidth, ih = state.photo.naturalHeight;
  const base = Math.max(SIZE / iw, SIZE / ih);
  const scale = base * state.zoom;
  const dw = iw * scale, dh = ih * scale;
  const x = (SIZE - dw) / 2 + state.offX;
  const y = (SIZE - dh) / 2 + state.offY;
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.drawImage(state.photo, x, y, dw, dh);
}

function banner(y, h, bg, fg, text, sub) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, y, SIZE, h);
  ctx.fillStyle = fg;
  ctx.textAlign = "center";
  fitFont(text, SIZE - 120, 56, 700);
  ctx.fillText(text, SIZE / 2, y + h / 2 + (sub ? 6 : 20));
  if (sub) {
    ctx.font = '400 26px "Space Mono", monospace';
    ctx.fillText(sub, SIZE / 2, y + h / 2 + 48);
  }
}

function drawFrame() {
  const mode = frameSelect.value;
  const text = (frameTextInput.value || "").trim();
  if (mode === "none") return;
  if (mode === "custom") {
    if (state.frameImg) ctx.drawImage(state.frameImg, 0, 0, SIZE, SIZE);
    return;
  }
  if (mode === "merah-putih") {
    ctx.strokeStyle = "#D90429"; ctx.lineWidth = 30;
    ctx.strokeRect(15, 15, SIZE - 30, SIZE - 30);
    banner(0, 128, "#D90429", "#FFFFFF", text || "DIRGAHAYU", "");
    banner(SIZE - 84, 84, "#FFFFFF", "#D90429", "", "");
    ctx.fillStyle = "#D90429"; ctx.textAlign = "center";
    ctx.font = '700 34px "Space Mono", monospace';
    ctx.fillText("✦ SAYA IKUT MERAYAKAN ✦", SIZE / 2, SIZE - 32);
  } else if (mode === "ultah") {
    for (const p of confetti) {
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = "#FF90E8"; ctx.lineWidth = 34;
    ctx.strokeRect(17, 17, SIZE - 34, SIZE - 34);
    banner(SIZE - 150, 150, "#FF90E8", "#111111", text || "SELAMAT ULANG TAHUN", "✦ tiup lilinnya dulu ✦");
  } else if (mode === "wisuda") {
    ctx.strokeStyle = "#16235C"; ctx.lineWidth = 40;
    ctx.strokeRect(20, 20, SIZE - 40, SIZE - 40);
    ctx.strokeStyle = "#F5C542"; ctx.lineWidth = 6;
    ctx.strokeRect(52, 52, SIZE - 104, SIZE - 104);
    banner(SIZE - 150, 150, "#16235C", "#F5C542", text || "SELAMAT WISUDA", "✦ resmi jadi sarjana ✦");
  }
}

function draw() {
  ctx.clearRect(0, 0, SIZE, SIZE);
  drawPhoto();
  drawFrame();
}

function loadImage(file, cb) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => { cb(img); };
  img.src = url;
}

photoInput.addEventListener("change", () => {
  const f = photoInput.files[0];
  if (!f) return;
  loadImage(f, (img) => {
    state.photo = img; state.offX = 0; state.offY = 0; state.zoom = 1;
    zoomInput.value = 100; zoomLabel.textContent = "100%";
    statusEl.textContent = "Foto masuk. Geser atau zoom buat pasin ke frame, lalu unduh.";
    draw();
  });
});

frameInput.addEventListener("change", () => {
  const f = frameInput.files[0];
  if (!f) return;
  loadImage(f, (img) => { state.frameImg = img; draw(); });
});

frameSelect.addEventListener("change", () => {
  const mode = frameSelect.value;
  customFrameField.hidden = mode !== "custom";
  frameTextField.hidden = mode === "custom" || mode === "none";
  draw();
});

frameTextInput.addEventListener("input", draw);

zoomInput.addEventListener("input", () => {
  state.zoom = Number(zoomInput.value) / 100;
  zoomLabel.textContent = zoomInput.value + "%";
  draw();
});

document.getElementById("fit-btn").addEventListener("click", () => {
  state.zoom = 1; state.offX = 0; state.offY = 0;
  zoomInput.value = 100; zoomLabel.textContent = "100%";
  draw();
});
document.getElementById("center-btn").addEventListener("click", () => {
  state.offX = 0; state.offY = 0; draw();
});

let dragging = false, lastX = 0, lastY = 0;
canvas.addEventListener("pointerdown", (e) => {
  if (!state.photo) return;
  dragging = true; lastX = e.clientX; lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  const rect = canvas.getBoundingClientRect();
  const k = SIZE / rect.width;
  state.offX += (e.clientX - lastX) * k;
  state.offY += (e.clientY - lastY) * k;
  lastX = e.clientX; lastY = e.clientY;
  draw();
});
canvas.addEventListener("pointerup", () => { dragging = false; });
canvas.addEventListener("pointercancel", () => { dragging = false; });

document.getElementById("download-btn").addEventListener("click", () => {
  if (!state.photo) {
    statusEl.textContent = "Upload foto dulu sebelum unduh ya.";
    return;
  }
  canvas.toBlob((blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "twibbon.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    statusEl.textContent = "Keunduh! Cek folder unduhan kamu — twibbon.png siap posting.";
  }, "image/png");
});

draw();
