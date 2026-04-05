(function () {
  const HOME_PATH = '/index.html';

  function createFullscreenButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-back nav-fullscreen';
    btn.setAttribute('aria-label', 'Toggle fullscreen');
    btn.title = 'Toggle fullscreen';
    btn.textContent = 'Toggle fullscreen';
    btn.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch {}
    });
    return btn;
  }

  function getGameTitle() {
    const title = document.title || 'Game';
    return title.split(' - ')[0].split(' — ')[0].trim();
  }

  function injectBar() {
    const nav = document.createElement('nav');
    nav.className = 'game-nav injected-game-nav';
    nav.innerHTML = `
      <a href="${HOME_PATH}" class="nav-back" title="Back to home" aria-label="Back to home">&#8592;</a>
      <span class="nav-game-title">${getGameTitle()}</span>
      <div class="nav-right-slot"></div>
    `;
    document.body.prepend(nav);
    return nav;
  }

  function init() {
    const nav = document.querySelector('.game-nav') || injectBar();
    const back = nav.querySelector('.nav-back');
    if (back && !back.getAttribute('href')) {
      back.setAttribute('href', HOME_PATH);
    }
    if (!back || nav.querySelector('.nav-fullscreen')) return;
    back.insertAdjacentElement('afterend', createFullscreenButton());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
