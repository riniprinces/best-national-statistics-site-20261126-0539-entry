// Page views for the Aldermere statistics site. Each view returns HTML for
// #page and a draw() step that paints its canvas charts after insertion.
// All navigation is by hash links, so every section is one click away.

import { COUNTRY, YEARS, SERIES, AGE_2025, GDP_SECTORS_2025, REGIONS, REGION_GROWTH, KEY_FACTS_2025, NEWS, gdpPerCapita, fmt, regionById } from './data.js';
import { lineChart, barChart, donutChart, sparkline } from './charts.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function kpiCard(f) {
  return `<article class="kpi">
    <p class="kpi-label">${esc(f.label)}</p>
    <p class="kpi-value">${esc(f.value)}</p>
    <p class="kpi-change">${esc(f.change)}</p>
    <canvas class="spark" data-spark="${f.series}" width="220" height="44" aria-hidden="true"></canvas>
  </article>`;
}

function sourceLine(source) {
  return `<p class="source">Source: ${esc(source)} · Aldermere National Statistics Office</p>`;
}

function yearOptions(selected) {
  return YEARS.map((y) => `<option value="${y}"${y === selected ? ' selected' : ''}>${y}</option>`).join('');
}

// ---------- Overview ----------
export function overviewView() {
  return `
  <section class="hero">
    <p class="eyebrow">${esc(COUNTRY.release)} · Updated ${esc(COUNTRY.updated)}</p>
    <h1>Aldermere in numbers</h1>
    <p class="lede">The official statistics of ${esc(COUNTRY.name)} — population, economy, health,
    education and environment — published by the ${esc(COUNTRY.office)} and updated every quarter.
    Every figure names its source and its year.</p>
    <div class="hero-facts">
      <span><strong>6.41m</strong> people</span>
      <span><strong>48,210 km²</strong> land area</span>
      <span><strong>8</strong> regions</span>
      <span><strong>32,200 ALD</strong> GDP per person</span>
    </div>
  </section>

  <section aria-label="Key figures">
    <h2>Key figures, 2025</h2>
    <div class="kpi-grid">${KEY_FACTS_2025.map(kpiCard).join('')}</div>
  </section>

  <section class="two-col">
    <div class="card">
      <h2>Population growth, 2015–2025</h2>
      <canvas id="chart-pop" aria-label="Line chart of population 2015 to 2025"></canvas>
      ${sourceLine(SERIES.population.source)}
    </div>
    <div class="card">
      <h2>Who we are: age structure</h2>
      <canvas id="chart-age" aria-label="Age structure of the population in 2025"></canvas>
      <ul class="legend">${AGE_2025.map((a, i) => `<li><span class="swatch" style="background:${['#14263f', '#0f766e', '#b45309', '#c9a227', '#7c8ea3'][i]}"></span>${esc(a.group)} — <strong>${a.share}%</strong></li>`).join('')}</ul>
      ${sourceLine('ANSO Population Register, 2025')}
    </div>
  </section>

  <section class="two-col">
    <div class="card">
      <h2>What the economy makes</h2>
      <p class="muted">Share of gross domestic product by sector, 2025.</p>
      <ul class="bars">${GDP_SECTORS_2025.map((s) => `<li><span>${esc(s.sector)}</span><span class="bar-track"><span class="bar-fill" style="width:${s.share}%"></span></span><strong>${s.share}%</strong></li>`).join('')}</ul>
      ${sourceLine('ANSO National Accounts, 2025')}
    </div>
    <div class="card">
      <h2>Latest releases</h2>
      <ul class="news">${NEWS.map((n) => `<li><span class="news-date">${esc(n.date)}</span><span class="news-tag">${esc(n.tag)}</span><a href="#/population">${esc(n.title)}</a></li>`).join('')}</ul>
      <p><a class="button" href="#/economy">Explore the economy →</a></p>
    </div>
  </section>`;
}

export function overviewDraw() {
  lineChart(document.getElementById('chart-pop'), { labels: YEARS, values: SERIES.population.values, decimals: 2, unit: 'm' });
  donutChart(document.getElementById('chart-age'), { parts: AGE_2025 });
  document.querySelectorAll('canvas.spark').forEach((c) => {
    sparkline(c, SERIES[c.dataset.spark].values);
  });
}

// ---------- Shared section shell ----------
function sectionHead(title, intro, source) {
  return `<section class="hero slim"><h1>${esc(title)}</h1><p class="lede">${esc(intro)}</p></section>
  <p class="crumb">Source: ${esc(source)}</p>`;
}

