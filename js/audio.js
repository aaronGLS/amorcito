"use strict";

import { chimeAudio } from "./dom.js";

export function playChime() {
  if (!chimeAudio) return;
  try {
    chimeAudio.currentTime = 0;
    const p = chimeAudio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  } catch (_) {}
}

