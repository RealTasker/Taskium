const MAPS = [
  {
    name:'City',
    bg:['#0d1b2e','#1a2744'],
    platforms:[
      {x:0,   y:520,w:800,h:20,t:'s'},
      {x:80,  y:390,w:160,h:14,t:'s'},
      {x:320, y:355,w:160,h:14,t:'s'},
      {x:560, y:390,w:160,h:14,t:'s'},
      {x:180, y:248,w:130,h:14,t:'s'},
      {x:490, y:248,w:130,h:14,t:'s'},
      {x:310, y:140,w:180,h:14,t:'s'},
      {x:30,  y:460,w:90, h:12,t:'p'},
      {x:680, y:460,w:90, h:12,t:'p'},
    ],
    bounces:[{x:388,y:507,w:34,h:13}],
    portals:[[[30,360],[750,360]]],
    spawns:[{x:80,y:470},{x:680,y:470},{x:340,y:108},{x:190,y:215}]
  },
  {
    name:'Jungle',
    bg:['#0a1f0e','#152e1a'],
    platforms:[
      {x:0,   y:520,w:800,h:20,t:'s'},
      {x:55,  y:415,w:110,h:14,t:'s'},
      {x:240, y:375,w:100,h:14,t:'s'},
      {x:460, y:375,w:100,h:14,t:'s'},
      {x:635, y:415,w:110,h:14,t:'s'},
      {x:150, y:290,w:130,h:12,t:'p'},
      {x:520, y:290,w:130,h:12,t:'p'},
      {x:315, y:208,w:170,h:14,t:'s'},
      {x:335, y:125,w:130,h:12,t:'p'},
      {x:0,   y:300,w:40, h:14,t:'s'},
      {x:760, y:300,w:40, h:14,t:'s'},
    ],
    bounces:[{x:90,y:507,w:34,h:13},{x:676,y:507,w:34,h:13}],
    portals:[[[20,487],[762,487]],[[400,175],[400,345]]],
    spawns:[{x:60,y:473},{x:700,y:473},{x:340,y:170},{x:165,y:256}]
  },
  {
    name:'Desert',
    bg:['#1e1200','#301d00'],
    platforms:[
      {x:0,   y:520,w:800,h:20,t:'s'},
      {x:95,  y:445,w:90, h:14,t:'s'},
      {x:615, y:445,w:90, h:14,t:'s'},
      {x:280, y:405,w:100,h:14,t:'s'},
      {x:420, y:405,w:100,h:14,t:'s'},
      {x:175, y:325,w:120,h:14,t:'s'},
      {x:505, y:325,w:120,h:14,t:'s'},
      {x:315, y:255,w:170,h:14,t:'s'},
      {x:345, y:162,w:110,h:14,t:'s'},
      {x:0,   y:385,w:70, h:12,t:'p'},
      {x:730, y:385,w:70, h:12,t:'p'},
    ],
    bounces:[{x:383,y:507,w:34,h:13},{x:195,y:507,w:34,h:13},{x:565,y:507,w:34,h:13}],
    portals:[],
    spawns:[{x:60,y:480},{x:720,y:480},{x:360,y:128},{x:295,y:370}]
  }
];

