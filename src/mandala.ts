import p5 from 'p5';

const W = 1024;
const H = 768;

const SYMMETRY = 10;   // rotational copies
const MAX_DEPTH = 7;    // recursion depth
const BASE_LEN = 105;  // root arm length (px)

const sketch = (p: p5Instance) => {

  // ─── recursive fractal arm ────────────────────────────────────────────────
  // Drawn upward from (0,0); caller sets the transform.
  const drawArm = (len: number, depth: number, t: number, hue: number) => {
    if (depth <= 0 || len < 1.5) return;

    // ── style ──
    const sat = p.map(depth, MAX_DEPTH, 1, 45, 100);
    const bri = p.map(depth, MAX_DEPTH, 1, 70, 100);
    const alpha = p.map(depth, MAX_DEPTH, 1, 60, 230);
    const sw = p.map(depth, 0, MAX_DEPTH, 0.3, 2.2);

    // ── noise-animated bezier bow ──
    const bend = (p.noise(depth * 9.3, t * 0.45) - 0.5) * 0.55;
    const cx1 = len * 0.35 * Math.sin(bend);
    const cy1 = -len * 0.3;
    const cx2 = len * 0.35 * Math.sin(bend * 1.7);
    const cy2 = -len * 0.72;

    p.noFill();
    p.strokeWeight(sw);
    p.stroke(hue % 360, sat, bri, alpha);
    p.bezier(0, 0, cx1, cy1, cx2, cy2, 0, -len);

    // ── petal bloom at tip ──
    const ps = p.map(depth, 0, MAX_DEPTH, 1.5, len * 0.38);
    p.noStroke();
    p.fill(hue % 360, sat * 0.8, bri, alpha * 0.55);
    p.ellipse(0, -len, ps, ps * 0.48);

    // ── step to tip and recurse ──
    p.translate(0, -len);

    const spread = p.map(p.noise(depth + 77, t * 0.38), 0, 1, 0.28, 0.92);
    const ratio = p.map(p.noise(depth + 155, t * 0.25), 0, 1, 0.54, 0.70);
    const childLen = len * ratio;
    const childHue = hue + 22;

    p.push(); p.rotate(-spread); drawArm(childLen, depth - 1, t, childHue); p.pop();
    p.push(); p.rotate(spread); drawArm(childLen, depth - 1, t, childHue); p.pop();
  };

  // ─── central bloom ────────────────────────────────────────────────────────
  const drawCenter = (t: number, hue: number) => {
    const RINGS = 7;

    // concentric pulsing rings
    for (let r = 0; r < RINGS; r++) {
      const rad = (r + 1) * 11 + Math.sin(t * 1.8 + r * 0.9) * 3.5;
      const rHue = (hue + r * 35) % 360;
      p.noFill();
      p.stroke(rHue, 80, 100, p.map(r, 0, RINGS - 1, 210, 50));
      p.strokeWeight(p.map(r, 0, RINGS - 1, 1.8, 0.4));
      p.circle(0, 0, rad * 2);
    }

    // orbiting gems
    for (let i = 0; i < SYMMETRY; i++) {
      const a = (Math.PI * 2 / SYMMETRY) * i + t * 0.18;
      const gHue = (hue + i * (360 / SYMMETRY)) % 360;
      const gs = 5 + Math.sin(t * 2.5 + i) * 1.5;
      p.fill(gHue, 100, 100, 210);
      p.noStroke();
      p.ellipse(Math.cos(a) * 19, Math.sin(a) * 19, gs, gs * 0.5);
    }

    // core gem
    const coreSize = 9 + Math.sin(t * 3.2) * 2.5;
    p.fill((hue + 120) % 360, 80, 100, 240);
    p.circle(0, 0, coreSize * 2);
    p.fill(0, 0, 100, 220);
    p.circle(0, 0, coreSize * 0.6);
  };

  // ─── radial gradient background burst ─────────────────────────────────────
  const drawBackgroundBurst = (_t: number, hue: number) => {
    const steps = 22;
    const maxR = Math.sqrt(W * W + H * H) / 2;
    p.noStroke();
    for (let i = 0; i < steps; i++) {
      const frac = i / steps;
      const rad = maxR * (1 - frac);
      // Deep near edge, faint purple-ish bloom near center
      const bri = p.map(frac * frac, 0, 1, 3, 11);
      const sat = p.map(frac, 0, 1, 20, 60);
      const alpha = 255;
      p.fill((hue + 200) % 360, sat, bri, alpha);
      p.ellipse(0, 0, rad * 2, rad * 2);
    }
  };

  // ─── setup ───────────────────────────────────────────────────────────────
  p.setup = () => {
    window.p = p;
    p.createCanvas(W, H);
    p.colorMode(p.HSB, 360, 100, 100, 255);
    p.angleMode(p.RADIANS);
    p.background(0, 0, 3);
  };

  // ─── draw loop ────────────────────────────────────────────────────────────
  p.draw = () => {
    const t = p.frameCount * 0.011;

    // Motion-blur ghost
    p.fill(0, 0, 3, 28);
    p.noStroke();
    p.rect(0, 0, W, H);

    // Mouse influence
    const mxN = p.constrain(p.mouseX / W, 0, 1);
    const myN = p.constrain(p.mouseY / H, 0, 1);
    const colorSpd = p.map(mxN, 0, 1, 8, 70);
    const lenScale = p.map(myN, 0, 1, 0.65, 1.35);
    const hueBase = (t * colorSpd) % 360;

    // Breathing pulse
    const breath = 1 + 0.07 * Math.sin(t * 1.1);
    const armLen = BASE_LEN * lenScale * breath;

    // Slow mandala rotation
    const rot = t * 0.005;

    p.push();
    p.translate(W / 2, H / 2);
    p.rotate(rot);

    // Background radial burst
    drawBackgroundBurst(t, hueBase);

    // Fractal arms (mirrored = 2 × SYMMETRY total)
    for (let i = 0; i < SYMMETRY; i++) {
      const angle = (Math.PI * 2 / SYMMETRY) * i;
      const armHue = (hueBase + i * (360 / SYMMETRY)) % 360;

      p.push();
      p.rotate(angle);
      drawArm(armLen, MAX_DEPTH, t, armHue);
      p.pop();

      // y-axis mirror for the petal-doubling effect
      p.push();
      p.rotate(angle);
      p.scale(-1, 1);
      drawArm(armLen, MAX_DEPTH, t, armHue);
      p.pop();
    }

    // Inner bloom on top
    drawCenter(t, hueBase);

    p.pop();
  };
};

export function mountMandala(container?: HTMLElement) {
  return new p5(sketch, container);
}
