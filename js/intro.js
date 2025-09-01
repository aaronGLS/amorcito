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
    // Esconder texto con transición suave y luego mostrar el corazón
    if (instructionEl) {
      // Asegurar que la transición esté aplicada ANTES de cambiar la opacidad
      instructionEl.style.transition = "opacity 800ms ease";

      const onFadeOutEnd = () => {
        instructionEl.style.display = "none";
        heartSVG.style.opacity = "1"; // Ahora sí, aparece el corazón
        state.isInteractable = true;
      };

      // Fallback por si no dispara transitionend (por ejemplo, navegadores raros)
      const fallbackId = setTimeout(onFadeOutEnd, 820);

      const handler = (ev) => {
        if (ev.propertyName !== "opacity") return;
        clearTimeout(fallbackId);
        instructionEl.removeEventListener("transitionend", handler);
        onFadeOutEnd();
      };
      instructionEl.addEventListener("transitionend", handler);

      // Disparar el fade-out
      requestAnimationFrame(() => {
        instructionEl.style.opacity = "0";
      });
    } else {
      // Si no hay instrucción, simplemente mostrar el corazón
      heartSVG.style.opacity = "1";
      state.isInteractable = true;
    }
  }, 2000);
}
