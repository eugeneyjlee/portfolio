(() => {
  document.querySelectorAll('#projects .project-file').forEach(card => {
    const tabs = [...card.querySelectorAll('[role="tab"]')];
    const previews = [...card.querySelectorAll('.project-preview')];
    const links = [...card.querySelectorAll('[data-preview-link]')];
    const select = index => {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      previews.forEach((preview, i) => preview.hidden = i !== index);
      links.forEach(link => link.hidden = Number(link.dataset.previewLink) !== index);
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        select(next);
        tabs[next].focus();
      });
    });
  });
})();
