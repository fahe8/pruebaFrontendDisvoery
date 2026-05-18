/**
 * utils.js - Shared helpers: formatters, color maps, CSV export, DOM helpers
 */

// ─── FORMATTERS ──────────────────────────────────────────────────────────────

const fmt = {
    currency: (val) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val),
    number: (val) => new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val),
    percent: (val) => new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val) + '%',
    hours: (val) => new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val) + ' h',
};

// ─── COLOR MAPS ──────────────────────────────────────────────────────────────

const SEMAPHORE_CONFIG = {
    green: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40', dot: '#10b981', label: 'Alta' },
    yellow: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40', dot: '#f59e0b', label: 'Media' },
    red: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/40', dot: '#f43f5e', label: 'Baja' },
};

const MODEL_COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
];

/** Returns a stable color for a label string */
function getModelColor(label, index) {
    if (index !== undefined) return MODEL_COLORS[index % MODEL_COLORS.length];
    let hash = 0;
    for (let i = 0; i < label.length; i++) hash = label.charCodeAt(i) + ((hash << 5) - hash);
    return MODEL_COLORS[Math.abs(hash) % MODEL_COLORS.length];
}

// ─── BADGE HELPERS ───────────────────────────────────────────────────────────

function semaphoreBadge(semaphore, label) {
    const cfg = SEMAPHORE_CONFIG[semaphore] || SEMAPHORE_CONFIG.yellow;
    const text = label || cfg.label;
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}">
    <span class="w-1.5 h-1.5 rounded-full" style="background:${cfg.dot}"></span>
    ${text}
  </span>`;
}

function priorityBadge(label, showLabel = true) {
    const colors = {
        'Alta': SEMAPHORE_CONFIG.green,
        'Media': SEMAPHORE_CONFIG.yellow,
        'Baja': SEMAPHORE_CONFIG.red
    };
    const cfg = colors[label] || SEMAPHORE_CONFIG.yellow;
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}">
      <span class="w-1.5 h-1.5 rounded-full" style="background:${cfg.dot}"></span>
      ${showLabel ? `Prioridad: ${label}` : label}
    </span>`;
}

function complexityBadge(label) {
    const colors = {
        'Baja': SEMAPHORE_CONFIG.green,
        'Media': SEMAPHORE_CONFIG.yellow,
        'Alta': SEMAPHORE_CONFIG.red
    };
    const cfg = colors[label] || SEMAPHORE_CONFIG.yellow;
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}">
      <span class="w-1.5 h-1.5 rounded-full" style="background:${cfg.dot}"></span>
      Complejidad: ${label}
    </span>`;
}

function viabilityBadge(label) {
    const colors = {
        'Alta': SEMAPHORE_CONFIG.green,
        'Media': SEMAPHORE_CONFIG.yellow,
        'Baja': SEMAPHORE_CONFIG.red
    };
    const cfg = colors[label] || SEMAPHORE_CONFIG.yellow;
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}">
      <span class="w-1.5 h-1.5 rounded-full" style="background:${cfg.dot}"></span>
      Viabilidad: ${label}
    </span>`;
}

// ─── CSV EXPORT ──────────────────────────────────────────────────────────────

function exportCSV(processes, filename = 'procesos.csv') {
    const headers = [
        'Ranking', 'Proceso', 'Línea de negocio', 'Frecuencia', 'Volumen/Mes',
        'TMO (min)', 'HH Día', 'HH Mes', 'Personas', 'Costo Proceso (USD)',
        'Viabilidad', 'Ponderación (%)', 'Prioridad', 'Complejidad',
    ];
    const rows = processes.map(p => [
        p.ranking, `"${p.nombre}"`, `"${p.nameModel}"`, p.frecuencia,
        p.volumenMes, p.tmo, p.hhDia, p.hhMes, p.personas,
        p.costoProceso, p.viabilidad, p.ponderacion, p.prioridad, p.complejidad
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

// ─── DOM HELPERS ─────────────────────────────────────────────────────────────

/** Clear element and set innerHTML */
function setHTML(el, html) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) el.innerHTML = html;
}

/** Show/hide an element */
function toggleVisible(el, show) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) el.classList.toggle('hidden', !show);
}

/** Debounce utility */
function debounce(fn, delay = 300) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}
