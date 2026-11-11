(() => {
  const explorer = document.getElementById('cloud-explorer');
  const plan = document.getElementById('cloud-plan');
  const years = document.getElementById('cloud-years');
  const label = document.getElementById('cloud-years-label');
  const total = document.getElementById('cloud-total');
  const explanation = document.getElementById('cloud-explanation');
  if (![explorer, plan, years, label, total, explanation].every(Boolean)) return;
  const validPlans = new Set([99, 299, 999]);
  const money = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
  const update = () => {
    const monthlyCents = Number(plan.value);
    const duration = Number(years.value);
    if (!validPlans.has(monthlyCents) || !Number.isInteger(duration) || duration < 1 || duration > 10) return;
    const payments = duration * 12;
    label.textContent = String(duration);
    years.setAttribute('aria-valuetext', `${duration} ${duration === 1 ? 'year' : 'years'}`);
    total.textContent = money(monthlyCents * payments);
    explanation.textContent = `${payments} monthly payments of ${money(monthlyCents)} at a constant rate. This illustrates recurring cost, not future pricing or potential app savings.`;
  };
  plan.addEventListener('change', update);
  years.addEventListener('input', update);
  years.addEventListener('change', update);
  explorer.hidden = false;
  update();
})();