const PLAYER_COLORS = ['#1e90ff','#ff4757','#ffa502','#2ed573'];
const PLAYER_NAMES  = ['P1','P2','P3','P4'];
const GRAVITY = 0.58, JUMP = -13.2, SPEED = 4.4;
const PW = 32, PH = 36;
const TAG_COOLDOWN = 1200;
const CONTROLS = [
  {left:'a',right:'d',up:'w'},
  {left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp'},
  {left:'f',right:'h',up:'t'},
  {left:'j',right:'l',up:'i'},
];

let cfg = {players:2, map:0, time:120};
let G = null, raf = null, tmr = null;
const keys = {};
const saveStore = window.TaskGamesSave;

function saveTagProgress() {
  if (!saveStore) return;
  saveStore.save('tag', {
    cfg,
    screen: document.getElementById('result-screen').classList.contains('hidden') ? 'active' : 'result',
    timeLeft: G ? G.timeLeft : cfg.time,
  });
}

function applyTagConfig() {
  document.querySelectorAll('[data-p]').forEach(x => x.classList.toggle('active', +x.dataset.p === cfg.players));
  document.querySelectorAll('[data-t]').forEach(x => x.classList.toggle('active', +x.dataset.t === cfg.time));
  document.querySelectorAll('.map-thumb').forEach((thumb, i) => thumb.classList.toggle('active', i === cfg.map));
}

function loadTagProgress() {
  if (!saveStore) return;
  const data = saveStore.load('tag');
  if (!data || !data.cfg) return;
  cfg = {
    players: data.cfg.players || cfg.players,
    map: typeof data.cfg.map === 'number' ? data.cfg.map : cfg.map,
    time: data.cfg.time || cfg.time,
  };
}

document.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click',()=>{
  document.querySelectorAll('[data-p]').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); cfg.players = +b.dataset.p;
  saveTagProgress();
}));
document.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click',()=>{
  document.querySelectorAll('[data-t]').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); cfg.time = +b.dataset.t;
  saveTagProgress();
}));

const grid = document.getElementById('mapGrid');
MAPS.forEach((m,i)=>{
  const div = document.createElement('div');
  div.className = 'map-thumb' + (i===0?' active':'');
  const c = document.createElement('canvas');
  c.width=160; c.height=90;
  const ctx = c.getContext('2d');
  const sx=160/800, sy=90/540;
  ctx.fillStyle=m.bg[0]; ctx.fillRect(0,0,160,90);
  m.platforms.forEach(p=>{ ctx.fillStyle=p.t==='p'?'rgba(100,220,100,.55)':'#546e8a'; ctx.fillRect(p.x*sx,p.y*sy,p.w*sx,p.h*sy); });
  m.bounces.forEach(b=>{ ctx.fillStyle='#7c6fe0'; ctx.fillRect(b.x*sx,b.y*sy,b.w*sx,b.h*sy); });
  m.portals.forEach(pair=>{ ctx.fillStyle='#fd79a8'; ctx.fillRect((pair[0][0]-8)*sx,(pair[0][1]-14)*sy,16*sx,28*sy); ctx.fillStyle='#00cec9'; ctx.fillRect((pair[1][0]-8)*sx,(pair[1][1]-14)*sy,16*sx,28*sy); });
  div.appendChild(c);
  const lbl = document.createElement('div'); lbl.className='map-label'; lbl.textContent=m.name; div.appendChild(lbl);
  div.addEventListener('click',()=>{ document.querySelectorAll('.map-thumb').forEach(t=>t.classList.remove('active')); div.classList.add('active'); cfg.map=i; saveTagProgress(); });
  grid.appendChild(div);
});

document.getElementById('startBtn').addEventListener('click', doCountdown);
document.getElementById('rematchBtn').addEventListener('click', doCountdown);
document.getElementById('menuBtn').addEventListener('click', ()=>showScreen('menu'));

window.addEventListener('keydown', e=>{ keys[e.key]=true; keys[e.key.toLowerCase()]=true; e.preventDefault && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key) && e.preventDefault(); });
window.addEventListener('keyup',   e=>{ keys[e.key]=false; keys[e.key.toLowerCase()]=false; });

function doCountdown() {
  showScreen('countdown-screen');
  let n=3;
  const numEl = document.getElementById('countdown-num');
  const txtEl = document.getElementById('countdown-text');
  function tick() {
    numEl.textContent = n;
    txtEl.textContent = n > 0 ? 'Get Ready!' : 'GO!';
    numEl.style.animation='none'; void numEl.offsetWidth; numEl.style.animation='cdbounce .5s ease-out';
    if (n-- > 0) setTimeout(tick, 800);
    else setTimeout(startGame, 700);
  }
  tick();
}

