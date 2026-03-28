import p5 from 'p5';

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;

const segments = 200;
const distance = 2;

// ─── background constants ────────────────────────────────
const CELL = 18;           // plasma grid resolution (px)
const NOISE_SCALE = 0.012; // spatial zoom of Perlin field
const NUM_STARS = 180;     // starfield count

const sketch = (p: p5Instance) => {

  // ─── starfield ────────────────────────────────────────
  interface Star {
    x: number; y: number;
    z: number;   // depth 0..1 → speed / brightness
    size: number;
  }
  let stars: Star[] = [];

  const initStars = () => {
    stars = Array.from({ length: NUM_STARS }, () => ({
      x: p.random(CANVAS_WIDTH),
      y: p.random(CANVAS_HEIGHT),
      z: p.random(0.1, 1),
      size: p.random(0.5, 3),
    }));
  };

  // ─── pre-computed plasma grid (cols × rows) ───────────
  const cols = Math.ceil(CANVAS_WIDTH / CELL) + 1;
  const rows = Math.ceil(CANVAS_HEIGHT / CELL) + 1;

  // ─── snake chain ─────────────────────────────────────
  class Point extends p5.Vector {
    public nr: number;
    public forwardPoint: Point;

    constructor(nr: number, x: number, y: number) {
      super(x, y);
      this.nr = nr;
    }

    nextPt(forwardPoint: Point) { this.forwardPoint = forwardPoint; }

    update() {
      if (!this.forwardPoint) return;
      const dir = p5.Vector.sub(this.forwardPoint, this).normalize();
      const target = p5.Vector.sub(this.forwardPoint, dir.mult(distance));
      this.set(target);
    }

    headingAngle(): number {
      if (!this.forwardPoint) return 0;
      return Math.atan2(this.forwardPoint.y - this.y, this.forwardPoint.x - this.x);
    }

    display() {
      if (!this.forwardPoint) return;

      const t = this.nr / segments;
      const r = p.lerp(0, 120, t);
      const g = p.lerp(255, 0, t);
      const b = p.lerp(200, 255, t);
      const alpha = p.lerp(255, 80, t);
      const sw = p.map(this.nr, 0, segments, 12, 1);
      const angle = this.headingAngle();
      const w = sw * 2.2;
      const h = sw * 0.8;

      // glow
      p.push();
      p.noFill();
      p.stroke(r, g, b, alpha * 0.25);
      p.strokeWeight(sw * 2.8);
      p.translate(this.x, this.y);
      p.rotate(angle);
      p.ellipse(0, 0, w * 2.2, h * 2.2);
      p.pop();

      // core
      p.push();
      p.noFill();
      p.stroke(r, g, b, alpha);
      p.strokeWeight(sw * 0.5);
      p.translate(this.x, this.y);
      p.rotate(angle);
      p.ellipse(0, 0, w, h);
      p.pop();
    }
  }

  let points: Point[] = [];

  const createPoint = (nr: number) =>
    new Point(nr, p.map(nr, -1, segments, 0, p.width), p.random(0, p.height));

  const resetGame = () => {
    points = [];
    const head = createPoint(0);
    points.push(head);
    let current = head;
    for (let i = 1; i < segments; i++) {
      const next = createPoint(i);
      next.nextPt(current);
      points.push(next);
      current = next;
    }
  };

  // ─── setup ───────────────────────────────────────────
  p.setup = () => {
    window.p = p;
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.angleMode(p.RADIANS);
    p.colorMode(p.HSB, 360, 100, 100, 255);
    initStars();
    resetGame();
  };

  // ─── plasma background ────────────────────────────────
  const drawPlasma = (t: number) => {
    p.noStroke();
    for (let ci = 0; ci < cols; ci++) {
      for (let ri = 0; ri < rows; ri++) {
        const px = ci * CELL;
        const py = ri * CELL;

        // Two overlapping noise layers for more complexity
        const n1 = p.noise(ci * NOISE_SCALE, ri * NOISE_SCALE, t * 0.4);
        const n2 = p.noise(ci * NOISE_SCALE * 2.3 + 40, ri * NOISE_SCALE * 2.3 + 40, t * 0.7);
        const n3 = p.noise(ci * NOISE_SCALE * 0.6 + 80, ri * NOISE_SCALE * 0.6 + 80, t * 0.2);

        // Combine to get a hue that drifts psychedelically
        const hue = (n1 * 220 + n2 * 100 + t * 15) % 360;
        const sat = p.map(n2, 0, 1, 60, 100);
        const bri = p.map(n3, 0, 1, 8, 28);  // keep it dark so snake pops
        const alpha = 255;

        p.fill(hue, sat, bri, alpha);
        p.rect(px, py, CELL + 1, CELL + 1); // +1 fills cracks
      }
    }
  };

  // ─── starfield ────────────────────────────────────────
  const drawStars = () => {
    for (const s of stars) {
      // drift slowly rightward; z controls speed
      s.x += s.z * 0.35;
      if (s.x > CANVAS_WIDTH) { s.x = 0; s.y = p.random(CANVAS_HEIGHT); }

      // twinkle: brightness oscillates
      const twinkle = 0.6 + 0.4 * Math.sin(p.frameCount * 0.05 * s.z + s.y);
      const bright = p.map(s.z, 0.1, 1, 40, 100) * twinkle;
      const alpha = p.map(s.z, 0.1, 1, 60, 220) * twinkle;

      p.push();
      p.noStroke();
      // glow halo
      p.fill(200, 20, bright, alpha * 0.3);
      p.circle(s.x, s.y, s.size * 4);
      // core
      p.fill(200, 10, 100, alpha);
      p.circle(s.x, s.y, s.size);
      p.pop();
    }
  };

  // ─── radial vignette ──────────────────────────────────
  const drawVignette = () => {
    const cx = CANVAS_WIDTH / 2;
    const cy = CANVAS_HEIGHT / 2;
    const r = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.85;
    // draw concentric rings from edge inward, fading to transparent
    p.noStroke();
    const steps = 18;
    for (let i = 0; i < steps; i++) {
      const frac = i / steps;            // 0 = center, 1 = outermost
      const alpha = p.map(frac * frac, 0, 1, 0, 210); // quadratic falloff
      p.fill(0, 0, 0, alpha);
      const sz = r * 2 * (1 - frac);
      p.ellipse(cx, cy, sz * (CANVAS_WIDTH / CANVAS_HEIGHT) * 1.6, sz);
    }
  };

  // ─── draw loop ───────────────────────────────────────
  p.draw = () => {
    const t = p.frameCount * 0.008; // slow time driver for noise

    // 1. Plasma background (full clear every frame – no motion blur here)
    drawPlasma(t);

    // 2. Stars on top of plasma
    drawStars();

    // 3. Vignette darkens edges
    drawVignette();

    // 4. Motion-blur ghost layer so snake tail smears nicely
    p.fill(0, 0, 0, 35);
    p.noStroke();
    p.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 5. Bait
    const baitX = p.map(Math.sin(p.frameCount * Math.PI / 180), -1, 1, CANVAS_WIDTH * 0.15, CANVAS_WIDTH * 0.85);
    const baitY = p.map(Math.cos(p.frameCount * Math.PI / 180), -1, 1, CANVAS_HEIGHT * 0.15, CANVAS_HEIGHT * 0.85);

    p.push();
    p.noStroke();
    // Pulsing bait size
    const pulse = 1 + 0.25 * Math.sin(p.frameCount * 0.15);
    p.fill(0, 100, 100, 50);
    p.circle(baitX, baitY, 55 * pulse);
    p.fill(0, 90, 100, 110);
    p.circle(baitX, baitY, 30 * pulse);
    p.fill(0, 70, 100, 220);
    p.circle(baitX, baitY, 12 * pulse);
    p.pop();

    // 6. Snake
    points[0].set(p.mouseX || baitX, p.mouseY || baitY);

    for (let i = 1; i < points.length; i++) points[i].update();
    for (let i = points.length - 1; i >= 0; i--) points[i].display();

    // 7. Head highlight + eyes
    const head = points[0];
    p.push();
    p.noFill();
    p.stroke(120, 0, 100, 200); // white in HSB
    p.strokeWeight(1.5);
    p.circle(head.x, head.y, 18);
    p.fill(150, 100, 100, 220);
    p.noStroke();
    p.circle(head.x, head.y, 10);

    const ha = head.headingAngle();
    const ex = 5, ey = 3;
    const cosA = Math.cos(ha), sinA = Math.sin(ha);
    p.fill(0, 0, 0);
    p.circle(head.x + cosA * ex - sinA * ey, head.y + sinA * ex + cosA * ey, 3);
    p.circle(head.x + cosA * ex + sinA * ey, head.y + sinA * ex - cosA * ey, 3);
    p.pop();
  };
};

export function mountSpace(container?: HTMLElement) {
  return new p5(sketch, container);
}
