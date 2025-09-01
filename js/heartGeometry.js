"use strict";

import { heartSVG, heartPath, heartClipPath } from "./dom.js";
import { state } from "./state.js";
import { ensureLiquidLayer, updateLiquidRect } from "./liquid.js";

function buildHeartPath(w, h) {
  const cx = w * 0.5;
  const cy = h * 0.5;

  const size = Math.min(w, h) * 0.3;
  const points = [];
  const numPoints = 100;

  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    const scaledX = cx + (x * size) / 16;
    const scaledY = cy + (y * size) / 16;

    if (i === 0) {
      points.push(`M ${scaledX} ${scaledY}`);
    } else {
      points.push(`L ${scaledX} ${scaledY}`);
    }
  }
  points.push("Z");
  return points.join(" ");
}

export function resizeAll() {
  state.vw = window.innerWidth;
  state.vh = window.innerHeight;

  heartSVG.setAttribute("width", String(state.vw));
  heartSVG.setAttribute("height", String(state.vh));
  heartSVG.setAttribute("viewBox", `0 0 ${state.vw} ${state.vh}`);

  const d = buildHeartPath(state.vw, state.vh);
  heartPath.setAttribute("d", d);
  heartClipPath.setAttribute("d", d);

  ensureLiquidLayer();
  updateLiquidRect();
}