function startGame() {
  showScreen('game-screen');
  const canvas = document.getElementById('gameCanvas');
  canvas.width = 800; canvas.height = 540;

  const map = MAPS[cfg.map];
  const players = Array.from({length:cfg.players},(_,i)=>{
    const sp = map.spawns[i]||{x:120+i*180,y:460};
    return {
      id:i, x:sp.x, y:sp.y, vx:0, vy:0, onGround:false,
      tagged:i===0, tagCooldown:0, color:PLAYER_COLORS[i], name:PLAYER_NAMES[i],
      flash:0, facingLeft:false,
    };
  });

  G = {
    players, map,
    timeLeft:cfg.time, running:true,
    particles:[],
    portals:map.portals.map(pair=>({ax:pair[0][0],ay:pair[0][1],bx:pair[1][0],by:pair[1][1],cd:0})),
    tagFlash:0,
  };

  updateHUD();
  saveTagProgress();
  clearInterval(tmr);
  tmr = setInterval(()=>{ if(!G||!G.running)return; G.timeLeft--; updateHUD(); saveTagProgress(); if(G.timeLeft<=0) endGame(); }, 1000);
  cancelAnimationFrame(raf);
  loop();
}

function loop() {
  if (!G||!G.running) return;
  update(); render();
  raf = requestAnimationFrame(loop);
}

function update() {
  const {players,map,particles,portals} = G;

  for (let i=particles.length-1;i>=0;i--) {
    const p=particles[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=0.28; p.life--;
    if(p.life<=0) particles.splice(i,1);
  }

  players.forEach((p,pi)=>{
    const c = CONTROLS[pi];
    const L = keys[c.left], R = keys[c.right], U = keys[c.up];
    if (L)      { p.vx=-SPEED; p.facingLeft=true; }
    else if (R) { p.vx=SPEED;  p.facingLeft=false; }
    else        p.vx *= 0.72;
    if (U && p.onGround) { p.vy=JUMP; p.onGround=false; }

    p.vy = Math.min(p.vy+GRAVITY, 20);
    p.x += p.vx; p.y += p.vy;

    if (p.x < 0)         { p.x=0;       p.vx=0; }
    if (p.x > 800-PW)    { p.x=800-PW;  p.vx=0; }
    if (p.y > 580)       { const sp=map.spawns[pi]||{x:120+pi*180,y:460}; p.x=sp.x; p.y=sp.y; p.vx=0; p.vy=0; }

    p.onGround = false;

    map.platforms.forEach(plat=>{
      const oxr = p.x+PW > plat.x && p.x < plat.x+plat.w;
      if (!oxr) return;
      const prevBot = (p.y-p.vy)+PH, currBot = p.y+PH;
      if (plat.t==='p') {
        if (prevBot <= plat.y+3 && currBot >= plat.y && p.vy>=0) {
          p.y=plat.y-PH; p.vy=0; p.onGround=true;
        }
      } else {
        if (p.y+PH > plat.y && p.y < plat.y+plat.h) {
          if (prevBot <= plat.y+3 && p.vy>=0) {
            p.y=plat.y-PH; p.vy=0; p.onGround=true;
          } else if ((p.y-p.vy) >= plat.y+plat.h-3 && p.vy<0) {
            p.y=plat.y+plat.h; p.vy=0;
          } else {
            p.x < plat.x+plat.w/2 ? (p.x=plat.x-PW) : (p.x=plat.x+plat.w); p.vx=0;
          }
        }
      }
    });

    map.bounces.forEach(b=>{
      if (p.x+PW>b.x && p.x<b.x+b.w && p.y+PH>=b.y && p.y+PH<=b.y+b.h+14 && p.vy>=0) {
        p.vy=JUMP*1.75; p.onGround=false;
        burst(p.x+PW/2, p.y+PH, '#a29bfe', 10);
      }
    });

    portals.forEach(pt=>{
      if(pt.cd>0){pt.cd--;return;}
      const check=(fx,fy,tx,ty)=>{
        if(Math.abs(p.x+PW/2-fx)<22&&Math.abs(p.y+PH/2-fy)<22){
          p.x=tx-PW/2; p.y=ty-PH/2; p.vy*=0.4; pt.cd=70;
          burst(tx,ty,'#fd79a8',14); burst(fx,fy,'#00cec9',14);
        }
      };
      check(pt.ax,pt.ay,pt.bx,pt.by);
      check(pt.bx,pt.by,pt.ax,pt.ay);
    });

    if (p.tagCooldown>0) p.tagCooldown-=16;
    if (p.flash>0) p.flash--;
  });

  const tagger = players.find(p=>p.tagged);
  if (tagger) {
    players.forEach(t=>{
      if(t===tagger||t.tagCooldown>0) return;
      const dx=(tagger.x+PW/2)-(t.x+PW/2), dy=(tagger.y+PH/2)-(t.y+PH/2);
      if(dx*dx+dy*dy < (PW+8)*(PW+8)) {
        tagger.tagged=false; tagger.tagCooldown=TAG_COOLDOWN;
        t.tagged=true; t.tagCooldown=0; t.flash=22; G.tagFlash=22;
        burst(t.x+PW/2, t.y+PH/2, t.color, 28);
        updateHUD();
      }
    });
  }
  G.tagFlash = Math.max(0,G.tagFlash-1);
}

function burst(x,y,color,n) {
  for(let i=0;i<n;i++){
    const a=(Math.PI*2*i/n)+Math.random()*.3, s=2+Math.random()*4;
    G.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,color,life:18+Math.random()*18,r:2+Math.random()*3});
  }
}

