"use strict";

import { heartSVG, heartPath } from "./dom.js";
import { state } from "./state.js";

let liquidRect = null;

export function ensureLiquidLayer() {
  const defs = heartSVG.querySelector("defs");
  if (defs && !heartSVG.querySelector("#liquid-grad")) {
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    grad.setAttribute("id", "liquid-grad");
    grad.setAttribute("x1", "0%");
    grad.setAttribute("y1", "100%");
    grad.setAttribute("x2", "0%");
    grad.setAttribute("y2", "0%");

    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#f4acb7");
    stop1.setAttribute("stop-opacity", "0.9");

    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#e5b299");
    stop2.setAttribute("stop-opacity", "0.9");

    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
  }

  if (!liquidRect) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", "liquid-group");
    g.setAttribute("clip-path", "url(#heart-clip)");

    liquidRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    liquidRect.setAttribute("id", "liquid-rect");
    liquidRect.setAttribute("x", "0");
    liquidRect.setAttribute("fill", "url(#liquid-grad)");
    liquidRect.style.transition = "height 0.3s ease, y 0.3s ease";

    g.appendChild(liquidRect);
    heartSVG.insertBefore(g, heartPath);
  }
}

export function updateLiquidRect() {
  if (!liquidRect || !heartPath) return;

  let bbox;
  try {
    bbox = heartPath.getBBox();
  } catch (e) {
    // Fallback: usar viewport si el path no está listo
    bbox = { x: 0, y: 0, width: state.vw, height: state.vh };
  }

  const width = Math.max(0, bbox.width);
  const totalHeight = Math.max(0, bbox.height);
  const filledHeight = Math.max(0, totalHeight * state.fillFraction);

  liquidRect.setAttribute("x", String(bbox.x));
  liquidRect.setAttribute("width", String(width));
  liquidRect.setAttribute("height", String(filledHeight));
  liquidRect.setAttribute("y", String(bbox.y + totalHeight - filledHeight));
}

