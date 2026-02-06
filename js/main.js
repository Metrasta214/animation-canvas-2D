const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasWrap = document.getElementById("canvasWrap");

// Sliders y labels
const circleSlider = document.getElementById("circleSlider");
const circleCount = document.getElementById("circleCount");

const canvasSlider = document.getElementById("canvasSlider");
const canvasPercent = document.getElementById("canvasPercent");

// Botones
const btnRegenerar = document.getElementById("btnRegenerar");
const btnAleatorio = document.getElementById("btnAleatorio");

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Colores
const COLORS = ["blue","red","green","purple","orange","brown","black","teal","magenta","navy"];

// ✅ Base FIJA del canvas: se toma 1 vez del cuadro (y ya NO cambia)
const base_canvas_width = canvasWrap.clientWidth;
const base_canvas_height = canvasWrap.clientHeight;

// Medidas actuales (dependen del slider)
let canvas_width = base_canvas_width;
let canvas_height = base_canvas_height;

let circles = [];

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.speed = speed;

    const angle = Math.random() * Math.PI * 2;
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
  }

  draw(context) {
    context.beginPath();

    context.fillStyle = "black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);

    context.strokeStyle = this.color;
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  clampToCanvas() {
    this.posX = Math.max(this.radius, Math.min(this.posX, canvas_width - this.radius));
    this.posY = Math.max(this.radius, Math.min(this.posY, canvas_height - this.radius));
  }

  update(context) {
    this.posX += this.dx;
    this.posY += this.dy;

    // Rebote + clamp
    if (this.posX + this.radius >= canvas_width) {
      this.posX = canvas_width - this.radius;
      this.dx = -this.dx;
    }
    if (this.posX - this.radius <= 0) {
      this.posX = this.radius;
      this.dx = -this.dx;
    }
    if (this.posY + this.radius >= canvas_height) {
      this.posY = canvas_height - this.radius;
      this.dy = -this.dy;
    }
    if (this.posY - this.radius <= 0) {
      this.posY = this.radius;
      this.dy = -this.dy;
    }

    this.draw(context);
  }
}

function shuffledUniqueSpeeds(n) {
  const speedsPool = [1,2,3,4,5,6,7,8,9,10];
  for (let i = speedsPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [speedsPool[i], speedsPool[j]] = [speedsPool[j], speedsPool[i]];
  }
  return speedsPool.slice(0, n);
}

function generateCircles(n) {
  const speeds = shuffledUniqueSpeeds(n);
  const newCircles = [];

  for (let i = 0; i < n; i++) {
    const radius = Math.floor(Math.random() * 40) + 25;

    let x = Math.random() * canvas_width;
    let y = Math.random() * canvas_height;

    x = Math.max(radius, Math.min(x, canvas_width - radius));
    y = Math.max(radius, Math.min(y, canvas_height - radius));

    const color = COLORS[i % COLORS.length];
    const text = String(i + 1);
    const speed = speeds[i];

    newCircles.push(new Circle(x, y, radius, color, text, speed));
  }

  circles = newCircles;
}

/* ✅ Cambiar tamaño del canvas SIN crecer el cuadro */
function setCanvasScale(percent) {
  const scale = percent / 100;

  canvas_width = Math.floor(base_canvas_width * scale);
  canvas_height = Math.floor(base_canvas_height * scale);

  // Cambia el tamaño real del canvas (lienzo), pero el cuadro NO cambia
  canvas.width = canvas_width;
  canvas.height = canvas_height;

  // Centrado visual dentro del wrap (por si es más chico)
  canvas.style.width = canvas_width + "px";
  canvas.style.height = canvas_height + "px";

  for (const c of circles) c.clampToCanvas();
}

function onCircleSlider() {
  const n = Number(circleSlider.value);
  circleCount.textContent = n;
  generateCircles(n);
}

function onCanvasSlider() {
  const percent = Number(canvasSlider.value);
  canvasPercent.textContent = `${percent}%`;
  setCanvasScale(percent);
}

btnRegenerar.addEventListener("click", () => {
  generateCircles(Number(circleSlider.value));
});

btnAleatorio.addEventListener("click", () => {
  const randomCircles = Math.floor(Math.random() * 10) + 1;
  const randomCanvas = Math.floor(Math.random() * 71) + 30;

  circleSlider.value = String(randomCircles);
  canvasSlider.value = String(randomCanvas);

  circleCount.textContent = randomCircles;
  canvasPercent.textContent = `${randomCanvas}%`;

  setCanvasScale(randomCanvas);
  generateCircles(randomCircles);
});

circleSlider.addEventListener("input", onCircleSlider);
canvasSlider.addEventListener("input", onCanvasSlider);

// Inicial
setCanvasScale(Number(canvasSlider.value));
onCircleSlider();

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  for (const c of circles) c.update(ctx);
}
animate();
