(function () {
  'use strict';

  var SORT_OPTIONS = [
    { value: 'relevance', label: 'По релевантности' },
    { value: 'price-asc', label: 'Сначала дешёвые' },
    { value: 'delivery', label: 'Быстрая доставка' },
    { value: 'rating', label: 'Высокий рейтинг' },
  ];
  var SORTS = SORT_OPTIONS.map(function (option) { return option.value; });

  var state = null;
  var observer = null;
  var handlers = null;

  function normalizeSort(value) {
    return SORTS.indexOf(value) === -1 ? 'relevance' : value;
  }

  function readFilters(params) {
    return {
      query: params.get('q') || '',
      category: params.get('category') || null,
      sort: normalizeSort(params.get('sort')),
    };
  }

  function chipsHtml(activeCategory) {
    var categories = window.US.data.CATEGORIES;
    var all = '<button type="button" class="chip' + (activeCategory ? '' : ' chip--active') +
      '" data-category="">Все категории</button>';
    var rest = categories.map(function (category) {
      return (
        '<button type="button" class="chip' +
        (activeCategory === category.id ? ' chip--active' : '') +
        '" data-category="' + category.id + '">' +
        window.US.ui.esc(category.title) + '</button>'
      );
    });
    return all + rest.join('');
  }

  function shellHtml(filters) {
    var esc = window.US.ui.esc;
    var options = SORT_OPTIONS.map(function (option) {
      return (
        '<option value="' + option.value + '"' +
        (option.value === filters.sort ? ' selected' : '') + '>' +
        option.label + '</option>'
      );
    }).join('');

    return (
      '<div class="search-page container">' +
      '<nav class="breadcrumbs" aria-label="Навигационная цепочка">' +
      '<a href="#/">Главная</a><span aria-hidden="true">/</span><span>Каталог</span></nav>' +
      '<div class="search-page__head">' +
      '<h1 class="search-page__title">' +
      (filters.query ? 'Результаты по запросу «' + esc(filters.query) + '»' : 'Каталог товаров') +
      '</h1>' +
      '<p class="search-page__summary" id="catalog-summary">Загружаем предложения…</p>' +
      '</div>' +
      '<div class="search-page__bar">' +
      '<form class="search" role="search" data-page-search>' +
      '<input class="search__input" type="search" value="' + esc(filters.query) + '"' +
      ' placeholder="Уточнить запрос" aria-label="Поисковый запрос">' +
      '<button class="search__submit" type="submit">Найти</button>' +
      '</form>' +
      '<div class="search-page__controls">' +
      '<div class="filters">' + chipsHtml(filters.category) + '</div>' +
      '<label class="sort"><span class="sort__label">Сортировка</span>' +
      '<select class="sort__select" data-sort>' + options + '</select></label>' +
      '</div>' +
      '</div>' +
      '<div id="catalog-body"></div>' +
      '<div class="catalog__footer" id="catalog-footer"></div>' +
      '</div>'
    );
  }

  function paintSummary() {
    var node = document.getElementById('catalog-summary');
    if (!node || !state) return;
    if (state.status === 'loading') {
      node.textContent = 'Загружаем предложения…';
      return;
    }
    node.textContent = 'Найдено ' + state.total + ' ' +
      window.US.format.plural(state.total, 'товар', 'товара', 'товаров');
  }

  function paintBody() {
    var node = document.getElementById('catalog-body');
    if (!node || !state) return;
    var ui = window.US.ui;

    if (state.status === 'error' && state.items.length === 0) {
      node.innerHTML =
        '<div class="catalog__failure" role="alert">' +
        '<p class="catalog__failure-text">Не удалось загрузить товары.</p>' +
        '<button type="button" class="button" data-retry>Повторить</button>' +
        '</div>';
      return;
    }

    if (state.status === 'ready' && state.items.length === 0) {
      node.innerHTML =
        '<div class="empty">' +
        '<h2 class="empty__title">Ничего не нашлось</h2>' +
        '<p class="empty__text">Попробуйте изменить формулировку или снять фильтр категории. ' +
        'Например: «наушники с шумоподавлением» или «кофемашина до 35 000».</p>' +
        '<div class="empty__actions">' +
        '<button type="button" class="button" data-reset>Сбросить фильтры</button>' +
        '<a href="#/" class="button button--primary">На главную</a>' +
        '</div>' +
        '</div>';
      return;
    }

    var html = '';
    if (state.status === 'loading') {
      html = ui.skeletons(window.US.catalog.PAGE_SIZE);
    } else {
      html = state.items.map(function (view, index) {
        return ui.productCard(view, { recommended: index === 0 && state.filters.sort === 'relevance' });
      }).join('');
      if (state.status === 'loadingMore') html += ui.skeletons(3);
    }

    node.innerHTML =
      '<div class="grid" aria-busy="' + (state.status === 'loading' || state.status === 'loadingMore') + '">' +
      html + '</div>';
  }

  function paintFooter() {
    var node = document.getElementById('catalog-footer');
    if (!node || !state) return;

    var parts = [];
    if (state.hasMore) {
      parts.push('<div id="catalog-sentinel" class="catalog__sentinel" aria-hidden="true"></div>');
    }
    if (state.status === 'error' && state.items.length > 0) {
      parts.push(
        '<p class="catalog__failure-text" role="alert">Не удалось загрузить ещё предложения. ' +
        '<button type="button" class="catalog__link" data-retry>Повторить</button></p>',
      );
    }
    if (state.hasMore) {
      parts.push(
        '<button type="button" class="button" data-more' +
        (state.status === 'loadingMore' ? ' disabled' : '') + '>' +
        (state.status === 'loadingMore' ? 'Загружаем…' : 'Показать ещё') + '</button>',
      );
    } else if (state.items.length > 0) {
      parts.push(
        '<p class="catalog__end" role="status">Показано ' + state.items.length + ' из ' +
        state.total + ' — список закончился</p>',
      );
    }

    node.innerHTML = parts.join('');

    if (state.hasMore && 'IntersectionObserver' in window) {
      var sentinel = document.getElementById('catalog-sentinel');
      if (!observer) {
        observer = new IntersectionObserver(function (entries) {
          var visible = entries.some(function (entry) { return entry.isIntersecting; });
          if (visible) loadMore();
        }, { rootMargin: '0px' });
      }
      observer.disconnect();
      if (sentinel) observer.observe(sentinel);
    }
  }

  function paint() {
    paintSummary();
    paintBody();
    paintFooter();
    window.US.store.notify();
  }

  function loadFirst() {
    state.page = 0;
    state.items = [];
    state.total = 0;
    state.hasMore = false;
    state.status = 'loading';
    state.requestId += 1;
    var requestId = state.requestId;
    paint();

    window.US.catalog
      .fetchPage(state.filters, 1)
      .then(function (page) {
        if (!state || requestId !== state.requestId) return;
        state.items = page.items;
        state.total = page.total;
        state.page = 1;
        state.hasMore = page.hasMore;
        state.status = 'ready';
        paint();
      })
      .catch(function (error) {
        if (!state || requestId !== state.requestId) return;
        if (error && error.name === 'AbortError') return;
        state.status = 'error';
        paint();
      });
  }

  function loadMore() {
    if (!state || state.status === 'loading' || state.status === 'loadingMore' || !state.hasMore) return;

    var requestId = state.requestId;
    var nextPage = state.page + 1;
    state.status = 'loadingMore';
    paint();

    window.US.catalog
      .fetchPage(state.filters, nextPage)
      .then(function (page) {
        if (!state || requestId !== state.requestId) return;
        var seen = state.items.map(function (view) { return view.product.id; });
        var fresh = page.items.filter(function (view) { return seen.indexOf(view.product.id) === -1; });
        state.items = state.items.concat(fresh);
        state.page = nextPage;
        state.total = page.total;
        state.hasMore = page.hasMore;
        state.status = 'ready';
        paint();
      })
      .catch(function () {
        if (!state || requestId !== state.requestId) return;
        state.status = 'error';
        paint();
      });
  }

  function updateHash(mutator) {
    var route = window.US.router.parse();
    var params = new URLSearchParams(route.params.toString());
    mutator(params);
    window.US.router.navigate('/search', params);
  }

  function bind() {
    var main = window.US.layout.main();

    var onSubmit = function (event) {
      if (!event.target.matches('[data-page-search]')) return;
      event.preventDefault();
      var value = (event.target.querySelector('.search__input').value || '').trim();
      updateHash(function (params) {
        if (value) params.set('q', value);
        else params.delete('q');
        params.delete('product');
      });
    };

    var onChange = function (event) {
      if (!event.target.matches('[data-sort]')) return;
      var value = event.target.value;
      updateHash(function (params) { params.set('sort', value); });
    };

    var onClick = function (event) {
      var categoryButton = event.target.closest('[data-category]');
      if (categoryButton) {
        var category = categoryButton.getAttribute('data-category');
        updateHash(function (params) {
          if (category) params.set('category', category);
          else params.delete('category');
          params.delete('product');
        });
        return;
      }

      if (event.target.closest('[data-more]')) {
        loadMore();
        return;
      }

      if (event.target.closest('[data-retry]')) {
        if (state.items.length === 0) {
          loadFirst();
        } else {
          state.status = 'ready';
          loadMore();
        }
        return;
      }

      if (event.target.closest('[data-reset]')) {
        window.US.router.navigate('/search', new URLSearchParams());
      }
    };

    main.addEventListener('submit', onSubmit);
    main.addEventListener('change', onChange);
    main.addEventListener('click', onClick);
    handlers = { main: main, onSubmit: onSubmit, onChange: onChange, onClick: onClick };
  }

  function render(params) {
    var filters = readFilters(params);
    state = {
      filters: filters,
      page: 0,
      items: [],
      total: 0,
      status: 'loading',
      hasMore: false,
      requestId: 0,
    };

    window.US.layout.main().innerHTML = shellHtml(filters);
    document.title = filters.query
      ? 'Умный Шопинг — ' + filters.query
      : 'Умный Шопинг — каталог товаров';

    window.scrollTo(0, 0);
    bind();
    loadFirst();

    if (params.get('product')) window.US.modal.open(params.get('product'));
  }

  function onParams(params) {
    var id = params.get('product');
    if (id) window.US.modal.open(id);
    else window.US.modal.close();
  }

  function destroy() {
    if (state) state.requestId += 1;
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (handlers) {
      handlers.main.removeEventListener('submit', handlers.onSubmit);
      handlers.main.removeEventListener('change', handlers.onChange);
      handlers.main.removeEventListener('click', handlers.onClick);
      handlers = null;
    }
    window.US.modal.close();
    state = null;
  }

  window.US = window.US || {};
  window.US.views = window.US.views || {};
  window.US.views.search = {
    render: render,
    onParams: onParams,
    destroy: destroy,
  };
})();
