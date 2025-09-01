"use strict";

import { instructionEl, heartSVG } from "./dom.js";
import { state } from "./state.js";
import { resizeAll } from "./heartGeometry.js";
import { updateLiquidRect } from "./liquid.js";

export function initIntroSequence() {
  resizeAll();

  // Prefill mínimo para que el llenado sea visible desde el primer clic
  if (state.fillFraction === 0) {
    state.fillFraction = 0.01;
    updateLiquidRect();
  }

  setTimeout(() => {
    // Esconder texto
    if (instructionEl) {
      instructionEl.style.opacity = "0";
      instructionEl.style.transition = "opacity 800ms ease";

      setTimeout(() => {
        instructionEl.style.display = "none";
      }, 800);
    }

    // Mostrar corazón
    setTimeout(() => {
      heartSVG.style.opacity = "1";
      state.isInteractable = true; // Habilitar interacción inmediatamente
      // console.log('Corazón visible e interacción habilitada');
    }, 200);
  }, 2000);
}

