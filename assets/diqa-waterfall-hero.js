(function () {
  function setupTilt(section) {
    var stageWrap = section.querySelector('[data-waterfall-tilt]');
    if (!stageWrap) return;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    var stage = section.querySelector('.diqa-waterfall__stage');
    var orbs = Array.prototype.slice.call(section.querySelectorAll('.diqa-waterfall__orb'));

    stageWrap.addEventListener('pointermove', function (event) {
      var rect = stageWrap.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width;
      var y = (event.clientY - rect.top) / rect.height;
      var rx = (0.5 - y) * 9;
      var ry = (x - 0.5) * 10;

      if (stage) {
        stage.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      }

      orbs.forEach(function (orb, index) {
        var depth = (index + 1) * 5;
        var tx = (x - 0.5) * depth * 2;
        var ty = (y - 0.5) * depth * -1.5;
        orb.style.transform = 'translate3d(' + tx.toFixed(1) + 'px, ' + ty.toFixed(1) + 'px, 0)';
      });
    });

    stageWrap.addEventListener('pointerleave', function () {
      if (stage) {
        stage.style.transform = 'rotateX(0deg) rotateY(0deg)';
      }
      orbs.forEach(function (orb) {
        orb.style.transform = 'translate3d(0,0,0)';
      });
    });
  }

  function setupTopicTabs(section) {
    var tabs = Array.prototype.slice.call(section.querySelectorAll('.diqa-waterfall__topic-tab'));
    if (!tabs.length) return;

    var titleEl = section.querySelector('[data-waterfall-topic-title]');
    var textEl = section.querySelector('[data-waterfall-topic-text]');
    var linkEl = section.querySelector('[data-waterfall-topic-link]');

    function activate(tab) {
      tabs.forEach(function (t) {
        t.classList.toggle('is-active', t === tab);
      });

      if (titleEl) titleEl.textContent = tab.getAttribute('data-topic-title') || '';
      if (textEl) textEl.textContent = tab.getAttribute('data-topic-text') || '';
      if (linkEl) {
        var href = tab.getAttribute('data-topic-link') || '/collections/all';
        linkEl.hidden = false;
        linkEl.setAttribute('href', href);
      }
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activate(tab);
      });
    });
  }

  function setupWaterfall(section) {
    var canvas = section.querySelector('.diqa-waterfall__canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    var waves = [];
    var raf = 0;
    var mx = 0;
    var time = 0;

    function resize() {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      var width = section.clientWidth;
      var height = section.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      var count = Math.max(4, Math.floor(width / 240));
      waves = Array.from({ length: count }).map(function (_, i) {
        return {
          baseY: height * (0.24 + i * 0.16),
          amplitude: 18 + Math.random() * 16,
          width: 1 + Math.random() * 1.6,
          speed: 0.004 + Math.random() * 0.0035,
          alpha: 0.06 + Math.random() * 0.08
        };
      });
    }

    function frame() {
      var width = section.clientWidth;
      var height = section.clientHeight;
      ctx.clearRect(0, 0, width, height);
      time += 1;

      waves.forEach(function (wave, index) {
        var shift = (mx - 0.5) * 30;
        var grad = ctx.createLinearGradient(0, wave.baseY, width, wave.baseY + 40);
        grad.addColorStop(0, 'rgba(167,131,78,0)');
        grad.addColorStop(0.5, 'rgba(167,131,78,' + wave.alpha.toFixed(3) + ')');
        grad.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = wave.width;
        ctx.beginPath();
        for (var x = -20; x <= width + 20; x += 8) {
          var y =
            wave.baseY +
            Math.sin(x * 0.016 + time * wave.speed + index) * wave.amplitude +
            Math.cos(x * 0.006 + time * wave.speed * 0.8) * 4 +
            shift;
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
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
      setupTopicTabs(section);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
