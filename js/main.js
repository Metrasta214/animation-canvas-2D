const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

//El canvas tiene las mismas dimensiones que la pantalla (a la mitad)
canvas.height = window_height / 2;
canvas.width = window_width / 2;

canvas.style.background = "#ff8";

// Dimensiones reales del canvas
const canvas_height = canvas.height;
const canvas_width = canvas.width;

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.speed = speed;

    // 👉 Dirección aleatoria (360°)
    const angle = Math.random() * Math.PI * 2;
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
  }

  draw(context) {
    context.beginPath();

    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);

    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update(context) {
    // Mueve
    this.posX += this.dx;
    this.posY += this.dy;

    // Límites horizontales
    if (this.posX + this.radius >= canvas_width) {
      this.posX = canvas_width - this.radius;
      this.dx = -this.dx;
    }

    if (this.posX - this.radius <= 0) {
      this.posX = this.radius;
      this.dx = -this.dx;
    }

    // Límites verticales
    if (this.posY + this.radius >= canvas_height) {
      this.posY = canvas_height - this.radius;
      this.dy = -this.dy;
    }

    if (this.posY - this.radius <= 0) {
      this.posY = this.radius;
      this.dy = -this.dy;
    }

    // Dibuja
    this.draw(context);
  }
}

// Genera dentro del canvas
let randomX = Math.random() * canvas_width;
let randomY = Math.random() * canvas_height;
let randomRadius = Math.floor(Math.random() * 100 + 30);

// Evita que nazca fuera del margen
randomX = Math.max(randomRadius, Math.min(randomX, canvas_width - randomRadius));
randomY = Math.max(randomRadius, Math.min(randomY, canvas_height - randomRadius));

let miCirculo = new Circle(randomX, randomY, randomRadius, "blue", "Tec1", 5);
let miCirculo2 = new Circle(randomX, randomY, randomRadius, "red", "Tec2", 2);

let updateCircle = function () {
  requestAnimationFrame(updateCircle);
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  miCirculo.update(ctx);
  miCirculo2.update(ctx);
};

updateCircle();
