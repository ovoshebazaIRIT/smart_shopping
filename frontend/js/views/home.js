(function () {
  'use strict';

  function recommendationSquare(view) {
    var f = window.US.format;
    return (
      '<button type="button" class="square" data-open="' + window.US.ui.esc(view.product.id) + '">' +
      '<span class="square__category">' + window.US.ui.esc(view.product.brand) + '</span>' +
      '<span class="square__title">' + window.US.ui.esc(view.product.title) + '</span>' +
      '<span class="square__price">от ' + f.price(view.minPrice) + '</span>' +
      '<span class="square__meta">' + view.offerCount + ' ' +
      f.plural(view.offerCount, 'предложение', 'предложения', 'предложений') + ' · ' +
      f.days(view.fastestDelivery) + '</span>' +
      '</button>'
    );
  }

  function quickLink(item) {
    return (
      '<a class="square square--link" href="#/search?q=' + encodeURIComponent(item.query) + '">' +
      '<span class="square__title">' + window.US.ui.esc(item.title) + '</span>' +
      '<span class="square__meta">Смотреть предложения</span>' +
      '</a>'
    );
  }

  function render() {
    var data = window.US.data;
    var products = window.US.products;
    var recommendations = products
      .sortProducts(products.buildProductViews(data.PRODUCTS), 'relevance')
      .slice(0, 8);

    window.US.layout.main().innerHTML =
      '<div class="page container">' +
      '<section class="block">' +
      '<div class="block__head">' +
      '<h1 class="block__title">Рекомендации</h1>' +
      '<a class="block__link" href="#/search">Все предложения</a>' +
      '</div>' +
      '<div class="squares squares--four">' +
      recommendations.map(recommendationSquare).join('') +
      '</div>' +
      '</section>' +
      '<section class="block">' +
      '<div class="block__head"><h2 class="block__title">Быстрый переход</h2></div>' +
      '<div class="squares squares--four">' +
      data.QUICK_LINKS.map(quickLink).join('') +
      '</div>' +
      '</section>' +
      '</div>';

    document.title = 'Умный Шопинг — поиск и сравнение товаров';
    window.scrollTo(0, 0);
  }

  window.US = window.US || {};
  window.US.views = window.US.views || {};
  window.US.views.home = {
    render: render,
    onParams: function (params) {
      var id = params.get('product');
      if (id) window.US.modal.open(id);
      else window.US.modal.close();
    },
    destroy: function () {
      window.US.modal.close();
    },
  };
})();
