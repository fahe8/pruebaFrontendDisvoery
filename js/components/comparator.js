/**
 * comparator.js – Multi-process selection and radar comparison view
 */

let selectedForComparison = new Set();

function initComparator() {
    document.getElementById('btn-compare')?.addEventListener('click', () => {
        if (selectedForComparison.size < 2) {
            showToast('Selecciona al menos 2 procesos para comparar', 'warning');
            return;
        }
        openComparatorModal();
    });

    document.getElementById('btn-close-comparator')?.addEventListener('click', closeComparatorModal);
    document.getElementById('comparator-modal')?.addEventListener('click', e => {
        if (e.target === e.currentTarget) closeComparatorModal();
    });
}

function toggleComparison(id) {
    if (selectedForComparison.has(id)) {
        selectedForComparison.delete(id);
    } else {
        if (selectedForComparison.size >= 5) {
            showToast('Máximo 5 procesos para comparar', 'warning');
            return;
        }
        selectedForComparison.add(id);
    }
    updateCompareButton();
}

function updateCompareButton() {
    const btn = document.getElementById('btn-compare');
    const count = selectedForComparison.size;
    if (btn) {
        btn.textContent = count > 0 ? `Comparar (${count})` : 'Comparar';
        btn.classList.toggle('ring-2 ring-indigo-500', count > 0);
    }
}

function openComparatorModal() {
    const ids = [...selectedForComparison];
    const processes = ids.map(id => processesData.find(p => p.id === id)).filter(Boolean);
    const modal = document.getElementById('comparator-modal');
    const body = document.getElementById('comparator-body');
    if (!modal || !body) return;

    // Build comparison metrics table
    const metrics = [
        { label: 'Ponderación', key: 'ponderacion', format: fmt.percent },
        { label: 'HH Mes', key: 'hhMes', format: fmt.hours },
        { label: 'Costo Proceso', key: 'costoProceso', format: fmt.currency },
        { label: 'Volumen/Mes', key: 'volumenMes', format: fmt.number },
        { label: 'TMO (min)', key: 'tmo', format: v => v },
        { label: 'Personas', key: 'personas', format: v => v },
        { label: 'Frecuencia', key: 'frecuencia', format: v => v },
        { label: 'Viabilidad', key: 'viabilidad', format: v => v },
        { label: 'Prioridad', key: 'prioridad', format: v => v },
    ];

    const headerCols = processes.map((p, i) => `
    <th class="px-4 py-3 text-left min-w-[160px]">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full flex-shrink-0" style="background:${MODEL_COLORS[i % MODEL_COLORS.length]}"></div>
        <span class="text-xs font-semibold text-slate-200 leading-tight">${truncate(p.nombre, 40)}</span>
      </div>
    </th>
  `).join('');

    const dataRows = metrics.map(m => {
        const vals = processes.map(p => m.format(p[m.key]));
        const numericVals = processes.map(p => Number(p[m.key]));
        const maxVal = Math.max(...numericVals.filter(v => !isNaN(v)));

        const cells = processes.map((p, i) => {
            const isMax = !isNaN(numericVals[i]) && numericVals[i] === maxVal && maxVal > 0;
            return `<td class="px-4 py-3 text-sm ${isMax ? 'text-indigo-300 font-semibold' : 'text-slate-300'}">${vals[i]}</td>`;
        }).join('');

        return `<tr class="border-t border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">${m.label}</td>
      ${cells}
    </tr>`;
    }).join('');

    body.innerHTML = `
    <div class="space-y-6">
      <!-- Radar chart -->
      <div class="rounded-2xl border border-white/8 bg-white/3 p-4">
        <h3 class="text-sm font-semibold text-slate-200 mb-4">Comparación Multidimensional</h3>
        <div class="h-72">
          <canvas id="chart-radar"></canvas>
        </div>
      </div>
      <!-- Metrics table -->
      <div class="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-white/3">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[130px]">Métrica</th>
                ${headerCols}
              </tr>
            </thead>
            <tbody>${dataRows}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.querySelector('.modal-panel').classList.remove('opacity-0', 'translate-y-4', 'scale-95');
        renderRadarChart(processes);
    }, 20);
}

function closeComparatorModal() {
    const modal = document.getElementById('comparator-modal');
    if (!modal) return;
    const panel = modal.querySelector('.modal-panel');
    if (panel) panel.classList.add('opacity-0', 'translate-y-4', 'scale-95');
    setTimeout(() => modal.classList.add('hidden'), 250);
}

// ─── Toast helper ─────────────────────────────────────────────────────────────

function showToast(msg, type = 'info') {
    const colors = { info: 'bg-indigo-500', warning: 'bg-amber-500', success: 'bg-emerald-500' };
    const toast = document.createElement('div');
    toast.className = `fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-2xl ${colors[type] || colors.info} translate-y-10 opacity-0 transition-all duration-300`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.remove('translate-y-10', 'opacity-0'); }, 10);
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
