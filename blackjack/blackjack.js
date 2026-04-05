const SUITS  = ['♥','♦','♣','♠'];
const VALUES = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const LOAN_INTEREST_RATE = 0.10;

const PIP_LAYOUTS = {
  2:[[2,1],[2,5]], 3:[[2,1],[2,3],[2,5]], 4:[[1,1],[3,1],[1,5],[3,5]],
  5:[[1,1],[3,1],[2,3],[1,5],[3,5]], 6:[[1,1],[3,1],[1,3],[3,3],[1,5],[3,5]],
  7:[[1,1],[3,1],[2,2],[1,3],[3,3],[1,5],[3,5]], 8:[[1,1],[3,1],[2,2],[1,3],[3,3],[2,4],[1,5],[3,5]],
  9:[[1,1],[2,1],[3,1],[1,3],[2,3],[3,3],[1,5],[2,5],[3,5]],
  10:[[1,1],[2,1],[3,1],[1,2],[3,2],[1,4],[3,4],[1,5],[2,5],[3,5]]
};

const LEVEL_XP = [0,5,13,24,38,56,78,105,137,175,220];
const XP_WIN = 2, XP_BLACKJACK = 4, XP_PUSH = 1, XP_LOSS = 0;

let xp = 0, level = 1;

function totalXPForLevel(lvl) {
  return lvl <= LEVEL_XP.length ? LEVEL_XP[lvl - 1] : LEVEL_XP[LEVEL_XP.length-1] + (lvl - LEVEL_XP.length) * 60;
}

function addXP(amount) {
  if (!amount) return;
  xp += amount;
  let leveled = false;
  while (level < 99 && xp >= totalXPForLevel(level + 1)) {
    level++;
    leveled = true;
  }
  updateLevelUI();
  if (leveled) showLevelUp();
  saveBlackjackProgress();
}

function updateLevelUI() {
  const prevXP = totalXPForLevel(level);
  const nextXP = totalXPForLevel(level + 1);
  const range  = nextXP - prevXP;
  const earned = xp - prevXP;
  const pct    = range > 0 ? Math.min(100, (earned / range) * 100) : 100;
  document.getElementById('level-num').textContent  = level;
  document.getElementById('level-xp-fill').style.width = pct + '%';
  document.getElementById('level-xp-text').textContent = earned + ' / ' + range + ' XP';
}

let lvlTimer = null;
function showLevelUp() {
  const subs = ['Nice!','Keep going!','On fire! 🔥','Unstoppable!','Legendary! 👑'];
  document.getElementById('levelup-num').textContent = level;
  document.getElementById('levelup-sub').textContent = subs[Math.min(level-2, subs.length-1)] || 'Amazing!';
  const o = document.getElementById('levelup-overlay');
  o.style.display = 'flex';
  clearTimeout(lvlTimer);
  lvlTimer = setTimeout(() => o.style.display = 'none', 2400);
}

let deck=[], playerHands=[[]], dealerHand=[], currentBet=0, currentBets=[0];
let wallet=1000, lastBet=0, gameState='BETTING', activeHandIndex=0;
let hasDoubled=[false], stats={wins:0,losses:0,pushes:0};
let loanPrincipal=0, loanStartTime=null, loanTaken=false, loanIntervalId=null;
let audioCtx=null;
const saveStore = window.TaskGamesSave;

function saveBlackjackProgress() {
  if (!saveStore) return;
  if (gameState === 'GAMEOVER') {
    saveStore.clear('blackjack');
    return;
  }
  saveStore.save('blackjack', {
    wallet,
    lastBet,
    currentBet,
    currentBets,
    stats,
    xp,
    level,
    loanPrincipal,
    loanStartTime,
    loanTaken,
    gameState,
  });
}

function loadBlackjackProgress() {
  if (!saveStore) return;
  const data = saveStore.load('blackjack');
  if (!data) return;
  wallet = typeof data.wallet === 'number' ? data.wallet : wallet;
  lastBet = typeof data.lastBet === 'number' ? data.lastBet : lastBet;
  currentBet = typeof data.currentBet === 'number' ? data.currentBet : currentBet;
  currentBets = Array.isArray(data.currentBets) ? data.currentBets : currentBets;
  stats = data.stats || stats;
  xp = typeof data.xp === 'number' ? data.xp : xp;
  level = typeof data.level === 'number' ? data.level : level;
  loanPrincipal = typeof data.loanPrincipal === 'number' ? data.loanPrincipal : loanPrincipal;
  loanStartTime = typeof data.loanStartTime === 'number' ? data.loanStartTime : loanStartTime;
  loanTaken = !!data.loanTaken;
  gameState = 'BETTING';
}

