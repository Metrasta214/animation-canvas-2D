const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Dimensiones de ventana
const window_height = window.innerHeight;
const window_width = window.innerWidth;

// Canvas base (mitad de pantalla)
const base_canvas_width = window_width / 2;
const base_canvas_height = window_height / 2;

// Fondo del canvas
canvas.style.background = "#ff8";

// Sliders
const circleSlider = document.getElementById("circleSlider");
const circleCount = document.getElementById("circleCount");

const canvasSlider = document.getElementById("canvasSlider");
const canvasPercent = document.getElementById("canvasPercent");

// Colores para diferenciar
const COLORS = ["blue", "red", "green", "purple", "orange", "brown", "black", "teal", "magenta", "navy"];

// Estado
let circles = [];
let canvas_width = base_canvas_width;
let canvas_height = base_canvas_height;

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.speed = speed;

    // Dirección aleatoria (360°)
    const angle = Math.random() * Math.PI * 2;
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
  }

  draw(context) {
    context.beginPath();

    // Texto
    context.fillStyle = "black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);

    // Círculo
    context.strokeStyle = this.color;
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  // Mantener dentro del canvas (por si cambia el tamaño)
  clampToCanvas() {
    this.posX = Math.max(this.radius, Math.min(this.posX, canvas_width - this.radius));
    this.posY = Math.max(this.radius, Math.min(this.posY, canvas_height - this.radius));
  }

  update(context) {
    // Mueve
    this.posX += this.dx;
    this.posY += this.dy;

    // Rebote + clamp (nunca se sale)
    // Derecha
    if (this.posX + this.radius >= canvas_width) {
      this.posX = canvas_width - this.radius;
      this.dx = -this.dx;
    }
    // Izquierda
    if (this.posX - this.radius <= 0) {
      this.posX = this.radius;
      this.dx = -this.dx;
    }
    // Abajo
    if (this.posY + this.radius >= canvas_height) {
      this.posY = canvas_height - this.radius;
      this.dy = -this.dy;
    }
    // Arriba
    if (this.posY - this.radius <= 0) {
      this.posY = this.radius;
      this.dy = -this.dy;
    }

    // Dibuja
    this.draw(context);
  }
}

/* =========================
   Velocidades únicas
   ========================= */
function shuffledUniqueSpeeds(n) {
  const speedsPool = [1,2,3,4,5,6,7,8,9,10];
  for (let i = speedsPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [speedsPool[i], speedsPool[j]] = [speedsPool[j], speedsPool[i]];
  }
  return speedsPool.slice(0, n);
}

/* =========================
   Generar círculos (1..N)
   ========================= */
function generateCircles(n) {
  const speeds = shuffledUniqueSpeeds(n);
  const newCircles = [];

  for (let i = 0; i < n; i++) {
    const radius = Math.floor(Math.random() * 40) + 25; // 25..64

    // Posición aleatoria dentro del canvas actual
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

/* =========================
   Ajustar tamaño del canvas
   ========================= */
function setCanvasScale(percent) {
  // percent: 30..100
  const scale = percent / 100;

  canvas_width = Math.floor(base_canvas_width * scale);
  canvas_height = Math.floor(base_canvas_height * scale);

  canvas.width = canvas_width;
  canvas.height = canvas_height;

  // Reajusta posición de todos para que sigan dentro
  for (const c of circles) c.clampToCanvas();
}

/* =========================
   Eventos sliders
   ========================= */
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

/* =========================
   Inicialización
   ========================= */
circleSlider.addEventListener("input", onCircleSlider);
canvasSlider.addEventListener("input", onCanvasSlider);

// Valores iniciales
onCanvasSlider();
onCircleSlider();

/* =========================
   Animación
   ========================= */
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  for (const c of circles) c.update(ctx);
}

animate();
