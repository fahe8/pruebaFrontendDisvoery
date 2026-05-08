/**
 * charts.js – All Chart.js chart instances for the dashboard
 * Uses Chart.js 4 loaded via CDN
 */

// Chart instances (stored for later updates/destroy)
const charts = {};

const CHART_DEFAULTS = {
    color: '#cbd5e1',
    gridColor: 'rgba(148,163,184,0.1)',
    font: { family: "'Inter', sans-serif", size: 12 },
};

Chart.defaults.color = CHART_DEFAULTS.color;
Chart.defaults.font.family = CHART_DEFAULTS.font.family;
Chart.defaults.font.size = CHART_DEFAULTS.font.size;

// ─── BAR CHART: HH por Proceso ───────────────────────────────────────────────

function renderBarChart(processes) {
    const ctx = document.getElementById('chart-bar')?.getContext('2d');
    if (!ctx) return;
    if (charts.bar) charts.bar.destroy();

    const sorted = [...processes].sort((a, b) => b.hhMes - a.hhMes);
    const labels = sorted.map(p => p.nombre.length > 30 ? p.nombre.slice(0, 29) + '…' : p.nombre);
    const data = sorted.map(p => p.hhMes);
    const colors = sorted.map(p =>
        p.semaphore === 'green' ? '#10b981' : p.semaphore === 'yellow' ? '#f59e0b' : '#f43f5e'
    );

    charts.bar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'HH Mes',
                data,
                backgroundColor: colors.map(c => c + 'cc'),
                borderColor: colors,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.parsed.y.toFixed(1)} horas/mes`,
                        afterLabel: ctx => {
                            const p = sorted[ctx.dataIndex];
                            return [`Viabilidad: ${p.viabilidad}`];
                        },
                    },
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 10,
                },
            },
            scales: {
                x: {
                    ticks: { maxRotation: 35, color: '#94a3b8', font: { size: 11 } },
                    grid: { color: CHART_DEFAULTS.gridColor },
                },
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: CHART_DEFAULTS.gridColor },
                    title: { display: true, text: 'Horas / Mes', color: '#64748b' },
                },
            },
        }
    });
}

// ─── PIE CHART: Distribución por Modelo ──────────────────────────────────────

function renderPieChart(processes) {
    const ctx = document.getElementById('chart-pie')?.getContext('2d');
    if (!ctx) return;
    if (charts.pie) charts.pie.destroy();

    // Group by lineaNegocio
    const groups = {};
    processes.forEach(p => {
        groups[p.lineaNegocio] = (groups[p.lineaNegocio] || 0) + 1;
    });
    const labels = Object.keys(groups);
    const data = Object.values(groups);
    const colors = labels.map((_, i) => MODEL_COLORS[i % MODEL_COLORS.length]);

    charts.pie = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors.map(c => c + 'cc'),
                borderColor: colors,
                borderWidth: 2,
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        color: '#94a3b8',
                        boxWidth: 12,
                        boxHeight: 12,
                        borderRadius: 4,
                        useBorderRadius: true,
                    }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.label}: ${ctx.parsed} proceso(s)`,
                    },
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 10,
                },
            }
        }
    });
}

// ─── HORIZONTAL BAR: Ponderación ranking ─────────────────────────────────────

function renderRankingChart(processes) {
    const ctx = document.getElementById('chart-ranking')?.getContext('2d');
    if (!ctx) return;
    if (charts.ranking) charts.ranking.destroy();

    const sorted = [...processes].sort((a, b) => b.ponderacion - a.ponderacion);
    const labels = sorted.map(p => p.nombre.length > 35 ? p.nombre.slice(0, 34) + '…' : p.nombre);
    const data = sorted.map(p => p.ponderacion);
    const colors = sorted.map(p =>
        p.semaphore === 'green' ? '#10b981' : p.semaphore === 'yellow' ? '#f59e0b' : '#f43f5e'
    );

    charts.ranking = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Ponderación (%)',
                data,
                backgroundColor: colors.map(c => c + 'cc'),
                borderColor: colors,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: { label: ctx => ` ${ctx.parsed.x.toFixed(1)}%` },
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 10,
                }
            },
            scales: {
                x: {
                    min: 0, max: 100,
                    ticks: { color: '#94a3b8' },
                    grid: { color: CHART_DEFAULTS.gridColor },
                    title: { display: true, text: 'Índice de Factibilidad (%)', color: '#64748b' },
                },
                y: {
                    ticks: { color: '#94a3b8', font: { size: 11 } },
                    grid: { display: false },
                }
            }
        }
    });
}

/** Re-render all active charts with a fresh dataset */
function updateAllCharts(processes) {
    renderBarChart(processes);
    renderPieChart(processes);
    renderRankingChart(processes);
}
