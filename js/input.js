// 输入处理：选择种子与在画布上放置
(function(){
  const shop = document.querySelectorAll('.seed');
  let selected = null;
  shop.forEach(el=>{
    el.addEventListener('click', ()=>{
      shop.forEach(s=>s.classList.remove('selected'));
      el.classList.add('selected');
      selected = el.dataset.type;
      window.Game && (window.Game.selectedPlant = selected);
    });
  });

  const canvas = document.getElementById('gameCanvas');
  function getPos(evt){
    const r = canvas.getBoundingClientRect();
    const touch = evt.touches ? evt.touches[0] : evt;
    return {x: (touch.clientX - r.left) * (canvas.width / r.width), y: (touch.clientY - r.top) * (canvas.height / r.height)};
  }

  canvas.addEventListener('click', (e)=>{ const p=getPos(e); window.Game && window.Game.tryPlace(p.x,p.y); });
  canvas.addEventListener('touchstart', (e)=>{ e.preventDefault(); const p=getPos(e); window.Game && window.Game.tryPlace(p.x,p.y); }, {passive:false});

  // start/restart buttons
  document.getElementById('startBtn').addEventListener('click', ()=>{ window.Game && window.Game.start(); });
  document.getElementById('restartBtn').addEventListener('click', ()=>{ window.Game && window.Game.reset(); });
})();
