/**
 * processDetail.js – Modal for individual process detail view
 */

function openProcessDetail(id) {
    const p = processesData.find(x => x.id === id);
    if (!p) return;

    const modal = document.getElementById('process-detail-modal');
    const body = document.getElementById('process-detail-body');
    if (!modal || !body) return;

    const solutionCards = p.soluciones.map(s => `
    <div class="rounded-xl border border-white/8 bg-white/3 p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">${s.tipo}</span>
      </div>
      <p class="text-xs text-slate-400 leading-relaxed mb-3">${s.descripcion.slice(0, 300)}…</p>
      <div class="flex flex-wrap gap-1.5">
        ${(s.herramientas_sugeridas || []).map(t =>
        `<span class="badge-tool text-xs px-2 py-0.5 rounded-md border">${t}</span>`
    ).join('')}
      </div>
    </div>
  `).join('');

    // Autopercent gauge
    const gaugeColor = p.semaphore === 'green' ? '#10b981' : p.semaphore === 'yellow' ? '#f59e0b' : '#f43f5e';
    const pct = p.ponderacion;
    const strokeDasharray = `${pct * 2.51327} ${251.327}`; // 2πr where r=40

    body.innerHTML = `
    <div class="space-y-6">
      ${p.hasAlert ? `
        <div class="flex gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
          <svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45L19.53 19H4.47L12 5.45zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
          <div class="text-sm">
            <p class="font-bold mb-1">Aviso de Proceso</p>
            <p class="opacity-90 leading-relaxed">${p.alertMessage}</p>
          </div>
        </div>
      ` : ''}

      <!-- Identification row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2 space-y-4">
          <div>
            <h2 class="text-2xl font-bold text-slate-100 leading-tight">${p.nombre}</h2>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-sm text-slate-400">${p.lineaNegocio}</span>
              <span class="w-1 h-1 rounded-full bg-slate-600"></span>
              <span class="text-xs font-mono text-slate-500">ID: #${p.id}</span>
            </div>
          </div>
          
          <div class="flex gap-2 flex-wrap">
            ${semaphoreBadge(p.semaphore, p.viabilidad)}
            <span class="badge-info inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border">
              Prioridad: ${p.prioridad}
            </span>
            <span class="badge-info inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border">
              Complejidad: ${p.complejidad}
            </span>
          </div>

          <div class="rounded-2xl border border-white/8 bg-white/3 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Responsable</p>
              <p class="text-sm text-slate-200 font-medium">${p.responsable}</p>
            </div>
            <div>
              <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Correo</p>
              <p class="text-sm text-slate-200 font-medium">${p.correo}</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-white/8 bg-white/3 p-4 flex flex-col items-center justify-center gap-2">
          <svg width="110" height="110" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(148,163,184,0.1)" stroke-width="8"/>
            <circle cx="50" cy="50" r="42" fill="none" stroke="${gaugeColor}" stroke-width="8"
              stroke-dasharray="${pct * 2.6389} 263.89"
              stroke-dashoffset="0"
              stroke-linecap="round"
              transform="rotate(-90 50 50)"
              style="transition:stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1)"/>
            <text x="50" y="56" text-anchor="middle" font-size="20" font-weight="800" fill="${gaugeColor}">${pct.toFixed(0)}%</text>
          </svg>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Índice Factibilidad</p>
        </div>
      </div>

      <!-- Description & Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3">
          <div class="flex items-center gap-2 text-indigo-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
            <h3 class="text-sm font-bold uppercase tracking-wider">Descripción del Proceso</h3>
          </div>
          <p class="text-sm text-slate-400 leading-relaxed">${p.descripcion || 'Sin descripción adicional disponible.'}</p>
        </div>
        <div class="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3">
          <div class="flex items-center gap-2 text-emerald-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <h3 class="text-sm font-bold uppercase tracking-wider">Resumen Ejecutivo</h3>
          </div>
          <p class="text-sm text-slate-400 leading-relaxed">${p.resumenEjecutivo}</p>
        </div>
      </div>

      <!-- Operational Data -->
      <div class="space-y-3">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Métricas Operativas</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${[
              { label: 'Frecuencia', val: p.frecuencia, color: 'text-indigo-300', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'Personas', val: p.personas, color: 'text-sky-300', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
              { label: 'TMO (min)', val: p.tmo, color: 'text-amber-300', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'Transacciones', val: p.transacciones, color: 'text-emerald-300', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          ].map(m => `
            <div class="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-2 group hover:border-white/20 transition-colors">
              <div class="flex items-center justify-between">
                <p class="text-[10px] text-slate-500 uppercase tracking-widest">${m.label}</p>
                <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${m.icon}"/></svg>
              </div>
              <p class="text-xl font-bold ${m.color}">${m.val}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Raw Data / Notes -->
      ${(p.tiempoRaw || p.transaccionesRaw) ? `
      <div class="rounded-2xl border border-white/10 bg-indigo-500/5 p-5 border-dashed">
        <h3 class="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Notas y Datos de Origen (Raw)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1">
            <p class="text-[10px] text-indigo-300/50 uppercase font-bold">Tiempo / TMO Detalle:</p>
            <p class="text-sm text-slate-300 leading-relaxed italic">${p.tiempoRaw || 'N/A'}</p>
          </div>
          <div class="space-y-1">
            <p class="text-[10px] text-indigo-300/50 uppercase font-bold">Volumen / Transacciones Detalle:</p>
            <p class="text-sm text-slate-300 leading-relaxed italic">${p.transaccionesRaw || 'N/A'}</p>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Recommended Solutions -->
      <div class="space-y-4">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Soluciones Recomendadas</h3>
        <div class="grid md:grid-cols-2 gap-4">
          ${solutionCards}
        </div>
      </div>
    </div>
  `;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.querySelector('.modal-panel').classList.remove('opacity-0', 'translate-y-4', 'scale-95');
    }, 10);
}

function closeProcessDetail() {
    const modal = document.getElementById('process-detail-modal');
    if (!modal) return;
    const panel = modal.querySelector('.modal-panel');
    if (panel) panel.classList.add('opacity-0', 'translate-y-4', 'scale-95');
    setTimeout(() => modal.classList.add('hidden'), 250);
}

function initDetailModal() {
    // Close on backdrop click
    document.getElementById('process-detail-modal')?.addEventListener('click', e => {
        if (e.target === e.currentTarget) closeProcessDetail();
    });
    // Close on button
    document.getElementById('btn-close-detail')?.addEventListener('click', closeProcessDetail);
    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeProcessDetail();
    });
}
