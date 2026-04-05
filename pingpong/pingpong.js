const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

const WINNING_SCORE_1P = 5;
const WINNING_SCORE_2P = 3;
const PADDLE_W = 12, PADDLE_H = 90;
const BALL_R   = 7;

const DIFF = {
  easy:       { speed: 0.40, reaction: 0.5,  error: 40  },
  medium:     { speed: 0.70, reaction: 0.75, error: 18  },
  hard:       { speed: 0.92, reaction: 0.92, error: 6   },
  impossible: { speed: 1.0,  reaction: 1.0,  error: 0   },
};

let mode = '1p';
let difficulty = 'medium';
let running = false;
let waitingForSpace = false;
let scores  = [0, 0];
let keys    = {};
let leftPaddle, rightPaddle, ball;
let rafId = null;
let countdownTimer = null;
let spaceCallback = null;
const saveStore = window.TaskGamesSave;

function currentScreenId() {
  const visible = document.querySelector('.screen:not(.hidden)');
  return visible ? visible.id : 'screen-menu';
}

function savePingPongProgress() {
  if (!saveStore) return;
  const screen = currentScreenId();
  if (screen === 'screen-over') {
    saveStore.clear('pingpong');
    return;
  }
  saveStore.save('pingpong', {
    mode,
    difficulty,
    scores,
    screen,
    waitingForSpace,
    running,
  });
}

function loadPingPongProgress() {
  if (!saveStore) return;
  const data = saveStore.load('pingpong');
  if (!data) return;
  mode = data.mode || mode;
  difficulty = data.difficulty || difficulty;
  scores = Array.isArray(data.scores) ? data.scores : scores;
  if (data.screen === 'screen-game') {
    const diffLabel = mode === '2p' ? '' : ' · ' + difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    document.getElementById('name-left').textContent = 'Player 1';
    document.getElementById('name-right').textContent = mode === '2p' ? 'Player 2' : 'AI' + diffLabel;
    document.getElementById('score-set').textContent = 'First to ' + (mode === '2p' ? WINNING_SCORE_2P : WINNING_SCORE_1P);
    showScreen('screen-game');
    resize();
    initPaddles();
    launchBall();
    running = false;
    waitingForSpace = true;
    updateScoreUI();
    setHint('Press Space to continue');
    draw();
  } else if (data.screen === 'screen-diff') {
    showScreen('screen-diff');
  }
}

function resize() {
  const maxW = Math.min(860, window.innerWidth - 32);
  const maxH = window.innerHeight - 160;
  const w = Math.min(maxW, Math.floor(maxH * (860/473)));
  canvas.width  = w;
  canvas.height = Math.round(w * (473/860));
}

function initPaddles() {
  leftPaddle  = { x: 20,                          y: (canvas.height - PADDLE_H) / 2, speed: 7 };
  rightPaddle = { x: canvas.width - 20 - PADDLE_W, y: (canvas.height - PADDLE_H) / 2, speed: 7 };
}

function launchBall() {
  const angle = (Math.random() * 40 - 20) * Math.PI / 180;
  const dir   = Math.random() < 0.5 ? 1 : -1;
  const spd   = canvas.width * 0.008;
  ball = {
    x: canvas.width / 2, y: canvas.height / 2,
    dx: Math.cos(angle) * spd * dir,
    dy: Math.sin(angle) * spd,
    speed: spd,
    trail: []
  };
}

function setHint(text) {
  const el = document.getElementById('pause-hint');
  el.textContent = text;
  el.style.display = text ? 'block' : 'none';
}

function waitForSpace(cb) {
  waitingForSpace = true;
  spaceCallback = cb;
  setHint('Press Space to start');
  draw();
  savePingPongProgress();
}

function startCountdown(cb) {
  waitingForSpace = false;
  let c = 3;
  setHint(c + '...');
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    c--;
    if (c > 0) {
      setHint(c + '...');
    } else {
      clearInterval(countdownTimer);
      setHint('');
      cb();
    }
  }, 700);
  savePingPongProgress();
}

