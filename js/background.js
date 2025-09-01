"use strict";

export function initBackground() {
  const firefliesSketch = (s) => {
    const COUNT = 60;
    let particles = [];

    class Particle {
      constructor() {
        this.reset(true);
      }
      reset(spawnAnywhere = false) {
        this.r = s.random(1.4, 3.2);
        this.speed = s.random(0.08, 0.2);
        const angle = s.random(s.TWO_PI);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.x = spawnAnywhere ? s.random(s.width) : this.vx > 0 ? 0 : s.width;
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
      cnv.id("background-canvas");
      cnv.style("position", "fixed");
      cnv.style("top", "0");
      cnv.style("left", "0");
      cnv.style("width", "100vw");
      cnv.style("height", "100vh");
      cnv.style("z-index", "1");
      cnv.style("pointer-events", "none");
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

  // p5 se expone como global por el script CDN
  // eslint-disable-next-line no-undef
  new p5(firefliesSketch);
}

