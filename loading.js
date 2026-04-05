/*!
 * Taskium — Loader v1.0.0
 */
(function () {
  'use strict';

  if (window.__tgLoaderInit) return;
  window.__tgLoaderInit = true;

  const TIPS = [
    'Tip: Gatekeep at all costs.',
    'Tip: Use keyboard shortcuts where possible.',
    'Tip: Check back for new games!',
    'Tip: Snake now has wall collisions.',
    'Tip: Ping Pong has 4 AI difficulty levels.',
    'Tip: Blackjack pays 3:2 on a natural.',
    'Tip: Combine elements in Infinite Craft!',
  ];

  const CSS = `
    #tg-loader *,#tg-loader *::before,#tg-loader *::after{box-sizing:border-box;margin:0;padding:0;}
    #tg-loader{
      position:fixed;inset:0;z-index:99999;
      background:#000;
      display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;
      font-family:'Outfit','DM Sans',system-ui,sans-serif;
      opacity:1;transition:opacity 0.55s cubic-bezier(0.22,1,0.36,1);overflow:hidden;
    }
    #tg-loader.tg-out{opacity:0;pointer-events:none;}
    #tg-loader::before{
      content:'';position:absolute;inset:0;pointer-events:none;
      background:
        radial-gradient(ellipse 60% 40% at 50% 50%,rgba(96,165,250,0.07) 0%,transparent 70%),
        radial-gradient(ellipse 40% 30% at 50% 50%,rgba(125,220,95,0.04) 0%,transparent 65%);
      animation:tgPulse 3s ease-in-out infinite;
    }
    @keyframes tgPulse{0%,100%{opacity:0.6;}50%{opacity:1;}}
    .tg-logo{font-size:42px;font-weight:800;letter-spacing:-1.5px;color:#fff;position:relative;z-index:1;margin-bottom:6px;user-select:none;}
    .tg-logo-accent{
      background:linear-gradient(90deg,#60a5fa 0%,#7ddc5f 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      background-clip:text;background-size:200% 100%;
      animation:tgShimmer 2.4s linear infinite;
    }
    @keyframes tgShimmer{0%{background-position:200% 0;}100%{background-position:-200% 0;}}
    .tg-game{font-size:11px;font-weight:600;letter-spacing:3.5px;text-transform:uppercase;color:rgba(255,255,255,0.28);position:relative;z-index:1;margin-bottom:36px;}
    .tg-bar-wrap{width:180px;height:2px;background:rgba(255,255,255,0.07);border-radius:999px;overflow:hidden;position:relative;z-index:1;margin-bottom:10px;}
    .tg-bar{height:100%;width:0%;background:linear-gradient(90deg,#60a5fa,#7ddc5f);border-radius:999px;box-shadow:0 0 8px rgba(96,165,250,0.5);position:relative;transition:width 0.3s ease;}
    .tg-bar::after{content:'';position:absolute;top:0;right:-20px;width:20px;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent);animation:tgBarShimmer 1.2s ease-in-out infinite;}
    @keyframes tgBarShimmer{0%{opacity:0;transform:translateX(-20px);}50%{opacity:1;}100%{opacity:0;transform:translateX(0);}}
    .tg-pct{font-size:11px;font-weight:600;font-variant-numeric:tabular-nums;color:rgba(255,255,255,0.18);position:relative;z-index:1;margin-bottom:10px;letter-spacing:0.5px;}
    .tg-stage{font-size:10px;color:rgba(255,255,255,0.12);position:relative;z-index:1;margin-bottom:28px;letter-spacing:1px;min-height:14px;transition:opacity 0.3s;}
    .tg-dots{display:flex;gap:7px;position:relative;z-index:1;}
    .tg-dot{width:5px;height:5px;border-radius:50%;animation:tgDotBounce 1.4s ease-in-out infinite;}
    .tg-dot:nth-child(1){animation-delay:0s;background:rgba(96,165,250,0.6);}
    .tg-dot:nth-child(2){animation-delay:0.18s;background:rgba(125,220,95,0.5);}
    .tg-dot:nth-child(3){animation-delay:0.36s;background:rgba(96,165,250,0.4);}
    @keyframes tgDotBounce{0%,80%,100%{transform:scale(1);opacity:0.4;}40%{transform:scale(1.6);opacity:1;}}
    .tg-tip{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);font-size:11px;color:rgba(255,255,255,0.16);max-width:260px;text-align:center;line-height:1.7;white-space:nowrap;z-index:1;}
  `;

  const WEIGHTS = { dom: 15, fonts: 25, images: 40, resources: 20 };

  const state = {
    dom: false, fonts: false, images: false, resources: false,
    imagesLoaded: 0, imagesTotal: 0,
    progress: 0,
  };

  let bar, pctEl, stageEl, finishFn;

  function calcProgress() {
    let p = 0;
    if (state.dom)       p += WEIGHTS.dom;
    if (state.fonts)     p += WEIGHTS.fonts;
    if (state.resources) p += WEIGHTS.resources;
    if (state.imagesTotal > 0) {
      p += WEIGHTS.images * (state.imagesLoaded / state.imagesTotal);
    } else {
      p += WEIGHTS.images;
    }
    return Math.min(Math.floor(p), 99);
  }

  function updateBar(val) {
    state.progress = val;
    if (!bar || !pctEl) return;
    bar.style.width   = val + '%';
    pctEl.textContent = val + '%';
  }

  function setStage(text) {
    if (stageEl) stageEl.textContent = text;
  }

  function tick() {
    updateBar(calcProgress());
  }

  function onDOM() {
    state.dom = true;
    setStage('DOM ready');
    tick();
    trackImages();
    trackResources();
  }

  if (document.readyState !== 'loading') {
    setTimeout(onDOM, 0);
  } else {
    document.addEventListener('DOMContentLoaded', function h() {
      document.removeEventListener('DOMContentLoaded', h);
      onDOM();
    });
  }

  if (document.fonts && typeof document.fonts.ready !== 'undefined') {
    setStage('Loading fonts…');
    document.fonts.ready.then(function () {
      state.fonts = true;
      setStage('Fonts loaded');
      tick();
    }).catch(function () {
      state.fonts = true;
      tick();
    });
  } else {
    state.fonts = true;
  }

  function trackImages() {
    const imgs = Array.from(document.querySelectorAll('img'));
    const pending = imgs.filter(function (img) { return !img.complete; });
    state.imagesTotal   = pending.length;
    state.imagesLoaded  = imgs.length - pending.length; // already-done ones

    if (pending.length === 0) {
      tick();
      return;
    }

    setStage('Loading images…');
    pending.forEach(function (img) {
      function done() {
        state.imagesLoaded++;
        setStage('Images ' + state.imagesLoaded + ' / ' + state.imagesTotal);
        tick();
      }
      img.addEventListener('load',  done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }

  function trackResources() {
    const links   = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const scripts = Array.from(document.querySelectorAll('script[src]'))
      .filter(function (s) { return !s.hasAttribute('async') && !s.hasAttribute('defer'); });

    const all = links.concat(scripts);
    if (all.length === 0) { state.resources = true; tick(); return; }

    let loaded = 0;
    setStage('Loading resources…');

    all.forEach(function (el) {
      const alreadyDone =
        (el.tagName === 'LINK' && el.sheet) ||
        (el.tagName === 'SCRIPT' && el.readyState === 'complete');

      if (alreadyDone) {
        loaded++;
        if (loaded >= all.length) { state.resources = true; tick(); }
        return;
      }

      function done() {
        loaded++;
        if (loaded >= all.length) {
          state.resources = true;
          setStage('Resources ready');
          tick();
        }
      }
      el.addEventListener('load',  done, { once: true });
      el.addEventListener('error', done, { once: true });
    });

    if (loaded >= all.length) { state.resources = true; tick(); }
  }

  function onFullLoad() {
    state.dom = state.fonts = state.images = state.resources = true;
    state.imagesLoaded = state.imagesTotal || 1;
    tick();
    setStage('Ready');
    setTimeout(function () { finishFn && finishFn(); }, 300);
  }

  if (document.readyState === 'complete') {
    setTimeout(onFullLoad, 0);
  } else {
    window.addEventListener('load', function h() {
      window.removeEventListener('load', h);
      onFullLoad();
    });
    setTimeout(onFullLoad, 8000);
  }

  function buildLoader() {
    if (!document.body) return;
    if (document.getElementById('tg-loader')) return;

    try {
      const s = document.createElement('style');
      s.textContent = CSS;
      (document.head || document.documentElement).appendChild(s);
    } catch (e) {}

    let gameName = 'Loading';
    try {
      const parts = (document.title || '').split('—');
      if (parts.length > 1) gameName = parts[0].trim();
    } catch (e) {}

    const tip = TIPS[Math.floor(Math.random() * TIPS.length)] || '';

    const loader = document.createElement('div');
    loader.id = 'tg-loader';
    loader.innerHTML = [
      '<div class="tg-logo">Task<span class="tg-logo-accent">Games</span></div>',
      '<div class="tg-game"></div>',
      '<div class="tg-bar-wrap"><div class="tg-bar" id="tg-bar"></div></div>',
      '<div class="tg-pct" id="tg-pct">0%</div>',
      '<div class="tg-stage" id="tg-stage"></div>',
      '<div class="tg-dots"><div class="tg-dot"></div><div class="tg-dot"></div><div class="tg-dot"></div></div>',
      '<div class="tg-tip"></div>',
    ].join('');

    loader.querySelector('.tg-game').textContent = gameName;
    loader.querySelector('.tg-tip').textContent  = tip;
    document.body.appendChild(loader);

    bar     = document.getElementById('tg-bar');
    pctEl   = document.getElementById('tg-pct');
    stageEl = document.getElementById('tg-stage');

    tick();

    finishFn = function () {
      updateBar(100);
      setTimeout(function () {
        loader.classList.add('tg-out');
        setTimeout(function () {
          try { loader.remove(); } catch (e) {}
          try { delete window.__tgLoaderInit; } catch (e) {}
        }, 600);
      }, 200);
    };

    if (document.readyState === 'complete') {
      state.dom = state.fonts = state.resources = true;
      state.imagesLoaded = Math.max(state.imagesTotal, 1);
      tick();
      setTimeout(finishFn, 500);
    }
  }

  if (document.body) {
    buildLoader();
  } else {
    document.addEventListener('DOMContentLoaded', function onReady() {
      document.removeEventListener('DOMContentLoaded', onReady);
      buildLoader();
    });
  }

})();