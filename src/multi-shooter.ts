import p5 from 'p5';

const W = 1024;
const H = 768;

const ARENA_W = 2000;
const ARENA_H = 2000;

const sketch = (p: p5Instance) => {

  // ─── state ────────────────────────────────────────────────────────────────
  let player: Player;
  let bullets: Bullet[] = [];
  let flames: Flame[] = [];
  let rockets: Rocket[] = [];
  let explosions: Explosion[] = [];

  let enemies: Enemy[] = [];
  let particles: Particle[] = [];
  let casings: Casing[] = [];

  let cameraX = 0;
  let cameraY = 0;

  let screenShake = 0;
  let score = 0;
  let timeAlive = 0;
  let lastSpawn = 0;

  // ─── Weapon System ────────────────────────────────────────────────────────

  abstract class Weapon {
    name: string;
    cooldown: number = 0;
    maxCooldown: number;
    color: number[];

    constructor(name: string, cd: number, color: number[]) {
      this.name = name;
      this.maxCooldown = cd;
      this.color = color;
    }

    update() { if (this.cooldown > 0) this.cooldown--; }
    canFire() { return this.cooldown <= 0; }

    fire(x: number, y: number, angle: number) {
      if (!this.canFire()) return false;
      this.cooldown = this.maxCooldown;
      this.onFire(x, y, angle);
      casings.push(new Casing(x, y, angle - Math.PI / 2 + p.random(-0.5, 0.5)));
      return true;
    }

    abstract onFire(x: number, y: number, angle: number): void;
  }

  class AssaultRifle extends Weapon {
    constructor() { super("RIFLE", 6, [255, 255, 0]); }
    onFire(x: number, y: number, angle: number) {
      screenShake += 3;
      const spread = p.random(-0.05, 0.05);
      bullets.push(new Bullet(x, y, angle + spread));
      player.recoil(1.5, angle);
    }
  }

  class Flamethrower extends Weapon {
    constructor() { super("FLAME", 2, [255, 100, 0]); }
    onFire(x: number, y: number, angle: number) {
      // Much higher spread, spawns multiple short-lived flame particles
      const spread = p.random(-0.3, 0.3);
      flames.push(new Flame(x, y, angle + spread));
      player.recoil(0.2, angle);
    }
  }

  class RocketLauncher extends Weapon {
    constructor() { super("ROCKET", 45, [50, 200, 50]); }
    onFire(x: number, y: number, angle: number) {
      screenShake += 10;
      rockets.push(new Rocket(x, y, angle));
      player.recoil(8, angle);
    }
  }

  // ─── Projectiles ──────────────────────────────────────────────────────────

  class Bullet {
    x: number; y: number; vx: number; vy: number;
    speed: number = 22; active: boolean = true; life: number = 60;
    history: { x: number, y: number }[] = [];

    constructor(x: number, y: number, angle: number) {
      this.x = x; this.y = y;
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
    }
    update() {
      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > 5) this.history.shift();
      this.x += this.vx; this.y += this.vy;
      this.life--;
      if (this.life <= 0 || this.x < 0 || this.x > ARENA_W || this.y < 0 || this.y > ARENA_H) this.active = false;
    }
    draw() {
      p.strokeWeight(3);
      p.noFill();
      p.beginShape();
      for (let i = 0; i < this.history.length; i++) {
        p.stroke(255, 255, 0, p.map(i, 0, this.history.length, 0, 100));
        p.vertex(this.history[i].x, this.history[i].y);
      }
      p.vertex(this.x, this.y);
      p.endShape();
      p.stroke(255);
      const px = this.history.length > 0 ? this.history[this.history.length - 1].x : this.x - this.vx * 0.5;
      const py = this.history.length > 0 ? this.history[this.history.length - 1].y : this.y - this.vy * 0.5;
      p.line(px, py, this.x, this.y);
    }
  }

  class Flame {
    x: number; y: number; vx: number; vy: number;
    active: boolean = true; life: number; maxLife: number;
    size: number = 10;

    // Track which enemies we've burned so we don't hit them 60 times a second
    burnedEnemies: Set<Enemy> = new Set();

    constructor(x: number, y: number, angle: number) {
      this.x = x; this.y = y;
      const speed = p.random(12, 18);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.maxLife = 25 + p.random(15);
      this.life = this.maxLife;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vx *= 0.85; this.vy *= 0.85; // Slow down rapidly into a cloud
      this.size += 1.5; // expand
      this.life--;
      if (this.life <= 0) this.active = false;
    }
    draw() {
      p.noStroke();
      const alpha = p.map(this.life, 0, this.maxLife, 0, 150);
      const ratio = this.life / this.maxLife;
      // Yellow core, orange/red exterior
      p.fill(255, ratio * 200, 0, alpha);
      p.circle(this.x, this.y, this.size);
    }
  }

  class Rocket {
    x: number; y: number; vx: number; vy: number; angle: number;
    speed: number = 2; // Starts slow
    active: boolean = true; life: number = 80;

    constructor(x: number, y: number, angle: number) {
      this.x = x; this.y = y; this.angle = angle;
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
    }
    update() {
      // Accelerate
      this.speed += 0.8;
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;

      this.x += this.vx; this.y += this.vy;

      // Rocket thrust smoke
      if (p.frameCount % 2 === 0) {
        particles.push(new Particle(this.x - this.vx, this.y - this.vy, [200, 200, 200], 1, 20));
        particles.push(new Particle(this.x - this.vx, this.y - this.vy, [255, 100, 0], 2, 10)); // fire
      }

      this.life--;
      if (this.life <= 0 || this.x < 0 || this.x > ARENA_W || this.y < 0 || this.y > ARENA_H) {
        this.explode();
      }
    }
    explode() {
      if (!this.active) return;
      this.active = false;
      explosions.push(new Explosion(this.x, this.y, 200, 50)); // radius 200, 50 damage
      spawnParticles(this.x, this.y, [255, 150, 50], 40, 12);
      screenShake += 25;
    }
    draw() {
      p.push();
      p.translate(this.x, this.y);
      p.rotate(this.angle);
      p.fill(50, 150, 50);
      p.stroke(20);
      p.strokeWeight(2);
      p.rectMode(p.CENTER);
      p.rect(0, 0, 20, 8, 4);
      p.fill(255, 50, 50);
      p.rect(8, 0, 8, 6, 2); // tip
      p.pop();
    }
  }

  class Explosion {
    x: number; y: number; radius: number; damage: number;
    life: number; maxLife: number = 15; active: boolean = true;
    damagedEnemies: Set<Enemy> = new Set();

    constructor(x: number, y: number, radius: number, damage: number) {
      this.x = x; this.y = y; this.radius = radius; this.damage = damage;
      this.life = this.maxLife;
    }
    update() {
      this.life--;
      if (this.life <= 0) this.active = false;
    }
    draw() {
      p.noStroke();
      const r = p.map(this.life, 0, this.maxLife, this.radius, 0);
      const alpha = p.map(this.life, 0, this.maxLife, 0, 180);
      p.fill(255, 150, 50, alpha);
      p.circle(this.x, this.y, r);
      p.fill(255, 255, 150, alpha);
      p.circle(this.x, this.y, r * 0.6);
    }
  }

  // ─── Entities ─────────────────────────────────────────────────────────────

  class Player {
    x: number = ARENA_W / 2; y: number = ARENA_H / 2;
    w: number = 32; h: number = 32; speed: number = 5;
    hp: number = 100; maxHp: number = 100;

    targetAngle: number = 0; angle: number = 0;

    weapons: Weapon[] = [
      new AssaultRifle(),
      new Flamethrower(),
      new RocketLauncher()
    ];
    weaponIndex: number = 0;

    update() {
      // Weapon Switch
      if (p.keyIsPressed) {
        if (p.key === '1') this.weaponIndex = 0;
        else if (p.key === '2') this.weaponIndex = 1;
        else if (p.key === '3') this.weaponIndex = 2;
      }

      this.weapons.forEach(w => w.update());

      // Movement
      let dx = 0, dy = 0;
      if (p.keyIsDown('a') || p.keyIsDown(65 /* A */)) dx -= this.speed;
      if (p.keyIsDown('d') || p.keyIsDown(68 /* D */)) dx += this.speed;
      if (p.keyIsDown('w') || p.keyIsDown(87 /* W */)) dy -= this.speed;
      if (p.keyIsDown('s') || p.keyIsDown(83 /* S */)) dy += this.speed;

      if (dx !== 0 && dy !== 0) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / len) * this.speed; dy = (dy / len) * this.speed;
      }

      this.x = p.constrain(this.x + dx, this.w / 2, ARENA_W - this.w / 2);
      this.y = p.constrain(this.y + dy, this.h / 2, ARENA_H - this.h / 2);

      // Aiming
      const mx = p.mouseX + cameraX;
      const my = p.mouseY + cameraY;
      this.targetAngle = Math.atan2(my - this.y, mx - this.x);

      let ad = this.targetAngle - this.angle;
      while (ad > Math.PI) ad -= Math.PI * 2;
      while (ad < -Math.PI) ad += Math.PI * 2;
      this.angle += ad * 0.25;

      // Shooting
      if (p.mouseIsPressed) {
        const bx = this.x + Math.cos(this.angle) * 30;
        const by = this.y + Math.sin(this.angle) * 30;
        this.weapons[this.weaponIndex].fire(bx, by, this.angle);
      }
    }

    recoil(amount: number, angle: number) {
      this.x -= Math.cos(angle) * amount;
      this.y -= Math.sin(angle) * amount;
    }

    takeDamage(dmg: number) {
      if (this.hp <= 0) return;
      this.hp -= dmg;
      screenShake += 15;
      spawnParticles(this.x, this.y, [255, 0, 0], 20, 6);
    }

    draw() {
      p.push();
      p.noStroke(); p.fill(0, 50);
      p.ellipse(this.x + 5, this.y + 5, this.w + 10, this.h + 10); // shadow

      p.translate(this.x, this.y);
      p.rotate(this.angle);

      // Body
      p.rectMode(p.CENTER);
      p.fill(40, 150, 220); p.stroke(20); p.strokeWeight(2);
      p.circle(0, 0, this.w);

      // Gun changes color based on weapon
      const c = this.weapons[this.weaponIndex].color;
      p.fill(c[0], c[1], c[2]);

      if (this.weaponIndex === 0) { // Rifle
        p.rect(15, 8, 25, 6, 2);
      } else if (this.weaponIndex === 1) { // Flamethrower
        p.rect(15, 8, 30, 10, 2);
        p.fill(255, 100, 0); p.rect(25, 8, 8, 4);
      } else if (this.weaponIndex === 2) { // Rocket
        p.rect(10, 8, 35, 12, 1);
        p.fill(50, 50, 50); p.rect(20, 8, 10, 16);
      }

      p.fill(80); p.rect(10, -8, 15, 6, 2); // left hand
      p.fill(255, 200, 150); p.strokeWeight(1.5); p.circle(0, 0, 16); // head
      p.pop();
    }
  }

  class Enemy {
    x: number; y: number; w: number = 28;
    hp: number; maxHp: number; speed: number;
    active: boolean = true;
    color: number[]; isTank: boolean; hitFlash: number = 0;

    constructor(x: number, y: number, isTank: boolean) {
      this.x = x; this.y = y; this.isTank = isTank;
      if (isTank) {
        this.w = 50; this.maxHp = 150 + p.floor(timeAlive / 1000) * 10;
        this.speed = p.random(1.2, 1.8); this.color = [180, 50, 50];
      } else {
        this.w = 28; this.maxHp = 30 + p.floor(timeAlive / 500) * 5;
        this.speed = p.random(3.5, 4.8); this.color = [200, 200, 50];
      }
      this.hp = this.maxHp;
    }
    update() {
      const angle = Math.atan2(player.y - this.y, player.x - this.x);

      // Boids separation
      let sepX = 0, sepY = 0, count = 0;
      for (const e of enemies) {
        if (e === this) continue;
        const distSq = (e.x - this.x) ** 2 + (e.y - this.y) ** 2;
        const minDist = (this.w + e.w) / 2 + 5;
        if (distSq > 0 && distSq < minDist * minDist) {
          const dist = Math.sqrt(distSq);
          sepX += (this.x - e.x) / dist; sepY += (this.y - e.y) / dist;
          count++;
        }
      }
      if (count > 0) { sepX /= count; sepY /= count; }

      const dx = Math.cos(angle) + sepX * 1.5;
      const dy = Math.sin(angle) + sepY * 1.5;
      const dLen = Math.sqrt(dx * dx + dy * dy) || 1;

      this.x += (dx / dLen) * this.speed;
      this.y += (dy / dLen) * this.speed;
      this.x = p.constrain(this.x, this.w / 2, ARENA_W - this.w / 2);
      this.y = p.constrain(this.y, this.w / 2, ARENA_H - this.w / 2);

      if (this.hitFlash > 0) this.hitFlash--;

      // Hit player
      const dToPlayer = p.dist(this.x, this.y, player.x, player.y);
      if (dToPlayer < (this.w / 2 + player.w / 2)) {
        player.takeDamage(this.isTank ? 20 : 5);
        const pAng = Math.atan2(player.y - this.y, player.x - this.x);
        player.x += Math.cos(pAng) * 20; player.y += Math.sin(pAng) * 20;
        this.x -= Math.cos(pAng) * 20; this.y -= Math.sin(pAng) * 20;
      }
    }
    hit(dmg: number, hx: number, hy: number) {
      this.hp -= dmg; this.hitFlash = 5;
      const kAng = Math.atan2(this.y - hy, this.x - hx);
      this.x += Math.cos(kAng) * (this.isTank ? 2 : 6);
      this.y += Math.sin(kAng) * (this.isTank ? 2 : 6);
      spawnParticles(this.x, this.y, this.color, 3, 4);

      if (this.hp <= 0) {
        this.active = false;
        score += this.isTank ? 50 : 10;
        spawnParticles(this.x, this.y, this.color, this.isTank ? 30 : 15, this.isTank ? 8 : 5);
        screenShake += this.isTank ? 10 : 3;
      }
    }
    draw() {
      p.push();
      p.translate(this.x, this.y);
      p.rotate(Math.atan2(player.y - this.y, player.x - this.x));
      p.noStroke(); p.fill(0, 50); p.ellipse(0, 0, this.w + 10, this.w + 10);
      if (this.hitFlash > 0) p.fill(255);
      else p.fill(this.color[0], this.color[1], this.color[2]);
      p.stroke(20); p.strokeWeight(2);
      if (this.isTank) {
        p.rectMode(p.CENTER); p.rect(0, 0, this.w, this.w, 8);
        p.fill(0, 100); p.rect(10, 0, 20, 10);
      } else {
        p.triangle(this.w / 2, 0, -this.w / 2, this.w / 3, -this.w / 2, -this.w / 3);
      }
      p.pop();
    }
  }

  // Visual classes (Particle, Casing)
  class Particle {
    x: number; y: number; vx: number; vy: number;
    life: number; maxLife: number; color: number[]; size: number;
    constructor(x: number, y: number, c: number[], spd: number, life: number) {
      this.x = x; this.y = y;
      const a = p.random(p.TWO_PI); const v = p.random(spd * 0.2, spd);
      this.vx = Math.cos(a) * v; this.vy = Math.sin(a) * v;
      this.color = c; this.maxLife = life; this.life = life; this.size = p.random(4, 9);
    }
    update() { this.x += this.vx; this.y += this.vy; this.vx *= 0.88; this.vy *= 0.88; this.life--; }
    draw() {
      if (this.life <= 0) return;
      p.push(); p.noStroke();
      p.fill(this.color[0], this.color[1], this.color[2], p.map(this.life, 0, this.maxLife, 0, 255));
      p.circle(this.x, this.y, p.map(this.life, 0, this.maxLife, 0, this.size));
      p.pop();
    }
  }

  class Casing {
    x: number; y: number; vx: number; vy: number; rot: number; rotSpd: number; life: number;
    constructor(x: number, y: number, angle: number) {
      this.x = x; this.y = y;
      const spd = p.random(2, 5);
      this.vx = Math.cos(angle) * spd; this.vy = Math.sin(angle) * spd;
      this.rot = p.random(p.TWO_PI); this.rotSpd = p.random(-0.5, 0.5);
      this.life = 120 + p.random(60);
    }
    update() {
      if (this.life <= 0) return;
      this.x += this.vx; this.y += this.vy; this.rot += this.rotSpd;
      this.vx *= 0.85; this.vy *= 0.85; this.rotSpd *= 0.9; this.life--;
    }
    draw() {
      if (this.life <= 0) return;
      p.push(); p.translate(this.x, this.y); p.rotate(this.rot); p.noStroke();
      p.fill(200, 150, 0, p.map(this.life, 0, 30, 0, 255, true));
      p.rectMode(p.CENTER); p.rect(0, 0, 2, 6); p.pop();
    }
  }

  // ─── helpers ──────────────────────────────────────────────────────────────

  const spawnParticles = (x: number, y: number, color: number[], count: number, speed: number) => {
    for (let i = 0; i < count; i++) particles.push(new Particle(x, y, color, speed, 15 + p.random(15)));
  };

  const spawnEnemies = () => {
    if (player.hp <= 0) return;
    const spawnDelay = Math.max(20, 120 - timeAlive / 30);
    if (p.frameCount - lastSpawn > spawnDelay) {
      lastSpawn = p.frameCount;
      const angle = p.random(p.TWO_PI);
      const dist = Math.max(W, H) / 2 + 100;
      const sx = player.x + Math.cos(angle) * dist;
      const sy = player.y + Math.sin(angle) * dist;
      if (sx > 0 && sx < ARENA_W && sy > 0 && sy < ARENA_H) {
        enemies.push(new Enemy(sx, sy, p.random() < 0.15));
      } else {
        enemies.push(new Enemy(p.constrain(sx, 50, ARENA_W - 50), p.constrain(sy, 50, ARENA_H - 50), p.random() < 0.1));
      }
    }
  };

  const checkCollisions = () => {
    // Bullets (Rifle)
    for (const b of bullets) {
      if (!b.active) continue;
      for (const e of enemies) {
        if (!e.active) continue;
        if (p.dist(b.x, b.y, e.x, e.y) < e.w / 2) {
          e.hit(20, b.x, b.y);
          b.active = false;
          break;
        }
      }
    }

    // Flames (Flamethrower - Piercing, Damage over time)
    for (const f of flames) {
      if (!f.active) continue;
      for (const e of enemies) {
        if (!e.active) continue;
        // If overlap and hasn't burned this enemy recently
        if (!f.burnedEnemies.has(e) && p.dist(f.x, f.y, e.x, e.y) < (e.w / 2 + f.size / 2)) {
          e.hit(4, f.x, f.y); // low damage, high fire rate
          f.burnedEnemies.add(e);
        }
      }
    }

    // Rockets (Direct Hit turns into explosion)
    for (const r of rockets) {
      if (!r.active) continue;
      for (const e of enemies) {
        if (!e.active) continue;
        if (p.dist(r.x, r.y, e.x, e.y) < e.w / 2) {
          r.explode(); // Spawns an explosion object which does the real AoE damage
          break; // rocket destroyed
        }
      }
    }

    // Explosions (AoE)
    for (const ex of explosions) {
      if (!ex.active) continue;
      // Explosions deal damage once per enemy per explosion
      const curRadius = p.map(ex.life, 0, ex.maxLife, ex.radius, 0); // grows inward technically, but mostly static hit area
      for (const e of enemies) {
        if (!e.active) continue;
        if (!ex.damagedEnemies.has(e) && p.dist(ex.x, ex.y, e.x, e.y) < (e.w / 2 + curRadius)) {
          e.hit(ex.damage, ex.x, ex.y);
          ex.damagedEnemies.add(e);
        }
      }
    }
  };

  const drawGrid = () => {
    p.stroke(35); p.strokeWeight(1);
    const step = 100;
    const startX = Math.floor(cameraX / step) * step;
    const endX = startX + W + step;
    const startY = Math.floor(cameraY / step) * step;
    const endY = startY + H + step;

    for (let x = startX; x <= endX; x += step) if (x >= 0 && x <= ARENA_W) p.line(x, 0, x, ARENA_H);
    for (let y = startY; y <= endY; y += step) if (y >= 0 && y <= ARENA_H) p.line(0, y, ARENA_W, y);

    p.stroke(255, 50, 50); p.strokeWeight(4); p.noFill();
    p.rectMode(p.CORNER); p.rect(0, 0, ARENA_W, ARENA_H);
  };

  const drawWeaponHUD = () => {
    p.push();
    p.translate(W / 2 - 90, H - 50);
    p.textAlign(p.CENTER, p.CENTER);
    p.textFont('monospace');

    for (let i = 0; i < player.weapons.length; i++) {
      const w = player.weapons[i];
      const isSelected = player.weaponIndex === i;

      const px = i * 90;

      p.strokeWeight(isSelected ? 3 : 1);
      p.stroke(isSelected ? 255 : 100);
      p.fill(20, 20, 25, 200);
      p.rectMode(p.CENTER);
      p.rect(px, 0, 70, 70, 8);

      // keybind num
      p.fill(200); p.noStroke(); p.textSize(12);
      p.text(`[${i + 1}]`, px - 20, -20);

      // Iconish
      p.fill(w.color[0], w.color[1], w.color[2]);
      p.textSize(10);
      p.text(w.name, px, 0);

      // Cooldown bar
      if (w.cooldown > 0) {
        p.fill(255, 0, 0, 100);
        const cdRatio = w.cooldown / w.maxCooldown;
        p.rectMode(p.CORNER);
        p.rect(px - 35, 35, 70, -70 * cdRatio);
      }
    }
    p.pop();
  };

  // ─── Setup & Loop ──────────────────────────────────────────────────────────

  p.setup = () => {
    p.createCanvas(W, H);
    player = new Player();
    p.cursor(p.CROSS);
  };

  p.draw = () => {
    if (player.hp > 0) timeAlive++;
    p.background(15);

    // Update
    if (player.hp > 0) { player.update(); spawnEnemies(); }

    const updateArr = (arr: any[]) => {
      for (let i = arr.length - 1; i >= 0; i--) {
        arr[i].update();
        if (!arr[i].active) arr.splice(i, 1);
      }
    };

    updateArr(bullets);
    updateArr(flames);
    updateArr(rockets);
    updateArr(explosions);
    updateArr(casings);
    updateArr(enemies);
    updateArr(particles);

    checkCollisions();

    // Camera follow (Lerped)
    const targetCamX = player.x - W / 2;
    const targetCamY = player.y - H / 2;
    cameraX += (targetCamX - cameraX) * 0.1;
    cameraY += (targetCamY - cameraY) * 0.1;

    // Screen shake
    let shakeX = 0, shakeY = 0;
    if (screenShake > 0) {
      shakeX = p.random(-screenShake, screenShake); shakeY = p.random(-screenShake, screenShake);
      screenShake *= 0.85; if (screenShake < 0.5) screenShake = 0;
    }

    // ─── Draw World ───
    p.push();
    p.translate(-cameraX + shakeX, -cameraY + shakeY);
    drawGrid();

    for (const c of casings) c.draw();
    for (const ex of explosions) ex.draw();
    for (const f of flames) f.draw();
    for (const b of bullets) b.draw();
    for (const r of rockets) r.draw();
    for (const e of enemies) e.draw();
    for (const part of particles) part.draw();

    if (player.hp > 0) player.draw();
    else { p.noStroke(); p.fill(200, 50, 50, 150); p.circle(player.x, player.y, 60); }
    p.pop();

    // ─── Draw UI ───
    p.push();
    if (player.hp > 0) {
      p.fill(50); p.rect(20, 20, 200, 24, 4);
      p.fill(255, 80, 80); p.rect(20, 20, (player.hp / player.maxHp) * 200, 24, 4);
      p.textAlign(p.CENTER, p.CENTER); p.fill(255); p.textSize(16); p.textFont('monospace');
      p.text(`${Math.ceil(player.hp)} / ${player.maxHp}`, 120, 32);

      p.textAlign(p.RIGHT, p.TOP); p.textSize(24);
      p.text(`SCORE: ${score}`, W - 20, 20);
      p.textSize(16); p.text(`TIME: ${p.floor(timeAlive / 60)}s`, W - 20, 50);

      drawWeaponHUD();

    } else {
      p.background(0, 150); p.textAlign(p.CENTER, p.CENTER);
      p.fill(255, 50, 50); p.textSize(64); p.text("WASTED", W / 2, H / 2 - 40);
      p.fill(255); p.textSize(24); p.text(`FINAL SCORE: ${score}`, W / 2, H / 2 + 30);
      p.textSize(18); p.text(`SURVIVED: ${p.floor(timeAlive / 60)}s`, W / 2, H / 2 + 60);
    }
    p.pop();
  };
};

export function mountMultiShooter(container?: HTMLElement) {
  return new p5(sketch, container);
}
