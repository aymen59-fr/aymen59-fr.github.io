'use strict';
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectTab(tabs[next]); tabs[next].focus(); }
  });
});
const links = [...document.querySelectorAll('.header nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) links.forEach(link => {
        const active = link.hash === '#' + entry.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  links.forEach(link => observer.observe(document.querySelector(link.hash)));
}

const hoverMotion = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const animatedCards = [...document.querySelectorAll('.quote-card, .experience-card, .education, .languages, .contact')];
const animatedText = [...document.querySelectorAll('h1, h2, h3, h4, main p')];
function followPointer(element, kind) {
  element.classList.add(kind === 'card' ? 'motion-card' : 'motion-text');
  let bounds;
  let frame = 0;
  let point;
  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    bounds = null;
    for (const key of ['--tilt-x', '--tilt-y', '--text-x', '--text-y', '--glow-x', '--glow-y']) element.style.removeProperty(key);
  }
  element.addEventListener('pointerenter', () => {
    if (hoverMotion.matches) bounds = element.getBoundingClientRect();
  });
  element.addEventListener('pointermove', event => {
    if (!hoverMotion.matches || event.pointerType === 'touch') return;
    bounds ||= element.getBoundingClientRect();
    point = { x: event.clientX, y: event.clientY };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!bounds || !bounds.width || !bounds.height) return;
      const x = Math.max(0, Math.min(1, (point.x - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (point.y - bounds.top) / bounds.height));
      if (kind === 'card') {
        element.style.setProperty('--tilt-x', ((.5 - y) * 3).toFixed(2) + 'deg');
        element.style.setProperty('--tilt-y', ((x - .5) * 3).toFixed(2) + 'deg');
        element.style.setProperty('--glow-x', (x * 100) + '%');
        element.style.setProperty('--glow-y', (y * 100) + '%');
      } else {
        element.style.setProperty('--text-x', ((x - .5) * 5).toFixed(2) + 'px');
        element.style.setProperty('--text-y', ((y - .5) * 4).toFixed(2) + 'px');
      }
    });
  }, { passive: true });
  element.addEventListener('pointerleave', reset);
  element.addEventListener('pointercancel', reset);
  return reset;
}
const resetMotion = [...animatedCards.map(element => followPointer(element, 'card')), ...animatedText.map(element => followPointer(element, 'text'))];
hoverMotion.addEventListener('change', () => resetMotion.forEach(reset => reset()));
window.addEventListener('scroll', () => resetMotion.forEach(reset => reset()), { passive: true });
