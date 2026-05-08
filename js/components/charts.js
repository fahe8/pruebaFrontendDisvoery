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
                        label: ctx => ` ${fmt.hours(ctx.parsed.y)}/mes`,
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
                    type: 'logarithmic',
                    ticks: { 
                        color: '#94a3b8',
                        callback: function(value, index, ticks) {
                            // Only show major ticks to avoid clutter
                            const remain = value / (Math.pow(10, Math.floor(Math.log10(value))));
                            if (remain === 1 || remain === 2 || remain === 5 || value === 0) {
                                return fmt.number(value) + ' h';
                            }
                            return null;
                        }
                    },
                    grid: { color: CHART_DEFAULTS.gridColor },
                    title: { display: true, text: 'Horas / Mes (Escala Log)', color: '#64748b' },
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
                    callbacks: { label: ctx => ` ${fmt.percent(ctx.parsed.x)}` },
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
    renderScatterChart(processes);
    renderSolutionsChart(processes);
    renderRankingChart(processes);
    renderRadarChart(processes);
}

// ─── SCATTER CHART: Viabilidad vs Complejidad ───────────────────────────────

function renderScatterChart(processes) {
    const ctx = document.getElementById('chart-scatter')?.getContext('2d');
    if (!ctx) return;
    if (charts.scatter) charts.scatter.destroy();

    const data = processes.map(p => ({
        x: p.ponderacion,
        y: p.complejidadValor,
        r: Math.max(4, Math.sqrt(p.hhMes) * 1.5), // bubble size based on HH
        name: p.nombre,
        semaphore: p.semaphore
    }));

    charts.scatter = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Procesos',
                data,
                backgroundColor: data.map(d =>
                    d.semaphore === 'green' ? 'rgba(16, 185, 129, 0.6)' :
                        d.semaphore === 'yellow' ? 'rgba(245, 158, 11, 0.6)' : 'rgba(244, 63, 94, 0.6)'
                ),
                borderColor: data.map(d =>
                    d.semaphore === 'green' ? '#10b981' :
                        d.semaphore === 'yellow' ? '#f59e0b' : '#f43f5e'
                ),
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => {
                            const p = data[ctx.dataIndex];
                            return [`${p.name}`, `Viabilidad: ${fmt.percent(p.x)}`, `Complejidad: ${p.y}`];
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: 0, max: 100,
                    title: { display: true, text: 'Viabilidad (%)', color: '#64748b' },
                    ticks: { color: '#94a3b8' },
                    grid: { color: CHART_DEFAULTS.gridColor }
                },
                y: {
                    min: 0, max: 4,
                    title: { display: true, text: 'Complejidad (1:Baja - 3:Alta)', color: '#64748b' },
                    ticks: {
                        stepSize: 1,
                        color: '#94a3b8',
                        callback: value => ['', 'Baja', 'Media', 'Alta', ''][value]
                    },
                    grid: { color: CHART_DEFAULTS.gridColor }
                }
            }
        }
    });
}

// ─── SOLUTIONS CHART: Mix de Tecnologías ─────────────────────────────────────

function renderSolutionsChart(processes) {
    const ctx = document.getElementById('chart-solutions')?.getContext('2d');
    if (!ctx) return;
    if (charts.solutions) charts.solutions.destroy();

    const solutionTypes = {};
    processes.forEach(p => {
        (p.soluciones || []).forEach(s => {
            solutionTypes[s.tipo] = (solutionTypes[s.tipo] || 0) + 1;
        });
    });

    const labels = Object.keys(solutionTypes);
    const data = Object.values(solutionTypes);
    const colors = labels.map((_, i) => MODEL_COLORS[(i + 4) % MODEL_COLORS.length]);

    charts.solutions = new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors.map(c => c + 'cc'),
                borderColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#94a3b8', boxWidth: 12, font: { size: 10 } }
                }
            }
        }
    });
}

// ─── RADAR CHART: Estandarización vs Score ───────────────────────────────────

function renderRadarChart(processes) {
    const ctx = document.getElementById('chart-radar')?.getContext('2d');
    if (!ctx) return;
    if (charts.radar) charts.radar.destroy();

    // Show top 5 or average? Let's show top 5 processes by HH
    const top = [...processes].sort((a, b) => b.hhMes - a.hhMes).slice(0, 5);

    charts.radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Estandarización', 'Score Auto', 'Ponderación', 'Viabilidad (Rel)', 'Complejidad (Inv)'],
            datasets: top.map((p, i) => ({
                label: p.nombre.length > 15 ? p.nombre.slice(0, 14) + '…' : p.nombre,
                data: [
                    p.estandarizacion,
                    p.scoreAutomatizacion,
                    p.ponderacion,
                    (p.ponderacion > 50 ? 100 : 50), // Simplified relation
                    (4 - p.complejidadValor) * 25 // Inverse complexity as a score
                ],
                backgroundColor: MODEL_COLORS[i % MODEL_COLORS.length] + '33',
                borderColor: MODEL_COLORS[i % MODEL_COLORS.length],
                borderWidth: 2,
                pointBackgroundColor: MODEL_COLORS[i % MODEL_COLORS.length],
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0, max: 100,
                    beginAtZero: true,
                    grid: { color: CHART_DEFAULTS.gridColor },
                    angleLines: { color: CHART_DEFAULTS.gridColor },
                    pointLabels: { color: '#94a3b8', font: { size: 10 } },
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8', boxWidth: 10, font: { size: 9 }, padding: 10 }
                }
            }
        }
    });
}