function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state==='suspended') audioCtx.resume();
}
function playSound(type) {
  if (!audioCtx) return;
  const now=audioCtx.currentTime;
  const tone=(freq,dur,g,wave='sine',start=0)=>{
    const o=audioCtx.createOscillator(),gn=audioCtx.createGain();
    o.type=wave; o.frequency.setValueAtTime(freq,now+start);
    gn.gain.setValueAtTime(0.0001,now+start);
    gn.gain.exponentialRampToValueAtTime(g,now+start+0.01);
    gn.gain.exponentialRampToValueAtTime(0.0001,now+start+dur);
    o.connect(gn); gn.connect(audioCtx.destination);
    o.start(now+start); o.stop(now+start+dur);
  };
  if (type==='chip')  { tone(1200,0.12,0.22); tone(800,0.1,0.15,'triangle',0.02); }
  if (type==='card')  { tone(420,0.1,0.14,'triangle'); tone(120,0.14,0.05,'sawtooth'); }
  if (type==='win')   { tone(523,0.9,0.09); tone(659,0.9,0.07,'sine',0.06); tone(784,0.9,0.05,'sine',0.12); }
  if (type==='bust')  { tone(140,0.26,0.16,'sawtooth'); tone(90,0.34,0.09,'triangle',0.04); }
}

function buildDeck() {
  deck=[];
  for(let d=0;d<6;d++) for(const s of SUITS) for(const v of VALUES) deck.push({s,v});
  for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
}
function getVal(c){if(['J','Q','K'].includes(c.v))return 10;if(c.v==='A')return 11;return parseInt(c.v,10);}
function getScore(hand){let s=0,a=0;for(const c of hand){s+=getVal(c);if(c.v==='A')a++;}while(s>21&&a>0){s-=10;a--;}return s;}
function isBlackjack(h){return h.length===2&&getScore(h)===21;}

function makeCardDOM(card, faceUp) {
  const el=document.createElement('div');
  el.className='card'+(faceUp?'':' face-down');
  el.style.setProperty('--rot',(Math.random()*4-2).toFixed(1)+'deg');
  el.style.setProperty('--deal-duration',isPerfLite()?'380ms':'580ms');
  const inner=document.createElement('div'); inner.className='inner';
  const face=document.createElement('div'); face.className='card-face';
  const isRed=card.s==='♥'||card.s==='♦';
  const pip=isRed?'pip-red':'pip-black';
  const isFace=['J','Q','K'].includes(card.v);
  const num=parseInt(card.v);
  const ct=document.createElement('div'); ct.className='corner';
  ct.innerHTML=`<span class="rank ${pip}">${card.v}</span><span class="suit ${pip}">${card.s}</span>`;
  const content=document.createElement('div'); content.className='card-content';
  if(card.v==='A'){
    content.innerHTML=`<div class="pip-grid"><span class="pip ace ${pip}" style="grid-column:2;grid-row:3">${card.s}</span></div>`;
  }else if(isFace){
    content.innerHTML=`<div class="face-art ${pip}">${card.v}</div>`;
  }else if(PIP_LAYOUTS[num]){
    const placed=new Set(PIP_LAYOUTS[num].map(([c,r])=>`${c},${r}`));
    let cells='';
    for(let r=1;r<=5;r++)for(let c=1;c<=3;c++){
      const has=placed.has(`${c},${r}`);
      cells+=`<span class="pip ${has?pip:''}" style="grid-column:${c};grid-row:${r};visibility:${has?'visible':'hidden'}">${card.s}</span>`;
    }
    content.innerHTML=`<div class="pip-grid">${cells}</div>`;
  }
  const cb=document.createElement('div'); cb.className='corner bottom';
  cb.innerHTML=`<span class="rank ${pip}">${card.v}</span><span class="suit ${pip}">${card.s}</span>`;
  face.appendChild(ct); face.appendChild(content); face.appendChild(cb);
  const bs=document.createElement('div'); bs.className='bust-stamp'; bs.textContent='BUST';
  const back=document.createElement('div'); back.className='card-back';
  inner.appendChild(face); inner.appendChild(back);
  el.appendChild(inner); el.appendChild(bs);
  return el;
}

