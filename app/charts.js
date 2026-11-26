// Canvas charts for the Aldermere statistics site. Plain canvas, no libraries:
// lineChart, barChart, donutChart and sparkline. Every chart draws its axes,
// labels and values from the data it is handed, and scales to its element.

const INK = '#1d2b3a';
const MUTED = '#66788a';
const GRID = '#e3e0d6';
const TEAL = '#0f766e';
const OCHRE = '#b45309';
const NAVY = '#14263f';
const GOLD = '#c9a227';

function setup(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const step = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const s = nice * mag;
  const lo = Math.floor(min / s) * s;
  const out = [];
  for (let v = lo; v <= max + s * 0.001; v += s) out.push(v);
  return out;
}

export function lineChart(canvas, { labels, values, color = TEAL, fill = true, decimals = 1, unit = '' }) {
  const { ctx, width, height } = setup(canvas, 260);
  const pad = { l: 52, r: 14, t: 14, b: 30 };
  const plotW = width - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const lo = min - (max - min) * 0.12;
  const hi = max + (max - min) * 0.12;
  const x = (i) => pad.l + (i / (values.length - 1)) * plotW;
  const y = (v) => pad.t + (1 - (v - lo) / (hi - lo)) * plotH;

  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.strokeStyle = GRID;
  ctx.lineWidth = 1;
  for (const t of niceTicks(lo, hi)) {
    const yy = y(t);
    ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(width - pad.r, yy); ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(t.toLocaleString('en-GB', { maximumFractionDigits: decimals }), pad.l - 8, yy + 4);
  }
  ctx.textAlign = 'center';
  labels.forEach((lab, i) => {
    if (i % 2 === 0 || i === labels.length - 1) ctx.fillText(String(lab), x(i), height - 10);
  });

  if (fill) {
    const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + plotH);
    grad.addColorStop(0, color + '33');
    grad.addColorStop(1, color + '00');
    ctx.beginPath();
    values.forEach((v, i) => (i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v))));
    ctx.lineTo(x(values.length - 1), pad.t + plotH);
    ctx.lineTo(x(0), pad.t + plotH);
    ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
  }
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v))));
  ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();

  values.forEach((v, i) => {
    ctx.beginPath(); ctx.arc(x(i), y(v), 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
  });
  const last = values.length - 1;
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillStyle = INK;
  ctx.textAlign = 'left';
  ctx.fillText(values[last].toLocaleString('en-GB', { maximumFractionDigits: decimals }) + unit, Math.min(x(last) + 10, width - 70), Math.max(y(values[last]) - 10, 16));
}

export function barChart(canvas, { labels, values, color = NAVY, decimals = 0, unit = '', horizontal = false }) {
  const { ctx, width, height } = setup(canvas, horizontal ? 300 : 280);
  const pad = horizontal ? { l: 130, r: 56, t: 10, b: 24 } : { l: 52, r: 10, t: 18, b: 46 };
  const max = Math.max(...values) * 1.12;
  ctx.font = '11px system-ui, sans-serif';

  if (horizontal) {
    const rowH = (height - pad.t - pad.b) / values.length;
    const barH = Math.min(24, rowH * 0.6);
    values.forEach((v, i) => {
      const y = pad.t + i * rowH + (rowH - barH) / 2;
      const w = (v / max) * (width - pad.l - pad.r);
      ctx.fillStyle = i === 0 ? OCHRE : color;
      ctx.beginPath(); ctx.roundRect(pad.l, y, w, barH, 4); ctx.fill();
      ctx.fillStyle = INK; ctx.textAlign = 'right';
      ctx.fillText(labels[i], pad.l - 8, y + barH / 2 + 4);
      ctx.fillStyle = MUTED; ctx.textAlign = 'left';
      ctx.fillText(v.toLocaleString('en-GB', { maximumFractionDigits: decimals }) + unit, pad.l + w + 8, y + barH / 2 + 4);
    });
    return;
  }

  const plotW = width - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  const slot = plotW / values.length;
  const barW = Math.min(46, slot * 0.62);
  ctx.strokeStyle = GRID;
  for (const t of niceTicks(0, max)) {
    const yy = pad.t + (1 - t / max) * plotH;
    ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(width - pad.r, yy); ctx.stroke();
    ctx.fillStyle = MUTED; ctx.textAlign = 'right';
    ctx.fillText(t.toLocaleString('en-GB'), pad.l - 8, yy + 4);
  }
  values.forEach((v, i) => {
    const h = (v / max) * plotH;
    const bx = pad.l + i * slot + (slot - barW) / 2;
    ctx.fillStyle = i === values.length - 1 ? TEAL : color;
    ctx.beginPath(); ctx.roundRect(bx, pad.t + plotH - h, barW, h, 4); ctx.fill();
    ctx.fillStyle = INK; ctx.textAlign = 'center';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText(v.toLocaleString('en-GB', { maximumFractionDigits: decimals }), bx + barW / 2, pad.t + plotH - h - 6);
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = MUTED;
    ctx.fillText(String(labels[i]), bx + barW / 2, height - 26);
  });
}

export function donutChart(canvas, { parts, colors = [NAVY, TEAL, OCHRE, GOLD, '#7c8ea3'] }) {
  const { ctx, width, height } = setup(canvas, 240);
  const cx = width / 2;
  const cy = height / 2 - 6;
  const r = 82;
  const total = parts.reduce((s, p) => s + p.share, 0);
  let a = -Math.PI / 2;
  parts.forEach((p, i) => {
    const sweep = (p.share / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a, a + sweep);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    a += sweep;
  });
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
  ctx.fillStyle = '#fffdf8'; ctx.fill();
  ctx.fillStyle = INK; ctx.textAlign = 'center';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.fillText('6.41m', cx, cy + 2);
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.fillText('people, 2025', cx, cy + 20);
}

export function sparkline(canvas, values, color = TEAL) {
  const { ctx, width, height } = setup(canvas, 44);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i) => 2 + (i / (values.length - 1)) * (width - 4);
  const y = (v) => 4 + (1 - (v - min) / span) * (height - 8);
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v))));
  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.beginPath();
  ctx.arc(x(values.length - 1), y(values[values.length - 1]), 3, 0, Math.PI * 2);
  ctx.fillStyle = color; ctx.fill();
}