function chartCard(id, title, note) {
  return `<div class="card"><h2>${esc(title)}</h2><canvas id="${id}"></canvas><p class="muted">${esc(note)}</p></div>`;
}

// ---------- Population ----------
export function populationView() {
  return `
  ${sectionHead('Population', '6.41 million people live in Aldermere. The population has grown every year since 2015, driven by longer lives and net migration into the cities.', SERIES.population.source)}
  <div class="kpi-grid">
    ${kpiCard({ label: 'Population, 2025', value: '6.41m', change: '+0.9% on 2024', series: 'population' })}
    ${kpiCard({ label: 'Median age', value: '42.1 years', change: '+0.3 years on 2024', series: 'medianAge' })}
    ${kpiCard({ label: 'Life expectancy', value: '81.2 years', change: '+0.2 years on 2024', series: 'lifeExpectancy' })}
  </div>
  <section class="two-col">
    ${chartCard('chart-pop-line', 'Population, 2015–2025', 'Total resident population at 1 January each year.')}
    <div class="card"><h2>Age structure, 2025</h2><canvas id="chart-age2"></canvas>
    <ul class="legend">${AGE_2025.map((a, i) => `<li><span class="swatch" style="background:${['#14263f', '#0f766e', '#b45309', '#c9a227', '#7c8ea3'][i]}"></span>${esc(a.group)} — <strong>${a.share}%</strong></li>`).join('')}</ul></div>
  </section>
  <section class="card">
    <h2>Population by year</h2>
    <p class="muted">Click a column heading to sort. Figures in millions.</p>
    <div class="table-wrap"><table class="sortable" data-sort="year">
      <thead><tr><th data-key="year">Year</th><th data-key="pop">Population (m)</th><th data-key="growth">Growth</th><th data-key="age">Median age</th><th data-key="life">Life expectancy</th></tr></thead>
      <tbody>${YEARS.map((y, i) => `<tr><td>${y}</td><td>${SERIES.population.values[i].toFixed(2)}</td><td>${i === 0 ? '—' : '+' + ((SERIES.population.values[i] / SERIES.population.values[i - 1] - 1) * 100).toFixed(1) + '%'}</td><td>${SERIES.medianAge.values[i].toFixed(1)}</td><td>${SERIES.lifeExpectancy.values[i].toFixed(1)}</td></tr>`).join('')}</tbody>
    </table></div>
    ${sourceLine(SERIES.population.source)}
  </section>`;
}

export function populationDraw() {
  lineChart(document.getElementById('chart-pop-line'), { labels: YEARS, values: SERIES.population.values, decimals: 2, unit: 'm' });
  donutChart(document.getElementById('chart-age2'), { parts: AGE_2025 });
  document.querySelectorAll('canvas.spark').forEach((c) => sparkline(c, SERIES[c.dataset.spark].values));
}