function spawnCard(hand, container, faceUp, delay) {
  const card=deck.pop(); hand.push(card);
  setTimeout(()=>{
    playSound('card');
    const el=makeCardDOM(card,faceUp);
    container.appendChild(el);
    requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('dealt')));
  }, delay);
}

function isPerfLite(){return document.documentElement.classList.contains('perf-lite')||document.body.classList.contains('perf-lite');}
function $(id){return document.getElementById(id);}

function updateWalletUI(){$('wallet-val').textContent='$'+wallet.toLocaleString();}
function updateBetUI(){$('bet-val').textContent='$'+currentBet.toLocaleString();}
function updateStatsUI(){$('stat-wins').textContent=stats.wins;$('stat-losses').textContent=stats.losses;$('stat-pushes').textContent=stats.pushes;}

function updateLoanUI() {
  if(loanPrincipal>0){
    $('loan-box').style.display='flex';
    $('loan-val').textContent='$'+calcOwed().toLocaleString();
    $('btn-payall').style.display='';
  }else{
    $('loan-box').style.display='none';
    $('btn-payall').style.display='none';
  }
  $('take-loan-strip').style.display=(wallet<=0&&currentBet===0&&gameState==='BETTING'&&!loanTaken)?'flex':'none';
  saveBlackjackProgress();
}

function updateScoreBadge(el,val){
  el.textContent=val;
  if(!el.classList.contains('visible')){
    el.classList.add('visible','pop-in');
    el.addEventListener('animationend',()=>el.classList.remove('pop-in'),{once:true});
  }
}

function showMsg(text,color,dur){
  const el=$('msg-text'); el.textContent=text; el.style.color=color||'#fff'; el.classList.add('visible');
  if(dur) setTimeout(()=>el.classList.remove('visible'),dur);
}
function hideMsg(){$('msg-text').classList.remove('visible');}

function clearTable(){
  ['dealer-cards','player-cards-0','player-cards-1'].forEach(id=>$(id).innerHTML='');
  ['dealer-score','player-score-0','player-score-1'].forEach(id=>{$(id).textContent='';$(id).classList.remove('visible','pop-in');});
}

function getPlayerCardsContainer(idx){return idx===0?$('player-cards-0'):$('player-cards-1');}
function getPlayerScoreEl(idx){return idx===0?$('player-score-0'):$('player-score-1');}
function markBusted(c){c.querySelectorAll('.card').forEach(x=>x.classList.add('busted'));}
function highlightWinner(c){c.querySelectorAll('.card').forEach(x=>x.classList.add('winner'));}
function dimHands(dim){[$('dealer-area'),$('player-area')].forEach(a=>a.classList.toggle('dimmed',dim));}

function addBetChip(amt,e){
  initAudio();
  if(gameState!=='BETTING')return;
  if(wallet<amt){showMsg('Not enough money','#ff8c8c',900);return;}
  playSound('chip');
  wallet-=amt; currentBet+=amt; currentBets=[currentBet];
  updateWalletUI(); updateBetUI(); updateLoanUI();
  saveBlackjackProgress();
}
function allIn(){
  initAudio();
  if(gameState!=='BETTING'||wallet<=0)return;
  playSound('chip');
  currentBet+=wallet; wallet=0; currentBets=[currentBet];
  updateWalletUI(); updateBetUI(); updateLoanUI();
  saveBlackjackProgress();
}
function clearBet(){
  if(gameState!=='BETTING')return;
  wallet+=currentBet; currentBet=0; currentBets=[0];
  updateWalletUI(); updateBetUI(); updateLoanUI();
  saveBlackjackProgress();
}
function doubleBet(){
  initAudio();
  if(gameState!=='BETTING'||currentBet<=0||wallet<currentBet)return;
  playSound('chip');
  wallet-=currentBet; currentBet*=2; currentBets=[currentBet];
  updateWalletUI(); updateBetUI();
  saveBlackjackProgress();
}
function rebet(){
  initAudio();
  if(gameState!=='BETTING'||lastBet<=0||wallet<lastBet)return;
  playSound('chip');
  wallet-=lastBet; currentBet=lastBet; currentBets=[currentBet];
  updateWalletUI(); updateBetUI(); updateLoanUI();
  saveBlackjackProgress();
}
function placeCustomBetUI(){
  const val=parseInt($('custom-bet-input').value);
  if(!val||val<=0){showMsg('Enter valid amount','#ffcf7b',900);return;}
  $('custom-bet-input').value='';
  addBetChip(val,null);
}

