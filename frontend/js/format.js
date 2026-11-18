(function () {
  'use strict';

  var priceFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  });
  var numberFormatter = new Intl.NumberFormat('ru-RU');

  function price(value) {
    return priceFormatter.format(value);
  }

  function number(value) {
    return numberFormatter.format(value);
  }

  /** «1 день», «2 дня», «5 дней». */
  function days(count) {
    return count + ' ' + plural(count, 'день', 'дня', 'дней');
  }

  /** 0 → «Бесплатно». */
  function delivery(cost) {
    return cost === 0 ? 'Бесплатно' : price(cost);
  }

  /** Склонение: 1 товар, 2 товара, 5 товаров. */
  function plural(value, one, few, many) {
    var mod10 = Math.abs(value) % 10;
    var mod100 = Math.abs(value) % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }

  window.US = window.US || {};
  window.US.format = {
    price: price,
    number: number,
    days: days,
    delivery: delivery,
    plural: plural,
  };
})();
