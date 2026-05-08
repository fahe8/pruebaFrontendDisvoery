/**
 * table.js – Interactive sortable/searchable process table with pagination
 */

let tableState = {
    data: [],
    sortKey: 'ranking',
    sortDir: 'asc',
    page: 1,
    pageSize: 8,
};

function renderTable(processes) {
    tableState.data = processes;
    tableState.page = 1;
    renderTablePage();
}

function renderTablePage() {
    const { data, sortKey, sortDir, page, pageSize } = tableState;

    // Sort
    const sorted = [...data].sort((a, b) => {
        let va = a[sortKey], vb = b[sortKey];
        if (typeof va === 'string') va = va.toLowerCase();
        if (typeof vb === 'string') vb = vb.toLowerCase();
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    // Paginate
    const total = sorted.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const slice = sorted.slice(start, start + pageSize);

    // Header
    const cols = [
        { key: 'ranking', label: 'ranking', cls: 'w-16 text-center' },
        { key: 'nombre', label: 'proceso', cls: 'min-w-[200px]' },
        { key: 'lineaNegocio', label: 'area', cls: 'min-w-[140px]' },
        { key: 'responsable', label: 'responsable', cls: 'min-w-[140px]' },
        { key: 'personas', label: 'personas', cls: 'text-right' },
        { key: 'transacciones', label: 'transacciones', cls: 'text-right' },
        { key: 'tmo', label: 'tmo minutos', cls: 'text-right' },
        { key: 'hhMes', label: 'potencial beneficio mes hh', cls: 'text-right' },
        { key: 'frecuencia', label: 'frecuencia', cls: '' },
        { key: 'ponderacion', label: 'ponderacion', cls: 'text-right' },
        { key: 'viabilidad', label: 'viabilidad', cls: '' },
        { key: 'pdf', label: 'pdf', cls: 'text-center' },
        { key: '_actions', label: '', cls: 'w-10 text-center' },
    ];

    const headerHTML = cols.map(c => {
        if (c.key === '_actions') return `<th class="${c.cls}"></th>`;
        const active = sortKey === c.key;
        const dir = active ? (sortDir === 'asc' ? '↑' : '↓') : '⇅';
        return `<th class="${c.cls} px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors"
      data-sort="${c.key}">
      <span class="flex items-center gap-1 ${c.cls.includes('text-right') ? 'justify-end' : ''}">
        ${c.label}
        <span class="${active ? 'text-indigo-400' : 'text-slate-600'} text-[10px]">${dir}</span>
      </span>
    </th>`;
    }).join('');

    const rowsHTML = slice.map(p => `
    <tr class="border-t border-white/5 hover:bg-white/3 transition-colors cursor-pointer group" data-id="${p.id}">
      <td class="px-4 py-3.5 text-center">
        <span class="badge-ranking w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mx-auto">${p.ranking}</span>
      </td>
      <td class="px-4 py-3.5">
        <div class="flex items-center gap-2">
          ${p.hasAlert ? `<svg class="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" title="${p.alertMessage}"><path d="M12 2L1 21h22L12 2zm0 3.45L19.53 19H4.47L12 5.45zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>` : ''}
          <div class="font-medium text-slate-100 text-sm leading-snug">${truncate(p.nombre, 50)}</div>
        </div>
      </td>
      <td class="px-4 py-3.5 text-xs text-slate-400">${p.lineaNegocio}</td>
      <td class="px-4 py-3.5 text-xs text-slate-400">${p.responsable}</td>
      <td class="px-4 py-3.5 text-right text-sm text-slate-300">${p.personas}</td>
      <td class="px-4 py-3.5 text-right text-sm text-slate-300">${p.transacciones}</td>
      <td class="px-4 py-3.5 text-right text-sm text-slate-300">${p.tmo}</td>
      <td class="px-4 py-3.5 text-right font-semibold text-indigo-300">${fmt.hours(p.hhMes)}</td>
      <td class="px-4 py-3.5 text-sm text-slate-400">${p.frecuencia}</td>
      <td class="px-4 py-3.5 text-right">
        <div class="flex items-center justify-end gap-2">
          <div class="w-12 h-1.5 rounded-full bg-slate-700 overflow-hidden">
            <div class="h-full rounded-full transition-all" style="width:${p.ponderacion}%;background:${ponderacionColor(p.ponderacion)}"></div>
          </div>
          <span class="text-[10px] font-semibold" style="color:${ponderacionColor(p.ponderacion)}">${fmt.percent(p.ponderacion)}</span>
        </div>
      </td>
      <td class="px-4 py-3.5">
        ${semaphoreBadge(p.semaphore, p.viabilidad)}
      </td>
      <td class="px-4 py-3.5 text-center">
        <span class="text-xs ${p.pdf === 'Si' ? 'text-emerald-400 font-bold' : 'text-slate-500'}">${p.pdf}</span>
      </td>
      <td class="px-4 py-3.5 text-center">
        <button class="btn-detail opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 flex items-center justify-center text-indigo-400" data-id="${p.id}" title="Ver detalle">
          <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </td>
    </tr>
  `).join('');

    // Pagination
    const pagHTML = buildPagination(page, pages, total, start, Math.min(start + pageSize, total));

    setHTML('table-head', headerHTML);
    setHTML('table-body', rowsHTML || `<tr><td colspan="${cols.length}" class="text-center py-10 text-slate-500">No hay procesos para mostrar</td></tr>`);
    setHTML('table-pagination', pagHTML);

    // Bind sorting
    document.querySelectorAll('#processes-table th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const key = th.dataset.sort;
            if (tableState.sortKey === key) {
                tableState.sortDir = tableState.sortDir === 'asc' ? 'desc' : 'asc';
            } else {
                tableState.sortKey = key;
                tableState.sortDir = 'asc';
            }
            renderTablePage();
        });
    });

    // Bind row click -> detail
    document.querySelectorAll('#processes-table tr[data-id]').forEach(row => {
        row.addEventListener('click', (e) => {
            if (e.target.closest('.btn-comparator-check')) return;
            const id = parseInt(row.dataset.id);
            openProcessDetail(id);
        });
    });

    // Bind pagination buttons
    document.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            const pg = parseInt(btn.dataset.page);
            if (pg >= 1 && pg <= pages) { tableState.page = pg; renderTablePage(); }
        });
    });
}

function buildPagination(page, pages, total, from, to) {
    const prevDisabled = page <= 1 ? 'opacity-40 pointer-events-none' : '';
    const nextDisabled = page >= pages ? 'opacity-40 pointer-events-none' : '';
    let pageNums = '';
    for (let i = 1; i <= pages; i++) {
        const active = i === page ? 'bg-indigo-500/30 text-indigo-300 border-indigo-500/50' : 'text-slate-400 hover:bg-white/5';
        pageNums += `<button data-page="${i}" class="w-8 h-8 rounded-lg text-xs font-medium border border-transparent ${active} transition-all">${i}</button>`;
    }
    return `
    <div class="flex items-center gap-2 text-xs text-slate-500">
      Mostrando ${from + 1}–${to} de ${total}
    </div>
    <div class="flex items-center gap-1">
      <button data-page="${page - 1}" class="w-8 h-8 rounded-lg text-slate-400 hover:bg-white/5 border border-transparent flex items-center justify-center ${prevDisabled}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
      </button>
      ${pageNums}
      <button data-page="${page + 1}" class="w-8 h-8 rounded-lg text-slate-400 hover:bg-white/5 border border-transparent flex items-center justify-center ${nextDisabled}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>`;
}

function truncate(str, max) {
    return str && str.length > max ? str.slice(0, max - 1) + '…' : str;
}

function ponderacionColor(val) {
    if (val >= 70) return '#10b981';
    if (val >= 45) return '#f59e0b';
    return '#f43f5e';
}