function calcOwed(){
  if(!loanStartTime)return loanPrincipal;
  const mins=(Date.now()-loanStartTime)/60000;
  return loanPrincipal+Math.floor(loanPrincipal*LOAN_INTEREST_RATE*mins);
}
function takeLoan(amount){
  if(loanTaken)return; // one-time only
  loanPrincipal=amount; loanStartTime=Date.now(); loanTaken=true;
  loanIntervalId=setInterval(()=>updateLoanUI(),5000);
  wallet+=amount;
  initAudio(); playSound('chip');
  updateWalletUI(); updateLoanUI();
  saveBlackjackProgress();
}
function payLoanFull(){
  if(gameState!=='BETTING'||loanPrincipal<=0||wallet<=0)return;
  const owed=calcOwed();
  if(wallet<owed){showMsg(`Need $${owed.toLocaleString()} to repay`,'#ffcf7b',1200);return;}
  wallet-=owed; loanPrincipal=0; loanStartTime=null;
  clearInterval(loanIntervalId);
  initAudio(); playSound('chip');
  showMsg('Loan repaid! ✅','var(--ok)',1400);
  updateWalletUI(); updateLoanUI();
  saveBlackjackProgress();
}

function triggerGameOver(){
  gameState='GAMEOVER';
  clearInterval(loanIntervalId);
  saveBlackjackProgress();

  const overlay=$('gameover-overlay');
  const video=$('gameover-video');
  overlay.style.display='flex';

  const showStats=()=>{
    video.style.display='none';
    $('go-wins').textContent=stats.wins;
    $('go-losses').textContent=stats.losses;
    $('go-pushes').textContent=stats.pushes;
    $('go-level').textContent='Level '+level;
    $('gameover-ui').style.display='flex';
  };

  video.style.display='block';
  video.currentTime=0;
  video.muted=true;

  const fallback=setTimeout(showStats,15000);
  video.onended=()=>{clearTimeout(fallback);showStats();};
  video.onerror=()=>{clearTimeout(fallback);showStats();};

  const playPromise=video.play();
  if(playPromise!==undefined){
    playPromise.then(()=>{
      video.muted=false;
    }).catch(()=>{
      clearTimeout(fallback);
      showStats();
    });
  }
}

$('btn-play-again').addEventListener('click',()=>{
  wallet=1000; currentBet=0; currentBets=[0]; lastBet=0;
  stats={wins:0,losses:0,pushes:0};
  xp=0; level=1;
  loanPrincipal=0; loanStartTime=null; loanTaken=false;
  clearInterval(loanIntervalId);
  $('gameover-overlay').style.display='none';
  $('gameover-ui').style.display='none';
  const v=$('gameover-video'); v.pause(); v.currentTime=0; v.style.display='none';
  playerHands=[[]], dealerHand=[], hasDoubled=[false], gameState='BETTING', activeHandIndex=0;
  clearTable(); hideMsg(); dimHands(true);
  $('betting-overlay').classList.remove('hidden');
  $('gameplay-controls').classList.remove('active');
  updateWalletUI(); updateBetUI(); updateStatsUI(); updateLoanUI(); updateLevelUI();
  saveBlackjackProgress();
});

