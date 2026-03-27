(function () {
  function setupTilt(section) {
    const visual = section.querySelector('[data-diqa-tilt]');
    if (!visual) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    visual.addEventListener('pointermove', function (event) {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 8;

      visual.style.transform = 'rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg)';
    });

    visual.addEventListener('pointerleave', function () {
      visual.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  function setupCanvas(section) {
    const canvas = section.querySelector('.diqa-luxury__canvas');
    if (!canvas) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId;
    let particles = [];

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = section.clientWidth;
      const height = section.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.max(10, Math.floor(width / 120));
      particles = Array.from({ length: count }).map(function () {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.2 + 0.5,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18
        };
      });
    }

    function frame() {
      const width = section.clientWidth;
      const height = section.clientHeight;

      ctx.clearRect(0, 0, width, height);

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(216, 205, 178, 0.14)';
        ctx.fill();
      });

      rafId = window.requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener('resize', resize);

    section.addEventListener(
      'shopify:section:unload',
      function () {
        window.cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
      },
      { once: true }
    );
  }

  function init() {
    document.querySelectorAll('[data-diqa-luxury]').forEach(function (section) {
      setupTilt(section);
      setupCanvas(section);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
