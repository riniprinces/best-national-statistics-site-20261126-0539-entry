// Router and shell for the Aldermere statistics site. Hash routes:
// #/ overview · #/population · #/economy · #/health · #/education
// #/environment · #/regions · #/regions/<id> · #/about
// Every page is reachable by a link; sortable tables are wired after each render.

import { overviewView, overviewDraw, populationView, populationDraw, economyView, economyDraw, healthView, healthDraw, educationView, educationDraw, environmentView, environmentDraw, regionsView, regionsDraw, regionView, regionDraw, aboutView, aboutDraw } from './views.js';

const ROUTES = {
  '': [overviewView, overviewDraw],
  population: [populationView, populationDraw],
  economy: [economyView, economyDraw],
  health: [healthView, healthDraw],
  education: [educationView, educationDraw],
  environment: [environmentView, environmentDraw],
  regions: [regionsView, regionsDraw],
  about: [aboutView, aboutDraw],
};

const NAV = [
  ['#/','Overview'], ['#/population','Population'], ['#/economy','Economy'],
  ['#/health','Health'], ['#/education','Education'], ['#/environment','Environment'],
  ['#/regions','Regions'], ['#/about','About'],
];

const page = document.getElementById('page');

function navHtml(active) {
  return NAV.map(([href, label]) => {
    const key = href.replace('#/', '');
    const on = (active === key) || (active.startsWith('regions/') && key === 'regions');
    return `<a href="${href}"${on ? ' aria-current="page" class="active"' : ''}>${label}</a>`;
  }).join('');
}

function wireSortableTables() {
  document.querySelectorAll('table.sortable').forEach((table) => {
    const tbody = table.querySelector('tbody');
    let dir = 1;
    let lastKey = null;
    table.querySelectorAll('th[data-key]').forEach((th) => {
      th.setAttribute('tabindex', '0');
      th.setAttribute('role', 'button');
      const sort = () => {
        const key = th.dataset.key;
        dir = key === lastKey ? -dir : 1;
        lastKey = key;
        const col = Array.from(th.parentElement.children).indexOf(th);
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const num = (t) => parseFloat(t.replace(/[^0-9.\-]/g, '')) || 0;
        rows.sort((a, b) => {
          const av = a.children[col].textContent.trim();
          const bv = b.children[col].textContent.trim();
          const an = num(av);
          const bn = num(bv);
          const bothNum = av !== '' && bv !== '' && !Number.isNaN(an) && !Number.isNaN(bn) && /[0-9]/.test(av) && /[0-9]/.test(bv);
          return bothNum ? (an - bn) * dir : av.localeCompare(bv) * dir;
        });
        rows.forEach((r) => tbody.appendChild(r));
        table.querySelectorAll('th').forEach((h) => h.removeAttribute('data-dir'));
        th.setAttribute('data-dir', dir === 1 ? 'asc' : 'desc');
      };
      th.addEventListener('click', sort);
      th.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sort(); } });
    });
  });
}

function render() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [first, second] = hash.split('/');
  let view;
  let draw;
  let active = first;
  if (first === 'regions' && second) {
    view = () => regionView(second);
    draw = () => regionDraw(second);
    active = 'regions/' + second;
  } else {
    [view, draw] = ROUTES[first] || ROUTES[''];
    active = ROUTES[first] ? first : '';
  }
  document.getElementById('nav').innerHTML = navHtml(active);
  page.innerHTML = view();
  draw();
  wireSortableTables();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
