(function () {
  'use strict';

  function boot() {
    window.US.layout.mount();

    var router = window.US.router;
    var views = window.US.views;

    router.register('/', views.home);
    router.register('/search', views.search);
    router.register('/account', views.account);
    router.register('/account/preferences', views.account);
    router.register('/account/favorites', views.account);
    router.register('/account/history', views.account);

    router.start(views.notFound);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
