(() => {
  const checks = [...document.querySelectorAll('.privacy-check')];
  const status = document.querySelector('.checklist-status');
  const count = document.getElementById('checklist-count');
  const finish = document.getElementById('checklist-finish');
  const reset = document.getElementById('reset-checklist');
  if (checks.length && status && count && finish && reset) {
    const update = () => {
      const reviewed = checks.filter(input => input.checked).length;
      count.textContent = `${reviewed} of ${checks.length} questions reviewed`;
      finish.hidden = reviewed !== checks.length;
      reset.disabled = reviewed === 0;
    };
    status.hidden = false;
    checks.forEach(input => input.addEventListener('change', update));
    reset.addEventListener('click', () => {
      checks.forEach(input => { input.checked = false; });
      update();
      checks[0].focus();
    });
    update();
  }
  // Highlight the section in view; normal anchor navigation works without JS.
  if (!('IntersectionObserver' in window)) return;
  const links = [...document.querySelectorAll('.article-sidebar nav a')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      links.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-100px 0px -45% 0px' });
  document.querySelectorAll('.article-content h2[id]').forEach(section => observer.observe(section));
})();
