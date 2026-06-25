/**
 * filters.js – Global filter panel + search bar logic
 */

// Current active filters
const activeFilters = {
    search: '',
    nameModel: 'all',
    frecuencia: 'all',
    viabilidad: 'all',
    hhMin: '',
    hhMax: '',
};

/** Repopulate filter dropdowns and reset active filters after the dataset changes (company/excel switch). */
function refreshFilterOptions() {
    populateSelect('filter-model', getUniqueValues('nameModel'), 'Todas las líneas');
    populateSelect('filter-frecuencia', getUniqueValues('frecuencia'), 'Todas');
    populateSelect('filter-viabilidad', getUniqueValues('viabilidad'), 'Todas');

    Object.keys(activeFilters).forEach(k => {
        activeFilters[k] = (k === 'nameModel' || k === 'frecuencia' || k === 'viabilidad') ? 'all' : '';
    });

    const searchInput = document.getElementById('search-global');
    if (searchInput) searchInput.value = '';
    const hhMin = document.getElementById('filter-hh-min');
    const hhMax = document.getElementById('filter-hh-max');
    if (hhMin) hhMin.value = '';
    if (hhMax) hhMax.value = '';
}

function initFilters() {
    // Populate dropdowns from data
    refreshFilterOptions();

    // Search
    const searchInput = document.getElementById('search-global');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(e => {
            activeFilters.search = e.target.value;
            applyFilters();
        }, 280));
    }

    // Selects
    bindSelect('filter-model', 'nameModel');
    bindSelect('filter-frecuencia', 'frecuencia');
    bindSelect('filter-viabilidad', 'viabilidad');

    // HH range
    const hhMin = document.getElementById('filter-hh-min');
    const hhMax = document.getElementById('filter-hh-max');
    if (hhMin) hhMin.addEventListener('input', debounce(e => { activeFilters.hhMin = e.target.value; applyFilters(); }, 400));
    if (hhMax) hhMax.addEventListener('input', debounce(e => { activeFilters.hhMax = e.target.value; applyFilters(); }, 400));

    // Reset button
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            Object.keys(activeFilters).forEach(k => {
                activeFilters[k] = k === 'nameModel' || k === 'frecuencia' || k === 'viabilidad' ? 'all' : '';
            });
            // Reset UI
            if (searchInput) searchInput.value = '';
            document.querySelectorAll('.filter-select').forEach(s => s.value = 'all');
            if (hhMin) hhMin.value = '';
            if (hhMax) hhMax.value = '';
            applyFilters();
        });
    }

    // Export button
    document.getElementById('btn-export')?.addEventListener('click', () => {
        const filtered = filterProcesses(activeFilters);
        exportCSV(filtered);
    });
}

function populateSelect(id, values, placeholder) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `<option value="all">${placeholder}</option>` +
        values.map(v => `<option value="${v}">${v}</option>`).join('');
}

function bindSelect(id, filterKey) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', e => {
        activeFilters[filterKey] = e.target.value;
        applyFilters();
    });
}

/**
 * Core: filter + re-render the entire dashboard
 */
function applyFilters() {
    const filtered = filterProcesses(activeFilters);
    renderKPICards(filtered);
    updateAllCharts(filtered);
    renderTable(filtered);
    updateFilterCount(filtered.length);
}

function updateFilterCount(count) {
    const el = document.getElementById('filter-count');
    if (el) el.textContent = `${count} proceso${count !== 1 ? 's' : ''}`;
}
