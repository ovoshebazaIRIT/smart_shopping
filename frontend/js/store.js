(function () {
  'use strict';

  var STORAGE_KEY = 'umnyi-shop:favorites';
  var listeners = [];
  var ids = read();

  function read() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(function (item) { return typeof item === 'string'; }) : [];
    } catch (error) {
      return [];
    }
  }

  function save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      /* приватный режим — избранное живёт до перезагрузки */
    }
  }

  function count() {
    return ids.length;
  }

  function isFavorite(id) {
    return ids.indexOf(id) !== -1;
  }

  function toggle(id) {
    var index = ids.indexOf(id);
    if (index === -1) ids.push(id);
    else ids.splice(index, 1);
    save();
    notify();
  }

  function updateBadges() {
    var badges = document.querySelectorAll('[data-fav-count]');
    for (var i = 0; i < badges.length; i += 1) {
      badges[i].textContent = String(ids.length);
      badges[i].hidden = ids.length === 0;
    }
  }

  function refreshButtons() {
    var buttons = document.querySelectorAll('[data-fav]');
    for (var i = 0; i < buttons.length; i += 1) {
      var id = buttons[i].getAttribute('data-fav');
      var active = isFavorite(id);
      buttons[i].textContent = active ? 'В избранном' : 'В избранное';
      buttons[i].classList.toggle('button--active', active);
      buttons[i].setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  }

  function notify() {
    updateBadges();
    refreshButtons();
    listeners.forEach(function (listener) {
      try {
        listener(ids);
      } catch (error) {
        console.error(error);
      }
    });
  }

  function subscribe(listener) {
    listeners.push(listener);
    return function () {
      listeners = listeners.filter(function (item) { return item !== listener; });
    };
  }

  window.US = window.US || {};
  window.US.store = {
    count: count,
    ids: function () { return ids.slice(); },
    isFavorite: isFavorite,
    toggle: toggle,
    subscribe: subscribe,
    notify: notify,
  };
})();
