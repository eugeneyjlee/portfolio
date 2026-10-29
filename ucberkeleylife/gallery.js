// Accessible filtering and sorting; the shared viewer handles previews.
(() => {
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
