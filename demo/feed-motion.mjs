const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const visible = rectangle => rectangle.bottom > 0 && rectangle.top < window.innerHeight;

function animate(element, frames, duration) {
  if (!element?.animate) return null;
  return element.animate(frames, { duration, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
}

export function replaceFeed(target, markup) {
  const previous = new Map();
  const moreOpen = target.querySelector('.more-results')?.open;
  for (const row of target.querySelectorAll('.result-row')) {
    previous.set(row.dataset.resultKey, row.getBoundingClientRect());
    for (const animation of row.getAnimations()) animation.cancel();
  }
  const wasPopulated = target.childElementCount > 0;
  target.innerHTML = markup;
  const more = target.querySelector('.more-results');
  if (more && moreOpen) more.open = true;
  if (!wasPopulated) return;
  const reduce = reducedMotion();
  const colors = getComputedStyle(document.documentElement);
  const highlight = colors.getPropertyValue('--blue-tint').trim();
  const surface = colors.getPropertyValue('--surface').trim();
  const rows = [...target.querySelectorAll('.result-row')].slice(0, 12);
  const measurements = rows.map(row => [row, row.getBoundingClientRect()]);
  for (const [row, bounds] of measurements) {
    if (!visible(bounds) || (row.checkVisibility && !row.checkVisibility())) continue;
    const before = previous.get(row.dataset.resultKey);
    const distance = before ? before.top - bounds.top : 0;
    if (!reduce && before && Math.abs(distance) > 2 && Math.abs(distance) < 500) {
      animate(row, [{ transform: `translateY(${distance}px)` }, { transform: 'translateY(0)' }], 220);
    } else if (!before) {
      animate(row, [{ backgroundColor: highlight }, { backgroundColor: surface }], reduce ? 100 : 220);
    }
  }
}

export function acknowledgeSave(button) {
  if (!button) return;
  const icon = button.querySelector('svg');
  if (reducedMotion()) return;
  animate(icon, [{ transform: 'scale(1)' }, { transform: 'scale(1.15)', offset: 0.45 }, { transform: 'scale(1)' }], 160);
}

export async function leaveFeed(row) {
  if (!row || reducedMotion()) return;
  const animation = animate(row, [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0.2, transform: 'translateX(12px)' }], 120);
  if (animation) await animation.finished.catch(() => {});
}