function startGame(m, diff) {
  mode = m;
  difficulty = diff || 'medium';
  const winScore = m === '2p' ? WINNING_SCORE_2P : WINNING_SCORE_1P;
  const diffLabel = m === '2p' ? '' : ' · ' + difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  document.getElementById('name-left').textContent  = 'Player 1';
  document.getElementById('name-right').textContent = m === '2p' ? 'Player 2' : 'AI' + diffLabel;
  document.getElementById('score-set').textContent  = 'First to ' + winScore;
  scores = [0, 0];
  updateScoreUI();
  showScreen('screen-game');
  resize();
  initPaddles();
  waitForSpace(() => startCountdown(() => {
    launchBall();
    running = true;
    cancelAnimationFrame(rafId);
    loop();
  }));
  savePingPongProgress();
}

function nextPoint() {
  running = false;
  initPaddles();
  startCountdown(() => {
    launchBall();
    running = true;
    loop();
  });
  savePingPongProgress();
}

function loop() {
  update();
  draw();
  if (running) rafId = requestAnimationFrame(loop);
}

function update() {
  if (!running) return;
  const H = canvas.height, W = canvas.width;

  if (keys['w'] || keys['W']) leftPaddle.y -= leftPaddle.speed;
  if (keys['s'] || keys['S']) leftPaddle.y += leftPaddle.speed;
  if (mode === '1p') {
    if (keys['ArrowUp'])   leftPaddle.y -= leftPaddle.speed;
    if (keys['ArrowDown']) leftPaddle.y += leftPaddle.speed;
  }

  if (mode === '1p') {
    const d = DIFF[difficulty];
    if (difficulty === 'impossible') {
      rightPaddle.y = ball.y - PADDLE_H / 2;
    } else {
      const target  = ball.y - PADDLE_H / 2 + (Math.random() - 0.5) * d.error;
      const center  = rightPaddle.y + PADDLE_H / 2;
      const diff    = target + PADDLE_H/2 - center;
      const maxSpd  = rightPaddle.speed * d.speed;
      rightPaddle.y += Math.sign(diff) * Math.min(maxSpd, Math.abs(diff) * d.reaction);
    }
  } else {
    if (keys['ArrowUp'])   rightPaddle.y -= rightPaddle.speed;
    if (keys['ArrowDown']) rightPaddle.y += rightPaddle.speed;
  }

  leftPaddle.y  = Math.max(0, Math.min(H - PADDLE_H, leftPaddle.y));
  rightPaddle.y = Math.max(0, Math.min(H - PADDLE_H, rightPaddle.y));

  ball.trail.push({ x: ball.x, y: ball.y });
  if (ball.trail.length > 12) ball.trail.shift();

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y - BALL_R <= 0) { ball.y = BALL_R; ball.dy = Math.abs(ball.dy); }
  if (ball.y + BALL_R >= H) { ball.y = H - BALL_R; ball.dy = -Math.abs(ball.dy); }

  const hitLeft = ball.dx < 0
    && ball.x - BALL_R <= leftPaddle.x + PADDLE_W
    && ball.x + BALL_R >= leftPaddle.x
    && ball.y + BALL_R >= leftPaddle.y
    && ball.y - BALL_R <= leftPaddle.y + PADDLE_H;

  const hitRight = ball.dx > 0
    && ball.x + BALL_R >= rightPaddle.x
    && ball.x - BALL_R <= rightPaddle.x + PADDLE_W
    && ball.y + BALL_R >= rightPaddle.y
    && ball.y - BALL_R <= rightPaddle.y + PADDLE_H;

  if (hitLeft) {
    ball.x  = leftPaddle.x + PADDLE_W + BALL_R + 1;
    ball.dx = Math.abs(ball.dx) * 1.04;
    const rel = (ball.y - (leftPaddle.y + PADDLE_H / 2)) / (PADDLE_H / 2);
    ball.dy = rel * ball.speed * 1.3;
    ball.speed = Math.min(ball.speed * 1.04, W * 0.018);
  }

  if (hitRight) {
    ball.x  = rightPaddle.x - BALL_R - 1;
    ball.dx = -Math.abs(ball.dx) * 1.04;
    const rel = (ball.y - (rightPaddle.y + PADDLE_H / 2)) / (PADDLE_H / 2);
    ball.dy = rel * ball.speed * 1.3;
    ball.speed = Math.min(ball.speed * 1.04, W * 0.018);
  }

  if (ball.x < 0) { scores[1]++; updateScoreUI(); checkWin() || nextPoint(); running = false; }
  if (ball.x > W) { scores[0]++; updateScoreUI(); checkWin() || nextPoint(); running = false; }
  savePingPongProgress();
}

