/**
 * kpiCards.js – Renders the 4 KPI summary cards at the top of the dashboard
 */

function renderKPICards(processes) {
    const kpis = computeKPIs(processes);
    const container = document.getElementById('kpi-cards');
    if (!container) return;

    const cards = [
        {
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
            label: 'Total Procesos',
            value: kpis.total,
            sub: 'procesos analizados',
            color: 'indigo',
            glow: 'shadow-indigo-500/20',
        },
        {
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
            label: 'Total HH Mes',
            value: fmt.hours(kpis.totalHH),
            sub: 'horas hombre mensuales',
            color: 'violet',
            glow: 'shadow-violet-500/20',
        },
        {
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
            label: 'Ponderación Promedio',
            value: fmt.percent(kpis.avgPonderacion),
            sub: 'índice de automatización',
            color: 'emerald',
            glow: 'shadow-emerald-500/20',
        },
    ];

    const colorMap = {
        indigo: { bg: 'bg-indigo-500/10', icon: 'bg-indigo-500/20 text-indigo-400', val: 'text-indigo-300' },
        violet: { bg: 'bg-violet-500/10', icon: 'bg-violet-500/20 text-violet-400', val: 'text-violet-300' },
        fuchsia: { bg: 'bg-fuchsia-500/10', icon: 'bg-fuchsia-500/20 text-fuchsia-400', val: 'text-fuchsia-300' },
        emerald: { bg: 'bg-emerald-500/10', icon: 'bg-emerald-500/20 text-emerald-400', val: 'text-emerald-300' },
    };

    container.innerHTML = cards.map(c => {
        const cc = colorMap[c.color];
        return `
    <div class="relative overflow-hidden rounded-2xl border border-white/8 ${cc.bg} shadow-lg ${c.glow} p-6 flex gap-4 items-start transition-all duration-300 hover:scale-[1.02] hover:shadow-xl kpi-card group">
      <!-- Glow blob -->
      <div class="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity" style="background: currentColor;"></div>
      <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${cc.icon} shadow-inner">
        ${c.icon}
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">${c.label}</p>
        <p class="text-2xl font-bold ${cc.val} leading-none tracking-tight">${c.value}</p>
        <p class="text-xs text-slate-500 mt-1">${c.sub}</p>
      </div>
    </div>`;
    }).join('');
}
