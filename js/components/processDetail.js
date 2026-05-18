/**
 * processDetail.js – Modal for individual process detail view
 */

function openProcessDetail(id) {
  const p = processesData.find(x => x.id === id);
  if (!p) return;

  const modal = document.getElementById('process-detail-modal');
  const body = document.getElementById('process-detail-body');
  if (!modal || !body) return;

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
          <!-- Module: Identification (Name & Line) -->
          <div class="flex items-center justify-between mb-4">
            <div id="module-identification-container" class="flex-1">
              ${renderModuleIdentification(p, false)}
            </div>
            <div class="flex items-center gap-2">
              <button id="btn-edit-id" onclick="toggleEditIdentification(${p.id})" 
                class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all border border-white/10 active:scale-95">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                Editar
              </button>
              ${renderSaveButton('btn-save-id', `saveModuleIdentification(${p.id})`, 'Guardar', 'hidden')}
            </div>
          </div>
          
          <!-- Module: Assessment Badges (Viability, Priority, Complexity) -->
          <div class="flex items-center justify-between mb-2">
            <div id="module-badges-container" class="flex gap-2 flex-wrap">
              ${renderModuleBadges(p, false)}
            </div>
            <div class="flex items-center gap-2">
              <button id="btn-edit-badges" onclick="toggleEditBadges(${p.id})" 
                class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all border border-white/10 active:scale-95">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                Editar
              </button>
              ${renderSaveButton('btn-save-badges', `saveModuleBadges(${p.id})`, 'Guardar', 'hidden')}
            </div>
          </div>

          <!-- Module: Contact (Responsible, PDF, Email) -->
          <div id="module-contact-container" class="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-5 relative group/contact">
            <div class="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover/contact:opacity-100 transition-opacity">
               <button id="btn-edit-contact" onclick="toggleEditContact(${p.id})" 
                class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              </button>
              ${renderSaveButton('btn-save-contact', `saveModuleContact(${p.id})`, 'Guardar', 'hidden')}
            </div>
            ${renderModuleContact(p, false)}
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
        <!-- Module: Process Description -->
        <div id="module-description-container" class="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3 relative group/desc">
          <div class="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover/desc:opacity-100 transition-opacity">
            <button id="btn-edit-desc" onclick="toggleEditDescription(${p.id})" 
              class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            </button>
            ${renderSaveButton('btn-save-desc', `saveModuleDescription(${p.id})`, 'Guardar', 'hidden')}
          </div>
          ${renderModuleDescription(p, false)}
        </div>
        
        <!-- Module: Executive Summary -->
        <div id="module-summary-container" class="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3 relative group/summary">
          <div class="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover/summary:opacity-100 transition-opacity">
            <button id="btn-edit-summary" onclick="toggleEditExecutiveSummary(${p.id})" 
              class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            </button>
            ${renderSaveButton('btn-save-summary', `saveModuleExecutiveSummary(${p.id})`, 'Guardar', 'hidden')}
          </div>
          ${renderModuleExecutiveSummary(p, false)}
        </div>
      </div>

      <!-- Operational Data -->
      <div class="space-y-4">
        <div class="flex items-center justify-between ml-1">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Métricas Operativas (Editables)</h3>
          ${renderSaveButton('btn-save-process', `saveProcessChanges(${p.id})`)}
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <!-- Frecuencia Select -->
          <div class="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-2 group hover:border-white/20 transition-colors">
            <div class="flex items-center justify-between">
              <p class="text-[10px] text-slate-500 uppercase tracking-widest">Frecuencia</p>
              <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <select id="edit-frecuencia" class="w-full bg-transparent border-b border-white/10 text-indigo-300 font-bold focus:outline-none focus:border-indigo-500 transition-colors py-1 cursor-pointer">
              ${['diario', 'semanal', 'quincenal', 'mensual', 'trimestral', 'semestral', 'anual'].map(f =>
    `<option value="${f}" ${p.frecuencia === f ? 'selected' : ''} class="bg-slate-800 text-slate-200">
                  ${f.charAt(0).toUpperCase() + f.slice(1)}
                </option>`
  ).join('')}
            </select>
          </div>

          <!-- Personas Input -->
          <div class="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-2 group hover:border-white/20 transition-colors">
            <div class="flex items-center justify-between">
              <p class="text-[10px] text-slate-500 uppercase tracking-widest">Personas</p>
              <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            </div>
            <input id="edit-personas" type="number" step="0.1" value="${p.personas}" class="w-full bg-transparent border-b border-white/10 text-sky-300 font-bold focus:outline-none focus:border-sky-500 transition-colors py-1">
          </div>

          <!-- TMO Input -->
          <div class="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-2 group hover:border-white/20 transition-colors">
            <div class="flex items-center justify-between">
              <p class="text-[10px] text-slate-500 uppercase tracking-widest">TMO (min)</p>
              <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <input id="edit-tmo" type="number" step="0.1" value="${p.tmo}" class="w-full bg-transparent border-b border-white/10 text-amber-300 font-bold focus:outline-none focus:border-amber-500 transition-colors py-1">
          </div>

          <!-- Transacciones Input -->
          <div class="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-2 group hover:border-white/20 transition-colors">
            <div class="flex items-center justify-between">
              <p class="text-[10px] text-slate-500 uppercase tracking-widest">Transacciones</p>
              <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <input id="edit-transacciones" type="number" step="0.1" value="${p.transacciones}" class="w-full bg-transparent border-b border-white/10 text-emerald-300 font-bold focus:outline-none focus:border-emerald-500 transition-colors py-1">
          </div>

          <!-- Beneficio HH (Highlight) -->
          <div class="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 space-y-2 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full -mr-8 -mt-8"></div>
            <div class="flex items-center justify-between relative z-10">
              <p class="text-[10px] text-indigo-300 uppercase tracking-widest font-bold">Beneficio HH</p>
              <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
            <p id="display-hh-mes" class="text-xl font-black benefit-value text-white">${p.hhMes.toFixed(1)} <span class="text-[10px] font-normal text-indigo-300">h/mes</span></p>
          </div>
        </div>
      </div>

      <!-- Raw Data / Notes -->
      ${(p.tiempoRaw || p.transaccionesRaw) ? `
      <div class="rounded-2xl border border-white/10 bg-indigo-500/5 p-5 border-dashed">
        <h3 class="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Notas y Datos de Origen 
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
      <div id="solutions-section" class="space-y-4 pt-4 border-t border-white/5">
        <div class="flex items-center justify-between ml-1">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Soluciones Recomendadas</h3>
          <div class="flex items-center gap-2">
            <button id="btn-edit-solutions" onclick="toggleEditSolutions(${p.id})" 
              class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all border border-white/10 active:scale-95">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              Editar
            </button>
            ${renderSaveButton('btn-save-solutions', `saveSolutionsChanges(${p.id})`, 'Guardar Cambios', 'hidden')}
          </div>
        </div>
        <div id="solutions-container" class="grid md:grid-cols-2 gap-4">
          ${renderSolutionsList(p.soluciones, false)}
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.querySelector('.modal-panel').classList.remove('opacity-0', 'translate-y-4', 'scale-95');
  }, 10);
}

/**
 * Renders the solutions as cards (view mode) or inputs (edit mode)
 */
function renderSolutionsList(soluciones, isEditing) {
  if (!isEditing) {
    if (!soluciones || soluciones.length === 0) {
      return `<div class="md:col-span-2 text-center py-8 text-slate-500 italic text-sm">No hay soluciones recomendadas registradas.</div>`;
    }
    return soluciones.map(s => `
      <div class="rounded-xl border border-white/8 bg-white/3 p-4 relative group">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">${s.tipo}</span>
        </div>
        <p class="text-xs text-slate-400 leading-relaxed mb-3">${s.descripcion}</p>
        <div class="flex flex-wrap gap-1.5">
          ${(s.herramientas_sugeridas || []).map(t =>
      `<span class="badge-tool text-xs px-2 py-0.5 rounded-md border">${t}</span>`
    ).join('')}
        </div>
      </div>
    `).join('');
  } else {
    // Edit Mode
    return (soluciones || []).map((s, idx) => `
      <div class="solution-edit-card rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 space-y-3 relative group">
        <button onclick="removeSolutionItem(${idx})" class="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 opacity-0 group-hover:opacity-100 transition-all" title="Eliminar solución">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        
        <div>
          <label class="text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1 block">Tipo de Solución</label>
          <input type="text" value="${s.tipo || s.Tipo || ''}" class="sol-tipo w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-indigo-300 font-bold focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Ej: RPA, IA, Power Platform...">
        </div>
        
        <div>
          <label class="text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1 block">Descripción</label>
          <textarea rows="30" class="sol-desc w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors resize-y" placeholder="Descripción de la solución...">${s.descripcion || ''}</textarea>
        </div>
        
        <div>
          <label class="text-[10px] text-indigo-300 uppercase tracking-widest font-bold mb-1 block">Herramientas (separadas por coma)</label>
          <input type="text" value="${(s.herramientas_sugeridas || []).join(', ')}" class="sol-tools w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Ej: UiPath, Python, etc.">
        </div>
      </div>
    `).join('');
  }
}

function renderModuleIdentification(p, isEditing) {
  if (!isEditing) {
    return `
      <h2 class="text-2xl font-bold text-slate-100 leading-tight">${p.nombre}</h2>
      <div class="flex items-center gap-2 mt-1">
        <span class="text-sm text-slate-400">${p.lineaNegocio}</span>
        <span class="w-1 h-1 rounded-full bg-slate-600"></span>
        <span class="text-xs font-mono text-slate-500">ID: #${p.id}</span>
      </div>
    `;
  } else {
    return `
      <div class="space-y-3">
        <div class="space-y-1">
          <label class="text-[10px] text-indigo-300 uppercase font-bold">Nombre del Proceso</label>
          <input id="edit-nombre" type="text" value="${p.nombre}" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors">
        </div>
        <div class="space-y-1">
          <label class="text-[10px] text-indigo-300 uppercase font-bold">Línea de Negocio</label>
          <input id="edit-linea" type="text" value="${p.lineaNegocio}" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors">
        </div>
      </div>
    `;
  }
}

function renderModuleContact(p, isEditing) {
  if (!isEditing) {
    return `
      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-1">
          <p class="text-[10px] text-slate-500 uppercase tracking-widest">Responsable</p>
          <p class="text-sm text-slate-200 font-semibold">${p.responsable}</p>
        </div>
        <div class="space-y-1">
          <p class="text-[10px] text-slate-500 uppercase tracking-widest">Requiere PDF</p>
          <p class="text-sm ${p.pdf === 'Si' ? 'text-emerald-400 font-bold' : 'text-slate-400'} font-semibold">${p.pdf}</p>
        </div>
      </div>
      <div class="pt-4 border-t border-white/5">
        <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Correo Electrónico</p>
        <div class="flex items-center gap-2 group/mail">
          <div class="flex-1 flex items-center gap-2 rounded-xl px-3 py-2 border border-white/5 transition-colors group-hover/mail:border-white/10">
            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span class="text-xs text-slate-400 font-mono truncate flex-1">${p.correo}</span>
            <button onclick="copyToClipboard('${p.correo}', this)" 
              class="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-all active:scale-90" 
              title="Copiar correo">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-1">
          <label class="text-[10px] text-indigo-300 uppercase font-bold">Responsable</label>
          <input id="edit-responsable" type="text" value="${p.responsable}" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors">
        </div>
        <div class="space-y-1">
          <label class="text-[10px] text-indigo-300 uppercase font-bold">Requiere PDF</label>
          <select id="edit-pdf" class="block w-full bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500">
            <option value="Si" ${p.pdf === 'Si' ? 'selected' : ''}>Si</option>
            <option value="No" ${p.pdf === 'No' ? 'selected' : ''}>No</option>
          </select>
        </div>
      </div>
      <div class="pt-4 border-t border-white/5 space-y-1">
        <label class="text-[10px] text-indigo-300 uppercase font-bold">Correo Electrónico</label>
        <input id="edit-correo" type="email" value="${p.correo}" class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors">
      </div>
    `;
  }
}

function renderModuleDescription(p, isEditing) {
  if (!isEditing) {
    return `
      <div class="flex items-center gap-2 text-indigo-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
        <h3 class="text-sm font-bold uppercase tracking-wider">Descripción del Proceso</h3>
      </div>
      <p class="text-sm text-slate-400 leading-relaxed">${p.descripcion || 'Sin descripción adicional disponible.'}</p>
    `;
  } else {
    return `
      <div class="flex items-center gap-2 text-indigo-400 mb-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        <h3 class="text-sm font-bold uppercase tracking-wider">Editar Descripción</h3>
      </div>
      <textarea id="edit-descripcion-behavior" rows="4" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-y" placeholder="Escribe la descripción del proceso...">${p.descripcion || ''}</textarea>
    `;
  }
}

function renderModuleBadges(p, isEditing) {
  if (!isEditing) {
    return `
      ${viabilityBadge(p.viabilidad)}
      ${priorityBadge(p.prioridad, true)}
      ${complexityBadge(p.complejidad)}
    `;
  } else {
    const levels = ['Alta', 'Media', 'Baja'];
    return `
      <div class="flex flex-wrap gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
        <div class="space-y-1">
          <label class="text-[10px] text-indigo-300 uppercase font-bold">Viabilidad</label>
          <select id="edit-viabilidad" class="block w-full bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500">
            ${levels.map(l => `<option value="${l}" ${p.viabilidad === l ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-[10px] text-indigo-300 uppercase font-bold">Prioridad</label>
          <select id="edit-prioridad" class="block w-full bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500">
            ${levels.map(l => `<option value="${l}" ${p.prioridad === l ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-[10px] text-indigo-300 uppercase font-bold">Complejidad</label>
          <select id="edit-complejidad" class="block w-full bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500">
            ${levels.map(l => `<option value="${l}" ${p.complejidad === l ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </div>
      </div>
    `;
  }
}

function renderModuleExecutiveSummary(p, isEditing) {
  if (!isEditing) {
    return `
      <div class="flex items-center gap-2 text-emerald-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <h3 class="text-sm font-bold uppercase tracking-wider">Resumen Ejecutivo</h3>
      </div>
      <p class="text-sm text-slate-400 leading-relaxed">${p.resumenEjecutivo || 'Sin resumen ejecutivo disponible.'}</p>
    `;
  } else {
    return `
      <div class="flex items-center gap-2 text-indigo-400 mb-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        <h3 class="text-sm font-bold uppercase tracking-wider">Editar Resumen Ejecutivo</h3>
      </div>
      <textarea id="edit-resumen" rows="8" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-y" placeholder="Escribe el resumen ejecutivo...">${p.resumenEjecutivo || ''}</textarea>
    `;
  }
}

// --- Granular Module Toggles & Saves ---

window.toggleEditIdentification = function (id) {
  const p = processesData.find(x => x.id === id);
  if (!p) return;
  const btn = document.getElementById('btn-edit-id');
  const btnSave = document.getElementById('btn-save-id');
  const container = document.getElementById('module-identification-container');
  const isEditing = btn.getAttribute('data-editing') === 'true';

  if (isEditing) {
    btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg> Editar`;
    btn.classList.replace('bg-rose-500/20', 'bg-white/5');
    btn.classList.replace('text-rose-400', 'text-slate-300');
    btnSave.classList.add('hidden');
    btn.setAttribute('data-editing', 'false');
    container.innerHTML = renderModuleIdentification(p, false);
  } else {
    btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg> Cancelar`;
    btn.classList.replace('bg-white/5', 'bg-rose-500/20');
    btn.classList.replace('text-slate-300', 'text-rose-400');
    btnSave.classList.remove('hidden');
    btn.setAttribute('data-editing', 'true');
    container.innerHTML = renderModuleIdentification(p, true);
  }
};

window.saveModuleIdentification = async function (id) {
  const p = processesData.find(x => x.id === id);
  await handleSaveUI('btn-save-id', async () => {
    const data = {
      proceso: document.getElementById('edit-nombre').value,
      linea_de_negocio: document.getElementById('edit-linea').value,
      responsable: p.responsable,
      correo: p.correo,
      descripcion: p.descripcion,
      pdf: p.pdf
    };
    return await updateProcessBehavior(id, data);
  }, '¡Actualizado!', () => {
    window.toggleEditIdentification(id);
    if (typeof renderTable === 'function') renderTable(processesData);
  });
};

window.toggleEditContact = function (id) {
  const p = processesData.find(x => x.id === id);
  if (!p) return;
  const btn = document.getElementById('btn-edit-contact');
  const btnSave = document.getElementById('btn-save-contact');
  const container = document.getElementById('module-contact-container');
  const isEditing = btn.getAttribute('data-editing') === 'true';

  if (isEditing) {
    btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>`;
    btn.classList.remove('bg-rose-500/20', 'text-rose-400');
    btnSave.classList.add('hidden');
    btn.setAttribute('data-editing', 'false');
    container.innerHTML = `
      <div class="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover/contact:opacity-100 transition-opacity">
        ${btn.outerHTML}
        ${btnSave.outerHTML}
      </div>
      ${renderModuleContact(p, false)}
    `;
  } else {
    btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;
    btn.classList.add('bg-rose-500/20', 'text-rose-400');
    btnSave.classList.remove('hidden');
    btn.setAttribute('data-editing', 'true');
    container.innerHTML = `
      <div class="absolute top-4 right-4 flex items-center gap-2">
        ${btn.outerHTML}
        ${btnSave.outerHTML}
      </div>
      ${renderModuleContact(p, true)}
    `;
  }
};

window.saveModuleContact = async function (id) {
  const p = processesData.find(x => x.id === id);
  await handleSaveUI('btn-save-contact', async () => {
    const data = {
      proceso: p.nombre,
      linea_de_negocio: p.lineaNegocio,
      responsable: document.getElementById('edit-responsable').value,
      correo: document.getElementById('edit-correo').value,
      descripcion: p.descripcion,
      pdf: document.getElementById('edit-pdf').value
    };
    return await updateProcessBehavior(id, data);
  }, '¡Actualizado!', () => {
    window.toggleEditContact(id);
  });
};

window.toggleEditDescription = function (id) {
  const p = processesData.find(x => x.id === id);
  if (!p) return;
  const btn = document.getElementById('btn-edit-desc');
  const btnSave = document.getElementById('btn-save-desc');
  const container = document.getElementById('module-description-container');
  const isEditing = btn.getAttribute('data-editing') === 'true';

  if (isEditing) {
    btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>`;
    btn.classList.remove('bg-rose-500/20', 'text-rose-400');
    btnSave.classList.add('hidden');
    btn.setAttribute('data-editing', 'false');
    container.innerHTML = `
      <div class="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover/desc:opacity-100 transition-opacity">
        ${btn.outerHTML}
        ${btnSave.outerHTML}
      </div>
      ${renderModuleDescription(p, false)}
    `;
  } else {
    btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;
    btn.classList.add('bg-rose-500/20', 'text-rose-400');
    btnSave.classList.remove('hidden');
    btn.setAttribute('data-editing', 'true');
    container.innerHTML = `
      <div class="absolute top-4 right-4 flex items-center gap-2">
        ${btn.outerHTML}
        ${btnSave.outerHTML}
      </div>
      ${renderModuleDescription(p, true)}
    `;
  }
};

window.saveModuleDescription = async function (id) {
  const p = processesData.find(x => x.id === id);
  await handleSaveUI('btn-save-desc', async () => {
    const data = {
      proceso: p.nombre,
      linea_de_negocio: p.lineaNegocio,
      responsable: p.responsable,
      correo: p.correo,
      descripcion: document.getElementById('edit-descripcion-behavior').value,
      pdf: p.pdf
    };
    return await updateProcessBehavior(id, data);
  }, '¡Actualizado!', () => {
    window.toggleEditDescription(id);
  });
};

window.toggleEditBadges = function (id) {
  const p = processesData.find(x => x.id === id);
  if (!p) return;
  const btn = document.getElementById('btn-edit-badges');
  const btnSave = document.getElementById('btn-save-badges');
  const container = document.getElementById('module-badges-container');
  const isEditing = btn.getAttribute('data-editing') === 'true';

  if (isEditing) {
    btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg> Editar`;
    btn.classList.replace('bg-rose-500/20', 'bg-white/5');
    btn.classList.replace('text-rose-400', 'text-slate-300');
    btnSave.classList.add('hidden');
    btn.setAttribute('data-editing', 'false');
    container.innerHTML = renderModuleBadges(p, false);
  } else {
    btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg> Cancelar`;
    btn.classList.replace('bg-white/5', 'bg-rose-500/20');
    btn.classList.replace('text-slate-300', 'text-rose-400');
    btnSave.classList.remove('hidden');
    btn.setAttribute('data-editing', 'true');
    container.innerHTML = renderModuleBadges(p, true);
  }
};

window.saveModuleBadges = async function (id) {
  const p = processesData.find(x => x.id === id);
  await handleSaveUI('btn-save-badges', async () => {
    const data = {
      resumen_ejecutivo: p.resumenEjecutivo,
      viabilidad: document.getElementById('edit-viabilidad').value,
      complejidad_implementacion: document.getElementById('edit-complejidad').value,
      prioridad: document.getElementById('edit-prioridad').value
    };
    return await updateProcessDetails(id, data);
  }, '¡Actualizado!', () => {
    window.toggleEditBadges(id);
    if (typeof renderKPICards === 'function') renderKPICards(processesData);
  });
};

window.toggleEditExecutiveSummary = function (id) {
  const p = processesData.find(x => x.id === id);
  if (!p) return;
  const btn = document.getElementById('btn-edit-summary');
  const btnSave = document.getElementById('btn-save-summary');
  const container = document.getElementById('module-summary-container');
  const isEditing = btn.getAttribute('data-editing') === 'true';

  if (isEditing) {
    btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>`;
    btn.classList.remove('bg-rose-500/20', 'text-rose-400');
    btnSave.classList.add('hidden');
    btn.setAttribute('data-editing', 'false');
    container.innerHTML = `
      <div class="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover/summary:opacity-100 transition-opacity">
        ${btn.outerHTML}
        ${btnSave.outerHTML}
      </div>
      ${renderModuleExecutiveSummary(p, false)}
    `;
  } else {
    btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;
    btn.classList.add('bg-rose-500/20', 'text-rose-400');
    btnSave.classList.remove('hidden');
    btn.setAttribute('data-editing', 'true');
    container.innerHTML = `
      <div class="absolute top-4 right-4 flex items-center gap-2">
        ${btn.outerHTML}
        ${btnSave.outerHTML}
      </div>
      ${renderModuleExecutiveSummary(p, true)}
    `;
  }
};

window.saveModuleExecutiveSummary = async function (id) {
  const p = processesData.find(x => x.id === id);
  await handleSaveUI('btn-save-summary', async () => {
    const data = {
      resumen_ejecutivo: document.getElementById('edit-resumen').value,
      viabilidad: p.viabilidad,
      complejidad_implementacion: p.complejidad,
      prioridad: p.prioridad
    };
    return await updateProcessDetails(id, data);
  }, '¡Actualizado!', () => {
    window.toggleEditExecutiveSummary(id);
  });
};

let tempSolutions = [];

window.toggleEditSolutions = function (id) {
  const p = processesData.find(x => x.id === id);
  if (!p) return;

  const btnEdit = document.getElementById('btn-edit-solutions');
  const btnSave = document.getElementById('btn-save-solutions');
  const container = document.getElementById('solutions-container');

  const isEditing = btnEdit.getAttribute('data-editing') === 'true';

  if (isEditing) {
    // Cancel editing
    btnEdit.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg> Editar`;
    btnEdit.classList.replace('bg-rose-500/20', 'bg-white/5');
    btnEdit.classList.replace('text-rose-400', 'text-slate-300');
    btnSave.classList.add('hidden');
    btnEdit.setAttribute('data-editing', 'false');
    container.innerHTML = renderSolutionsList(p.soluciones, false);
  } else {
    // Start editing
    tempSolutions = JSON.parse(JSON.stringify(p.soluciones));
    btnEdit.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg> Cancelar`;
    btnEdit.classList.replace('bg-white/5', 'bg-rose-500/20');
    btnEdit.classList.replace('text-slate-300', 'text-rose-400');
    btnSave.classList.remove('hidden');
    btnEdit.setAttribute('data-editing', 'true');
    container.innerHTML = renderSolutionsList(tempSolutions, true);
  }
};

window.removeSolutionItem = function (idx) {
  tempSolutions.splice(idx, 1);
  document.getElementById('solutions-container').innerHTML = renderSolutionsList(tempSolutions, true);
};

window.saveSolutionsChanges = async function (id) {
  await handleSaveUI('btn-save-solutions', async () => {
    // Collect data from inputs
    const cards = document.querySelectorAll('.solution-edit-card');
    const soluciones = Array.from(cards).map(card => {
      const tipo = card.querySelector('.sol-tipo').value;
      const descripcion = card.querySelector('.sol-desc').value;
      const toolsText = card.querySelector('.sol-tools').value;
      const herramientas_sugeridas = toolsText.split(',').map(t => t.trim()).filter(Boolean);
      return { tipo, descripcion, herramientas_sugeridas };
    });

    return await updateSolutions(id, { soluciones_recomendadas: soluciones });
  }, '¡Actualizado!', () => {
    const btnEdit = document.getElementById('btn-edit-solutions');
    btnEdit.setAttribute('data-editing', 'false');
    btnEdit.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg> Editar`;
    btnEdit.classList.replace('bg-rose-500/20', 'bg-white/5');
    btnEdit.classList.replace('text-rose-400', 'text-slate-300');

    document.getElementById('btn-save-solutions').classList.add('hidden');

    // Re-render container in view mode
    const p = processesData.find(x => x.id === id);
    if (p) {
      document.getElementById('solutions-container').innerHTML = renderSolutionsList(p.soluciones, false);
    }
  });
};

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

/**
 * Collect values from inputs and call update API
 */
window.saveProcessChanges = async function (id) {
  await handleSaveUI('btn-save-process', async () => {
    const payload = {
      frecuencia: document.getElementById('edit-frecuencia').value,
      personas: parseFloat(document.getElementById('edit-personas').value),
      tmo_minutos: parseFloat(document.getElementById('edit-tmo').value),
      casos_per_exec: parseFloat(document.getElementById('edit-transacciones').value)
    };
    return await updateProcessData(id, payload);
  }, '¡Guardado!', () => {
    // Update specific value in modal immediately
    const updatedP = processesData.find(x => x.id === id);
    if (updatedP) {
      const hhDisplay = document.getElementById('display-hh-mes');
      if (hhDisplay) {
        hhDisplay.innerHTML = `${updatedP.hhMes.toFixed(1)} <span class="text-[10px] font-normal text-indigo-300">h/mes</span>`;
      }
    }
    // Re-render dashboard/table behind the scenes
    if (typeof renderKPICards === 'function') renderKPICards(processesData);
    if (typeof renderTable === 'function') renderTable(processesData);
    if (typeof updateAllCharts === 'function') updateAllCharts(processesData);
  });
};

/**
 * Unified UI component for a Save button
 */
function renderSaveButton(id, onclick, label = 'Guardar Cambios', extraClasses = '') {
  return `
    <button id="${id}" onclick="${onclick}" 
      class="btn-save flex items-center gap-2 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 ${extraClasses}">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
      ${label}
    </button>
  `;
}

/**
 * Unified UI handler for save button lifecycle
 */
async function handleSaveUI(btnId, asyncFn, successLabel = '¡Guardado!', successCallback) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const originalHtml = btn.innerHTML;

  try {
    btn.disabled = true;
    btn.innerHTML = '<svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Guardando...';

    const result = await asyncFn();

    if (result) {
      btn.classList.replace('bg-indigo-600', 'bg-emerald-600');
      btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg> ${successLabel}`;

      if (successCallback) successCallback();

      setTimeout(() => {
        btn.classList.replace('bg-emerald-600', 'bg-indigo-600');
        btn.innerHTML = originalHtml;
        btn.disabled = false;
      }, 2000);
    } else {
      throw new Error('Save failed');
    }
  } catch (err) {
    console.error('Save error:', err);
    btn.classList.replace('bg-indigo-600', 'bg-rose-600');
    btn.innerHTML = 'Error al guardar';
    setTimeout(() => {
      btn.classList.replace('bg-rose-600', 'bg-indigo-600');
      btn.innerHTML = originalHtml;
      btn.disabled = false;
    }, 3000);
  }
}

/** Global clipboard helper */
window.copyToClipboard = function (text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>';
    btn.classList.replace('text-indigo-400', 'text-emerald-400');
    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.replace('text-emerald-400', 'text-indigo-400');
    }, 2000);
  });
};
