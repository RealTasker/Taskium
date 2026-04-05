(function () {
  const PREFIX = 'taskgames.save.';

  function fullKey(key) {
    return PREFIX + key;
  }

  function load(key, fallback = null) {
    try {
      const raw = localStorage.getItem(fullKey(key));
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(fullKey(key), JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function clear(key) {
    try {
      localStorage.removeItem(fullKey(key));
    } catch {}
  }

  window.TaskGamesSave = { load, save, clear };
})();
