(function () {
  'use strict';

  var TABS = [
    { path: '/account', label: 'Профиль' },
    { path: '/account/preferences', label: 'Предпочтения' },
    { path: '/account/favorites', label: 'Избранное' },
    { path: '/account/history', label: 'История запросов' },
  ];

  var PRIORITIES = ['Цена', 'Скорость доставки', 'Гарантия', 'Рейтинг продавца', 'Возврат'];
  var unsubscribeFavorites = null;

  function esc(value) {
    return window.US.ui.esc(value);
  }

  function tabsHtml(activePath) {
    var count = window.US.store.count();
    return TABS.map(function (tab) {
      var active = tab.path === activePath;
      var badge = '';
      if (tab.path === '/account/favorites' && count > 0) {
        badge = '<span class="header__badge">' + count + '</span>';
      }
      return (
        '<a class="account__tab' + (active ? ' account__tab--active' : '') + '" href="#' + tab.path + '">' +
        esc(tab.label) + badge + '</a>'
      );
    }).join('');
  }

  function profileHtml() {
    var user = window.US.data.CURRENT_USER;
    return (
      '<section class="panel">' +
      '<h2 class="panel__title">Профиль</h2>' +
      '<p class="panel__lead">Данные профиля используются для расчёта доставки и персонализации рекомендаций.</p>' +
      '<dl class="fields">' +
      '<div class="fields__row"><dt>Имя</dt><dd>' + esc(user.name) + '</dd></div>' +
      '<div class="fields__row"><dt>Электронная почта</dt><dd>' + esc(user.email) + '</dd></div>' +
      '<div class="fields__row"><dt>Регион доставки</dt><dd>' + esc(user.region) + '</dd></div>' +
      '<div class="fields__row"><dt>Дата регистрации</dt><dd>' + esc(user.memberSince) + '</dd></div>' +
      '</dl>' +
      '<div class="panel__actions">' +
      '<a href="#/account/preferences" class="button button--primary">Настроить предпочтения</a>' +
      '<a href="#/account/favorites" class="button">Перейти в избранное</a>' +
      '</div>' +
      '</section>'
    );
  }

  function chip(value, label, active, attribute) {
    return (
      '<button type="button" class="chip' + (active ? ' chip--active' : '') + '" ' + attribute +
      '="' + esc(value) + '" aria-pressed="' + (active ? 'true' : 'false') + '">' + esc(label) + '</button>'
    );
  }

  function preferencesHtml() {
    var user = window.US.data.CURRENT_USER;
    var categories = window.US.data.CATEGORIES.map(function (category) {
      var active = user.favoriteCategories.indexOf(category.id) !== -1;
      return chip(category.id, category.title, active, 'data-pref-category');
    });
    var priorities = PRIORITIES.map(function (priority) {
      return chip(priority, priority, user.priorities.indexOf(priority) !== -1, 'data-pref-priority');
    });

    return (
      '<section class="panel">' +
      '<h2 class="panel__title">Предпочтения</h2>' +
      '<div class="preference">' +
      '<span class="preference__label">Интересующие категории</span>' +
      '<div class="chips">' + categories.join('') + '</div>' +
      '</div>' +
      '<div class="preference">' +
      '<span class="preference__label">Что важнее при выборе</span>' +
      '<div class="chips">' + priorities.join('') + '</div>' +
      '</div>' +
      '<div class="panel__actions">' +
      '<button type="button" class="button button--primary" data-save>Сохранить настройки</button>' +
      '<span class="panel__saved" data-saved hidden>Сохранено локально</span>' +
      '</div>' +
      '</section>'
    );
  }

  function favoritesHtml() {
    var data = window.US.data;
    var ids = window.US.store.ids();
    var products = data.CATALOG.filter(function (product) { return ids.indexOf(product.id) !== -1; });
    var views = window.US.products.sortProducts(window.US.products.buildProductViews(products), 'relevance');

    var content;
    if (views.length === 0) {
      content =
        '<div class="empty empty--compact">' +
        '<h3 class="empty__title">Пока пусто</h3>' +
        '<p class="empty__text">Нажмите «В избранное» в карточке товара — он появится здесь ' +
        'и будет доступен с любой страницы.</p>' +
        '<a href="#/search" class="button button--primary">Перейти в каталог</a>' +
        '</div>';
    } else {
      content =
        '<div class="grid grid--narrow">' +
        views.map(function (view) { return window.US.ui.productCard(view, {}); }).join('') +
        '</div>';
    }

    return (
      '<section class="panel">' +
      '<h2 class="panel__title">Избранное</h2>' +
      '<p class="panel__lead">Отмеченные товары сохраняются в браузере.</p>' +
      content +
      '</section>'
    );
  }

  var HISTORY = [
    { date: '3 ноября 2026', query: 'смартфон с хорошей камерой до 50 000', results: 5 },
    { date: '1 ноября 2026', query: 'наушники с шумоподавлением', results: 2 },
    { date: '28 октября 2026', query: 'кофемашина для дома', results: 1 },
    { date: '24 октября 2026', query: 'кроссовки для бега', results: 1 },
  ];

  function historyHtml() {
    var rows = HISTORY.map(function (item) {
      return (
        '<div class="history__row">' +
        '<span class="history__date">' + esc(item.date) + '</span>' +
        '<span class="history__query">' + esc(item.query) + '</span>' +
        '<span>' + item.results + ' товаров</span>' +
        '<a class="history__repeat" href="#/search?q=' + encodeURIComponent(item.query) + '">Повторить</a>' +
        '</div>'
      );
    }).join('');

    return (
      '<section class="panel">' +
      '<h2 class="panel__title">История запросов</h2>' +
      '<p class="panel__lead">Запросы используются для персонализации: система поднимает в выдаче то, ' +
      'что совпадает с вашими прошлыми интересами.</p>' +
      '<div class="history">' +
      '<div class="history__row history__row--head">' +
      '<span>Дата</span><span>Запрос</span><span>Найдено</span><span></span>' +
      '</div>' + rows + '</div>' +
      '</section>'
    );
  }

  function sectionFor(path) {
    if (path === '/account/preferences') return 'preferences';
    if (path === '/account/favorites') return 'favorites';
    if (path === '/account/history') return 'history';
    return 'profile';
  }

  function contentHtml(section) {
    if (section === 'preferences') return preferencesHtml();
    if (section === 'favorites') return favoritesHtml();
    if (section === 'history') return historyHtml();
    return profileHtml();
  }

  function render(params, path) {
    var user = window.US.data.CURRENT_USER;
    var section = sectionFor(path);

    var html =
      '<div class="account container">' +
      '<nav class="breadcrumbs" aria-label="Навигационная цепочка">' +
      '<a href="#/">Главная</a><span aria-hidden="true">/</span><span>Личный кабинет</span></nav>' +
      '<header class="account__header">' +
      '<span class="account__avatar" aria-hidden="true">' + esc(user.name.charAt(0)) + '</span>' +
      '<div><h1 class="account__title">' + esc(user.name) + '</h1>' +
      '<p class="account__subtitle">' + esc(user.email) + ' · ' + esc(user.region) +
      ' · с ' + esc(user.memberSince) + '</p></div>' +
      '</header>' +
      '<div class="account__layout">' +
      '<nav class="account__tabs" aria-label="Разделы личного кабинета">' + tabsHtml(path) + '</nav>' +
      '<div class="account__content" data-account-content>' + contentHtml(section) + '</div>' +
      '</div>' +
      '</div>';

    window.US.layout.main().innerHTML = html;
    document.title = 'Умный Шопинг — личный кабинет';
    window.scrollTo(0, 0);
    bind(section);

    if (section === 'favorites' && !unsubscribeFavorites) {
      unsubscribeFavorites = window.US.store.subscribe(function () {
        var content = document.querySelector('[data-account-content]');
        if (content) content.innerHTML = favoritesHtml();
        var tabs = document.querySelector('.account__tabs');
        if (tabs) tabs.innerHTML = tabsHtml('/account/favorites');
      });
    }
  }

  function bind(section) {
    var main = window.US.layout.main();

    if (main.__accountHandler) {
      main.removeEventListener('click', main.__accountHandler);
    }

    var handler = function (event) {
      var chipNode = event.target.closest('[data-pref-category], [data-pref-priority]');
      if (chipNode) {
        var active = chipNode.classList.toggle('chip--active');
        chipNode.setAttribute('aria-pressed', active ? 'true' : 'false');
        return;
      }

      if (event.target.closest('[data-save]')) {
        var saved = document.querySelector('[data-saved]');
        if (saved) {
          saved.hidden = false;
          window.setTimeout(function () { saved.hidden = true; }, 2500);
        }
      }
    };

    main.__accountHandler = handler;
    main.addEventListener('click', handler);
  }

  function destroy() {
    var main = window.US.layout.main();
    if (main && main.__accountHandler) {
      main.removeEventListener('click', main.__accountHandler);
      main.__accountHandler = null;
    }
    if (unsubscribeFavorites) {
      unsubscribeFavorites();
      unsubscribeFavorites = null;
    }
  }

  window.US = window.US || {};
  window.US.views = window.US.views || {};
  window.US.views.account = {
    render: render,
    destroy: destroy,
  };
})();