// ---------- Economy ----------
export function economyView() {
  return `
  ${sectionHead('Economy', 'GDP reached 206.4 billion ALD in 2025. Unemployment is at a record low of 4.8% and inflation has settled back to 2.1% after the 2022 spike.', SERIES.gdp.source)}
  <div class="kpi-grid">
    ${kpiCard({ label: 'GDP, 2025', value: '206.4bn ALD', change: '+3.9% on 2024', series: 'gdp' })}
    ${kpiCard({ label: 'GDP per person', value: '32,200 ALD', change: '+2.9% on 2024', series: 'gdp' })}
    ${kpiCard({ label: 'Unemployment', value: '4.8%', change: '−0.3 pts on 2024', series: 'unemployment' })}
    ${kpiCard({ label: 'Inflation (CPI)', value: '2.1%', change: '−0.7 pts on 2024', series: 'inflation' })}
  </div>
  <section>
    <div class="card">
      <div class="card-head"><h2 id="econ-chart-title">Gross domestic product, 2015–2025</h2>
      <label class="toggle">Show
        <select id="econ-series">
          <option value="gdp">GDP (bn ALD)</option>
          <option value="unemployment">Unemployment (%)</option>
          <option value="inflation">Inflation (%)</option>
        </select></label></div>
      <canvas id="chart-econ"></canvas>
      <p class="muted" id="econ-note">GDP in current prices, billion ALD.</p>
    </div>
  </section>
  <section class="two-col">
    <div class="card"><h2>GDP per person by year</h2><canvas id="chart-gdppc"></canvas>${sourceLine('ANSO National Accounts, 2025')}</div>
    <div class="card"><h2>What the economy makes</h2>
      <ul class="bars">${GDP_SECTORS_2025.map((s) => `<li><span>${esc(s.sector)}</span><span class="bar-track"><span class="bar-fill" style="width:${s.share}%"></span></span><strong>${s.share}%</strong></li>`).join('')}</ul>
      <p class="muted">Services — led by finance, software and tourism — account for more than two thirds of output.</p>
      ${sourceLine('ANSO National Accounts, 2025')}</div>
  </section>
  <section class="card">
    <h2>Economy by year</h2>
    <div class="table-wrap"><table class="sortable">
      <thead><tr><th data-key="year">Year</th><th data-key="gdp">GDP (bn ALD)</th><th data-key="gdppc">GDP per person (ALD)</th><th data-key="unemp">Unemployment</th><th data-key="infl">Inflation</th></tr></thead>
      <tbody>${YEARS.map((y, i) => `<tr><td>${y}</td><td>${SERIES.gdp.values[i].toFixed(1)}</td><td>${Math.round(gdpPerCapita(i)).toLocaleString('en-GB')}</td><td>${SERIES.unemployment.values[i].toFixed(1)}%</td><td>${SERIES.inflation.values[i].toFixed(1)}%</td></tr>`).join('')}</tbody>
    </table></div>
    ${sourceLine(SERIES.gdp.source)}
  </section>`;
}

export function economyDraw() {
  const draw = (key) => {
    const s = SERIES[key];
    lineChart(document.getElementById('chart-econ'), { labels: YEARS, values: s.values, decimals: s.decimals, color: key === 'gdp' ? '#0f766e' : key === 'unemployment' ? '#b45309' : '#14263f' });
    document.getElementById('econ-chart-title').textContent = `${s.label}, 2015–2025`;
    document.getElementById('econ-note').textContent = `${s.label} — ${s.unit}. ${s.source}.`;
  };
  draw('gdp');
  document.getElementById('econ-series').addEventListener('change', (e) => draw(e.target.value));
  barChart(document.getElementById('chart-gdppc'), { labels: YEARS.map((y) => String(y).slice(2)), values: YEARS.map((_, i) => Math.round(gdpPerCapita(i))), color: '#14263f' });
  document.querySelectorAll('canvas.spark').forEach((c) => sparkline(c, SERIES[c.dataset.spark].values));
}

// ---------- Health ----------
export function healthView() {
  return `
  ${sectionHead('Health', 'People in Aldermere now live 81.2 years on average. There are 4.2 doctors and 5.1 hospital beds for every 1,000 people, and infant mortality is 3.1 per 1,000 live births.', SERIES.lifeExpectancy.source)}
  <div class="kpi-grid">
    ${kpiCard({ label: 'Life expectancy', value: '81.2 years', change: '+0.2 years on 2024', series: 'lifeExpectancy' })}
    ${kpiCard({ label: 'Doctors per 1,000', value: '4.2', change: 'unchanged on 2024', series: 'doctors' })}
    ${kpiCard({ label: 'Hospital beds per 1,000', value: '5.1', change: 'unchanged on 2024', series: 'beds' })}
  </div>
  <section class="two-col">
    ${chartCard('chart-life', 'Life expectancy, 2015–2025', 'Years at birth, both sexes.')}
    ${chartCard('chart-docs', 'Doctors and beds per 1,000 people', 'Doctors have risen steadily; beds have eased as care moved out of hospital.')}
  </section>
  <section class="card">
    <h2>Health in 2025 — the headline numbers</h2>
    <dl class="facts">
      <div><dt>Infant mortality</dt><dd><strong>3.1</strong> per 1,000 live births</dd></div>
      <div><dt>Health spending</dt><dd><strong>9.4%</strong> of GDP (19.4bn ALD)</dd></div>
      <div><dt>Smoking, adults</dt><dd><strong>14.2%</strong> smoke daily, down from 19.8% in 2015</dd></div>
      <div><dt>Obesity, adults</dt><dd><strong>21.6%</strong> — the office's fastest-growing concern</dd></div>
      <div><dt>Flu vaccination, 65+</dt><dd><strong>78%</strong> covered in winter 2025–26</dd></div>
      <div><dt>Waiting time, planned surgery</dt><dd><strong>41 days</strong> median</dd></div>
    </dl>
    ${sourceLine('ANSO Health Accounts and Vital Statistics, 2025')}
  </section>`;
}

