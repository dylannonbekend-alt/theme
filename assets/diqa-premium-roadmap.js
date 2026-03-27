(function () {
  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  function initRoadmap(root) {
    var steps = Array.from(root.querySelectorAll('[data-roadmap-step]'));
    var progress = root.querySelector('[data-roadmap-progress]');
    if (!steps.length || !progress) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      steps.forEach(function (step) {
        step.classList.add('is-active');
      });
      progress.style.width = '100%';
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-active');
          }
        });

        var activeCount = steps.filter(function (step) {
          return step.classList.contains('is-active');
        }).length;
        var ratio = activeCount / steps.length;
        progress.style.width = clamp(ratio * 100, 0, 100).toFixed(0) + '%';
      },
      { threshold: 0.45 }
    );

    steps.forEach(function (step) {
      observer.observe(step);
    });
  }

  function init() {
    document.querySelectorAll('[data-diqa-roadmap]').forEach(function (root) {
      initRoadmap(root);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
