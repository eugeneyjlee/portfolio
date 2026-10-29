// Cards are plain links to the original posts, so everything works without
// JavaScript. With it, a click swaps the poster for the platform's player in
// place, and the topic chips filter the grid.
(() => {
  document.querySelectorAll('.video-poster[data-embed]').forEach((poster) => {
    poster.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      const card = poster.closest('.video-card');
      const title = card.querySelector('.video-card-title').textContent;
      const frame = document.createElement('iframe');
      frame.src = poster.dataset.embed;
      frame.title = poster.dataset.platform + ' video: ' + title;
      frame.setAttribute('allow', 'encrypted-media; picture-in-picture; fullscreen; autoplay');
      frame.setAttribute('allowfullscreen', '');
      frame.setAttribute('scrolling', 'no');
      const player = document.createElement('div');
      player.className = 'video-player is-' + poster.dataset.platform.toLowerCase();
      player.appendChild(frame);
      poster.replaceWith(player);
      frame.focus();
    });
  });

  const grid = document.querySelector('.video-grid');
  const sort = document.getElementById('video-sort');
  const order = {
    newest: (a, b) => b.dataset.date.localeCompare(a.dataset.date),
    oldest: (a, b) => a.dataset.date.localeCompare(b.dataset.date),
    views: (a, b) => Number(b.dataset.views) - Number(a.dataset.views),
  };
  sort.addEventListener('change', () => {
    [...grid.children].sort(order[sort.value]).forEach((card) => grid.appendChild(card));
  });

  const chips = [...document.querySelectorAll('.filter-chip')];
  const cards = [...document.querySelectorAll('.video-card')];
  const count = document.querySelector('.archive-count');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    let shown = 0;
    cards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.hidden = !match;
      if (match) shown += 1;
    });
    count.textContent = filter === 'all'
      ? `Showing all ${shown} videos`
      : `Showing ${shown} ${chip.firstChild.textContent.trim().toLowerCase()} videos`;
  }));
})();
