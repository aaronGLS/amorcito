// Fase 1 – Interacción del corazón acuarela + fondo partículas p5
// Autoría: Implementación enfocada en UX serena y orgánica

'use strict';

// Paleta de acuarela (tonos cálidos)
const PALETTE = ['#f4acb7', '#e5b299', '#d88c9a', '#f7c8a1'];
const TARGET_CLICKS = 100; // objetivo de clics

// Referencias de elementos
const paintingCanvas = document.getElementById('painting-canvas');
const paintingCtx = paintingCanvas.getContext('2d');
const heartSVG = document.getElementById('heart-svg');
const heartPath = document.getElementById('heart-path');
const heartClipPath = document.getElementById('heart-clip-path');
const instructionEl = document.getElementById('instruction');
const chimeAudio = document.getElementById('chime');

// Estado de progreso
let clicks = 0;
let totalLength = 0;       // Longitud total del contorno SVG
let heartPath2D = null;    // Geometría para hit-test en canvas
let isInteractable = false; // Controla si se procesan los clics (Estado 3)

// Tamaño actual de la escena
let vw = window.innerWidth;
let vh = window.innerHeight;

// Construye una forma de corazón orgánica y ligeramente asimétrica
// devolviendo un string de path SVG en coordenadas de usuario (px)
function buildHeartPath(w, h) {
  const minSide = Math.min(w, h);
  // Dimensiones del corazón con márgenes respirables
  const heartW = minSide * 0.70;     // un poco más ancho
  const heartH = heartW * 0.95;      // un poco más alto para punta más definida
  const cx = w * 0.5;
  const cy = h * 0.50;               // centrado verticalmente

  const W = heartW;
  const H = heartH;

  // Anclas principales (asimetría sutil: lóbulo izq. 2% más alto)
  const Bx = cx;
  const By = cy + 0.42 * H; // punta inferior

  const LTx = cx - 0.30 * W;
  const LTy = cy - 0.09 * H; // lóbulo izquierdo

  const RTx = cx + 0.30 * W;
  const RTy = cy - 0.07 * H; // lóbulo derecho ligeramente más bajo

  const NTx = cx;            // escote superior
  const NTy = cy - 0.35 * H;

  // Controles cúbicos afinados para evitar bultos en los laterales
  // Segmento B -> LT
  const C1x = cx - 0.32 * W, C1y = cy + 0.34 * H;
  const C2x = cx - 0.62 * W, C2y = cy + 0.02 * H;

  // Segmento LT -> NT
  const C3x = cx - 0.46 * W, C3y = cy - 0.26 * H;
  const C4x = cx - 0.12 * W, C4y = cy - 0.44 * H;

  // Segmento NT -> RT
  const C5x = cx + 0.12 * W, C5y = cy - 0.44 * H;
  const C6x = cx + 0.46 * W, C6y = cy - 0.26 * H;

  // Segmento RT -> B
  const C7x = cx + 0.62 * W, C7y = cy + 0.02 * H;
  const C8x = cx + 0.32 * W, C8y = cy + 0.34 * H;

  const d = [
    `M ${Bx} ${By}`,
    `C ${C1x} ${C1y}, ${C2x} ${C2y}, ${LTx} ${LTy}`,
    `C ${C3x} ${C3y}, ${C4x} ${C4y}, ${NTx} ${NTy}`,
    `C ${C5x} ${C5y}, ${C6x} ${C6y}, ${RTx} ${RTy}`,
    `C ${C7x} ${C7y}, ${C8x} ${C8y}, ${Bx} ${By}`,
    'Z'
  ].join(' ');
  return d;
}

// Ajusta todos los elementos a tamaño de ventana y sincroniza geometrías
function resizeAll() {
  vw = window.innerWidth;
  vh = window.innerHeight;

  // Lienzo de pintura (1:1 con CSS px para mantener coherencia de coordenadas)
  paintingCanvas.width = vw;
  paintingCanvas.height = vh;

  // SVG ocupa todo y usa unidades absolutas para el clip
  heartSVG.setAttribute('width', vw);
  heartSVG.setAttribute('height', vh);
  heartSVG.setAttribute('viewBox', `0 0 ${vw} ${vh}`);

  // Recalcular geometría del corazón
  const d = buildHeartPath(vw, vh);
  heartPath.setAttribute('d', d);
  heartClipPath.setAttribute('d', d);

  // Longitud total del contorno (para stroke-dasharray/offset)
  totalLength = heartPath.getTotalLength();
  heartPath.style.strokeDasharray = `${totalLength}`;

  // Mantener el mismo progreso relativo tras resize, sin animación inicial
  const fraction = Math.min(1, clicks / TARGET_CLICKS);
  setProgress(fraction, { immediate: true });

  // Path2D para hit testing del clic en el canvas
  heartPath2D = new Path2D(d);
}

// Dibuja un trazo acuarela: 5-8 círculos con tamaño/opacidad/offset aleatorios
function paintAt(x, y) {
  const clusters = Math.floor(Math.random() * 4) + 5; // 5..8
  const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];

  for (let i = 0; i < clusters; i++) {
    const r = Math.random() * 22 + 10; // radio 10..32 px
    const dx = (Math.random() - 0.5) * 24; // dispersión suave
    const dy = (Math.random() - 0.5) * 24;
    paintingCtx.globalAlpha = 0.1 + Math.random() * 0.2; // 0.1..0.3
    paintingCtx.fillStyle = color;
    paintingCtx.beginPath();
    paintingCtx.arc(x + dx, y + dy, r, 0, Math.PI * 2);
    paintingCtx.fill();
  }
  // Restaurar opacidad por si otras rutinas dibujan más adelante
  paintingCtx.globalAlpha = 1.0;
}

