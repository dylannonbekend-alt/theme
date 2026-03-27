(function () {
  function setupTilt(section) {
    var layers = section.querySelector('[data-immersive-tilt]');
    if (!layers) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    layers.addEventListener('pointermove', function (event) {
      var rect = layers.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width;
      var y = (event.clientY - rect.top) / rect.height;
      var rx = (0.5 - y) * 8;
      var ry = (x - 0.5) * 8;
      layers.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    });

    layers.addEventListener('pointerleave', function () {
      layers.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  function setupParticles(section) {
    var canvas = section.querySelector('.diqa-immersive__canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var particles = [];
    var raf = 0;

    function resize() {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      var w = section.clientWidth;
      var h = section.clientHeight;
      canvas.width = Math.floor(w * ratio);
      canvas.height = Math.floor(h * ratio);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      var count = Math.max(18, Math.floor(w / 80));
      particles = Array.from({ length: count }).map(function () {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.4 + 0.4,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2
        };
      });
    }

    function frame() {
      var w = section.clientWidth;
      var h = section.clientHeight;
      ctx.clearRect(0, 0, w, h);

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(188,167,115,0.14)';
        ctx.fill();
      });

      raf = window.requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener('resize', resize);
    section.addEventListener(
      'shopify:section:unload',
      function () {
        window.cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
      },
      { once: true }
    );
  }

  function init() {
    document.querySelectorAll('[data-diqa-immersive]').forEach(function (section) {
      setupTilt(section);
      setupParticles(section);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
