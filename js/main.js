"use strict";

import { heartSVG } from "./dom.js";
import { resizeAll } from "./heartGeometry.js";
import { handlePointer } from "./interactions.js";
import { initIntroSequence } from "./intro.js";
import { initBackground } from "./background.js";

// Listeners
window.addEventListener("resize", resizeAll);
heartSVG.addEventListener("click", handlePointer);

document.addEventListener("DOMContentLoaded", () => {
  initIntroSequence();
  initBackground();
});