export function healthDraw() {
  lineChart(document.getElementById('chart-life'), { labels: YEARS, values: SERIES.lifeExpectancy.values, decimals: 1, unit: ' yrs', color: '#0f766e' });
  barChart(document.getElementById('chart-docs'), { labels: YEARS.map((y) => String(y).slice(2)), values: SERIES.doctors.values, decimals: 1, color: '#14263f' });
  document.querySelectorAll('canvas.spark').forEach((c) => sparkline(c, SERIES[c.dataset.spark].values));
}

// ---------- Education ----------
export function educationView() {
  return `
  ${sectionHead('Education', '99.2% of adults can read and write. 54.3% of 18–24 year olds are in tertiary education, and 61,400 students graduated in 2025.', SERIES.literacy.source)}
  <div class="kpi-grid">
    ${kpiCard({ label: 'Adult literacy', value: '99.2%', change: 'unchanged on 2024', series: 'literacy' })}
    ${kpiCard({ label: 'Tertiary enrolment', value: '54.3%', change: '+0.3 pts on 2024', series: 'tertiary' })}
  </div>
  <section class="two-col">
    ${chartCard('chart-tert', 'Tertiary enrolment, 2015–2025', '% of 18–24 year olds in higher education.')}
    <div class="card"><h2>Schooling in 2025</h2>
      <ul class="bars">
        <li><span>Primary enrolment</span><span class="bar-track"><span class="bar-fill" style="width:99.6%"></span></span><strong>99.6%</strong></li>
        <li><span>Secondary enrolment</span><span class="bar-track"><span class="bar-fill" style="width:97.8%"></span></span><strong>97.8%</strong></li>
        <li><span>Tertiary enrolment</span><span class="bar-track"><span class="bar-fill" style="width:54.3%"></span></span><strong>54.3%</strong></li>
        <li><span>Graduates, 2025</span><span class="bar-track"><span class="bar-fill" style="width:61.4%"></span></span><strong>61,400</strong></li>
      </ul>
      <p class="muted">Pupils per teacher: 14.1 in primary schools, 12.8 in secondary schools.</p>
      ${sourceLine('ANSO Education Survey, 2025')}</div>
  </section>
  <section class="card">
    <h2>Graduates by field, 2025</h2>
    <div class="table-wrap"><table class="sortable">
      <thead><tr><th data-key="field">Field of study</th><th data-key="grads">Graduates</th><th data-key="share">Share</th><th data-key="women">Women</th></tr></thead>
      <tbody>
        <tr><td>Business &amp; law</td><td>14,200</td><td>23.1%</td><td>54%</td></tr>
        <tr><td>Health &amp; welfare</td><td>11,800</td><td>19.2%</td><td>76%</td></tr>
        <tr><td>Engineering &amp; computing</td><td>10,900</td><td>17.8%</td><td>31%</td></tr>
        <tr><td>Natural sciences</td><td>7,600</td><td>12.4%</td><td>48%</td></tr>
        <tr><td>Education</td><td>6,900</td><td>11.2%</td><td>71%</td></tr>
        <tr><td>Arts &amp; humanities</td><td>5,400</td><td>8.8%</td><td>58%</td></tr>
        <tr><td>Agriculture &amp; veterinary</td><td>4,600</td><td>7.5%</td><td>52%</td></tr>
      </tbody>
    </table></div>
    ${sourceLine('ANSO Education Survey, 2025')}
  </section>`;
}

export function educationDraw() {
  lineChart(document.getElementById('chart-tert'), { labels: YEARS, values: SERIES.tertiary.values, decimals: 1, unit: '%', color: '#b45309' });
  document.querySelectorAll('canvas.spark').forEach((c) => sparkline(c, SERIES[c.dataset.spark].values));
}

