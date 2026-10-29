// Progressive enhancement: original links work even without this viewer.
(() => {
  const dialog = document.createElement('dialog');
  dialog.className = 'preview-dialog';
  dialog.setAttribute('aria-labelledby', 'preview-dialog-title');
  dialog.innerHTML = '<div class="preview-dialog-header"><h2 id="preview-dialog-title" class="visually-hidden"></h2><button type="button" class="preview-close" aria-label="Close preview">×</button></div><div class="preview-dialog-stage"></div><div class="preview-dialog-footer"><a class="preview-original" target="_blank" rel="noopener noreferrer">Open original <span aria-hidden="true">↗</span></a></div>';
  document.body.append(dialog);
  const title = dialog.querySelector('h2');
  const stage = dialog.querySelector('.preview-dialog-stage');
  const original = dialog.querySelector('.preview-original');
  let opener, previousOverflow;
  dialog.querySelector('.preview-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    stage.replaceChildren();
    document.body.style.overflow = previousOverflow || '';
    if (opener?.isConnected) opener.focus({preventScroll:true});
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-preview-embed], .video-poster[data-embed]');
    if (!target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    opener = target;
    const url = target.dataset.previewEmbed || target.dataset.embed;
    const card = target.closest('.video-card');
    title.textContent = target.dataset.previewTitle || card?.querySelector('.video-card-title')?.textContent || 'Video preview';
    const host = new URL(url).hostname;
    dialog.dataset.kind = host.includes('instagram') ? 'instagram' : host.includes('tiktok') ? 'tiktok' : 'project';
    original.href = target.dataset.previewOriginal || target.href;
    const platformLabel = host.includes('canva') ? 'Open in Canva' : host.includes('figma') ? 'Open in Figma' : host.includes('instagram') ? 'Open on Instagram' : host.includes('tiktok') ? 'Open on TikTok' : 'Open original';
    original.innerHTML = platformLabel + ' <span aria-hidden="true">↗</span>';
    original.setAttribute('aria-label', platformLabel + ': ' + title.textContent + ' (opens in a new tab)');
    const frame = document.createElement('iframe');
    frame.title = title.textContent;
    frame.allow = 'encrypted-media; picture-in-picture; fullscreen; autoplay';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.src = url;
    stage.replaceChildren(frame);
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.querySelector('.preview-close').focus();
  });
  document.querySelectorAll('[data-preview-embed], .video-poster[data-embed]').forEach(target => target.setAttribute('aria-haspopup','dialog'));
})();
