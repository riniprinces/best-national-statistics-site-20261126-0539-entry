// Aldermere in numbers — every figure on this site comes from this file.
// Aldermere is a fictional country; the figures are invented but internally
// consistent, and each indicator names its source office and reference year.
// Currency is the alder (ALD). Population is in thousands unless stated.

export const COUNTRY = {
  name: 'Aldermere',
  office: 'Aldermere National Statistics Office',
  short: 'ANSO',
  capital: 'Aldermere City',
  areaKm2: 48210,
  currency: 'ALD',
  updated: '26 November 2026',
  release: 'Autumn Statistical Bulletin 2026',
};

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// National series, one value per year in YEARS.
export const SERIES = {
  population: { label: 'Population', unit: 'million', values: [5.92, 5.97, 6.02, 6.07, 6.12, 6.15, 6.19, 6.24, 6.29, 6.35, 6.41], source: 'ANSO Population Register, 2025', decimals: 2 },
  gdp: { label: 'Gross domestic product', unit: 'billion ALD', values: [148.2, 152.6, 157.9, 163.4, 169.1, 165.8, 174.3, 183.6, 191.2, 198.7, 206.4], source: 'ANSO National Accounts, 2025', decimals: 1 },
  unemployment: { label: 'Unemployment rate', unit: '% of labour force', values: [6.8, 6.4, 6.1, 5.7, 5.4, 7.9, 6.6, 5.9, 5.5, 5.1, 4.8], source: 'ANSO Labour Force Survey, Q3 2025', decimals: 1 },
  inflation: { label: 'Consumer price inflation', unit: '% per year', values: [1.2, 0.9, 1.4, 1.8, 1.6, 0.7, 2.4, 6.1, 4.3, 2.8, 2.1], source: 'ANSO Consumer Price Index, Oct 2025', decimals: 1 },
  lifeExpectancy: { label: 'Life expectancy at birth', unit: 'years', values: [78.4, 78.7, 78.9, 79.2, 79.5, 79.8, 80.1, 80.4, 80.7, 81.0, 81.2], source: 'ANSO Vital Statistics, 2025', decimals: 1 },
  medianAge: { label: 'Median age', unit: 'years', values: [39.1, 39.4, 39.7, 40.0, 40.3, 40.6, 40.9, 41.2, 41.5, 41.8, 42.1], source: 'ANSO Population Register, 2025', decimals: 1 },
  renewable: { label: 'Renewable share of electricity', unit: '%', values: [31, 33, 35, 37, 39, 41, 42, 44, 45, 46, 48], source: 'ANSO Energy Balance, 2025', decimals: 0 },
  co2: { label: 'CO₂ emissions per person', unit: 'tonnes', values: [6.4, 6.2, 6.1, 5.9, 5.7, 5.2, 5.3, 5.1, 5.0, 4.9, 4.8], source: 'ANSO Environment Accounts, 2025', decimals: 1 },
  literacy: { label: 'Adult literacy rate', unit: '%', values: [98.6, 98.7, 98.8, 98.9, 99.0, 99.0, 99.1, 99.1, 99.2, 99.2, 99.2], source: 'ANSO Education Survey, 2025', decimals: 1 },
  tertiary: { label: 'Tertiary enrolment', unit: '% of 18–24 year olds', values: [44.1, 45.3, 46.8, 48.2, 49.6, 50.1, 51.4, 52.6, 53.5, 54.0, 54.3], source: 'ANSO Education Survey, 2025', decimals: 1 },
  doctors: { label: 'Doctors per 1,000 people', unit: 'per 1,000', values: [3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.0, 4.1, 4.2, 4.2], source: 'ANSO Health Workforce Register, 2025', decimals: 1 },
  beds: { label: 'Hospital beds per 1,000 people', unit: 'per 1,000', values: [5.6, 5.5, 5.5, 5.4, 5.4, 5.3, 5.2, 5.2, 5.1, 5.1, 5.1], source: 'ANSO Health Accounts, 2025', decimals: 1 },
};

export const AGE_2025 = [
  { group: '0–14 years', share: 16.8 },
  { group: '15–24 years', share: 11.9 },
  { group: '25–44 years', share: 27.4 },
  { group: '45–64 years', share: 25.6 },
  { group: '65+ years', share: 18.3 },
];

export const GDP_SECTORS_2025 = [
  { sector: 'Services', share: 68.4 },
  { sector: 'Industry', share: 21.7 },
  { sector: 'Agriculture & fishing', share: 4.6 },
  { sector: 'Construction', share: 5.3 },
];

