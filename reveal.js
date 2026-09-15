(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const animations = new Set();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (motion.matches || entry.target.contains(document.activeElement)) continue;
      const animation = entry.target.animate(
        [{ opacity: 0.35, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 550, easing: 'cubic-bezier(.2,.65,.3,1)' }
      );
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.experience-card, .project-row, .about').forEach((item) => observer.observe(item));
  motion.addEventListener('change', () => {
    if (motion.matches) {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    }
  });
})();

// Type once; keep a complete, stable sentence available to screen readers.
(() => {
  const line = document.querySelector('[data-typewriter]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!line || motion.matches) return;
  const sentence = line.textContent;
  const accessible = document.createElement('span');
  accessible.className = 'sr-only';
  accessible.textContent = sentence;
  const visual = document.createElement('span');
  visual.className = 'typewriter-visual';
  visual.setAttribute('aria-hidden', 'true');
  line.replaceChildren(accessible, visual);
  let index = 0;
  let timer;
  const complete = () => {
    clearTimeout(timer);
    visual.textContent = sentence;
    line.classList.add('is-complete');
  };
  const type = () => {
    if (motion.matches) return complete();
    visual.textContent = sentence.slice(0, ++index);
    if (index < sentence.length) timer = setTimeout(type, 32);
    else complete();
  };
  timer = setTimeout(type, 350);
  motion.addEventListener('change', () => { if (motion.matches) complete(); });
})();
