'use strict';

const TARGET_CLICKS = 100; // objetivo de clics

// Referencias de elementos
const heartSVG = document.getElementById('heart-svg');
const heartPath = document.getElementById('heart-path');
const heartClipPath = document.getElementById('heart-clip-path');
const instructionEl = document.getElementById('instruction');
const chimeAudio = document.getElementById('chime');

// Estado de progreso
let clicks = 0;
let isInteractable = false;
let fillFraction = 0;
let liquidRect = null;

// Tamaño actual de la escena
let vw = window.innerWidth;
let vh = window.innerHeight;

// Construye un corazón perfecto usando la fórmula matemática estándar
function buildHeartPath(w, h) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  
  // Tamaño del corazón
  const size = Math.min(w, h) * 0.3;
  
  // Fórmula matemática para un corazón perfecto
  const points = [];
  const numPoints = 100;
  
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    
    // Escalar y centrar
    const scaledX = cx + (x * size / 16);
    const scaledY = cy + (y * size / 16);
    
    if (i === 0) {
      points.push(`M ${scaledX} ${scaledY}`);
    } else {
      points.push(`L ${scaledX} ${scaledY}`);
    }
  }
  
  points.push('Z');
  return points.join(' ');
}

// Ajusta elementos al tamaño de ventana
function resizeAll() {
  vw = window.innerWidth;
  vh = window.innerHeight;

  heartSVG.setAttribute('width', vw);
  heartSVG.setAttribute('height', vh);
  heartSVG.setAttribute('viewBox', `0 0 ${vw} ${vh}`);

  const d = buildHeartPath(vw, vh);
  heartPath.setAttribute('d', d);
  heartClipPath.setAttribute('d', d);

  ensureLiquidLayer();
  updateLiquidRect();
}

// Maneja clicks para llenar el corazón
function isClickInsideHeart(e) {
  if (!heartSVG || !heartPath) return false;
  const pt = heartSVG.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const ctm = heartPath.getScreenCTM();
  if (!ctm || !ctm.inverse) return false;
  const local = pt.matrixTransform(ctm.inverse());
  if (typeof heartPath.isPointInFill === 'function') {
    return heartPath.isPointInFill(local) || heartPath.isPointInStroke(local);
  }
  const bbox = heartPath.getBBox();
  return (
    local.x >= bbox.x &&
    local.x <= bbox.x + bbox.width &&
    local.y >= bbox.y &&
    local.y <= bbox.y + bbox.height
  );
}
function handlePointer(e) {
  console.log('Click detectado, isInteractable:', isInteractable, 'clicks:', clicks);
  
  if (!isInteractable) return;
  if (!isClickInsideHeart(e)) return;
  
  // Sonido por cada clic
  if (chimeAudio) {
    chimeAudio.currentTime = 0;
    chimeAudio.play().catch(() => {});
  }

  // Incrementar llenado
  clicks += 2;
  fillFraction = Math.min(1, clicks / TARGET_CLICKS);
  updateLiquidRect();
  
  console.log('Después del click - clicks:', clicks, 'fillFraction:', fillFraction);
  
  // Cambiar mensaje cuando esté lleno
  if (fillFraction === 1) {
    instructionEl.textContent = "¡El corazón está lleno de amor!";
    instructionEl.style.display = "grid";
    instructionEl.style.opacity = "1";
  }
}

// Inicialización
function initIntroSequence() {
  resizeAll();
  // Prefill mínimo para que el llenado sea visible desde el primer clic
  if (fillFraction === 0) {
    fillFraction = 0.01;
    updateLiquidRect();
  }

  setTimeout(() => {
    // Esconder texto
    if (instructionEl) {
      instructionEl.style.opacity = '0';
      instructionEl.style.transition = 'opacity 800ms ease';
      
      setTimeout(() => {
        instructionEl.style.display = 'none';
      }, 800);
    }

    // Mostrar corazón
    setTimeout(() => {
      heartSVG.style.opacity = '1';
      isInteractable = true; // Habilitar interacción inmediatamente
      console.log('Corazón visible e interacción habilitada');
    }, 200);
  }, 2000);
}

// Crear capa de líquido
function ensureLiquidLayer() {
  const defs = heartSVG.querySelector('defs');
  if (defs && !heartSVG.querySelector('#liquid-grad')) {
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.setAttribute('id', 'liquid-grad');
    grad.setAttribute('x1', '0%');
    grad.setAttribute('y1', '100%');
    grad.setAttribute('x2', '0%');
    grad.setAttribute('y2', '0%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#f4acb7');
    stop1.setAttribute('stop-opacity', '0.9');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#e5b299');
    stop2.setAttribute('stop-opacity', '0.9');
    
    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
  }

  if (!liquidRect) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('id', 'liquid-group');
    g.setAttribute('clip-path', 'url(#heart-clip)');
    
    liquidRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    liquidRect.setAttribute('id', 'liquid-rect');
    liquidRect.setAttribute('x', '0');
    liquidRect.setAttribute('fill', 'url(#liquid-grad)');
    liquidRect.style.transition = 'height 0.3s ease, y 0.3s ease';
    
    g.appendChild(liquidRect);
    heartSVG.insertBefore(g, heartPath);
  }
}

// Actualizar rectángulo de líquido
function updateLiquidRect() {
  if (!liquidRect || !heartPath) return;

  // Usar el bounding box real del corazón para que el llenado
  // empiece desde la base del corazón (no desde el borde de la ventana).
  let bbox;
  try {
    bbox = heartPath.getBBox();
  } catch (e) {
    // Si aún no está listo el path, usar viewport como respaldo
    bbox = { x: 0, y: 0, width: vw, height: vh };
  }

  const width = Math.max(0, bbox.width);
  const totalHeight = Math.max(0, bbox.height);
  const filledHeight = Math.max(0, totalHeight * fillFraction);

  liquidRect.setAttribute('x', String(bbox.x));
  liquidRect.setAttribute('width', String(width));
  liquidRect.setAttribute('height', String(filledHeight));
  // Colocar el rectángulo desde la base del corazón hacia arriba
  liquidRect.setAttribute('y', String(bbox.y + totalHeight - filledHeight));
}

// Fondo de partículas con p5.js
const firefliesSketch = (s) => {
  const COUNT = 60;
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
      this.flicker = s.random(0.4, 0.9);
    }
    
    step() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = s.width;
      if (this.x > s.width) this.x = 0;
      if (this.y < 0) this.y = s.height;
      if (this.y > s.height) this.y = 0;
    }
    
    draw() {
      const base = 235;
      const twinkle = Math.sin((s.frameCount + this.x * 0.3) * 0.02) * 30;
      const a = s.constrain(base * this.flicker + twinkle, 120, 255);
      s.noStroke();
      s.fill(253, 235, 208, a);
      s.circle(this.x, this.y, this.r * 2);
    }
  }

  s.setup = () => {
    const cnv = s.createCanvas(window.innerWidth, window.innerHeight);
    cnv.id('background-canvas');
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
    s.background(26, 26, 46);
    for (const p of particles) {
      p.step();
      p.draw();
    }
  };
};

// Event listeners
window.addEventListener('resize', resizeAll);
// Solo contar clics sobre la forma del corazón
heartSVG.addEventListener('click', handlePointer);
document.addEventListener('DOMContentLoaded', initIntroSequence);

// Inicializar p5.js
new p5(firefliesSketch);
