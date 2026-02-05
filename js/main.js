const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Dimensiones de ventana
const window_height = window.innerHeight;
const window_width = window.innerWidth;

// Canvas a la mitad
canvas.height = window_height / 2;
canvas.width = window_width / 2;
canvas.style.background = "#ff8";

// Dimensiones reales del canvas
const canvas_height = canvas.height;
const canvas_width = canvas.width;

// Slider y texto del valor
const circleSlider = document.getElementById("circleSlider");
const circleCount = document.getElementById("circleCount");

// Colores (solo para diferenciar)
const COLORS = ["blue", "red", "green", "purple", "orange", "brown", "black", "teal", "magenta", "navy"];

// Arreglo global de círculos (se regenera con el slider)
let circles = [];

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

  update(context) {
    // Mueve
    this.posX += this.dx;
    this.posY += this.dy;

    // Limita + rebota (nunca se sale del canvas)
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

/* ==========================================================
   VELOCIDADES ÚNICAS
   - Genera velocidades únicas para que no se repitan
   ========================================================== */
function shuffledUniqueSpeeds(n) {
  const speedsPool = [1,2,3,4,5,6,7,8,9,10];

  // Fisher-Yates shuffle
  for (let i = speedsPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [speedsPool[i], speedsPool[j]] = [speedsPool[j], speedsPool[i]];
  }

  return speedsPool.slice(0, n);
}

/* ==========================================================
   GENERAR CÍRCULOS SEGÚN N (slider)
   - Texto: 1..N
   - Velocidad: distinta para cada uno
   - Posición: dentro del canvas (considerando radio)
   ========================================================== */
function generateCircles(n) {
  const speeds = shuffledUniqueSpeeds(n);
  const newCircles = [];

  for (let i = 0; i < n; i++) {
    const radius = Math.floor(Math.random() * 40) + 25; // 25..64 (ajustable)

    let x = Math.random() * canvas_width;
    let y = Math.random() * canvas_height;

    // Evita que nazcan fuera del margen
    x = Math.max(radius, Math.min(x, canvas_width - radius));
    y = Math.max(radius, Math.min(y, canvas_height - radius));

    const color = COLORS[i % COLORS.length];
    const text = String(i + 1);
    const speed = speeds[i];

    newCircles.push(new Circle(x, y, radius, color, text, speed));
  }

  circles = newCircles; // reemplaza los círculos actuales
}

/* ==========================================================
   EVENTO DEL SLIDER
   - Cada vez que cambie, regenera los círculos
   ========================================================== */
function onSliderChange() {
  const n = Number(circleSlider.value);
  circleCount.textContent = n;
  generateCircles(n);
}

// Inicial
onSliderChange();

// Regenerar en tiempo real al mover el slider
circleSlider.addEventListener("input", onSliderChange);

/* ==========================================================
   LOOP DE ANIMACIÓN
   ========================================================== */
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas_width, canvas_height);

  for (const c of circles) {
    c.update(ctx);
  }
}

animate();
