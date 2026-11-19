(function () {
  'use strict';

  var STOP_WORDS = [
    'и', 'с', 'в', 'на', 'для', 'до', 'от', 'по', 'мне', 'нужен', 'нужна', 'нужно',
    'хочу', 'купить', 'подбери', 'найди', 'пожалуйста', 'чем', 'что', 'без', 'или',
    'хорошей', 'хороший', 'хорошая', 'лучше', 'недорого', 'рублей', 'руб', 'цена',
  ];

  function shop(id) {
    return window.US.data.SHOP_BY_ID[id];
  }

  /** Ограничение бюджета из запроса «... до 50 000 рублей». */
  function parseBudget(query) {
    var match = query.match(/до\s*([\d\s]{3,9})/i);
    if (!match) return null;
    var value = Number(match[1].replace(/\s/g, ''));
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  function tokenize(query) {
    return query
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(function (token) {
        return token.length > 1 && STOP_WORDS.indexOf(token) === -1 && !/^\d+$/.test(token);
      });
  }

  function haystack(product) {
    return [product.title, product.brand].concat(product.specs).join(' ').toLowerCase();
  }

  function searchProducts(products, query) {
    var tokens = tokenize(query);
    var budget = parseBudget(query);

    return products.filter(function (product) {
      if (budget !== null) {
        var cheapest = Math.min.apply(null, product.offers.map(function (offer) { return offer.price; }));
        if (cheapest > budget) return false;
      }
      if (tokens.length === 0) return true;
      var text = haystack(product);
      return tokens.some(function (token) { return text.indexOf(token) !== -1; });
    });
  }

  function evaluateOffer(offer, product) {
    var seller = shop(offer.shopId);
    var total = offer.price + offer.deliveryCost;
    var minPrice = Math.min.apply(null, product.offers.map(function (item) {
      return item.price + item.deliveryCost;
    }));
    var minDays = Math.min.apply(null, product.offers.map(function (item) { return item.deliveryDays; }));

    var priceScore = minPrice / total;
    var deliveryScore = minDays / offer.deliveryDays;
    var ratingScore = seller.rating / 5;
    var score = Math.round((priceScore * 0.5 + deliveryScore * 0.25 + ratingScore * 0.25) * 1000) / 10;

    var reasons = [];
    if (total === minPrice) reasons.push('самая низкая итоговая стоимость');
    if (offer.deliveryDays === minDays) reasons.push('быстрая доставка');
    if (seller.rating >= 4.6) reasons.push('высокий рейтинг продавца');
    if (offer.deliveryCost === 0) reasons.push('бесплатная доставка');

    return {
      offer: offer,
      shop: seller,
      total: total,
      score: score,
      reasons: reasons,
      isBest: false,
    };
  }

  function toProductView(product) {
    var offers = product.offers
      .map(function (offer) { return evaluateOffer(offer, product); })
      .sort(function (a, b) { return b.score - a.score; })
      .map(function (view, index) {
        view.isBest = index === 0;
        return view;
      });

    return {
      product: product,
      minPrice: Math.min.apply(null, product.offers.map(function (offer) { return offer.price; })),
      offerCount: product.offers.length,
      fastestDelivery: Math.min.apply(null, product.offers.map(function (offer) { return offer.deliveryDays; })),
      bestOffer: offers[0],
      score: offers[0].score,
      offers: offers,
    };
  }

  function buildProductViews(products) {
    return products.map(toProductView);
  }

  function sortProducts(views, sort) {
    var sorted = views.slice();
    if (sort === 'price-asc') return sorted.sort(function (a, b) { return a.minPrice - b.minPrice; });
    if (sort === 'delivery') return sorted.sort(function (a, b) { return a.fastestDelivery - b.fastestDelivery; });
    if (sort === 'rating') return sorted.sort(function (a, b) { return b.product.rating - a.product.rating; });
    return sorted.sort(function (a, b) { return b.score - a.score; });
  }

  /** Текст-объяснение, почему система советует этот вариант. */
  function buildRecommendation(view) {
    var best = view.bestOffer;
    var parts = [
      best.shop.name + ' — ' + window.US.format.price(best.offer.price),
      best.offer.deliveryCost === 0 ? 'бесплатная доставка' : 'доставка ' + window.US.format.price(best.offer.deliveryCost),
      'срок ' + window.US.format.days(best.offer.deliveryDays),
    ];
    var reason = best.reasons.length > 0 ? best.reasons.join(', ') : 'сбалансированный вариант';
    return parts.join(', ') + '. Причины выбора: ' + reason + '.';
  }

  window.US = window.US || {};
  window.US.products = {
    parseBudget: parseBudget,
    searchProducts: searchProducts,
    evaluateOffer: evaluateOffer,
    toProductView: toProductView,
    buildProductViews: buildProductViews,
    sortProducts: sortProducts,
    buildRecommendation: buildRecommendation,
  };
})();
