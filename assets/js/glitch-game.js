/**
 * TAVRICON — "Quantum ROAS Runner" Arcade Engine
 * An interactive cyberpunk canvas mini-game built for HTTP error status pages (404, 502, 500).
 * Features zero external dependencies, 60FPS fluid physics, synthesized Web Audio FX, 
 * touch/mobile support, particle systems, and persistent High Score tracking.
 */

(function () {
  'use strict';

  class QuantumRunner {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.width = 720;
      this.height = 320;
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      // Audio engine reference or local synth
      this.audioCtx = null;
      this.soundEnabled = localStorage.getItem('tavricon_sound_active') !== 'false';

      // Game state
      this.state = 'IDLE'; // 'IDLE', 'PLAYING', 'GAMEOVER'
      this.score = 0;
      this.highScore = parseInt(localStorage.getItem('tavricon_roas_highscore') || '0', 10);
      this.speed = 5.5;
      this.gravity = 0.65;
      this.distance = 0;
      this.perkUnlocked = false;

      // Player setup
      this.player = {
        x: 70,
        y: 230,
        baseY: 230,
        w: 36,
        h: 36,
        vy: 0,
        isGrounded: true,
        jumpsLeft: 2,
        isDucking: false,
        trail: [],
        shieldTime: 0
      };

      // Entities
      this.obstacles = [];
      this.collectibles = [];
      this.particles = [];
      this.gridOffset = 0;
      this.spawnTimer = 0;
      this.collectibleTimer = 0;

      // Input handlers
      this.keys = {};
      this.bindEvents();
      this.updateScoreUI();

      // Start render loop
      this.lastTime = performance.now();
      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    initAudio() {
      if (!this.audioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) this.audioCtx = new AudioClass();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    }

    playSynth(type) {
      if (!this.soundEnabled) return;
      this.initAudio();
      if (!this.audioCtx || this.audioCtx.state !== 'running') return;

      const t = this.audioCtx.currentTime;
      try {
        if (type === 'jump') {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(260, t);
          osc.frequency.exponentialRampToValueAtTime(740, t + 0.16);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.17);
        } else if (type === 'collect') {
          // Double crystal chime
          const notes = [587.33, 880];
          notes.forEach((freq, idx) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + idx * 0.05);
            gain.gain.setValueAtTime(0.25, t + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.14);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(t + idx * 0.05);
            osc.stop(t + idx * 0.05 + 0.15);
          });
        } else if (type === 'shield') {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(440, t);
          osc.frequency.linearRampToValueAtTime(880, t + 0.25);
          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.29);
        } else if (type === 'crash') {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(160, t);
          osc.frequency.exponentialRampToValueAtTime(40, t + 0.35);
          gain.gain.setValueAtTime(0.35, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.36);
        }
      } catch (e) {}
    }

    bindEvents() {
      const onKeyDown = (e) => {
        if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
          e.preventDefault();
          this.handleJump();
        } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
          e.preventDefault();
          this.handleDuck(true);
        } else if (e.code === 'KeyR') {
          if (this.state === 'GAMEOVER') this.start();
        }
      };

      const onKeyUp = (e) => {
        if (['ArrowDown', 'KeyS'].includes(e.code)) {
          this.handleDuck(false);
        }
      };

      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);

      // Canvas click / tap
      this.canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.initAudio();
        if (this.state !== 'PLAYING') {
          this.start();
        } else {
          this.handleJump();
        }
      });

      // HTML buttons (if available in DOM)
      const startBtn = document.getElementById('game-start-btn');
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          this.initAudio();
          this.start();
        });
      }

      const jumpBtn = document.getElementById('game-jump-btn');
      if (jumpBtn) {
        jumpBtn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.initAudio();
          if (this.state !== 'PLAYING') this.start();
          else this.handleJump();
        });
      }

      const slideBtn = document.getElementById('game-slide-btn');
      if (slideBtn) {
        slideBtn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.handleDuck(true);
        });
        slideBtn.addEventListener('pointerup', (e) => {
          e.preventDefault();
          this.handleDuck(false);
        });
        slideBtn.addEventListener('pointerleave', () => this.handleDuck(false));
      }
    }

    start() {
      this.state = 'PLAYING';
      this.score = 0;
      this.speed = 5.8;
      this.distance = 0;
      this.obstacles = [];
      this.collectibles = [];
      this.particles = [];
      this.perkUnlocked = false;

      this.player.y = this.player.baseY;
      this.player.vy = 0;
      this.player.isGrounded = true;
      this.player.jumpsLeft = 2;
      this.player.isDucking = false;
      this.player.trail = [];
      this.player.shieldTime = 0;

      this.updateScoreUI();
      const perkBanner = document.getElementById('game-perk-banner');
      if (perkBanner) perkBanner.style.display = 'none';
      this.playSynth('jump');
    }

    handleJump() {
      if (this.state === 'IDLE' || this.state === 'GAMEOVER') {
        this.start();
        return;
      }
      if (this.player.jumpsLeft > 0) {
        this.player.vy = this.player.jumpsLeft === 2 ? -11.5 : -10;
        this.player.isGrounded = false;
        this.player.jumpsLeft--;
        this.player.isDucking = false;
        this.createJumpParticles(this.player.x + 18, this.player.y + 36);
        this.playSynth('jump');
      }
    }

    handleDuck(isDucking) {
      if (this.state !== 'PLAYING') return;
      this.player.isDucking = isDucking;
      if (isDucking && !this.player.isGrounded) {
        // Fast drop
        this.player.vy += 8;
      }
    }

    createJumpParticles(x, y) {
      for (let i = 0; i < 9; i++) {
        this.particles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * -2 - 1,
          color: '#00F2FE',
          alpha: 1,
          size: Math.random() * 3 + 2,
          life: 20
        });
      }
    }

    createCollectParticles(x, y, color) {
      for (let i = 0; i < 14; i++) {
        this.particles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 7,
          vy: (Math.random() - 0.5) * 7,
          color: color || '#38BDF8',
          alpha: 1,
          size: Math.random() * 4 + 2,
          life: 25
        });
      }
    }

    createExplosion(x, y) {
      for (let i = 0; i < 28; i++) {
        this.particles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 9,
          vy: (Math.random() - 0.5) * 9,
          color: Math.random() > 0.5 ? '#EF4444' : '#F59E0B',
          alpha: 1,
          size: Math.random() * 5 + 3,
          life: 35
        });
      }
    }

    gameOver() {
      this.state = 'GAMEOVER';
      this.createExplosion(this.player.x + 18, this.player.y + 18);
      this.playSynth('crash');

      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('tavricon_roas_highscore', this.highScore.toString());
      }
      this.updateScoreUI();

      if (this.score >= 500 && !this.perkUnlocked) {
        this.perkUnlocked = true;
        const perkBanner = document.getElementById('game-perk-banner');
        if (perkBanner) perkBanner.style.display = 'flex';
      }
    }

    updateScoreUI() {
      const scoreEl = document.getElementById('game-current-score');
      if (scoreEl) scoreEl.textContent = `${this.score} ROAS`;

      const highEl = document.getElementById('game-high-score');
      if (highEl) highEl.textContent = `${this.highScore} ROAS`;
    }

    spawnEntities() {
      this.spawnTimer++;
      this.collectibleTimer++;

      // Gradually increase speed
      this.speed = Math.min(13, 5.8 + this.distance * 0.0018);

      // Obstacle spawner (adaptive spacing)
      const minSpawnGap = Math.max(55, Math.floor(110 - this.speed * 4));
      if (this.spawnTimer > minSpawnGap && Math.random() < 0.35) {
        this.spawnTimer = 0;
        const type = Math.random();
        if (type < 0.45) {
          // Low 404 Route Barrier
          this.obstacles.push({
            x: this.width + 30,
            y: 228,
            w: 32,
            h: 38,
            type: '404_SPIKE',
            label: '404'
          });
        } else if (type < 0.75) {
          // Low double hurdle
          this.obstacles.push({
            x: this.width + 30,
            y: 220,
            w: 52,
            h: 46,
            type: '502_WALL',
            label: '502'
          });
        } else {
          // Floating Drone (jump over or duck under)
          this.obstacles.push({
            x: this.width + 30,
            y: 165,
            w: 38,
            h: 32,
            type: 'GLITCH_DRONE',
            label: 'LAG'
          });
        }
      }

      // Collectible spawner
      if (this.collectibleTimer > 60 && Math.random() < 0.4) {
        this.collectibleTimer = 0;
        const isShield = Math.random() < 0.08;
        const isBonus = Math.random() < 0.28;
        const cy = Math.random() > 0.5 ? 220 : 155;

        this.collectibles.push({
          x: this.width + 20,
          y: cy,
          w: 22,
          h: 22,
          type: isShield ? 'SHIELD' : isBonus ? 'SUPER_ORB' : 'ROAS_ORB',
          label: isShield ? '🛡️' : isBonus ? '5X' : '+10',
          floatOffset: Math.random() * Math.PI
        });
      }
    }

    updatePhysics() {
      this.distance += this.speed;
      this.gridOffset = (this.gridOffset + this.speed) % 40;

      // Player vertical physics
      if (!this.player.isGrounded) {
        this.player.vy += this.gravity;
        this.player.y += this.player.vy;

        if (this.player.y >= this.player.baseY) {
          this.player.y = this.player.baseY;
          this.player.vy = 0;
          this.player.isGrounded = true;
          this.player.jumpsLeft = 2;
        }
      }

      // Player trail update
      this.player.trail.unshift({
        x: this.player.x,
        y: this.player.y + (this.player.isDucking ? 14 : 0),
        h: this.player.isDucking ? 22 : 36
      });
      if (this.player.trail.length > 7) this.player.trail.pop();

      // Shield countdown
      if (this.player.shieldTime > 0) this.player.shieldTime--;

      // Hitbox calculations
      const pw = this.player.w - 8;
      const ph = this.player.isDucking ? 20 : this.player.h - 6;
      const px = this.player.x + 4;
      const py = this.player.y + (this.player.isDucking ? 16 : 4);

      // Update and collide obstacles
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.x -= this.speed;

        // Collision check
        const collides = (
          px < obs.x + obs.w &&
          px + pw > obs.x &&
          py < obs.y + obs.h &&
          py + ph > obs.y
        );

        if (collides) {
          if (this.player.shieldTime > 0) {
            // Shield absorbs crash
            this.player.shieldTime = 0;
            this.createExplosion(obs.x + obs.w / 2, obs.y + obs.h / 2);
            this.obstacles.splice(i, 1);
            this.playSynth('crash');
            continue;
          } else {
            this.gameOver();
            return;
          }
        }

        // Clean out of bounds
        if (obs.x + obs.w < -20) {
          this.obstacles.splice(i, 1);
          this.score += 5;
          this.updateScoreUI();
        }
      }

      // Update and collide collectibles
      for (let i = this.collectibles.length - 1; i >= 0; i--) {
        const c = this.collectibles[i];
        c.x -= this.speed;
        c.y += Math.sin(this.distance * 0.05 + c.floatOffset) * 0.7;

        // Collect check
        const picked = (
          px < c.x + c.w &&
          px + pw > c.x &&
          py < c.y + c.h &&
          py + ph > c.y
        );

        if (picked) {
          if (c.type === 'SHIELD') {
            this.player.shieldTime = 240; // ~4 seconds
            this.playSynth('shield');
            this.createCollectParticles(c.x, c.y, '#8B5CF6');
          } else if (c.type === 'SUPER_ORB') {
            this.score += 50;
            this.playSynth('collect');
            this.createCollectParticles(c.x, c.y, '#10B981');
          } else {
            this.score += 15;
            this.playSynth('collect');
            this.createCollectParticles(c.x, c.y, '#00F2FE');
          }
          this.collectibles.splice(i, 1);
          this.updateScoreUI();
          continue;
        }

        if (c.x + c.w < -20) {
          this.collectibles.splice(i, 1);
        }
      }

      // Particle physics
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 1 / p.life;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      // 1. Deep Space Cyber Grid Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
      bgGrad.addColorStop(0, '#030712');
      bgGrad.addColorStop(0.7, '#071026');
      bgGrad.addColorStop(1, '#02050E');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, this.width, this.height);

      // Starfield / matrix dots
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      for (let i = 0; i < 18; i++) {
        const sx = (i * 65 - (this.distance * 0.3) % this.width + this.width) % this.width;
        const sy = (i * 37) % (this.height - 90);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // 2. Horizon & Ground Plane
      const groundY = 266;
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(this.width, groundY);
      ctx.stroke();

      // Glowing cyber ground line
      ctx.shadowColor = '#00F2FE';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#00F2FE';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(this.width, groundY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Perspective grid lines beneath ground
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.35)';
      ctx.lineWidth = 1;
      for (let x = -this.gridOffset; x < this.width; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x - 28, this.height);
        ctx.stroke();
      }

      // 3. Player Light Trail
      for (let i = 0; i < this.player.trail.length; i++) {
        const t = this.player.trail[i];
        const alpha = (1 - i / this.player.trail.length) * 0.35;
        ctx.fillStyle = `rgba(0, 242, 254, ${alpha})`;
        ctx.fillRect(t.x - i * 3.5, t.y, 28, t.h);
      }

      // 4. Render Collectibles
      this.collectibles.forEach((c) => {
        ctx.save();
        ctx.translate(c.x + c.w / 2, c.y + c.h / 2);

        if (c.type === 'SHIELD') {
          // Violet shield ring
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 14;
          ctx.strokeStyle = '#A78BFA';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 11, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '10px "Space Grotesk", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', 0, 0);
        } else if (c.type === 'SUPER_ORB') {
          // Emerald Super Crystal
          ctx.shadowColor = '#10B981';
          ctx.shadowBlur = 15;
          ctx.fillStyle = '#10B981';
          ctx.beginPath();
          ctx.moveTo(0, -11);
          ctx.lineTo(10, 0);
          ctx.lineTo(0, 11);
          ctx.lineTo(-10, 0);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('5X', 0, 0);
        } else {
          // Cyan ROAS Orb
          ctx.shadowColor = '#00F2FE';
          ctx.shadowBlur = 14;
          ctx.fillStyle = '#00F2FE';
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#071026';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('+', 0, 0);
        }
        ctx.restore();
      });

      // 5. Render Obstacles
      this.obstacles.forEach((obs) => {
        ctx.save();
        if (obs.type === 'GLITCH_DRONE') {
          // Floating red glitch drone
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 16;
          ctx.fillStyle = '#EF4444';
          ctx.fillRect(obs.x, obs.y + 4, obs.w, obs.h - 8);
          // Scanner visor
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(obs.x + 4, obs.y + 10, obs.w - 8, 4);
          ctx.font = 'bold 8px monospace';
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.fillText(obs.label, obs.x + obs.w / 2, obs.y + 20);
        } else {
          // Red/Orange Neon Cyber Barrier
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 14;
          const grad = ctx.createLinearGradient(obs.x, obs.y, obs.x, obs.y + obs.h);
          grad.addColorStop(0, '#F59E0B');
          grad.addColorStop(1, '#DC2626');
          ctx.fillStyle = grad;
          ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

          // Diagonal caution stripes
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.lineWidth = 2;
          for (let s = -10; s < obs.h + 20; s += 10) {
            ctx.beginPath();
            ctx.moveTo(obs.x, obs.y + s);
            ctx.lineTo(obs.x + obs.w, obs.y + s - 10);
            ctx.stroke();
          }

          // Badge tag
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(obs.label, obs.x + obs.w / 2, obs.y - 4);
        }
        ctx.restore();
      });

      // 6. Render Particles
      this.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
      });

      // 7. Render Player (TAVRICON Quantum Node)
      if (this.state !== 'GAMEOVER') {
        ctx.save();
        const px = this.player.x;
        const py = this.player.y + (this.player.isDucking ? 14 : 0);
        const pw = this.player.w;
        const ph = this.player.isDucking ? 22 : this.player.h;

        // Shield aura
        if (this.player.shieldTime > 0) {
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.5 + Math.sin(this.distance * 0.2) * 0.4})`;
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 20;
          ctx.lineWidth = 3;
          ctx.strokeRect(px - 6, py - 6, pw + 12, ph + 12);
        }

        // Outer Neon Glow
        ctx.shadowColor = '#00F2FE';
        ctx.shadowBlur = 18;

        // Player Core Gradient
        const pGrad = ctx.createLinearGradient(px, py, px + pw, py + ph);
        pGrad.addColorStop(0, '#FFFFFF');
        pGrad.addColorStop(0.3, '#00F2FE');
        pGrad.addColorStop(0.8, '#2563EB');
        pGrad.addColorStop(1, '#1D4ED8');
        ctx.fillStyle = pGrad;

        // Rounded chamfer core
        ctx.beginPath();
        const r = 6;
        ctx.moveTo(px + r, py);
        ctx.lineTo(px + pw - r, py);
        ctx.quadraticCurveTo(px + pw, py, px + pw, py + r);
        ctx.lineTo(px + pw, py + ph - r);
        ctx.quadraticCurveTo(px + pw, py + ph, px + pw - r, py + ph);
        ctx.lineTo(px + r, py + ph);
        ctx.quadraticCurveTo(px, py + ph, px, py + ph - r);
        ctx.lineTo(px, py + r);
        ctx.quadraticCurveTo(px, py, px + r, py);
        ctx.closePath();
        ctx.fill();

        // Inner telemetry eye / crosshair
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(px + pw - 10, py + ph / 2 - 2, 4, 4);

        ctx.restore();
      }

      // 8. HUD & Overlays
      if (this.state === 'IDLE') {
        ctx.save();
        ctx.fillStyle = 'rgba(2, 6, 23, 0.7)';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#00F2FE';
        ctx.shadowColor = '#00F2FE';
        ctx.shadowBlur = 14;
        ctx.font = 'bold 20px "Space Grotesk", sans-serif';
        ctx.fillText('QUANTUM ROAS RUNNER', this.width / 2, this.height / 2 - 28);

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '13px monospace';
        ctx.fillText('DODGE 404 GLITCHES • COLLECT ROAS CONVERSIONS', this.width / 2, this.height / 2);

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 12px "Space Grotesk", sans-serif';
        ctx.fillText('[ PRESS SPACE OR TAP SCREEN TO LAUNCH ]', this.width / 2, this.height / 2 + 34);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '11px monospace';
        ctx.fillText('CONTROLS: SPACE / ↑ = JUMP (DOUBLE JUMP) • ↓ = FAST DUCK', this.width / 2, this.height / 2 + 60);
        ctx.restore();
      } else if (this.state === 'GAMEOVER') {
        ctx.save();
        ctx.fillStyle = 'rgba(3, 7, 18, 0.82)';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#EF4444';
        ctx.shadowColor = '#EF4444';
        ctx.shadowBlur = 18;
        ctx.font = 'bold 24px "Space Grotesk", sans-serif';
        ctx.fillText('DESYNC DETECTED: CONNECTION SEVERED', this.width / 2, this.height / 2 - 34);

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(`SESSION ROAS: ${this.score}X  |  RECORD: ${this.highScore}X`, this.width / 2, this.height / 2);

        ctx.fillStyle = '#00F2FE';
        ctx.font = 'bold 13px "Space Grotesk", sans-serif';
        ctx.fillText('[ PRESS SPACE OR "R" TO RE-INITIALIZE ENGINE ]', this.width / 2, this.height / 2 + 36);

        if (this.score >= 500) {
          ctx.fillStyle = '#10B981';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('★ 500+ MILESTONE ACHIEVED: SECRET PROPOSAL PERK UNLOCKED! ★', this.width / 2, this.height / 2 + 64);
        }
        ctx.restore();
      }
    }

    loop(timestamp) {
      const dt = timestamp - this.lastTime;
      this.lastTime = timestamp;

      if (this.state === 'PLAYING') {
        this.spawnEntities();
        this.updatePhysics();
      }

      this.render();
      requestAnimationFrame(this.loop);
    }
  }

  // Initialize once DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('glitch-game-canvas')) {
      window.tavriconRunner = new QuantumRunner('glitch-game-canvas');
    }
  });
})();
