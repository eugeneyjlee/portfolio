// Fade and settle into the final size, never past it. The typewriter is independent.
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !Element.prototype.animate) return;
  const animations = new Set();
  let observer;
  const popIn = (element, delay = 0) => {
    if (motion.matches || element.contains(document.activeElement)) return;
    const opacity = getComputedStyle(element).opacity;
    const animation = element.animate(
      [{ opacity: 0, scale: '0.96' }, { opacity, scale: '1' }],
      { duration: 520, delay, easing: 'cubic-bezier(.22,.7,.3,1)', fill: 'backwards' }
    );
    animations.add(animation);
    const clean = () => animations.delete(animation);
    animation.onfinish = clean;
    animation.oncancel = clean;
  };
  const groups = [
    ['.nav .wordmark, .nav nav a', 0],
    ['.intro h1', 70],
    ['.intro-actions a', 110],
    ['.intro-facts li', 150],
    ['.landing-photo', 190],
    ['.intro-side a', 210],
    ['.intro .doodle', 160]
  ];
  groups.forEach(([selector, delay]) => {
    document.querySelectorAll(selector).forEach((element, index) => popIn(element, delay + index * 35));
  });
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      visible.forEach((entry, index) => {
        observer.unobserve(entry.target);
        popIn(entry.target, Math.min(index * 45, 180));
      });
    }, { threshold: 0, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.work > .section-heading, .projects > .section-heading, .projects-intro, .experience-card, .project-row, .work > .doodle, .projects > .doodle, .footer-top, .footer-bottom, .site-footer > .doodle').forEach((element) => observer.observe(element));
  }
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    observer?.disconnect();
    animations.forEach((animation) => animation.cancel());
    animations.clear();
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