// Eight regions. Populations are thousands and sum to 6,410 — the 2025 national total.
export const REGIONS = [
  { id: 'city', name: 'Aldermere City', pop: 1180, gdpPc: 41200, unemp: 4.1, life: 81.8, renewable: 38, forest: 22, area: 640, density: 1844, grads: 61.2 },
  { id: 'northgate', name: 'Northgate', pop: 940, gdpPc: 28700, unemp: 5.6, life: 80.4, renewable: 44, forest: 41, area: 5120, density: 184, grads: 52.8 },
  { id: 'eastvale', name: 'Eastvale', pop: 860, gdpPc: 26400, unemp: 5.9, life: 80.1, renewable: 52, forest: 48, area: 6980, density: 123, grads: 49.5 },
  { id: 'southport', name: 'Southport', pop: 810, gdpPc: 30100, unemp: 5.2, life: 80.9, renewable: 47, forest: 35, area: 4210, density: 192, grads: 55.1 },
  { id: 'westmere', name: 'Westmere', pop: 720, gdpPc: 24900, unemp: 6.3, life: 79.6, renewable: 58, forest: 55, area: 7450, density: 97, grads: 46.3 },
  { id: 'highfeld', name: 'Highfeld', pop: 640, gdpPc: 22800, unemp: 6.8, life: 79.2, renewable: 61, forest: 63, area: 8920, density: 72, grads: 43.9 },
  { id: 'lakeside', name: 'Lakeside', pop: 590, gdpPc: 25600, unemp: 5.4, life: 80.6, renewable: 49, forest: 44, area: 5340, density: 110, grads: 51.7 },
  { id: 'dunmoor', name: 'Dunmoor', pop: 670, gdpPc: 21500, unemp: 7.1, life: 78.9, renewable: 55, forest: 58, area: 9550, density: 70, grads: 41.2 },
];

// Regional population index (2015 = 100) so each region page can draw its own line.
export const REGION_GROWTH = {
  city: [100, 101, 102, 104, 105, 106, 107, 108, 110, 111, 113],
  northgate: [100, 101, 101, 102, 103, 103, 104, 105, 106, 107, 108],
  eastvale: [100, 100, 101, 101, 102, 102, 103, 104, 104, 105, 106],
  southport: [100, 101, 102, 103, 104, 104, 105, 106, 107, 108, 109],
  westmere: [100, 101, 101, 102, 102, 103, 103, 104, 104, 105, 105],
  highfeld: [100, 100, 100, 101, 101, 101, 102, 102, 103, 103, 104],
  lakeside: [100, 101, 101, 102, 103, 103, 104, 105, 105, 106, 107],
  dunmoor: [100, 100, 101, 101, 102, 102, 102, 103, 103, 104, 104],
};

export const KEY_FACTS_2025 = [
  { label: 'Population', value: '6.41m', change: '+0.9% on 2024', series: 'population' },
  { label: 'GDP', value: '206.4bn ALD', change: '+3.9% on 2024', series: 'gdp' },
  { label: 'GDP per person', value: '32,200 ALD', change: '+2.9% on 2024', series: 'gdp' },
  { label: 'Unemployment', value: '4.8%', change: '−0.3 pts on 2024', series: 'unemployment' },
  { label: 'Inflation (CPI)', value: '2.1%', change: '−0.7 pts on 2024', series: 'inflation' },
  { label: 'Life expectancy', value: '81.2 years', change: '+0.2 years on 2024', series: 'lifeExpectancy' },
  { label: 'Renewable electricity', value: '48%', change: '+2 pts on 2024', series: 'renewable' },
  { label: 'CO₂ per person', value: '4.8 t', change: '−0.1 t on 2024', series: 'co2' },
];

export const NEWS = [
  { date: '18 Nov 2026', title: 'Unemployment falls to 4.8%, lowest since records began', tag: 'Labour' },
  { date: '04 Nov 2026', title: 'Renewable electricity reaches 48% of supply', tag: 'Energy' },
  { date: '21 Oct 2026', title: 'Population passes 6.4 million', tag: 'Population' },
  { date: '07 Oct 2026', title: 'Autumn Statistical Bulletin 2026 published', tag: 'Release' },
];

export function gdpPerCapita(yearIndex) {
  return (SERIES.gdp.values[yearIndex] * 1000) / SERIES.population.values[yearIndex];
}

export function fmt(n, decimals = 1) {
  return n.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function regionById(id) {
  return REGIONS.find((r) => r.id === id) || REGIONS[0];
}
