// 实体定义：植物与僵尸
(function(){
  window.Entities = {};

  class Plant{
    constructor(row,col){
      this.row=row; this.col=col; this.hp=100; this.cooldown=0; this.fireRate=100; // ticks
    }
    update(game){
      if(this.cooldown>0) this.cooldown--;
    }
    draw(ctx,x,y,w,h){
      ctx.fillStyle='#88b04b'; ctx.fillRect(x+4,y+4,w-8,h-8);
    }
  }

  class Shooter extends Plant{
    constructor(row,col){super(row,col); this.cost=50; this.fireRate=90; this.hp=80}
    update(game){
      super.update(game);
      if(this.cooldown<=0){
        // 查找本行最近敌人
        const enemies = game.enemies.filter(e=>e.row===this.row && e.col>this.col);
        if(enemies.length){
          game.bullets.push({x:this.col*game.cellW+game.cellW/2, y:this.row*game.cellH+game.cellH/2, vx:4, damage:25});
          this.cooldown=this.fireRate;
        }
      }
    }
    draw(ctx,x,y,w,h){
      ctx.fillStyle='#ffb86b'; ctx.fillRect(x+6,y+10,w-12,h-20);
      ctx.fillStyle='#7b4913'; ctx.beginPath(); ctx.arc(x+w-16,y+h/2,6,0,Math.PI*2); ctx.fill();
    }
  }

  class Blocker extends Plant{
    constructor(row,col){super(row,col); this.cost=25; this.hp=200}
    draw(ctx,x,y,w,h){
      ctx.fillStyle='#9ad3bc'; ctx.fillRect(x+6,y+6,w-12,h-12);
      ctx.fillStyle='#4a4a4a'; ctx.fillRect(x+12,y+h-14,w-24,8);
    }
  }

  class Producer extends Plant{
    constructor(row,col){super(row,col); this.cost=75; this.produceTimer=0; this.produceRate=600}
    update(game){
      super.update(game);
      this.produceTimer++;
      if(this.produceTimer>this.produceRate){ this.produceTimer=0; game.qi+=25; }
    }
    draw(ctx,x,y,w,h){
      ctx.fillStyle='#ffd1dc'; ctx.fillRect(x+6,y+6,w-12,h-12);
      ctx.fillStyle='#b30000'; ctx.beginPath(); ctx.arc(x+w/2,y+h/2,10,0,Math.PI*2); ctx.fill();
    }
  }

  class Enemy{
    constructor(row){ this.row=row; this.x=900; this.hp=100; this.speed=0.3; this.width=40; this.col=Infinity }
    update(game){ this.x -= this.speed; }
    draw(ctx,cellW,cellH){
      const y=this.row*cellH+6; ctx.fillStyle='#6b6b6b'; ctx.fillRect(this.x, y, this.width, cellH-12);
      ctx.fillStyle='black'; ctx.fillText(Math.floor(this.hp), this.x+6, y+12);
    }
  }

  window.Entities.Plant=Plant;
  window.Entities.Shooter=Shooter;
  window.Entities.Blocker=Blocker;
  window.Entities.Producer=Producer;
  window.Entities.Enemy=Enemy;
})();
