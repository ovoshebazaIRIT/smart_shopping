(function () {
  'use strict';

  var PAGE_SIZE = 12;
  var RESPONSE_DELAY = 300;

  function applyFilters(params) {
    var byQuery = window.US.products.searchProducts(window.US.data.CATALOG, params.query);
    var byCategory = params.category
      ? byQuery.filter(function (product) { return product.category === params.category; })
      : byQuery;
    return window.US.products.sortProducts(window.US.products.buildProductViews(byCategory), params.sort);
  }

  function fetchPage(params, page, signal) {
    var filtered = applyFilters(params);
    var start = (page - 1) * PAGE_SIZE;
    var items = filtered.slice(start, start + PAGE_SIZE);
    var result = {
      items: items,
      total: filtered.length,
      page: page,
      hasMore: start + items.length < filtered.length,
    };

    return new Promise(function (resolve, reject) {
      var timer = window.setTimeout(function () {
        if (signal) signal.removeEventListener('abort', onAbort);
        resolve(result);
      }, RESPONSE_DELAY);

      function onAbort() {
        window.clearTimeout(timer);
        reject(new DOMException('Запрос отменён', 'AbortError'));
      }

      if (signal && signal.aborted) {
        onAbort();
        return;
      }
      if (signal) signal.addEventListener('abort', onAbort);
    });
  }

  window.US = window.US || {};
  window.US.catalog = {
    PAGE_SIZE: PAGE_SIZE,
    fetchPage: fetchPage,
  };
})();
