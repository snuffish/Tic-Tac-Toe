import p5 from 'p5';

const W = 1024;
const H = 768;

const sketch = (p: p5Instance) => {

  // ─── types & state ────────────────────────────────────────────────────────
  let player: Player;
  let bullets: Bullet[] = [];
  let enemies: Enemy[] = [];
  let particles: Particle[] = [];
  
  let score = 0;
  let wave = 1;

  // ─── classes ──────────────────────────────────────────────────────────────

  class Player {
    x: number = W / 2;
    y: number = H - 60;
    w: number = 40;
    h: number = 25;
    speed: number = 6;
    cooldown: number = 0;

    update() {
      // Input
      if (p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65 /* A */)) this.x -= this.speed;
      if (p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68 /* D */)) this.x += this.speed;

      // Bounds
      this.x = p.constrain(this.x, this.w/2, W - this.w/2);

      // Shooting
      if (this.cooldown > 0) this.cooldown--;
      if ((p.keyIsDown(32 /* Space */) || p.mouseIsPressed) && this.cooldown <= 0) {
        this.shoot();
      }
    }

    shoot() {
      bullets.push(new Bullet(this.x, this.y - this.h/2));
      this.cooldown = 12; // Frames between shots
    }

    draw() {
      p.push();
      p.fill(0, 255, 100);
      p.noStroke();
      p.rectMode(p.CENTER);
      // Ship body
      p.rect(this.x, this.y, this.w, this.h, 4);
      // Ship cannon
      p.rect(this.x, this.y - this.h/2, 12, 16, 2);
      p.pop();
    }
  }

  class Bullet {
    x: number;
    y: number;
    speed: number = -12;
    w: number = 4;
    h: number = 18;
    active: boolean = true;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    update() {
      this.y += this.speed;
      if (this.y < -this.h) this.active = false;
    }

    draw() {
      p.push();
      p.fill(255, 255, 0);
      p.noStroke();
      p.rectMode(p.CENTER);
      p.rect(this.x, this.y, this.w, this.h, 4);
      
      // Glow
      p.fill(255, 255, 0, 100);
      p.rect(this.x, this.y, this.w * 2.5, this.h * 1.5, 4);
      p.pop();
    }
  }

  class Enemy {
    x: number;
    y: number;
    w: number = 32;
    h: number = 24;
    hp: number;
    maxHp: number;
    points: number;
    speed: number;
    active: boolean = true;
    color: number[];
    tOffset: number; // For floating motion

    constructor(x: number, y: number, tier: number) {
      this.x = x;
      this.y = y;
      this.hp = tier * 10;
      this.maxHp = this.hp;
      this.points = tier * 50;
      this.speed = 0.5 + wave * 0.2;
      this.tOffset = p.random(1000);
      
      // Color based on tier
      const hues = [
        [255, 50, 50],   // Tier 1: Red
        [255, 150, 50],  // Tier 2: Orange
        [255, 50, 255],  // Tier 3: Magenta
        [50, 200, 255]   // Tier 4: Cyan
      ];
      this.color = hues[Math.min(tier - 1, hues.length - 1)];
    }

    update() {
      this.y += this.speed;
      
      // Sway horizontally
      const t = p.frameCount * 0.05 + this.tOffset;
      this.x += Math.sin(t) * 1.5;

      if (this.y > H + this.h) {
        this.active = false;
        // Penalize score if they escape? Or just let them go
        score = Math.max(0, score - 100); 
      }
    }

    hit(damage: number) {
      this.hp -= damage;
      if (this.hp <= 0) {
        this.active = false;
        score += this.points;
        spawnExplosion(this.x, this.y, this.color);
      } else {
        // Hit flash
        spawnHitParticles(this.x, this.y + this.h/2);
      }
    }

    draw() {
      p.push();
      p.rectMode(p.CENTER);
      p.noStroke();
      
      // Render based on HP percentage
      const hpPct = this.hp / this.maxHp;
      p.fill(this.color[0], this.color[1], this.color[2]);
      
      // Main body
      p.rect(this.x, this.y, this.w, this.h, 2);
      
      // Outer shell (gets destroyed as HP drops)
      if (hpPct > 0.5) {
        p.rect(this.x - this.w/2 - 4, this.y, 6, this.h - 4);
        p.rect(this.x + this.w/2 + 4, this.y, 6, this.h - 4);
      }

      // Eyes
      p.fill(0);
      p.rect(this.x - 6, this.y - 2, 4, 4);
      p.rect(this.x + 6, this.y - 2, 4, 4);
      
      p.pop();
    }
  }

  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: number[];
    size: number;

    constructor(x: number, y: number, c: number[], spd: number, life: number) {
      this.x = x;
      this.y = y;
      const a = p.random(p.TWO_PI);
      const v = p.random(spd * 0.2, spd);
      this.vx = Math.cos(a) * v;
      this.vy = Math.sin(a) * v;
      this.color = c;
      this.maxLife = life * p.random(0.8, 1.2);
      this.life = this.maxLife;
      this.size = p.random(3, 7);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.94; // friction
      this.vy *= 0.94;
      this.life--;
    }

    draw() {
      if (this.life <= 0) return;
      p.push();
      const alpha = p.map(this.life, 0, this.maxLife, 0, 255);
      p.fill(this.color[0], this.color[1], this.color[2], alpha);
      p.noStroke();
      const s = p.map(this.life, 0, this.maxLife, 0, this.size);
      p.circle(this.x, this.y, s);
      p.pop();
    }
  }

  // ─── helpers ──────────────────────────────────────────────────────────────

  const spawnExplosion = (x: number, y: number, color: number[]) => {
    for (let i = 0; i < 25; i++) {
      particles.push(new Particle(x, y, color, 8, 40));
    }
    for (let i = 0; i < 15; i++) {
      particles.push(new Particle(x, y, [255, 255, 255], 12, 20)); // white flash
    }
  };

  const spawnHitParticles = (x: number, y: number) => {
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(x, y, [255, 255, 0], 5, 15));
    }
  };

  const spawnWave = () => {
    const cols = 8 + wave;
    const rows = 3 + Math.floor(wave / 2);
    const spacingX = 60;
    const spacingY = 50;
    
    const startX = (W - (cols - 1) * spacingX) / 2;
    const startY = -rows * spacingY - 50;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Tier scales up by row and wave
        let tier = 1 + Math.floor(wave / 3);
        if (r === 0) tier += 2; // Front row is tougher
        else if (r === 1) tier += 1;
        
        enemies.push(new Enemy(
          startX + c * spacingX,
          startY + r * spacingY,
          tier
        ));
      }
    }
  };

  const checkCollisions = () => {
    for (const b of bullets) {
      if (!b.active) continue;
      
      for (const e of enemies) {
        if (!e.active) continue;

        // AABB Collision
        const hit = b.x > e.x - e.w/2 && 
                    b.x < e.x + e.w/2 && 
                    b.y > e.y - e.h/2 && 
                    b.y < e.y + e.h/2;
                    
        if (hit) {
          e.hit(10); // bullet damage
          b.active = false;
          break; // bullet killed
        }
      }
    }
  };

  // ─── starfield ────────────────────────────────────────────────────────────
  
  interface Star { x: number, y: number, speed: number, size: number }
  const stars: Star[] = [];
  
  const initStars = () => {
    for(let i=0; i<100; i++) {
      stars.push({
        x: p.random(W),
        y: p.random(H),
        speed: p.random(0.5, 3),
        size: p.random(1, 3)
      });
    }
  };

  const drawStars = () => {
    p.noStroke();
    for(const s of stars) {
      s.y += s.speed * (1 + wave * 0.1); // warp speed increases
      if (s.y > H) {
        s.y = 0;
        s.x = p.random(W);
      }
      p.fill(255, p.map(s.speed, 0.5, 3, 50, 255));
      p.rect(s.x, s.y, s.size, s.size * 2);
    }
  };

  // ─── p5 hooks ─────────────────────────────────────────────────────────────

  p.setup = () => {
    p.createCanvas(W, H);
    player = new Player();
    initStars();
    spawnWave();
  };

  p.draw = () => {
    p.background(10, 10, 25);

    drawStars();

    // Updates
    player.update();
    
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].update();
      if (!bullets[i].active) bullets.splice(i, 1);
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].update();
      if (!enemies[i].active) enemies.splice(i, 1);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      if (particles[i].life <= 0) particles.splice(i, 1);
    }

    checkCollisions();

    // Check wave complete
    if (enemies.length === 0) {
      wave++;
      spawnWave();
    }

    // Draws
    for (const b of bullets) b.draw();
    for (const e of enemies) e.draw();
    for (const part of particles) part.draw();
    player.draw();

    // UI
    p.push();
    p.fill(255);
    p.textSize(24);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`SCORE: ${score}`, 20, 20);
    p.textAlign(p.RIGHT, p.TOP);
    p.text(`WAVE: ${wave}`, W - 20, 20);
    p.pop();
  };
};

export function mountInvaders(container?: HTMLElement) {
  return new p5(sketch, container);
}