// ---------- Environment ----------
export function environmentView() {
  return `
  ${sectionHead('Environment', 'Renewable sources supplied 48% of Aldermere’s electricity in 2025. CO₂ per person has fallen from 6.4 tonnes in 2015 to 4.8 tonnes, and 44% of the country is forest.', SERIES.co2.source)}
  <div class="kpi-grid">
    ${kpiCard({ label: 'Renewable electricity', value: '48%', change: '+2 pts on 2024', series: 'renewable' })}
    ${kpiCard({ label: 'CO₂ per person', value: '4.8 t', change: '−0.1 t on 2024', series: 'co2' })}
  </div>
  <section class="two-col">
    ${chartCard('chart-ren', 'Renewable share of electricity, 2015–2025', '% of electricity generated from wind, water, sun and biomass.')}
    ${chartCard('chart-co2', 'CO₂ per person, 2015–2025', 'Tonnes per person per year.')}
  </section>
  <section class="card">
    <h2>Environment in 2025 — the headline numbers</h2>
    <dl class="facts">
      <div><dt>Forest cover</dt><dd><strong>44%</strong> of land area (21,200 km²)</dd></div>
      <div><dt>Household recycling</dt><dd><strong>58%</strong> of household waste recycled</dd></div>
      <div><dt>Good air-quality days</dt><dd><strong>312</strong> of 365 days in Aldermere City</dd></div>
      <div><dt>Protected land</dt><dd><strong>18.6%</strong> of land in national parks and reserves</dd></div>
      <div><dt>Electric cars</dt><dd><strong>19.4%</strong> of new cars sold are electric</dd></div>
      <div><dt>Water use per person</dt><dd><strong>128 litres</strong> a day</dd></div>
    </dl>
    ${sourceLine('ANSO Environment Accounts, 2025')}
  </section>`;
}

export function environmentDraw() {
  lineChart(document.getElementById('chart-ren'), { labels: YEARS, values: SERIES.renewable.values, decimals: 0, unit: '%', color: '#0f766e' });
  lineChart(document.getElementById('chart-co2'), { labels: YEARS, values: SERIES.co2.values, decimals: 1, unit: ' t', color: '#b45309' });
  document.querySelectorAll('canvas.spark').forEach((c) => sparkline(c, SERIES[c.dataset.spark].values));
}

// ---------- Regions ----------
export function regionsView() {
  return `
  ${sectionHead('Regions', 'Aldermere has eight regions. Aldermere City holds 1.18 million people — 18% of the country — while Dunmoor, the largest by area, holds 670,000. Compare them below.', 'ANSO Regional Statistics, 2025')}
  <section class="card">
    <div class="card-head"><h2>Compare the regions</h2>
    <label class="toggle">Search <input id="region-search" type="search" placeholder="Type a region name…" aria-label="Search regions"></label></div>
    <div class="table-wrap"><table class="sortable" id="region-table">
      <thead><tr><th data-key="name">Region</th><th data-key="pop">Population</th><th data-key="gdppc">GDP per person (ALD)</th><th data-key="unemp">Unemployment</th><th data-key="life">Life expectancy</th><th data-key="renew">Renewable %</th><th data-key="forest">Forest %</th></tr></thead>
      <tbody>${REGIONS.map((r) => `<tr data-name="${esc(r.name.toLowerCase())}"><td><a href="#/regions/${r.id}">${esc(r.name)}</a></td><td>${r.pop.toLocaleString('en-GB')}</td><td>${r.gdpPc.toLocaleString('en-GB')}</td><td>${r.unemp.toFixed(1)}%</td><td>${r.life.toFixed(1)}</td><td>${r.renewable}%</td><td>${r.forest}%</td></tr>`).join('')}</tbody>
    </table></div>
    <p class="muted" id="region-count">Showing 8 of 8 regions. Click a column heading to sort; click a region for its detail page.</p>
    ${sourceLine('ANSO Regional Statistics, 2025')}
  </section>
  <section class="two-col">
    <div class="card"><h2>Population by region, 2025</h2><canvas id="chart-regpop"></canvas><p class="muted">Thousands of people.</p></div>
    <div class="card"><h2>GDP per person by region, 2025</h2><canvas id="chart-reggdp"></canvas><p class="muted">ALD per person per year.</p></div>
  </section>`;
}

export function regionsDraw() {
  barChart(document.getElementById('chart-regpop'), { labels: REGIONS.map((r) => r.name.replace('Aldermere ', '')), values: REGIONS.map((r) => r.pop), horizontal: true, unit: 'k' });
  barChart(document.getElementById('chart-reggdp'), { labels: REGIONS.map((r) => r.name.replace('Aldermere ', '')), values: REGIONS.map((r) => r.gdpPc), horizontal: true });
  const input = document.getElementById('region-search');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll('#region-table tbody tr').forEach((tr) => {
      const ok = tr.dataset.name.includes(q);
      tr.style.display = ok ? '' : 'none';
      if (ok) shown += 1;
    });
    document.getElementById('region-count').textContent = `Showing ${shown} of 8 regions.`;
  });
}

