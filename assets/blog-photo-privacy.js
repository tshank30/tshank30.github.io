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
  // Track the last heading above the sticky header, clearing the state at the top.
  const links = [...document.querySelectorAll('.article-sidebar nav a')];
  const sections = [...document.querySelectorAll('.article-content h2[id]')];
  if (!links.length || !sections.length) return;
  let scheduled = false;
  const updateSection = () => {
    scheduled = false;
    const active = sections.filter(section => section.getBoundingClientRect().top <= 120).pop();
    links.forEach(link => {
      if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const scheduleUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateSection);
  };
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  updateSection();
})();
