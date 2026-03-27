(function () {
  function setupTilt(section) {
    var panel = section.querySelector('[data-waterfall-tilt]');
    if (!panel) return;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    panel.addEventListener('pointermove', function (event) {
      var rect = panel.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width;
      var y = (event.clientY - rect.top) / rect.height;
      var rx = (0.5 - y) * 7;
      var ry = (x - 0.5) * 7;
      panel.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    });

    panel.addEventListener('pointerleave', function () {
      panel.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  function setupWaterfall(section) {
    var canvas = section.querySelector('.diqa-waterfall__canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    var lines = [];
    var raf = 0;
    var mx = 0;

    function resize() {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      var width = section.clientWidth;
      var height = section.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      var count = Math.max(24, Math.floor(width / 34));
      lines = Array.from({ length: count }).map(function (_, i) {
        var x = (i / count) * width + Math.random() * 22;
        return {
          x: x,
          y: Math.random() * height,
          length: Math.random() * 110 + 60,
          width: Math.random() * 1.2 + 0.4,
          speed: Math.random() * 1.2 + 0.5,
          alpha: Math.random() * 0.16 + 0.04
        };
      });
    }

    function frame() {
      var width = section.clientWidth;
      var height = section.clientHeight;
      ctx.clearRect(0, 0, width, height);

      lines.forEach(function (l) {
        l.y += l.speed;
        if (l.y - l.length > height) l.y = -40;

        var offset = (mx - 0.5) * 18;
        var x = l.x + offset;
        var grad = ctx.createLinearGradient(x, l.y - l.length, x, l.y);
        grad.addColorStop(0, 'rgba(188,167,115,0)');
        grad.addColorStop(0.55, 'rgba(188,167,115,' + l.alpha.toFixed(3) + ')');
        grad.addColorStop(1, 'rgba(201,222,229,' + (l.alpha * 0.8).toFixed(3) + ')');

        ctx.strokeStyle = grad;
        ctx.lineWidth = l.width;
        ctx.beginPath();
        ctx.moveTo(x, l.y - l.length);
        ctx.lineTo(x, l.y);
        ctx.stroke();
      });

      raf = window.requestAnimationFrame(frame);
    }

    function onMove(event) {
      var rect = section.getBoundingClientRect();
      mx = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    }

    resize();
    frame();
    section.addEventListener('pointermove', onMove);
    window.addEventListener('resize', resize);

    section.addEventListener(
      'shopify:section:unload',
      function () {
        window.cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        section.removeEventListener('pointermove', onMove);
      },
      { once: true }
    );
  }

  function init() {
    document.querySelectorAll('[data-diqa-waterfall]').forEach(function (section) {
      setupTilt(section);
      setupWaterfall(section);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
