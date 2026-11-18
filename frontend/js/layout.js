(function () {
  'use strict';

  var mainEl = null;

  function headerHtml() {
    return (
      '<header class="header">' +
      '<div class="header__top container">' +
      '<a class="logo" href="#/">Умный Шопинг</a>' +
      '<div class="header__search">' +
      '<form class="search" role="search" data-search-form>' +
      '<input class="search__input" type="search" name="q" placeholder="Найти товар" aria-label="Поисковый запрос">' +
      '<button class="search__submit" type="submit">Найти</button>' +
      '</form>' +
      '</div>' +
      '<a class="header__account" href="#/account">Личный кабинет</a>' +
      '</div>' +
      '<div class="header__bottom">' +
      '<nav class="header__nav container" aria-label="Основная навигация">' +
      '<a class="header__link" data-nav="/" href="#/">Главная</a>' +
      '<a class="header__link" data-nav="/search" href="#/search">Каталог</a>' +
      '<a class="header__link" data-nav="/account/favorites" href="#/account/favorites">' +
      'Избранное <span class="header__badge" data-fav-count hidden>0</span>' +
      '</a>' +
      '</nav>' +
      '</div>' +
      '</header>'
    );
  }

  function footerHtml() {
    return (
      '<footer class="footer">' +
      '<div class="footer__inner container">' +
      '<div class="footer__brand"><span class="footer__title">Умный Шопинг</span></div>' +
      '<nav class="footer__column" aria-label="Разделы">' +
      '<span class="footer__heading">Сервис</span>' +
      '<a href="#/">Главная</a>' +
      '<a href="#/search">Каталог</a>' +
      '<a href="#/account">Личный кабинет</a>' +
      '</nav>' +
      '<nav class="footer__column" aria-label="Личный кабинет">' +
      '<span class="footer__heading">Профиль</span>' +
      '<a href="#/account/favorites">Избранное</a>' +
      '<a href="#/account/preferences">Предпочтения</a>' +
      '<a href="#/account/history">История запросов</a>' +
      '</nav>' +
      '</div>' +
      '<div class="footer__bottom container">' +
      '<span>© ' + new Date().getFullYear() + ' «Умный Шопинг»</span>' +
      '<span>Версия 0.1.0</span>' +
      '</div>' +
      '</footer>'
    );
  }

  function bindHeader() {
    var form = document.querySelector('[data-search-form]');
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('.search__input');
        var value = (input.value || '').trim();
        var params = new URLSearchParams();
        if (value) params.set('q', value);
        window.US.router.navigate('/search', params);
      });
    }
  }

  function mount() {
    var app = document.getElementById('app');
    app.className = 'app';
    app.innerHTML = headerHtml() + '<main class="app__main" id="main"></main>' + footerHtml();
    mainEl = document.getElementById('main');
    bindHeader();
    // Делегирование кликов по карточкам живёт на <main> и переживает смену страниц.
    window.US.ui.bindCards(mainEl);
    window.US.store.notify();
    return mainEl;
  }

  function main() {
    return mainEl || document.getElementById('main');
  }

  function setActive(path) {
    var links = document.querySelectorAll('[data-nav]');
    for (var i = 0; i < links.length; i += 1) {
      var target = links[i].getAttribute('data-nav');
      var active = false;
      if (target === '/') active = path === '/';
      else if (target === '/search') active = path.indexOf('/search') === 0;
      else active = path === target;
      links[i].classList.toggle('header__link--active', active);
    }
  }

  window.US = window.US || {};
  window.US.layout = {
    mount: mount,
    main: main,
    setActive: setActive,
  };
})();