function deal(){
  initAudio();
  if(gameState!=='BETTING'||currentBet<=0)return;
  lastBet=currentBet; buildDeck();
  gameState='PLAYING';
  saveBlackjackProgress();
  playerHands=[[]]; dealerHand=[]; hasDoubled=[false]; activeHandIndex=0;
  clearTable(); hideMsg(); dimHands(false);
  $('player-hands-row').classList.add('single');
  $('player-hands-row').querySelectorAll('.hand-slot').forEach((s,i)=>{
    s.classList.toggle('active',i===0); s.classList.toggle('inactive',i!==0);
  });
  $('betting-overlay').classList.add('hidden');
  $('gameplay-controls').classList.remove('active');
  const lite=isPerfLite(), gap=lite?180:240;
  spawnCard(playerHands[0],$('player-cards-0'),true,0);
  spawnCard(dealerHand,$('dealer-cards'),true,gap);
  spawnCard(playerHands[0],$('player-cards-0'),true,gap*2);
  spawnCard(dealerHand,$('dealer-cards'),false,gap*3);
  setTimeout(()=>{
    updateAllScores(false);
    if(isBlackjack(playerHands[0])){stand(true);return;}
    setTimeout(()=>{$('gameplay-controls').classList.add('active');updateButtonStates();},lite?60:120);
  },gap*3+(lite?380:600));
}

function hit(){
  if(gameState!=='PLAYING')return;
  $('btn-double').disabled=true; $('btn-split').disabled=true;
  spawnCard(playerHands[activeHandIndex],getPlayerCardsContainer(activeHandIndex),true,0);
  setTimeout(()=>{
    updateAllScores(false);
    const score=getScore(playerHands[activeHandIndex]);
    if(score>21){markBusted(getPlayerCardsContainer(activeHandIndex));playSound('bust');endRound();}
    updateButtonStates();
  },isPerfLite()?220:320);
}

function stand(fast=false){
  if(gameState!=='PLAYING')return;
  const lite=isPerfLite();
  $('gameplay-controls').classList.remove('active');
  const holeCard=$('dealer-cards').children[1];
  if(holeCard) holeCard.classList.remove('face-down');
  gameState='DEALER_TURN';
  setTimeout(()=>{
    updateAllScores(true);
    setTimeout(()=>dealerAI(fast),lite?300:440);
  },fast?(lite?120:180):(lite?220:320));
}

function doubleDown(){
  if(gameState!=='PLAYING')return;
  const bet=currentBets[activeHandIndex]||currentBet;
  if(wallet<bet||playerHands[activeHandIndex].length!==2)return;
  initAudio(); playSound('chip');
  wallet-=bet; currentBets[activeHandIndex]=bet*2; hasDoubled[activeHandIndex]=true;
  updateWalletUI();
  spawnCard(playerHands[activeHandIndex],getPlayerCardsContainer(activeHandIndex),true,0);
  setTimeout(()=>{
    updateAllScores(false);
    if(getScore(playerHands[activeHandIndex])>21){markBusted(getPlayerCardsContainer(activeHandIndex));playSound('bust');endRound();return;}
    stand(false);
  },isPerfLite()?220:320);
}

function splitHand(){
  if(gameState!=='PLAYING'||playerHands.length!==1)return;
  const h=playerHands[0];
  if(h.length!==2||getVal(h[0])!==getVal(h[1])||wallet<currentBet)return;
  initAudio(); playSound('chip');
  wallet-=currentBet;
  const c1=h.pop();
  const h1=[c1]; h.push(deck.pop()); h1.push(deck.pop());
  playerHands=[h,h1]; hasDoubled=[false,false]; currentBets=[currentBet,currentBet];
  $('player-hands-row').classList.remove('single');
  $('player-cards-0').innerHTML=''; $('player-cards-1').innerHTML='';
  $('player-score-0').classList.remove('visible'); $('player-score-1').classList.remove('visible');
  const lite=isPerfLite(), gap=lite?180:240;
  const buildHand=(hand,container,start)=>{
    hand.forEach((card,i)=>setTimeout(()=>{
      playSound('card');
      const el=makeCardDOM(card,true);
      container.appendChild(el);
      requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('dealt')));
    },start+i*gap));
  };
  buildHand(h,$('player-cards-0'),0);
  buildHand(h1,$('player-cards-1'),gap*2.5);
  setTimeout(()=>{
    activeHandIndex=0;
    $('player-hands-row').querySelectorAll('.hand-slot').forEach((s,i)=>{
      s.classList.toggle('active',i===0); s.classList.toggle('inactive',i!==0);
    });
    updateAllScores(false); updateButtonStates();
  },gap*2.5+gap+(lite?200:340));
  updateWalletUI();
}

