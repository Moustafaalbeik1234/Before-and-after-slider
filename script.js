const beforeInput = document.getElementById("beforeInput");
const afterInput = document.getElementById("afterInput");
const beforeImage = document.getElementById("beforeImage");
const afterImage = document.getElementById("afterImage");
const slider = document.getElementById("slider");
const overlay = document.getElementById("overlay");
const handle = document.getElementById("handle");
const knob = document.getElementById("sliderThumb");
const frame = document.getElementById("frame");

function setComparison(value) {
  const pct = `${value}%`;
  overlay.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
  handle.style.left = pct;
}

function loadImage(input, target) {
  const file = input.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  target.onload = () => URL.revokeObjectURL(url);
  target.src = url;
}

function syncHandleFromPointer(clientX) {
  const rect = frame.getBoundingClientRect();
  const ratio = (clientX - rect.left) / rect.width;
  const value = Math.min(100, Math.max(0, Math.round(ratio * 100)));
  slider.value = String(value);
  setComparison(value);
}

beforeInput.addEventListener("change", () => loadImage(beforeInput, beforeImage));
afterInput.addEventListener("change", () => loadImage(afterInput, afterImage));
slider.addEventListener("input", (event) => setComparison(Number(event.target.value)));

let dragging = false;

function startDrag(event) {
  dragging = true;
  syncHandleFromPointer(event.clientX);
}

function moveDrag(event) {
  if (!dragging) return;
  syncHandleFromPointer(event.clientX);
}

function endDrag() {
  dragging = false;
}

frame.addEventListener("pointerdown", startDrag);
window.addEventListener("pointermove", moveDrag);
window.addEventListener("pointerup", endDrag);
knob.addEventListener("pointerdown", startDrag);

setComparison(Number(slider.value));

beforeImage.src =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#g)" />
      <circle cx="410" cy="360" r="190" fill="#38bdf8" opacity="0.35"/>
      <circle cx="980" cy="520" r="250" fill="#f472b6" opacity="0.22"/>
      <text x="800" y="470" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="82" text-anchor="middle">Before</text>
    </svg>
  `);

afterImage.src =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="g2" x1="0" x2="1">
          <stop offset="0%" stop-color="#111827" />
          <stop offset="100%" stop-color="#334155" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#g2)" />
      <rect x="350" y="220" width="900" height="460" rx="40" fill="#7dd3fc" opacity="0.18"/>
      <circle cx="1030" cy="310" r="170" fill="#f472b6" opacity="0.35"/>
      <text x="800" y="470" fill="#f8fafc" font-family="Arial, sans-serif" font-size="82" text-anchor="middle">After</text>
    </svg>
  `);