// ---------- Region detail ----------
export function regionView(id) {
  const r = regionById(id);
  const growth = REGION_GROWTH[r.id];
  const share = ((r.pop / 6410) * 100).toFixed(1);
  return `
  <section class="hero slim"><p class="eyebrow"><a href="#/regions">← All regions</a></p>
  <h1>${esc(r.name)}</h1>
  <p class="lede">${r.pop.toLocaleString('en-GB')} people — ${share}% of Aldermere — living on ${r.area.toLocaleString('en-GB')} km² at ${r.density.toLocaleString('en-GB')} people per km².</p></section>
  <div class="kpi-grid">
    <article class="kpi"><p class="kpi-label">Population</p><p class="kpi-value">${r.pop.toLocaleString('en-GB')}</p><p class="kpi-change">Index ${growth[10]} (2015 = 100)</p></article>
    <article class="kpi"><p class="kpi-label">GDP per person</p><p class="kpi-value">${r.gdpPc.toLocaleString('en-GB')} ALD</p><p class="kpi-change">${r.gdpPc > 32200 ? 'Above' : 'Below'} the national 32,200 ALD</p></article>
    <article class="kpi"><p class="kpi-label">Unemployment</p><p class="kpi-value">${r.unemp.toFixed(1)}%</p><p class="kpi-change">National average 4.8%</p></article>
    <article class="kpi"><p class="kpi-label">Life expectancy</p><p class="kpi-value">${r.life.toFixed(1)} years</p><p class="kpi-change">National average 81.2 years</p></article>
  </div>
  <section class="two-col">
    <div class="card"><h2>Population growth, 2015–2025</h2><canvas id="chart-regline"></canvas><p class="muted">Index, 2015 = 100.</p></div>
    <div class="card"><h2>${esc(r.name)} in 2025</h2>
      <dl class="facts">
        <div><dt>Renewable electricity</dt><dd><strong>${r.renewable}%</strong> of supply</dd></div>
        <div><dt>Forest cover</dt><dd><strong>${r.forest}%</strong> of land</dd></div>
        <div><dt>Tertiary graduates</dt><dd><strong>${r.grads}%</strong> of 25–34 year olds hold a degree</dd></div>
        <div><dt>Population density</dt><dd><strong>${r.density.toLocaleString('en-GB')}</strong> people per km²</dd></div>
      </dl>
      ${sourceLine('ANSO Regional Statistics, 2025')}</div>
  </section>
  <p><a class="button" href="#/regions">← Back to all regions</a></p>`;
}

export function regionDraw(id) {
  const r = regionById(id);
  lineChart(document.getElementById('chart-regline'), { labels: YEARS, values: REGION_GROWTH[r.id], decimals: 0, color: '#14263f' });
}

// ---------- About / sources ----------
export function aboutView() {
  return `
  ${sectionHead('About this site', 'This site is the public face of the Aldermere National Statistics Office. It publishes the country’s official statistics in plain language, with every figure traceable to its source.', 'ANSO, 2026')}
  <section class="card">
    <h2>How to read a figure</h2>
    <p>Every chart and table names its source and reference year. Figures are revised when better data arrives; the release note on the overview page gives the date of the latest revision. Where a figure is an estimate, the text says so.</p>
    <h2>Methods in brief</h2>
    <ul class="plain">
      <li><strong>Population</strong> — the population register, updated from births, deaths and migration records.</li>
      <li><strong>GDP</strong> — national accounts, current prices, compiled to the Aldermere System of National Accounts.</li>
      <li><strong>Unemployment</strong> — Labour Force Survey, quarterly, 12,000 households.</li>
      <li><strong>Prices</strong> — Consumer Price Index, 640 goods and services priced monthly in 42 towns.</li>
      <li><strong>Health &amp; education</strong> — administrative registers, cross-checked with survey data.</li>
      <li><strong>Environment</strong> — energy balance and emissions inventory, compiled with the Environment Agency.</li>
    </ul>
    <h2>Contact</h2>
    <p>Aldermere National Statistics Office, 14 Ledger Square, Aldermere City · <a href="#/">statistics@aldermere.example</a> · All figures on this site are fictional and illustrative.</p>
  </section>`;
}

export function aboutDraw() {}
