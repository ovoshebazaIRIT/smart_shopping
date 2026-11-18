(function () {
  'use strict';

  var root = null;
  var lastFocus = null;

  function findProduct(id) {
    var list = window.US.data.CATALOG;
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function offersHtml(view) {
    var f = window.US.format;
    var rows = view.offers
      .map(function (item) {
        return (
          '<div class="offers__row' + (item.isBest ? ' offers__row--best' : '') + '">' +
          '<span class="offers__shop">' + window.US.ui.esc(item.shop.name) +
          '<small>рейтинг ' + item.shop.rating.toFixed(1) + ' · ' +
          f.number(item.shop.reviews) + ' отзывов</small></span>' +
          '<span>' + f.price(item.offer.price) + '</span>' +
          '<span>' + f.delivery(item.offer.deliveryCost) +
          '<small>' + f.days(item.offer.deliveryDays) + '</small></span>' +
          '<span class="offers__total">' + f.price(item.total) +
          (item.isBest ? '<small class="offers__badge">лучший вариант</small>' : '') +
          '</span>' +
          '</div>'
        );
      })
      .join('');

    return (
      '<div class="offers">' +
      '<div class="offers__row offers__row--head">' +
      '<span>Магазин</span><span>Цена</span><span>Доставка</span><span>Итого</span>' +
      '</div>' + rows + '</div>'
    );
  }

  function buildHtml(product, view) {
    var f = window.US.format;
    var data = window.US.data;
    var category = data.CATEGORY_BY_ID[product.category];
    var best = view.bestOffer;

    return (
      '<div class="modal__dialog" role="dialog" aria-modal="true" aria-label="' +
      window.US.ui.esc(product.title) + '">' +
      '<button type="button" class="modal__close" aria-label="Закрыть">×</button>' +
      '<div class="product-modal">' +
      '<p class="product-modal__eyebrow">' + window.US.ui.esc(category.title) + '</p>' +
      '<h2 class="product-modal__title">' + window.US.ui.esc(product.title) + '</h2>' +
      '<p class="product-modal__brand">Бренд: ' + window.US.ui.esc(product.brand) +
      ' · рейтинг ' + product.rating.toFixed(1) +
      ' · ' + f.number(product.reviews) + ' отзывов</p>' +
      '<ul class="product-modal__specs">' +
      product.specs.map(function (spec) {
        return '<li>' + window.US.ui.esc(spec) + '</li>';
      }).join('') +
      '</ul>' +
      '<dl class="product-modal__stats">' +
      '<div><dt>Магазинов</dt><dd>' + product.offers.length + '</dd></div>' +
      '<div><dt>Минимальная цена</dt><dd>' + f.price(view.minPrice) + '</dd></div>' +
      '<div><dt>Быстрая доставка</dt><dd>' + f.days(view.fastestDelivery) + '</dd></div>' +
      '</dl>' +
      '<h3 class="product-modal__subtitle">Предложения магазинов</h3>' +
      offersHtml(view) +
      '<div class="recommendation">' +
      '<span class="recommendation__label">Рекомендация системы</span>' +
      '<p class="recommendation__text">' +
      window.US.ui.esc(window.US.products.buildRecommendation(view)) + '</p>' +
      '</div>' +
      '<div class="product-modal__actions">' +
      '<button type="button" class="button button--primary" data-fav="' +
      window.US.ui.esc(product.id) + '"></button>' +
      '<button type="button" class="button" disabled>Перейти в магазин</button>' +
      '</div>' +
      '</div>' +
      '</div>'
    );
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') window.US.router.setParam('product', null);
  }

  function onOverlayClick(event) {
    if (event.target === root) window.US.router.setParam('product', null);
  }

  function open(id) {
    var product = findProduct(id);
    if (!product) return;
    close();

    lastFocus = document.activeElement;
    var view = window.US.products.toProductView(product);

    root = document.createElement('div');
    root.className = 'modal';
    root.setAttribute('role', 'presentation');
    root.innerHTML = buildHtml(product, view);
    document.body.appendChild(root);
    document.body.classList.add('is-locked');

    var closeButton = root.querySelector('.modal__close');
    closeButton.addEventListener('click', function () {
      window.US.router.setParam('product', null);
    });
    root.addEventListener('click', onOverlayClick);
    document.addEventListener('keydown', onKeyDown);

    window.US.store.notify();
    if (closeButton) closeButton.focus();
  }

  function close() {
    if (!root) return;
    root.removeEventListener('click', onOverlayClick);
    document.removeEventListener('keydown', onKeyDown);
    if (root.parentNode) root.parentNode.removeChild(root);
    root = null;
    document.body.classList.remove('is-locked');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
      lastFocus = null;
    }
  }

  window.US = window.US || {};
  window.US.modal = {
    open: open,
    close: close,
    isOpen: function () { return root !== null; },
  };
})();
