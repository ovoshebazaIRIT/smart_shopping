(function () {
  'use strict';

  var routes = {};
  var notFoundView = null;
  var current = null;
  var currentBase = '';

  function parse() {
    var raw = window.location.hash.replace(/^#/, '');
    if (!raw) raw = '/';
    var qIndex = raw.indexOf('?');
    var path = qIndex === -1 ? raw : raw.slice(0, qIndex);
    var search = qIndex === -1 ? '' : raw.slice(qIndex + 1);
    return {
      path: path || '/',
      params: new URLSearchParams(search),
    };
  }

  function serialize(path, params) {
    var qs = params ? params.toString() : '';
    return '#' + path + (qs ? '?' + qs : '');
  }

  /** Ключ страницы без учёта карточки товара: по нему решаем, нужен ли полный перерендер. */
  function baseKey(path, params) {
    var copy = new URLSearchParams(params.toString());
    copy.delete('product');
    return path + '?' + copy.toString();
  }

  function navigate(path, params, options) {
    var hash = serialize(path, params);
    var mode = (options && options.replace) ? 'replace' : 'push';
    if (window.location.hash === hash) {
      handle();
      return;
    }
    if (mode === 'replace') {
      var url = window.location.pathname + window.location.search + hash;
      window.history.replaceState(null, '', url);
      handle();
      return;
    }
    window.location.hash = hash;
  }

  function setParam(key, value) {
    var route = parse();
    var params = new URLSearchParams(route.params.toString());
    if (value === null || value === undefined || value === '') params.delete(key);
    else params.set(key, value);
    navigate(route.path, params, { replace: true });
  }

  function handle() {
    var route = parse();
    var view = routes[route.path] || notFoundView;
    if (!view) return;

    var base = baseKey(route.path, route.params);
    if (current && base === currentBase && typeof current.onParams === 'function') {
      current.onParams(route.params, route.path);
      return;
    }

    if (current && typeof current.destroy === 'function') {
      try {
        current.destroy();
      } catch (error) {
        console.error('destroy:', error);
      }
    }

    current = view;
    currentBase = base;
    if (window.US.layout) window.US.layout.setActive(route.path);
    view.render(route.params, route.path);
  }

  function register(path, view) {
    routes[path] = view;
  }

  function start(fallback) {
    notFoundView = fallback;
    window.addEventListener('hashchange', handle);
    if (!window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + '#/');
    }
    handle();
  }

  window.US = window.US || {};
  window.US.router = {
    register: register,
    start: start,
    navigate: navigate,
    setParam: setParam,
    parse: parse,
    link: serialize,
  };
})();
