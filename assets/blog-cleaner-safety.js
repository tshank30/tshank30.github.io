(() => {
  const worksheet = document.getElementById('app-review');
  if (!worksheet) return;
  const fields = [...worksheet.querySelectorAll('[data-review-field]')];
  const progress = document.getElementById('review-progress');
  const summary = document.getElementById('review-summary');
  const actions = document.getElementById('review-actions');
  const reset = document.getElementById('review-reset');
  if (!fields.length || !progress || !summary || !actions || !reset) return;
  const advice = {
    media: {
      cloud: 'Ask who receives uploaded media, how long it is retained, and how to request deletion of server copies.',
      unknown: 'Find a clear statement about where photo analysis happens, or ask the developer before sharing media.'
    },
    permissions: {
      no: 'Resolve the unexplained permission request. Limit access while you investigate.',
      unknown: 'Compare the permission requests with the features you plan to use.'
    },
    deletion: {
      no: 'Find a workflow that lets you inspect files and confirm removal before a bulk cleanup.',
      unknown: 'Review the deletion flow using nonessential files before attempting a larger cleanup.'
    },
    backup: {
      no: 'Verify separate copies of important files and check how your photo service handles synced deletions.',
      unknown: 'Confirm which copies deletion affects. Do not assume a synced library keeps an untouched backup.'
    },
    billing: {
      no: 'Resolve unclear trial, renewal, or cancellation terms before approving a purchase.',
      unknown: 'Read the checkout screen and cancellation instructions before starting a trial.'
    }
  };
  const update = () => {
    const answered = fields.filter(field => field.value !== '').length;
    const followUps = fields.flatMap(field => {
      const next = advice[field.dataset.reviewField]?.[field.value];
      return next ? [next] : [];
    });
    progress.textContent = `${answered} of ${fields.length} answers recorded`;
    summary.textContent = answered === 0
      ? 'Start with any question. Your next steps will appear here.'
      : answered < fields.length
        ? 'Your review is still in progress. Resolve the points below and answer the remaining questions.'
        : followUps.length
          ? 'All answers are recorded. Follow up on the points below before proceeding. These questions do not establish that an app is unsafe.'
          : 'You have recorded clear answers for these five checks. This is a useful starting point, not a security audit or a guarantee of safety.';
    actions.replaceChildren(...followUps.map(text => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
    actions.hidden = followUps.length === 0;
    reset.disabled = answered === 0;
  };
  fields.forEach(field => field.addEventListener('change', update));
  reset.addEventListener('click', () => {
    fields.forEach(field => { field.value = ''; });
    update();
    fields[0].focus();
  });
  worksheet.hidden = false;
  update();
})();
