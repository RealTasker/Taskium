let RECIPES_LOADED = true;

async function loadRecipes() {
  init();
}

function recipeKey(a, b) {
  return [a, b].sort().join('+');
}

const STARTING = [
  { name:'Fire',  emoji:'🔥' },
  { name:'Water', emoji:'💧' },
  { name:'Wind',  emoji:'🌬️' },
  { name:'Earth', emoji:'🌍' },
];

const saveStore = window.TaskGamesSave;
let discovered = [], canvasItems = [], combining = null, nextId = 0;

function save() {
  if (!saveStore) return;
  saveStore.save('infinitecraft', { discovered, canvasItems, nextId });
}

function load() {
  try {
    const data = saveStore ? saveStore.load('infinitecraft') : null;
    if (data) {
      discovered = data.discovered || [];
      canvasItems = data.canvasItems || [];
      nextId = typeof data.nextId === 'number' ? data.nextId : nextId;
      for (const s of STARTING)
        if (!discovered.find(d => d.name === s.name))
          discovered.unshift({ ...s, isNew: false });
    } else {
      discovered = STARTING.map(s => ({ ...s, isNew: false }));
    }
  } catch {
    discovered = STARTING.map(s => ({ ...s, isNew: false }));
  }
}

function renderSidebar(filter = '') {
  const list = document.getElementById('elements-list');
  document.getElementById('count').textContent = discovered.length;
  const filtered = filter
    ? discovered.filter(d => d.name.toLowerCase().includes(filter.toLowerCase()))
    : discovered;
  list.innerHTML = filtered.map(d => `
    <div class="element-pill${d.isNew?' is-new':''}" draggable="true" data-name="${d.name}" data-emoji="${d.emoji}">
      <span class="pill-emoji">${d.emoji}</span>
      <span class="pill-name">${d.name}</span>
    </div>`).join('');
  list.querySelectorAll('.element-pill').forEach(pill => {
    pill.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', JSON.stringify({ source:'sidebar', name:pill.dataset.name, emoji:pill.dataset.emoji }));
    });
    pill.addEventListener('click', () => addToCanvas(pill.dataset.name, pill.dataset.emoji));
  });
}

function renderCanvas() {
  const container = document.getElementById('canvas-items');
  document.getElementById('canvas-hint').style.display = canvasItems.length === 0 ? 'flex' : 'none';
  container.innerHTML = canvasItems.map(item => `
    <div class="canvas-item${item.id===combining?' selected':''}${item.combining?' combining':''}"
         data-id="${item.id}" style="left:${item.x}px;top:${item.y}px;">
      <span class="item-emoji">${item.emoji}</span>
      <span class="item-name">${item.name}</span>
      <button class="item-remove" data-id="${item.id}">×</button>
    </div>`).join('');
  container.querySelectorAll('.canvas-item').forEach(el => {
    makeDraggable(el);
    el.addEventListener('click', e => {
      if (e.target.classList.contains('item-remove')) return;
      handleCanvasClick(parseInt(el.dataset.id));
    });
  });
  container.querySelectorAll('.item-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      canvasItems = canvasItems.filter(i => i.id !== parseInt(btn.dataset.id));
      if (combining === parseInt(btn.dataset.id)) combining = null;
      renderCanvas();
      save();
    });
  });
}

function addToCanvas(name, emoji, x, y) {
  const canvas = document.getElementById('canvas');
  const rect = canvas.getBoundingClientRect();
  canvasItems.push({
    id: nextId++, name, emoji,
    x: x !== undefined ? x : Math.random() * (rect.width - 140) + 20,
    y: y !== undefined ? y : Math.random() * (rect.height - 80) + 20,
  });
  renderCanvas();
  save();
}