// Maneja un click/pointer: pinta si está dentro del corazón y avanza progreso
function handlePointer(e) {
  if (!isInteractable) return; // Estados 1 y 2: sin interacción
  const rect = paintingCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (!heartPath2D) return;
  // Verificar que el clic está dentro del corazón
  if (paintingCtx.isPointInPath(heartPath2D, x, y)) {
    paintAt(x, y);

    // Sonido suave por cada clic válido
    if (chimeAudio) {
      // Reinicia para permitir clicks rápidos
      chimeAudio.currentTime = 0;
      chimeAudio.play().catch(() => {});
    }

    // Avanzar progreso de contorno
    if (clicks < TARGET_CLICKS) {
      clicks += 1;
      const fraction = Math.min(1, clicks / TARGET_CLICKS);
      setProgress(fraction);
    }
  }
}

// Listeners
window.addEventListener('resize', resizeAll);
paintingCanvas.addEventListener('pointerdown', handlePointer);
document.addEventListener('DOMContentLoaded', initIntroSequence);

// Inicializar intro por estados cuando el DOM esté listo
function initIntroSequence() {
  // Preparación de geometrías y tamaños
  resizeAll();

  // Estado 1: Bienvenida durante 2000ms
  setTimeout(() => {
    // Transición: desvanecer texto
    if (instructionEl) {
      instructionEl.classList.add('fade-out');
      const onEnd = (ev) => {
        if (ev.propertyName === 'opacity') {
          instructionEl.style.display = 'none';
          instructionEl.removeEventListener('transitionend', onEnd);
        }
      };
      instructionEl.addEventListener('transitionend', onEnd);
    }

    // 200ms después, revelar el corazón
    setTimeout(() => {
      heartSVG.style.opacity = '1';
      const onHeartShown = (ev) => {
        if (ev.propertyName === 'opacity') {
          isInteractable = true; // Estado 3: interacción habilitada
          heartSVG.removeEventListener('transitionend', onHeartShown);
        }
      };
      heartSVG.addEventListener('transitionend', onHeartShown);
    }, 200);
  }, 2000);
}

// ------------------------------
// Fondo de partículas (p5.js)
// ------------------------------

const firefliesSketch = (s) => {
  const COUNT = 60; // 50-70
  let particles = [];

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(spawnAnywhere = false) {
      this.r = s.random(1.4, 3.2);
      this.speed = s.random(0.08, 0.20);
      const angle = s.random(s.TWO_PI);
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
      this.x = spawnAnywhere ? s.random(s.width) : (this.vx > 0 ? 0 : s.width);
      this.y = spawnAnywhere ? s.random(s.height) : s.random(s.height);
      this.flicker = s.random(0.4, 0.9); // brillo base
    }
    step() {
      this.x += this.vx;
      this.y += this.vy;
      // Reaparece por el borde opuesto
      if (this.x < 0) this.x = s.width;
      if (this.x > s.width) this.x = 0;
      if (this.y < 0) this.y = s.height;
      if (this.y > s.height) this.y = 0;
    }
    draw() {
      // Dorado pálido con leve parpadeo
      const base = 235; // alpha base 0..255
      const twinkle = Math.sin((s.frameCount + this.x * 0.3) * 0.02) * 30;
      const a = s.constrain(base * this.flicker + twinkle, 120, 255);
      s.noStroke();
      s.fill(253, 235, 208, a); // #fdebd0 con alpha
      s.circle(this.x, this.y, this.r * 2);
    }
  }

  s.setup = () => {
    const cnv = s.createCanvas(window.innerWidth, window.innerHeight);
    cnv.id('background-canvas');
    // Asegura capa/fijación al fondo
    cnv.style('position', 'fixed');
    cnv.style('top', '0');
    cnv.style('left', '0');
    cnv.style('width', '100vw');
    cnv.style('height', '100vh');
    cnv.style('z-index', '1');
    cnv.style('pointer-events', 'none');

    particles = Array.from({ length: COUNT }, () => new Particle());
  };

  s.windowResized = () => {
    s.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  s.draw = () => {
    // Fondo oscuro y sereno (#1a1a2e)
    s.background(26, 26, 46);
    for (const p of particles) {
      p.step();
      p.draw();
    }
  };
};

new p5(firefliesSketch);

// ------------------------------
// Utilidad: fijar progreso del contorno con/ sin transición
// ------------------------------
function setProgress(fraction, opts = {}) {
  const offset = (1 - fraction) * totalLength;
  if (opts.immediate) {
    const prev = heartPath.style.transition;
    heartPath.style.transition = 'none';
    heartPath.style.strokeDashoffset = `${offset}`;
    // Forzar reflow para aplicar inmediatamente sin animar
    void heartPath.getBoundingClientRect();
    heartPath.style.transition = prev || '';
  } else {
    heartPath.style.strokeDashoffset = `${offset}`;
  }
}