function render() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const {players,map,particles,portals,tagFlash} = G;
  const t = Date.now()/1000;

  const bg=ctx.createLinearGradient(0,0,0,540);
  bg.addColorStop(0,map.bg[0]); bg.addColorStop(1,map.bg[1]);
  ctx.fillStyle=bg; ctx.fillRect(0,0,800,540);

  if(tagFlash>0){ctx.fillStyle=`rgba(255,255,255,${tagFlash/22*.1})`;ctx.fillRect(0,0,800,540);}

  map.platforms.forEach(plat=>{
    if(plat.t==='p'){
      ctx.fillStyle='rgba(100,220,100,0.35)'; ctx.fillRect(plat.x,plat.y,plat.w,plat.h);
      ctx.strokeStyle='rgba(120,240,120,0.75)'; ctx.lineWidth=2; ctx.strokeRect(plat.x,plat.y,plat.w,plat.h);
    } else {
      ctx.fillStyle=plat.y>=518?'#1e2435':'#2e3a50'; ctx.fillRect(plat.x,plat.y,plat.w,plat.h);
      ctx.fillStyle='rgba(255,255,255,0.09)'; ctx.fillRect(plat.x,plat.y,plat.w,3);
    }
  });

  map.bounces.forEach(b=>{
    ctx.fillStyle='#4a3fa0'; ctx.fillRect(b.x,b.y,b.w,b.h);
    const shine=ctx.createLinearGradient(b.x,b.y,b.x,b.y+b.h);
    shine.addColorStop(0,'#a29bfe'); shine.addColorStop(1,'#6c5ce7');
    ctx.fillStyle=shine; ctx.fillRect(b.x+2,b.y+2,b.w-4,b.h-4);
    ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.font='9px sans-serif'; ctx.textAlign='center';
    ctx.fillText('â–²',b.x+b.w/2,b.y+b.h-1);
  });

  portals.forEach(pt=>{
    [[pt.ax,pt.ay,'#fd79a8'],[pt.bx,pt.by,'#00cec9']].forEach(([px,py,col])=>{
      ctx.save();
      ctx.beginPath(); ctx.ellipse(px,py,13,21,0,0,Math.PI*2);
      const g=ctx.createRadialGradient(px,py,2,px,py,18);
      g.addColorStop(0,col); g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.fill();
      ctx.strokeStyle=col; ctx.lineWidth=2+Math.sin(t*3)*0.8; ctx.stroke();
      ctx.restore();
    });
  });

  particles.forEach(p=>{ ctx.globalAlpha=p.life/36; ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); });
  ctx.globalAlpha=1;

  players.forEach(p=>{
    ctx.save();
    const cx=p.x+PW/2;

    if(p.tagged){ ctx.shadowColor='#ff6b00'; ctx.shadowBlur=16+Math.sin(t*4)*5; }
    if(p.flash>0 && Math.floor(p.flash/3)%2===1) ctx.globalAlpha=0.35;

    const r=7;
    ctx.beginPath();
    ctx.moveTo(p.x+r,p.y);
    ctx.arcTo(p.x+PW,p.y, p.x+PW,p.y+PH,r);
    ctx.arcTo(p.x+PW,p.y+PH, p.x,p.y+PH,r);
    ctx.arcTo(p.x,p.y+PH, p.x,p.y,r);
    ctx.arcTo(p.x,p.y, p.x+PW,p.y,r);
    ctx.closePath();
    ctx.fillStyle=p.color; ctx.fill();

    ctx.fillStyle='rgba(255,255,255,0.16)';
    ctx.beginPath(); ctx.roundRect(p.x+5,p.y+5,PW-10,7,3); ctx.fill();

    ctx.shadowBlur=0; ctx.globalAlpha=1;
    const ey=p.y+13, exL=p.facingLeft?p.x+8:p.x+PW-20, exR=p.facingLeft?p.x+20:p.x+PW-8;
    [exL,exR].forEach(ex=>{ ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ex,ey,3.5,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#222'; ctx.beginPath(); ctx.arc(ex+(p.facingLeft?-1:1),ey,2,0,Math.PI*2); ctx.fill(); });

    ctx.shadowColor='rgba(0,0,0,.7)'; ctx.shadowBlur=5;

    if(p.tagged){
      ctx.font='17px sans-serif'; ctx.textAlign='center'; ctx.fillStyle='#fff';
      ctx.fillText('ðŸ’£',cx,p.y-4);
    }

    ctx.fillStyle='rgba(255,255,255,0.9)';
    ctx.font='bold 11px Nunito,sans-serif'; ctx.textAlign='center';
    ctx.fillText(p.name,cx,p.y-(p.tagged?22:7));
    ctx.shadowBlur=0; ctx.restore();
  });

  if(G.timeLeft<=10){
    const pulse=0.05+0.05*Math.sin(t*5);
    ctx.fillStyle=`rgba(255,71,87,${pulse})`; ctx.fillRect(0,0,800,540);
  }
}

function updateHUD() {
  G.players.forEach((p,i)=>{
    const el=document.getElementById(`hud-p${i+1}`); if(!el)return;
    if(i>=cfg.players){el.classList.add('hidden');return;}
    el.classList.remove('hidden');
    if(p.tagged){
      el.classList.add('tagged');
      el.innerHTML=`<div class="hud-p-dot" style="background:${p.color}"></div><span>${p.name}</span><span class="hud-bomb">ðŸ’£</span>`;
    } else {
      el.classList.remove('tagged');
      el.innerHTML=`<div class="hud-p-dot" style="background:${p.color}"></div><span>${p.name}</span>`;
    }
  });
  for(let i=cfg.players;i<4;i++){ const el=document.getElementById(`hud-p${i+1}`); if(el)el.classList.add('hidden'); }
  const m=Math.floor(G.timeLeft/60), s=G.timeLeft%60;
  const te=document.getElementById('hud-timer');
  te.textContent=`${m}:${String(s).padStart(2,'0')}`;
  te.classList.toggle('warn',G.timeLeft<=10);
  saveTagProgress();
}

function endGame() {
  G.running=false; clearInterval(tmr); cancelAnimationFrame(raf);
  const loser=G.players.find(p=>p.tagged);
  const cards=document.getElementById('resultCards'); cards.innerHTML='';
  G.players.forEach(p=>{
    const lost=p===loser;
    const div=document.createElement('div');
    div.className='result-card '+(lost?'loser':'winner');
    div.innerHTML=`<div class="rc-emoji">${lost?'ðŸ’£':'ðŸ†'}</div><div class="rc-name" style="color:${p.color}">${p.name}</div><div class="rc-status">${lost?'ðŸ’¥ TAGGED':'âœ… SAFE'}</div>`;
    cards.appendChild(div);
  });
  showScreen('result-screen');
  saveStore && saveStore.clear('tag');
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

loadTagProgress();
applyTagConfig();
