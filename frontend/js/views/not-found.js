(function () {
  'use strict';

  function render() {
    window.US.layout.main().innerHTML =
      '<div class="notfound container">' +
      '<p class="notfound__code">404</p>' +
      '<h1 class="notfound__title">Страница не найдена</h1>' +
      '<p class="notfound__text">Возможно, ссылка устарела или в адресе опечатка. ' +
      'Вернитесь на главную и попробуйте поиск ещё раз.</p>' +
      '<div class="notfound__actions">' +
      '<a href="#/" class="button button--primary">На главную</a>' +
      '<a href="#/search" class="button">В каталог</a>' +
      '</div>' +
      '</div>';
    document.title = 'Умный Шопинг — страница не найдена';
    window.scrollTo(0, 0);
  }

  window.US = window.US || {};
  window.US.views = window.US.views || {};
  window.US.views.notFound = {
    render: render,
    destroy: function () {
      window.US.modal.close();
    },
  };
})();
