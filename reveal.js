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
