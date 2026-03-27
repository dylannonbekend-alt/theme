(function () {
  function getProductForm() {
    return document.querySelector('form[action*="/cart/add"]');
  }

  function getMainAddButton(form) {
    if (!form) return null;
    return form.querySelector('[name="add"], button[type="submit"]');
  }

  function readText(selector, fallback) {
    var node = document.querySelector(selector);
    if (!node || !node.textContent) return fallback;
    return node.textContent.trim();
  }

  function initSticky(root) {
    var bar = root.querySelector('[data-diqa-sticky]');
    if (!bar) return;

    var form = getProductForm();
    var addButton = getMainAddButton(form);
    if (!form || !addButton) return;

    var stickyButton = bar.querySelector('[data-diqa-sticky-add]');
    var titleEl = bar.querySelector('[data-diqa-sticky-title]');
    var priceEl = bar.querySelector('[data-diqa-sticky-price]');

    if (titleEl) titleEl.textContent = readText('h1', 'DIQA Product');
    if (priceEl) priceEl.textContent = readText('[class*="price"]', '');

    stickyButton.addEventListener('click', function () {
      addButton.click();
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            bar.classList.remove('is-visible');
          } else {
            bar.classList.add('is-visible');
          }
        });
      },
      {
        root: null,
        threshold: 0.25
      }
    );

    observer.observe(addButton);
  }

  function init() {
    document.querySelectorAll('[data-diqa-product-enhance]').forEach(function (root) {
      initSticky(root);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
