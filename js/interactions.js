"use strict";

import { heartSVG, heartPath, instructionEl } from "./dom.js";
import { state } from "./state.js";
import { updateLiquidRect } from "./liquid.js";
import { playChime } from "./audio.js";
import { startPhase2 } from "./phase2.js";

export function isClickInsideHeart(e) {
  if (!heartSVG || !heartPath) return false;
  const pt = heartSVG.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const ctm = heartPath.getScreenCTM();
  if (!ctm || !ctm.inverse) return false;
  const local = pt.matrixTransform(ctm.inverse());
  if (typeof heartPath.isPointInFill === "function") {
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

export function handlePointer(e) {
  if (!state.isInteractable) return;
  if (!isClickInsideHeart(e)) return;

  playChime();

  state.clicks += 2;
  state.fillFraction = Math.min(1, state.clicks / state.TARGET_CLICKS);
  updateLiquidRect();

  if (state.fillFraction === 1 && instructionEl) {
    instructionEl.textContent = "¡El corazón está lleno de amor!";
    instructionEl.style.display = "grid";
    instructionEl.style.opacity = "1";
    
    // Iniciar la transición a la Fase 2 después de un breve momento
    setTimeout(() => {
      startPhase2();
    }, 3000); // Esperar 3 segundos para que el usuario lea el mensaje
  }
}

