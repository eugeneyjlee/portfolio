
(() => {
 const video = document.querySelector('.art-film');
 if (!video) return;
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 let visible = false;
 const update = () => {
   if (visible && !document.hidden && !reduced.matches) video.play().catch(() => {});
   else video.pause();
 };
 if ('IntersectionObserver' in window) {
   new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }, {threshold: .1}).observe(video);
 } else { visible = true; update(); }
 reduced.addEventListener('change', update);
 document.addEventListener('visibilitychange', update);
})();
