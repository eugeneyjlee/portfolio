// Every reel is an Instagram embed — no cover images in the way. The whole
// track mounts at once, well before the section is reached, so scrolling
// sideways never swaps a placeholder for a player.
//
// Instagram's embed cannot be told to play: the iframe is cross-origin and its
// only postMessage traffic is sizing, so each reel opens paused behind its own
// play button.
//
// The cover images live inside <noscript>, so a browser running this script
// never fetches them — they are ~2MB each. If an embed stalls, the cover for
// that one slide is built from its data attributes and fetched then.
(() => {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.reel-embed[data-reel]');
  if (!track || !slides.length) return;
  track.classList.add('js-embeds');

  const buildCover = (host) => {
    const link = document.createElement('a');
    link.className = 'reel-embed-fallback';
    link.href = 'https://www.instagram.com/reel/' + host.dataset.reel + '/';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const image = document.createElement('img');
    image.src = host.dataset.cover;
    image.alt = host.dataset.alt || '';
    const label = document.createElement('span');
    label.className = 'reel-watch-label';
    label.textContent = 'Watch on Instagram';
    link.append(image, label);
    return link;
  };

  const mount = (host) => {
    if (host.dataset.mounted) return;
    host.dataset.mounted = '1';
    const frame = document.createElement('iframe');
    frame.src = 'https://www.instagram.com/reel/' + host.dataset.reel + '/embed/';
    frame.title = 'Instagram reel';
    frame.setAttribute('scrolling', 'no');
    frame.setAttribute('allowtransparency', 'true');
    frame.setAttribute('allow', 'encrypted-media; picture-in-picture; fullscreen');
    frame.setAttribute('allowfullscreen', '');
    // If Instagram never answers, fall back to the cover image and its link
    // rather than leaving an empty box.
    const failed = setTimeout(() => {
      if (host.classList.contains('is-loaded')) return;
      host.classList.add('is-stalled');
      host.appendChild(buildCover(host));
    }, 10000);
    frame.addEventListener('load', () => {
      clearTimeout(failed);
      host.classList.add('is-loaded');
    });
    host.appendChild(frame);
  };

  const mountAll = () => slides.forEach(mount);

  if (!('IntersectionObserver' in window)) {
    mountAll();
    return;
  }
  // Start loading once the section is within a couple of screens, so the
  // players are ready on arrival. On a desktop viewport the carousel is inside
  // that margin from the start, so they mount immediately; on a phone, where
  // the section sits much further down, they wait until it is approached.
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    mountAll();
  }, { root: null, rootMargin: '2500px 0px', threshold: 0 });
  observer.observe(track);
})();