function dealerAI(fast){
  const lite=isPerfLite();
  if(getScore(dealerHand)<17){
    spawnCard(dealerHand,$('dealer-cards'),true,0);
    setTimeout(()=>{updateAllScores(true);dealerAI(fast);},fast?(lite?200:280):(lite?360:520));
  }else{endRound();}
}

function updateAllScores(showDealer){
  playerHands.forEach((h,i)=>{if(h.length)updateScoreBadge(getPlayerScoreEl(i),getScore(h));});
  if(showDealer&&dealerHand.length) updateScoreBadge($('dealer-score'),getScore(dealerHand));
  else if(dealerHand.length) updateScoreBadge($('dealer-score'),getVal(dealerHand[0]));
}

function endRound(){
  gameState='END';
  const p=getScore(playerHands[0]),d=getScore(dealerHand);
  const pBJ=isBlackjack(playerHands[0]),dBJ=isBlackjack(dealerHand);
  const pBust=p>21;
  updateAllScores(true);

  let result,msg,color,earnedXP=0;
  if(pBust)        {result='LOSE';msg='BUST';           color='var(--danger)'; earnedXP=XP_LOSS;}
  else if(pBJ&&dBJ){result='PUSH';msg='PUSH';           color='rgba(255,255,255,0.8)'; earnedXP=XP_PUSH;}
  else if(pBJ)     {result='BLACKJACK';msg='BLACKJACK!';color='var(--gold)'; earnedXP=XP_BLACKJACK;}
  else if(dBJ)     {result='LOSE';msg='HOUSE BLACKJACK';color='var(--danger)'; earnedXP=XP_LOSS;}
  else if(d>21)    {result='WIN'; msg='DEALER BUSTS';   color='var(--ok)'; earnedXP=XP_WIN;}
  else if(p>d)     {result='WIN'; msg='YOU WIN';        color='var(--ok)'; earnedXP=XP_WIN;}
  else if(p<d)     {result='LOSE';msg='HOUSE WINS';     color='var(--danger)'; earnedXP=XP_LOSS;}
  else             {result='PUSH';msg='PUSH';           color='rgba(255,255,255,0.8)'; earnedXP=XP_PUSH;}

  const bet=currentBets[0]||currentBet;
  if(result==='WIN')      {wallet+=bet*2;stats.wins++;highlightWinner($('player-cards-0'));playSound('win');}
  else if(result==='BLACKJACK'){wallet+=Math.floor(bet*2.5);stats.wins++;highlightWinner($('player-cards-0'));playSound('win');}
  else if(result==='PUSH'){wallet+=bet;stats.pushes++;}
  else{stats.losses++;markBusted($('player-cards-0'));if(!pBust)playSound('bust');}
  if(d>21) markBusted($('dealer-cards'));

  addXP(earnedXP);
  showMsg(msg,color,1400);
  updateWalletUI(); updateStatsUI(); updateLoanUI();
  saveBlackjackProgress();

  setTimeout(()=>{
    gameState='BETTING';
    currentBet=0; currentBets=[0];
    playerHands=[[]]; dealerHand=[];
    hasDoubled=[false]; activeHandIndex=0;
    dimHands(true);
    $('betting-overlay').classList.remove('hidden');
    $('gameplay-controls').classList.remove('active');
    updateBetUI(); updateLoanUI();
    saveBlackjackProgress();

    if(wallet<=0){
      if(!loanTaken){
        updateLoanUI();
      }else{
        setTimeout(()=>triggerGameOver(),400);
      }
    }
  },1800);
}

function updateButtonStates(){
  const hand=playerHands[activeHandIndex];
  $('btn-double').disabled=!(hand&&hand.length===2&&!hasDoubled[activeHandIndex]&&wallet>=(currentBets[activeHandIndex]||currentBet));
  $('btn-split').disabled=!(playerHands.length===1&&hand&&hand.length===2&&getVal(hand[0])===getVal(hand[1])&&wallet>=currentBet);
}

dimHands(true);
loadBlackjackProgress();
updateWalletUI(); updateBetUI(); updateStatsUI(); updateLoanUI(); updateLevelUI();
