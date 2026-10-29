// Each reel starts as a lightweight cover (a ~40KB WebP) with a play button.
// The Instagram player only loads when someone asks for it, so the section no
// longer mounts six cross-origin iframes as it scrolls into view.
//
// Every slide also keeps a permanent "Open on Instagram" link beneath it: an
// iframe's load event does not prove the media is playable, so the original
// post must always be one click away.
(() => {
  const hosts = document.querySelectorAll('.reel-embed[data-reel]');
  if (!hosts.length) return;

  const titleOf = (host) => (host.dataset.alt || '').replace(/ — video thumbnail$/, '');

  const mount = (host) => {
    if (host.dataset.mounted) return;
    host.dataset.mounted = '1';
    const frame = document.createElement('iframe');
    frame.src = 'https://www.instagram.com/reel/' + host.dataset.reel + '/embed/';
    frame.title = 'Instagram reel: ' + titleOf(host);
    frame.setAttribute('scrolling', 'no');
    frame.setAttribute('allowtransparency', 'true');
    frame.setAttribute('allow', 'encrypted-media; picture-in-picture; fullscreen');
    frame.setAttribute('allowfullscreen', '');
    frame.addEventListener('load', () => host.classList.add('is-loaded'));
    host.appendChild(frame);
    frame.focus();
  };

  hosts.forEach((host) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'reel-cover';
    button.setAttribute('aria-label', 'Play ' + titleOf(host));
    const image = document.createElement('img');
    image.src = host.dataset.cover;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    const play = document.createElement('span');
    play.className = 'reel-play';
    play.setAttribute('aria-hidden', 'true');
    play.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    button.append(image, play);
    button.addEventListener('click', () => {
      button.remove();
      mount(host);
    });
    host.appendChild(button);
  });
})();