function draw() {
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0a0f1e';
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.setLineDash([10, 14]);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke();
  ctx.restore();

  if (!ball) return;

  ball.trail.forEach((t, i) => {
    const a = (i / ball.trail.length) * 0.3;
    ctx.globalAlpha = a;
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(t.x, t.y, BALL_R * (i / ball.trail.length), 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  ctx.shadowColor = '#60a5fa';
  ctx.shadowBlur  = 20;
  ctx.fillStyle   = '#fff';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  const drawPaddle = (p, color) => {
    ctx.shadowColor = color;
    ctx.shadowBlur  = 16;
    ctx.fillStyle   = color;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, PADDLE_W, PADDLE_H, 6);
    ctx.fill();
    ctx.shadowBlur = 0;
  };
  drawPaddle(leftPaddle,  '#7ddc5f');
  drawPaddle(rightPaddle, mode === '2p' ? '#f59e0b' : '#f87171');
}

function updateScoreUI() {
  document.getElementById('score-left').textContent  = scores[0];
  document.getElementById('score-right').textContent = scores[1];
}

function checkWin() {
  const winScore = mode === '2p' ? WINNING_SCORE_2P : WINNING_SCORE_1P;
  if (scores[0] < winScore && scores[1] < winScore) return false;
  cancelAnimationFrame(rafId);
  clearInterval(countdownTimer);
  running = false;

  const leftName = document.getElementById('name-left').textContent;
  const rightName = document.getElementById('name-right').textContent;
  const leftWon = scores[0] >= winScore;

  document.getElementById('result-name-left').textContent  = leftName;
  document.getElementById('result-name-right').textContent = rightName;
  document.getElementById('result-score-left').textContent  = scores[0];
  document.getElementById('result-score-right').textContent = scores[1];

  const badgeLeft  = document.getElementById('badge-left');
  const badgeRight = document.getElementById('badge-right');
  const sideLeft   = document.getElementById('result-left');
  const sideRight  = document.getElementById('result-right');

  if (leftWon) {
    badgeLeft.textContent  = '🏆 Winner';
    badgeRight.textContent = '💀 Loser';
    sideLeft.className  = 'result-side winner-side';
    sideRight.className = 'result-side loser-side';
  } else {
    badgeLeft.textContent  = '💀 Loser';
    badgeRight.textContent = '🏆 Winner';
    sideLeft.className  = 'result-side loser-side';
    sideRight.className = 'result-side winner-side';
  }

  setTimeout(() => showScreen('screen-over'), 600);
  return true;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  savePingPongProgress();
}

// ── INPUT ────────────────────────────────────────────────
window.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (['ArrowUp','ArrowDown',' '].includes(e.key)) e.preventDefault();
  if (e.key === ' ' && waitingForSpace && spaceCallback) {
    const cb = spaceCallback;
    spaceCallback = null;
    cb();
  }
});
window.addEventListener('keyup', e => { keys[e.key] = false; });
window.addEventListener('resize', () => { if (running) resize(); });

// ── BUTTONS ──────────────────────────────────────────────
document.getElementById('btn-1p').addEventListener('click', () => showScreen('screen-diff'));
document.getElementById('btn-2p').addEventListener('click', () => startGame('2p'));
document.getElementById('btn-diff-back').addEventListener('click', () => showScreen('screen-menu'));

document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => startGame('1p', btn.dataset.diff));
});

document.getElementById('btn-rematch').addEventListener('click', () => startGame(mode, difficulty));
document.getElementById('btn-menu').addEventListener('click', () => {
  running = false; cancelAnimationFrame(rafId); clearInterval(countdownTimer);
  waitingForSpace = false; spaceCallback = null;
  saveStore && saveStore.clear('pingpong');
  showScreen('screen-menu');
});

loadPingPongProgress();
