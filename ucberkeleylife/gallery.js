// Instagram's embed uses a 326px minimum layout. Scale it to each compact card.
const players = document.querySelectorAll('.instagram-player');
const resizeEmbeds = new ResizeObserver(entries => {
  entries.forEach(({target, contentRect}) => {
    target.style.setProperty('--embed-scale', contentRect.width / 326);
  });
});
players.forEach(player => resizeEmbeds.observe(player));
