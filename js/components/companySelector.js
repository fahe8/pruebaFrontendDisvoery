/**
 * companySelector.js - Company & excel-upload selector UI + create-company / upload-excel modals.
 */

function initCompanySelector() {
    const companySelect = document.getElementById('selector-company');
    const uploadSelect = document.getElementById('selector-excel-upload');

    companySelect?.addEventListener('change', async (e) => {
        const companyId = Number(e.target.value);
        setSelectedCompanyId(companyId);
        clearSelectedExcelUploadId();
        await refreshExcelUploadsForCompany(companyId, { autoSelectLatest: true });
        await reloadDashboardForSelection();
    });

    uploadSelect?.addEventListener('change', async (e) => {
        setSelectedExcelUploadId(e.target.value ? Number(e.target.value) : null);
        await reloadDashboardForSelection();
    });

    document.getElementById('btn-upload-excel-empty-state')?.addEventListener('click', () => {
        document.getElementById('btn-upload-excel')?.click();
    });

    initNewCompanyModal();
    initUploadExcelModal();
}

function populateCompanySelect(companies, selectedId) {
    const el = document.getElementById('selector-company');
    if (!el) return;
    el.innerHTML = companies.map(c =>
        `<option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>${c.name}</option>`
    ).join('');
}

function populateExcelUploadSelect(uploads, selectedId) {
    const el = document.getElementById('selector-excel-upload');
    if (!el) return;
    if (!uploads.length) {
        el.innerHTML = `<option value="">Sin uploads — sube un excel</option>`;
        return;
    }
    el.innerHTML = uploads.map(u => {
        const date = new Date(u.uploaded_at).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
        return `<option value="${u.id}" ${u.id === selectedId ? 'selected' : ''}>${u.file_name} (${date})</option>`;
    }).join('');
}

/** Refreshes the excel-upload list for a company, optionally auto-selecting the most recent one. */
async function refreshExcelUploadsForCompany(companyId, { autoSelectLatest = false } = {}) {
    excelUploadsCache = await fetchExcelUploads(companyId);
    let selectedId = getSelectedExcelUploadId();
    if (autoSelectLatest || !excelUploadsCache.some(u => u.id === selectedId)) {
        const latest = getMostRecentUpload(excelUploadsCache);
        selectedId = latest ? latest.id : null;
        setSelectedExcelUploadId(selectedId);
    }
    populateExcelUploadSelect(excelUploadsCache, selectedId);
    return excelUploadsCache;
}

/** Re-fetches data for the current selection and re-renders the dashboard, without a full page reload. */
async function reloadDashboardForSelection() {
    const hasUpload = !!getSelectedExcelUploadId();
    toggleVisible('app-loader', true);
    toggleVisible('app-content', false);
    toggleVisible('empty-state-no-upload', false);

    if (!hasUpload) {
        toggleVisible('app-loader', false);
        toggleVisible('empty-state-no-upload', true);
        return;
    }

    await loadData();
    renderKPICards(processesData);
    renderTable(processesData);
    refreshFilterOptions();
    updateFilterCount(processesData.length);

    toggleVisible('app-loader', false);
    toggleVisible('app-content', true);

    setTimeout(() => updateAllCharts(processesData), 100);
}

// ── New company modal ──

function _toggleModal(modal, show) {
    const panel = modal.querySelector('.modal-panel');
    if (show) {
        modal.classList.remove('hidden');
        setTimeout(() => panel.classList.remove('opacity-0', 'translate-y-4', 'scale-95'), 10);
    } else {
        panel.classList.add('opacity-0', 'translate-y-4', 'scale-95');
        setTimeout(() => modal.classList.add('hidden'), 250);
    }
}

function initNewCompanyModal() {
    const modal = document.getElementById('new-company-modal');
    if (!modal) return;
    const toggle = (show) => _toggleModal(modal, show);

    document.getElementById('btn-new-company')?.addEventListener('click', () => toggle(true));
    document.getElementById('btn-close-new-company')?.addEventListener('click', () => toggle(false));
    document.getElementById('btn-cancel-new-company')?.addEventListener('click', () => toggle(false));
    modal.addEventListener('click', (e) => { if (e.target === modal) toggle(false); });

    document.getElementById('btn-confirm-new-company')?.addEventListener('click', async () => {
        const name = document.getElementById('new-company-name').value.trim();
        const codigo = document.getElementById('new-company-codigo').value.trim();
        if (!name) { alert('El nombre es obligatorio.'); return; }

        const spinner = document.getElementById('new-company-spinner');
        spinner.classList.remove('hidden');
        try {
            const created = await createCompany(name, codigo || undefined);
            companiesCache = await fetchCompanies();
            setSelectedCompanyId(created.id);
            clearSelectedExcelUploadId();
            populateCompanySelect(companiesCache, created.id);
            await refreshExcelUploadsForCompany(created.id, { autoSelectLatest: true });
            toggle(false);
            await reloadDashboardForSelection();
        } catch (err) {
            console.error('Error creando empresa:', err);
            alert('Error creando la empresa.');
        } finally {
            spinner.classList.add('hidden');
        }
    });
}

// ── Upload excel modal ──

function initUploadExcelModal() {
    const modal = document.getElementById('upload-excel-modal');
    if (!modal) return;
    const toggle = (show) => _toggleModal(modal, show);

    document.getElementById('btn-upload-excel')?.addEventListener('click', () => {
        const targetSelect = document.getElementById('upload-target-company');
        targetSelect.innerHTML = companiesCache.map(c =>
            `<option value="${c.id}" ${c.id === getSelectedCompanyId() ? 'selected' : ''}>${c.name}</option>`
        ).join('');
        toggle(true);
    });

    document.getElementById('btn-close-upload-excel')?.addEventListener('click', () => toggle(false));
    document.getElementById('btn-cancel-upload-excel')?.addEventListener('click', () => toggle(false));
    modal.addEventListener('click', (e) => { if (e.target === modal) toggle(false); });

    document.getElementById('btn-confirm-upload-excel')?.addEventListener('click', async () => {
        const companyId = Number(document.getElementById('upload-target-company').value);
        const file = document.getElementById('upload-file-input').files[0];
        if (!file) { alert('Selecciona un archivo Excel.'); return; }

        const confirmBtn = document.getElementById('btn-confirm-upload-excel');
        const progress = document.getElementById('upload-progress');
        confirmBtn.disabled = true;
        progress.classList.remove('hidden');

        try {
            await uploadAndAnalyzeExcel(companyId, file);

            setSelectedCompanyId(companyId);
            if (!companiesCache.some(c => c.id === companyId)) {
                companiesCache = await fetchCompanies();
            }
            populateCompanySelect(companiesCache, companyId);
            await refreshExcelUploadsForCompany(companyId, { autoSelectLatest: true });

            toggle(false);
            await reloadDashboardForSelection();
        } catch (err) {
            console.error('Error subiendo/analizando excel:', err);
            alert('Error al subir/analizar el excel.');
        } finally {
            confirmBtn.disabled = false;
            progress.classList.add('hidden');
            document.getElementById('upload-file-input').value = '';
        }
    });
}
