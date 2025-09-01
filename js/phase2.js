"use strict";

import { heartSVG, instructionEl, gardenSVG } from "./dom.js";
import { initGardenAnimation } from "./garden.js";

/**
 * Inicia la transición a la Fase 2: El Jardín que Florece
 * Se encarga de ocultar elementos de la Fase 1 y activar la animación del jardín
 */
export function startPhase2() {
  // Ocultar el corazón de la Fase 1 con una transición suave
  if (heartSVG) {
    heartSVG.style.transition = "opacity 1500ms ease";
    heartSVG.style.opacity = "0";
  }

  // Ocultar la instrucción si aún está visible
  if (instructionEl) {
    instructionEl.style.transition = "opacity 1000ms ease";
    instructionEl.style.opacity = "0";
  }

  // Después de que el corazón se haya desvanecido, iniciar la animación del jardín
  setTimeout(() => {
    // Ocultar completamente el SVG del corazón para evitar conflictos
    if (heartSVG) {
      heartSVG.style.display = "none";
    }
    if (gardenSVG) {
      gardenSVG.style.pointerEvents = "auto";
    }
    
    // Iniciar la animación del jardín
    initGardenAnimation();
  }, 1600); // Esperar un poco más que la duración de la transición del corazón
}
