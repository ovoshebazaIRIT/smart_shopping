(function () {
  'use strict';

  var f = null;
  var data = null;

  function init() {
    f = window.US.format;
    data = window.US.data;
  }

  function esc(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function row(label, value) {
    return '<div><dt>' + esc(label) + '</dt><dd>' + esc(value) + '</dd></div>';
  }

  /** Карточка товара для ленты и избранного. */
  function productCard(view, options) {
    if (!f) init();
    var settings = options || {};
    var product = view.product;
    var category = data.CATEGORY_BY_ID[product.category];
    var fav = window.US.store.isFavorite(product.id);
    var deliveryText =
      f.delivery(view.bestOffer.offer.deliveryCost) + ', ' + f.days(view.bestOffer.offer.deliveryDays);

    return (
      '<article class="card' + (settings.recommended ? ' card--recommended' : '') + '">' +
      '<div class="card__head">' +
      '<span class="card__category">' + esc(category.title) + '</span>' +
      (settings.recommended ? '<span class="card__label">Рекомендуем</span>' : '') +
      '</div>' +
      '<button type="button" class="card__title" data-open="' + esc(product.id) + '">' +
      esc(product.title) +
      '</button>' +
      '<p class="card__specs">' + esc(product.specs.slice(0, 3).join(' · ')) + '</p>' +
      '<dl class="card__rows">' +
      row('Цена', 'от ' + f.price(view.minPrice)) +
      row('Предложений', String(view.offerCount)) +
      row('Доставка', deliveryText) +
      row('Рейтинг', product.rating.toFixed(1)) +
      '</dl>' +
      '<div class="card__actions">' +
      '<button type="button" class="button button--small" data-open="' + esc(product.id) + '">Подробнее</button>' +
      '<button type="button" class="button button--small' + (fav ? ' button--active' : '') + '"' +
      ' data-fav="' + esc(product.id) + '" aria-pressed="' + (fav ? 'true' : 'false') + '">' +
      (fav ? 'В избранном' : 'В избранное') +
      '</button>' +
      '</div>' +
      '</article>'
    );
  }

  function skeletonCard() {
    return (
      '<div class="card card--skeleton" aria-hidden="true">' +
      '<span class="skeleton skeleton--xs"></span>' +
      '<span class="skeleton skeleton--lg"></span>' +
      '<span class="skeleton skeleton--sm"></span>' +
      '<span class="skeleton skeleton--xs"></span>' +
      '<span class="skeleton skeleton--row"></span>' +
      '<span class="skeleton skeleton--row"></span>' +
      '<span class="skeleton skeleton--row"></span>' +
      '<span class="skeleton skeleton--row"></span>' +
      '<span class="skeleton skeleton--button"></span>' +
      '</div>'
    );
  }

  function skeletons(count, keyPrefix) {
    var html = '';
    for (var i = 0; i < count; i += 1) {
      html += skeletonCard();
    }
    return html;
  }

  /** Делегирование кликов по карточкам: открыть товар и переключить избранное. */
  function bindCards(container) {
    container.addEventListener('click', function (event) {
      var favButton = event.target.closest('[data-fav]');
      if (favButton) {
        window.US.store.toggle(favButton.getAttribute('data-fav'));
        return;
      }
      var openButton = event.target.closest('[data-open]');
      if (openButton) {
        window.US.router.setParam('product', openButton.getAttribute('data-open'));
      }
    });
  }

  window.US = window.US || {};
  window.US.ui = {
    esc: esc,
    productCard: productCard,
    skeletons: skeletons,
    bindCards: bindCards,
  };
})();
