// Mount each Instagram embed only once its slide scrolls into view, so the
// section costs nothing until it is reached. Instagram's embed cannot be told
// to play — it is cross-origin and exposes no player API — so every reel opens
// paused behind its own play button. The thumbnail stays as the placeholder
// underneath, and remains the whole slide if the embed never loads.
(() => {
  const slides = document.querySelectorAll('.reel-embed[data-reel]');
  if (!slides.length) return;

  const mount = (host) => {
    if (host.dataset.mounted) return;
    host.dataset.mounted = '1';
    const frame = document.createElement('iframe');
    frame.src = 'https://www.instagram.com/reel/' + host.dataset.reel + '/embed/';
    frame.title = 'Instagram reel';
    frame.loading = 'lazy';
    frame.setAttribute('scrolling', 'no');
    frame.setAttribute('allowtransparency', 'true');
    frame.setAttribute('allow', 'encrypted-media; picture-in-picture; fullscreen');
    frame.setAttribute('allowfullscreen', '');
    // If Instagram never answers, leave the thumbnail in place rather than a blank box.
    const failed = setTimeout(() => {
      if (!host.classList.contains('is-loaded')) host.classList.add('is-stalled');
    }, 8000);
    // Reveal on load; the slide is a fixed height, so nothing to measure.
    frame.addEventListener('load', () => {
      clearTimeout(failed);
      host.classList.add('is-loaded');
    });
    host.appendChild(frame);
  };

  if (!('IntersectionObserver' in window)) {
    slides.forEach(mount);
    return;
  }
  // Generous margin so a slide is ready by the time it is scrolled to, in
  // either direction — the track scrolls horizontally inside a vertical page.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      mount(entry.target);
    });
  }, { root: null, rootMargin: '200px 600px', threshold: 0 });
  slides.forEach((slide) => observer.observe(slide));
})();
