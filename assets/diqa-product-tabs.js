(function () {
  function initTabs(section) {
    var tabs = Array.prototype.slice.call(section.querySelectorAll('[data-diqa-tab]'));
    var panels = Array.prototype.slice.call(section.querySelectorAll('[data-diqa-panel]'));
    if (!tabs.length || !panels.length) return;

    function activateTab(id) {
      tabs.forEach(function (tab) {
        var isActive = tab.getAttribute('data-diqa-tab') === id;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      panels.forEach(function (panel) {
        var isActive = panel.getAttribute('data-diqa-panel') === id;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute('data-diqa-tab');
        if (id) activateTab(id);
      });
    });

    activateTab(tabs[0].getAttribute('data-diqa-tab'));
  }

  function init() {
    document.querySelectorAll('[data-diqa-product-tabs]').forEach(initTabs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
