import p5 from 'p5';

const W = 1024;
const H = 768;
const TILE_SIZE = 48;

// Basic 2D array map (0 = floor, 1 = wall)
const MAP_COLS = 30;
const MAP_ROWS = 20;
const levelMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const sketch = (p: p5Instance) => {

  // ─── types & state ────────────────────────────────────────────────────────
  let player: Player;
  let enemies: Enemy[] = [];
  let particles: Particle[] = [];
  let damageTexts: DamageText[] = [];

  let cameraX = 0;
  let cameraY = 0;

  // ─── helpers ──────────────────────────────────────────────────────────────

  const isWall = (x: number, y: number): boolean => {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return true;
    return levelMap[row][col] === 1;
  };

  const spawnParticles = (x: number, y: number, color: number[], count: number, speed: number) => {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, color, speed, 20 + p.random(15)));
    }
  };

  const aabbIntersect = (x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number) => {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  };

  // ─── classes ──────────────────────────────────────────────────────────────

  class Player {
    x: number;
    y: number;
    w: number = 24;
    h: number = 32;
    speed: number = 4;
    maxHp: number = 100;
    hp: number = 100;

    dirX: number = 0;
    dirY: number = 1;

    // Attack state
    isAttacking: boolean = false;
    attackTimer: number = 0;
    attackDuration: number = 15;
    attackCooldown: number = 0;
    attackRange: number = 45;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    update() {
      if (this.attackCooldown > 0) this.attackCooldown--;

      if (this.isAttacking) {
        this.attackTimer++;
        if (this.attackTimer >= this.attackDuration) {
          this.isAttacking = false;
        }
        return; // Can't move while attacking
      }

      let dx = 0;
      let dy = 0;

      if (p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65 /* A */)) dx -= this.speed;
      if (p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68 /* D */)) dx += this.speed;
      if (p.keyIsDown(p.UP_ARROW) || p.keyIsDown(87 /* W */)) dy -= this.speed;
      if (p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(83 /* S */)) dy += this.speed;

      // Normalize diagonal speed
      if (dx !== 0 && dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / length) * this.speed;
        dy = (dy / length) * this.speed;
      }

      if (dx !== 0 || dy !== 0) {
        // Only update facing dir if moving
        if (Math.abs(dx) > Math.abs(dy)) {
          this.dirX = dx > 0 ? 1 : -1;
          this.dirY = 0;
        } else {
          this.dirX = 0;
          this.dirY = dy > 0 ? 1 : -1;
        }
      }

      this.moveWithCollision(dx, dy);

      // Attack Input
      if (p.keyIsDown(32 /* Space */) && this.attackCooldown <= 0) {
        this.attack();
      }
    }

    moveWithCollision(dx: number, dy: number) {
      // Very basic point collision based on corners
      const newX = this.x + dx;
      if (!isWall(newX - this.w / 2, this.y - this.h / 2) &&
        !isWall(newX + this.w / 2, this.y - this.h / 2) &&
        !isWall(newX - this.w / 2, this.y + this.h / 2) &&
        !isWall(newX + this.w / 2, this.y + this.h / 2)) {
        this.x = newX;
      }

      const newY = this.y + dy;
      if (!isWall(this.x - this.w / 2, newY - this.h / 2) &&
        !isWall(this.x + this.w / 2, newY - this.h / 2) &&
        !isWall(this.x - this.w / 2, newY + this.h / 2) &&
        !isWall(this.x + this.w / 2, newY + this.h / 2)) {
        this.y = newY;
      }
    }

    attack() {
      this.isAttacking = true;
      this.attackTimer = 0;
      this.attackCooldown = 30;

      // Hitbox logic
      const hitW = this.dirX !== 0 ? this.attackRange : this.w + 10;
      const hitH = this.dirY !== 0 ? this.attackRange : this.h + 10;

      const hitX = this.x + (this.dirX * (this.w / 2 + hitW / 2));
      const hitY = this.y + (this.dirY * (this.h / 2 + hitH / 2));

      // Check enemies
      for (const e of enemies) {
        if (!e.active) continue;
        if (aabbIntersect(hitX - hitW / 2, hitY - hitH / 2, hitW, hitH, e.x - e.w / 2, e.y - e.h / 2, e.w, e.h)) {
          e.hit(25 + Math.floor(Math.random() * 10), this.dirX, this.dirY);
        }
      }
    }

    takeDamage(dmg: number) {
      this.hp = Math.max(0, this.hp - dmg);
      spawnParticles(this.x, this.y, [255, 50, 50], 10, 4);
      damageTexts.push(new DamageText(this.x, this.y - 20, dmg, [255, 50, 50]));
    }

    draw() {
      p.push();
      p.translate(this.x, this.y);

      // Shadow
      p.noStroke();
      p.fill(0, 50);
      p.ellipse(0, this.h / 2, this.w, 10);

      // Body
      p.fill(50, 150, 255);
      p.rectMode(p.CENTER);
      p.rect(0, 0, this.w, this.h, 6);

      // Facing indicator / Head
      p.fill(255);
      p.circle(this.dirX * 6, this.dirY * 6 - 4, 12);

      // Sword Draw
      if (this.isAttacking) {
        p.stroke(220);
        p.strokeWeight(4);

        // Arc swing math
        const progress = this.attackTimer / this.attackDuration;
        const angleBase = Math.atan2(this.dirY, this.dirX);
        const swingAngle = p.map(progress, 0, 1, -Math.PI / 2, Math.PI / 2) + angleBase;

        const swordLen = 30;
        const sx = Math.cos(swingAngle) * swordLen;
        const sy = Math.sin(swingAngle) * swordLen;

        p.line(0, 0, sx, sy);

        // Whoosh trail
        p.noStroke();
        p.fill(255, 255, 255, 150 * (1 - progress));
        p.circle(sx, sy, 10);
      }

      p.pop();
    }
  }

  class Enemy {
    x: number;
    y: number;
    w: number = 28;
    h: number = 28;
    speed: number = 1.5;
    maxHp: number = 80;
    hp: number = 80;
    active: boolean = true;

    vx: number = 0;
    vy: number = 0;
    stateTimer: number = 0;
    hitCooldown: number = 0;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.pickDirection();
    }

    pickDirection() {
      const angle = p.random(p.TWO_PI);
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
      this.stateTimer = 60 + p.random(60);
    }

    update() {
      if (this.hitCooldown > 0) {
        this.hitCooldown--;
        // Knockback drift
        this.moveX(this.vx * 1.5);
        this.moveY(this.vy * 1.5);
        this.vx *= 0.9;
        this.vy *= 0.9;
      } else {
        // Wander
        this.stateTimer--;
        if (this.stateTimer <= 0) {
          this.pickDirection();
        }

        // Move and bounce
        const collidedX = !this.moveX(this.vx);
        const collidedY = !this.moveY(this.vy);

        if (collidedX) this.vx *= -1;
        if (collidedY) this.vy *= -1;

        // Player collision
        if (aabbIntersect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h, player.x - player.w / 2, player.y - player.h / 2, player.w, player.h)) {
          // Bump player
          const angle = Math.atan2(player.y - this.y, player.x - this.x);
          player.x += Math.cos(angle) * 15;
          player.y += Math.sin(angle) * 15;
          player.takeDamage(10);
          this.pickDirection();
        }
      }
    }

    moveX(dx: number): boolean {
      const newX = this.x + dx;
      if (!isWall(newX - this.w / 2, this.y - this.h / 2) &&
        !isWall(newX + this.w / 2, this.y - this.h / 2) &&
        !isWall(newX - this.w / 2, this.y + this.h / 2) &&
        !isWall(newX + this.w / 2, this.y + this.h / 2)) {
        this.x = newX;
        return true;
      }
      return false;
    }

    moveY(dy: number): boolean {
      const newY = this.y + dy;
      if (!isWall(this.x - this.w / 2, newY - this.h / 2) &&
        !isWall(this.x + this.w / 2, newY - this.h / 2) &&
        !isWall(this.x - this.w / 2, newY + this.h / 2) &&
        !isWall(this.x + this.w / 2, newY + this.h / 2)) {
        this.y = newY;
        return true;
      }
      return false;
    }

    hit(dmg: number, kbx: number, kby: number) {
      if (this.hitCooldown > 0) return;
      this.hp -= dmg;
      this.hitCooldown = 15;

      // Knockback vector
      this.vx = kbx * 4;
      this.vy = kby * 4;

      spawnParticles(this.x, this.y, [150, 255, 100], 8, 3.5);
      damageTexts.push(new DamageText(this.x, this.y - 20, dmg, [255, 255, 255]));

      if (this.hp <= 0) {
        this.active = false;
        spawnParticles(this.x, this.y, [100, 200, 50], 25, 6);
      }
    }

    draw() {
      p.push();
      p.translate(this.x, this.y);

      // Shadow
      p.noStroke();
      p.fill(0, 50);
      p.ellipse(0, this.h / 2, this.w, 8);

      // Squish animation while wandering
      const squish = this.hitCooldown > 0 ? 0 : Math.sin(p.frameCount * 0.2) * 2;

      // Slime body
      if (this.hitCooldown > 0) p.fill(255); // flash white
      else p.fill(100, 200, 80);

      p.rectMode(p.CENTER);
      p.rect(0, -squish, this.w, this.h + squish * 2, 8, 8, 2, 2);

      // Eyes
      p.fill(0);
      p.circle(-6, -4 - squish, 4);
      p.circle(6, -4 - squish, 4);

      // Health bar
      if (this.hp < this.maxHp) {
        p.fill(0);
        p.rect(0, -this.h - 5, this.w, 4);
        p.fill(0, 255, 0);
        p.rectMode(p.CORNER);
        p.rect(-this.w / 2, -this.h - 5 - 2, (this.hp / this.maxHp) * this.w, 4);
      }

      p.pop();
    }
  }

  class Particle {
    x: number; y: number; vx: number; vy: number;
    life: number; maxLife: number; color: number[]; size: number;
    constructor(x: number, y: number, c: number[], spd: number, life: number) {
      this.x = x; this.y = y;
      const a = p.random(p.TWO_PI);
      const v = p.random(spd * 0.3, spd);
      this.vx = Math.cos(a) * v; this.vy = Math.sin(a) * v;
      this.color = c; this.maxLife = life; this.life = life;
      this.size = p.random(4, 9);
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vx *= 0.9; this.vy *= 0.9; // friction
      this.life--;
    }
    draw() {
      if (this.life <= 0) return;
      p.push();
      p.noStroke();
      const alpha = p.map(this.life, 0, this.maxLife, 0, 255);
      p.fill(this.color[0], this.color[1], this.color[2], alpha);
      const s = p.map(this.life, 0, this.maxLife, 0, this.size);
      p.circle(this.x, this.y, s);
      p.pop();
    }
  }

  class DamageText {
    x: number; y: number; dmg: number; life: number = 40; color: number[];
    constructor(x: number, y: number, dmg: number, color: number[]) {
      this.x = x; this.y = y; this.dmg = dmg; this.color = color;
      // random pop
      this.x += p.random(-15, 15);
      this.y += p.random(-5, 5);
    }
    update() {
      this.y -= 1; // float up
      this.life--;
    }
    draw() {
      if (this.life <= 0) return;
      p.push();
      const alpha = p.map(this.life, 0, 40, 0, 255);
      p.fill(this.color[0], this.color[1], this.color[2], alpha);
      p.stroke(0, alpha);
      p.strokeWeight(2);
      p.textSize(16);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(this.dmg.toString(), this.x, this.y);
      p.pop();
    }
  }

  // ─── Draw Map ──────────────────────────────────────────────────────────────

  const drawMap = () => {
    // Determine visible bounds based on camera
    const startCol = Math.max(0, Math.floor(cameraX / TILE_SIZE) - 1);
    const endCol = Math.min(MAP_COLS, startCol + Math.ceil(W / TILE_SIZE) + 2);
    const startRow = Math.max(0, Math.floor(cameraY / TILE_SIZE) - 1);
    const endRow = Math.min(MAP_ROWS, startRow + Math.ceil(H / TILE_SIZE) + 2);

    for (let r = startRow; r < endRow; r++) {
      for (let c = startCol; c < endCol; c++) {
        const val = levelMap[r][c];
        const tx = c * TILE_SIZE;
        const ty = r * TILE_SIZE;

        if (val === 1) {
          // Wall
          p.fill(60, 60, 70);
          p.stroke(40);
          p.strokeWeight(2);
          p.rectMode(p.CORNER);
          p.rect(tx, ty, TILE_SIZE, TILE_SIZE);

          // Brick pattern line
          p.stroke(45);
          p.line(tx, ty + TILE_SIZE / 2, tx + TILE_SIZE, ty + TILE_SIZE / 2);
        } else {
          // Floor
          p.fill(100, 100, 110);
          p.noStroke();
          p.rectMode(p.CORNER);
          p.rect(tx, ty, TILE_SIZE, TILE_SIZE);

          // Subtle floor texture/dots
          p.fill(90, 90, 100);
          if ((r + c) % 2 === 0) p.circle(tx + TILE_SIZE / 2, ty + TILE_SIZE / 2, 4);
        }
      }
    }
  };

  // ─── Setup & Loop ──────────────────────────────────────────────────────────

  p.setup = () => {
    p.createCanvas(W, H);

    // Spawn Player
    player = new Player(TILE_SIZE * 2.5, TILE_SIZE * 3.5);

    // Spawn some enemies
    const spawns = [
      { c: 12, r: 6 }, { c: 15, r: 6 }, { c: 20, r: 12 },
      { c: 24, r: 4 }, { c: 8, r: 15 }, { c: 15, r: 16 }
    ];
    spawns.forEach(sp => {
      enemies.push(new Enemy(sp.c * TILE_SIZE + TILE_SIZE / 2, sp.r * TILE_SIZE + TILE_SIZE / 2));
    });
  };

  p.draw = () => {
    p.background(20);

    // Update Player
    player.update();

    // Camera follow player with lerp smoothing
    const targetCamX = player.x - W / 2;
    const targetCamY = player.y - H / 2;

    // Clamp camera to map bounds
    const maxCamX = MAP_COLS * TILE_SIZE - W;
    const maxCamY = MAP_ROWS * TILE_SIZE - H;

    const clampedCamX = p.constrain(targetCamX, 0, maxCamX);
    const clampedCamY = p.constrain(targetCamY, 0, maxCamY);

    cameraX += (clampedCamX - cameraX) * 0.1;
    cameraY += (clampedCamY - cameraY) * 0.1;

    // Begin World Space
    p.push();
    p.translate(-cameraX, -cameraY);

    drawMap();

    // Update Entities
    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].update();
      if (!enemies[i].active) enemies.splice(i, 1);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      if (particles[i].life <= 0) particles.splice(i, 1);
    }

    for (let i = damageTexts.length - 1; i >= 0; i--) {
      damageTexts[i].update();
      if (damageTexts[i].life <= 0) damageTexts.splice(i, 1);
    }

    // Sort draw order by Y (simple depth/Z-sorting)
    const drawables: any[] = [player, ...enemies, ...particles, ...damageTexts];
    // Particles and text render on top, entities sort by Y
    drawables.sort((a, b) => {
      if (a instanceof Particle || a instanceof DamageText) return 1;
      if (b instanceof Particle || b instanceof DamageText) return -1;
      return a.y - b.y;
    });

    for (const d of drawables) d.draw();

    p.pop();
    // End World Space

    // HUD / UI (Screen Space)
    p.push();
    // Health bar
    p.fill(50);
    p.rect(20, 20, 200, 20, 10);
    p.fill(255, 50, 50);
    p.rect(20, 20, (player.hp / player.maxHp) * 200, 20, 10);

    p.fill(255);
    p.textSize(16);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(`HP: ${player.hp} / ${player.maxHp}`, 230, 30);

    if (enemies.length === 0) {
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(48);
      p.fill(255, 200, 50);
      p.text("DUNGEON CLEARED", W / 2, H / 2);
    } else if (player.hp <= 0) {
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(48);
      p.fill(255, 50, 50);
      p.text("YOU DIED", W / 2, H / 2);
    }
    p.pop();
  };
};

export function mountRpg(container?: HTMLElement) {
  return new p5(sketch, container);
}
