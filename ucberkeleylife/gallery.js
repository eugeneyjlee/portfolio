document.querySelectorAll('.archive-player button').forEach(button => {
  button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = 'https://www.instagram.com/reel/' + button.dataset.reel + '/embed/';
    frame.title = button.getAttribute('aria-label').replace('Load ', '');
    frame.allow = 'encrypted-media; picture-in-picture; fullscreen';
    frame.setAttribute('allowfullscreen', '');
    frame.setAttribute('scrolling', 'no');
    button.parentElement.replaceChildren(frame);
  });
});
