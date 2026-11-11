(() => {
  const guide = document.getElementById('option-guide');
  const problem = document.getElementById('phone-problem');
  const title = document.getElementById('option-title');
  const copy = document.getElementById('option-copy');
  const link = document.getElementById('option-link');
  const options = {
    clutter: ['Review unwanted media first', 'Check backups, review duplicate and similar photos, screenshots, and videos, then check device storage again. Built-in tools may be enough; a cleaner can help group files for review.', '#cleanup-plan', 'See the cleanup plan'],
    cloud: ['Review the cloud account separately', 'Check what uses your cloud quota before paying for a bigger plan. Removing local copies may leave cloud usage unchanged. Preserve important files before making synced deletions.', '#compare-costs', 'Understand cloud costs'],
    essential: ['Compare archiving, cloud access, and capacity', 'If the files are essential, do not delete them just to clear a warning. Consider a verified archive or suitable cloud service, and decide how much content must remain available offline. More device capacity may be appropriate.', '#when-to-upgrade', 'When more capacity makes sense'],
    battery: ['Investigate service or repair', 'Photo cleanup does not repair a battery or physical damage. Check the device maker’s service options and compare a repair quote with replacement.', 'https://support.apple.com/en-us/102598', 'Read Apple’s performance and battery guidance'],
    slow: ['Check the cause before buying', 'Review available space, network conditions, temperature, and battery health. A storage cleanup helps only with the storage part of the problem.', '#when-to-upgrade', 'Separate storage from other problems'],
    support: ['Compare your actual software and hardware needs', 'A cleaner cannot add missing hardware features or extend software support. Confirm which requirements your current phone cannot meet, then compare repair or replacement options.', '#when-to-upgrade', 'Review replacement considerations']
  };
  if (guide && problem && title && copy && link) {
    problem.addEventListener('change', () => {
      const selected = options[problem.value];
      title.textContent = selected ? selected[0] : 'Start with the problem';
      copy.textContent = selected ? selected[1] : 'Pick an option to see a relevant next step.';
      link.hidden = !selected;
      if (selected) { link.href = selected[2]; link.textContent = selected[3] + ' →'; }
      else { link.removeAttribute('href'); link.textContent = ''; }
    });
    guide.hidden = false;
  }
  const tool = document.getElementById('cost-tool');
  const form = document.getElementById('cost-form');
  const outputTitle = document.getElementById('cost-title');
  const output = document.getElementById('cost-output');
  const reset = document.getElementById('cost-reset');
  if (!tool || !form || !outputTitle || !output || !reset) return;
  const current = document.getElementById('cost-current');
  const target = document.getElementById('cost-target');
  const months = document.getElementById('cost-months');
  const cleaner = document.getElementById('cost-cleaner');
  const currency = document.getElementById('cost-currency');
  if (![current, target, months, cleaner, currency].every(Boolean)) return;
  const initial = () => { outputTitle.textContent = 'Your comparison'; output.textContent = 'Enter your prices to compare the same period.'; };
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = [current, target, months, cleaner].map(input => Number(input.value));
    const [oldPrice, newPrice, period, cleanerCost] = values;
    if (!values.every(Number.isFinite) || values.some(n => n < 0) || [oldPrice, newPrice, cleanerCost].some(n => n > 1000000000) || !Number.isInteger(period) || period < 1 || period > 120) {
      outputTitle.textContent = 'Check your entries';
      output.textContent = 'Use prices from 0 to 1,000,000,000 and a whole number of months from 1 to 120.';
      return;
    }
    const oldTotal = Math.round(oldPrice * 100) * period;
    const newTotal = Math.round(newPrice * 100) * period + Math.round(cleanerCost * 100);
    const difference = oldTotal - newTotal;
    if (![oldTotal, newTotal, difference].every(Number.isSafeInteger)) {
      outputTitle.textContent = 'Check your entries';
      output.textContent = 'These values are too large to compare reliably. Use smaller prices or a shorter period.';
      return;
    }
    const money = cents => new Intl.NumberFormat('en', { style: 'currency', currency: currency.value }).format(cents / 100);
    outputTitle.textContent = difference > 0 ? `${money(difference)} lower modeled cost` : difference < 0 ? `${money(-difference)} higher modeled cost` : 'No modeled cost difference';
    output.textContent = `Over ${period} ${period === 1 ? 'month' : 'months'}, your current cloud plan totals ${money(oldTotal)}. The proposed plan plus the cleaner totals ${money(newTotal)}. These are calculations from your entries, not measured savings or confirmation that the lower plan fits your storage.`;
  });
  form.addEventListener('input', () => {
    outputTitle.textContent = 'Ready to compare';
    output.textContent = 'Values changed. Select “Compare these costs” to calculate with the latest entries.';
  });
  currency.addEventListener('change', () => {
    outputTitle.textContent = 'Ready to compare';
    output.textContent = 'Enter every price in the selected currency, then compare again. Currency selection does not convert prices.';
  });
  reset.addEventListener('click', () => { form.reset(); initial(); current.focus(); });
  tool.hidden = false;
  initial();
})();