function makeDraggable(el) {
  let startX, startY, startLeft, startTop, dragged = false;
  const id = parseInt(el.dataset.id);
  const sidebar = document.querySelector('.sidebar');

  el.addEventListener('mousedown', e => {
    if (e.target.classList.contains('item-remove')) return;
    e.preventDefault();
    const item = canvasItems.find(i => i.id === id);
    if (!item) return;
    dragged = false;
    startX = e.clientX; startY = e.clientY;
    startLeft = item.x; startTop = item.y;
    el.style.zIndex = 100;

    function onMove(e) {
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragged = true;
      item.x = startLeft + dx;
      item.y = startTop + dy;
      el.style.left = item.x + 'px';
      el.style.top = item.y + 'px';
      const sRect = sidebar.getBoundingClientRect();
      if (e.clientX <= sRect.right) {
        sidebar.classList.add('drop-target');
      } else {
        sidebar.classList.remove('drop-target');
      }
    }
    function onUp(e) {
      el.style.zIndex = '';
      sidebar.classList.remove('drop-target');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      const sRect = sidebar.getBoundingClientRect();
      if (dragged && e.clientX <= sRect.right) {
        canvasItems = canvasItems.filter(i => i.id !== id);
        if (combining === id) combining = null;
        renderCanvas();
        save();
      } else if (dragged) {
        checkOverlap(id);
        save();
      }
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

function checkOverlap(id) {
  const itemA = canvasItems.find(i => i.id === id);
  if (!itemA) return;
  for (const itemB of canvasItems) {
    if (itemB.id === id) continue;
    if (Math.abs(itemA.x - itemB.x) < 110 && Math.abs(itemA.y - itemB.y) < 70) {
      doCombine(itemA, itemB);
      return;
    }
  }
}

function handleCanvasClick(id) {
  if (combining === null) {
    combining = id;
    renderCanvas();
  } else if (combining === id) {
    combining = null;
    renderCanvas();
  } else {
    const a = canvasItems.find(i => i.id === combining);
    const b = canvasItems.find(i => i.id === id);
    combining = null;
    renderCanvas();
    if (a && b) doCombine(a, b);
  }
}

function doCombine(itemA, itemB) {
  const key = recipeKey(itemA.name, itemB.name);
  const recipe = RECIPES[key];
  if (recipe) {
    applyResult(itemA, itemB, recipe[0], recipe[1]);
  }
}

function applyResult(itemA, itemB, name, emoji) {
  const x = (itemA.x + itemB.x) / 2;
  const y = (itemA.y + itemB.y) / 2;
  canvasItems = canvasItems.filter(i => i.id !== itemA.id && i.id !== itemB.id);
  canvasItems.push({ id: nextId++, name, emoji, x, y });
  const isNew = !discovered.find(d => d.name.toLowerCase() === name.toLowerCase());
  if (isNew) {
    discovered.unshift({ name, emoji, isNew: true });
    save();
    showToast(`✨ Discovered: ${emoji} ${name}!`, true);
    setTimeout(() => {
      const d = discovered.find(d => d.name === name);
      if (d) d.isNew = false;
      renderSidebar(document.getElementById('search').value);
    }, 3000);
  } else {
    showToast(`${emoji} ${name}`);
  }
  renderCanvas();
  renderSidebar(document.getElementById('search').value);
  save();
}

let toastTimer;
function showToast(msg, isNew = false) {
  const t = document.getElementById('result-toast');
  t.textContent = msg;
  t.className = 'result-toast show' + (isNew ? ' new-discovery' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.className = 'result-toast', 2400);
}

const canvas = document.getElementById('canvas');
canvas.addEventListener('dragover', e => e.preventDefault());
canvas.addEventListener('drop', e => {
  e.preventDefault();
  try {
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (data.source === 'sidebar') {
      const rect = canvas.getBoundingClientRect();
      addToCanvas(data.name, data.emoji, e.clientX - rect.left - 40, e.clientY - rect.top - 20);
    }
  } catch {}
});

document.getElementById('search').addEventListener('input', e => renderSidebar(e.target.value));

document.getElementById('reset-btn').addEventListener('click', () => {
  if (!confirm('Reset all progress?')) return;
  saveStore && saveStore.clear('infinitecraft');
  discovered = STARTING.map(s => ({ ...s, isNew: false }));
  canvasItems = []; combining = null;
  renderSidebar(); renderCanvas();
});

canvas.addEventListener('dblclick', e => {
  if (e.target === canvas || e.target.id === 'canvas-items' || e.target.id === 'canvas-hint') {
    canvasItems = []; combining = null; renderCanvas(); save();
  }
});

function init() {
  load();
  renderSidebar();
  renderCanvas();
}

loadRecipes();
