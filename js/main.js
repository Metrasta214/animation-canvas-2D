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

// Número aleatorio de círculos: 1 a 10
const NUM_CIRCLES = Math.floor(Math.random() * 10) + 1;

// Colores (opcional, para diferenciar)
const COLORS = ["blue", "red", "green", "purple", "orange", "brown", "black", "teal", "magenta", "navy"];

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

    // Texto dentro del círculo
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
   CREAR VELOCIDADES ÚNICAS PARA CADA CÍRCULO
   - Generamos una lista de velocidades posibles y la mezclamos
   - Luego tomamos las primeras N, así TODAS serán diferentes
   ========================================================== */
function shuffledUniqueSpeeds(n) {
  // Puedes ajustar el rango si quieres más rápido/lento (1..10 por ejemplo)
  const speedsPool = [1,2,3,4,5,6,7,8,9,10];

  // Mezcla tipo Fisher-Yates
  for (let i = speedsPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [speedsPool[i], speedsPool[j]] = [speedsPool[j], speedsPool[i]];
  }

  return speedsPool.slice(0, n); // primeras n (todas únicas)
}

const speeds = shuffledUniqueSpeeds(NUM_CIRCLES);

/* ==========================================================
   CREAR CÍRCULOS ALEATORIOS
   - Texto: 1..N
   - Velocidad: distinta en cada uno
   - Posición: dentro del canvas (considerando radio)
   ========================================================== */
const circles = [];

for (let i = 0; i < NUM_CIRCLES; i++) {
  const radius = Math.floor(Math.random() * 40) + 25; // radio 25..64 (ajustable)

  // Posición dentro del canvas (sin salirse por radio)
  let x = Math.random() * canvas_width;
  let y = Math.random() * canvas_height;

  x = Math.max(radius, Math.min(x, canvas_width - radius));
  y = Math.max(radius, Math.min(y, canvas_height - radius));

  const color = COLORS[i % COLORS.length];
  const text = String(i + 1);          // 1..N
  const speed = speeds[i];             // distinta para cada círculo

  circles.push(new Circle(x, y, radius, color, text, speed));
}

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
