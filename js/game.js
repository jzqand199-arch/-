// 游戏主逻辑
(function(){
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  function Game(){
    this.rows = 5; this.cols = 9; this.cellW = canvas.width/this.cols; this.cellH = canvas.height/this.rows;
    this.plants = []; // 2D grid null or plant
    for(let r=0;r<this.rows;r++){ this.plants[r]=Array(this.cols).fill(null); }
    this.enemies = [];
    this.bullets = [];
    this.qi = 50;
    this.score = 0;
    this.ticks = 0;
    this.running = false;
    this.selectedPlant = null;

    this.spawnInterval = 400; // ticks
    this.lastSpawn = 0;

    this.cellW = this.cellW; this.cellH = this.cellH;

    this.updateHud();
  }

  Game.prototype.updateHud = function(){ document.getElementById('qi').textContent = '气: '+this.qi; document.getElementById('score').textContent = '分数: '+this.score; }

  Game.prototype.start = function(){ this.running = true; }
  Game.prototype.reset = function(){
    this.plants = []; this.enemies=[]; this.bullets=[]; this.qi=50; this.score=0; this.ticks=0; this.running=false;
    for(let r=0;r<this.rows;r++){ this.plants[r]=Array(this.cols).fill(null); }
    this.updateHud();
  }

  Game.prototype.tryPlace = function(x,y){
    const col = Math.floor(x/this.cellW); const row = Math.floor(y/this.cellH);
    if(row<0||row>=this.rows||col<0||col>=this.cols) return;
    if(this.plants[row][col]) return; // already
    let PlantClass = null; let cost = 0;
    if(this.selectedPlant==='shooter'){ PlantClass = window.Entities.Shooter; cost=50 }
    if(this.selectedPlant==='blocker'){ PlantClass = window.Entities.Blocker; cost=25 }
    if(this.selectedPlant==='producer'){ PlantClass = window.Entities.Producer; cost=75 }
    if(!PlantClass) return;
    if(this.qi < cost) return;
    this.qi -= cost; this.plants[row][col]= new PlantClass(row,col); this.updateHud();
  }

  Game.prototype.loop = function(){
    this.ticks++;
    if(this.running){
      // spawn
      if(this.ticks - this.lastSpawn > this.spawnInterval){ this.lastSpawn=this.ticks; const r = Math.floor(Math.random()*this.rows); this.enemies.push(new window.Entities.Enemy(r)); }

      // update plants
      for(let r=0;r<this.rows;r++){
        for(let c=0;c<this.cols;c++){
          const p=this.plants[r][c]; if(p){ p.update(this); if(p.hp<=0) this.plants[r][c]=null }
        }
      }

      // update enemies
      for(let e of this.enemies){ e.update(this); }

      // bullets
      for(let b of this.bullets){ b.x += b.vx; // check hit
        for(let e of this.enemies){ const cy = e.row*this.cellH+this.cellH/2; if(Math.abs(b.y-cy)<this.cellH/2 && b.x > e.x && b.x < e.x+e.width){ e.hp -= b.damage; b._hit=true; if(e.hp<=0){ this.score += 10; this.qi += 10; } break; } }
      }
      this.bullets = this.bullets.filter(b=>!b._hit && b.x < canvas.width+50);

      // cleanup dead enemies
      this.enemies = this.enemies.filter(e=>{ if(e.hp<=0) return false; if(e.x < 0) { this.running=false; alert('失败：僵尸突破防线！'); return false;} return true; });

      // simple collision: enemies attack plants when overlapping
      for(let e of this.enemies){
        const col = Math.floor(e.x/this.cellW);
        const row = e.row;
        if(col>=0 && col < this.cols){
          const p = this.plants[row][col];
          if(p){ p.hp -= 0.2; e.speed = 0.02; } else { e.speed = 0.3; }
        }
      }

    }
    this.draw();
    this.updateHud();
    requestAnimationFrame(()=>this.loop());
  }

  Game.prototype.draw = function(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // grid
    for(let r=0;r<this.rows;r++){
      for(let c=0;c<this.cols;c++){
        const x=c*this.cellW, y=r*this.cellH, w=this.cellW, h=this.cellH;
        ctx.strokeStyle='rgba(0,0,0,0.08)'; ctx.strokeRect(x,y,w,h);
        const p=this.plants[r][c]; if(p){ p.draw(ctx,x,y,w,h); ctx.fillStyle='black'; ctx.fillText(Math.floor(p.hp), x+6, y+12); }
      }
    }

    // enemies
    for(let e of this.enemies){ e.draw(ctx,this.cellW,this.cellH); }
    // bullets
    for(let b of this.bullets){ ctx.fillStyle='rgba(30,30,30,0.9)'; ctx.beginPath(); ctx.arc(b.x,b.y,5,0,Math.PI*2); ctx.fill(); }
  }

  // init
  const G = new Game(); window.Game = G; G.draw(); G.loop();
})();
