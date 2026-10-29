// Thumbnail-first social previews share the accessible full-size viewer.
(() => {
 document.querySelectorAll('.reel-embed[data-reel]').forEach(host => {
  const title = (host.dataset.alt || '').replace(/ — video thumbnail$/, '');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'reel-cover';
  button.setAttribute('aria-label', 'Preview video: ' + title);
  button.setAttribute('aria-haspopup', 'dialog');
  button.dataset.previewEmbed = 'https://www.instagram.com/reel/' + host.dataset.reel + '/embed/';
  button.dataset.previewOriginal = 'https://www.instagram.com/reel/' + host.dataset.reel + '/';
  button.dataset.previewTitle = title;
  const image = document.createElement('img');
  image.src = host.dataset.cover;
  image.alt = '';
  image.loading = 'lazy';
  image.decoding = 'async';
  const icon = document.createElement('span');
  icon.className = 'reel-play';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  button.append(image, icon);
  host.append(button);
 });
})();
