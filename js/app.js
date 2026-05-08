/**
 * app.js – Main application bootstrap: navigation, tab switching, initialization
 */

// ─── NAV / TAB LOGIC ─────────────────────────────────────────────────────────

const TABS = ['dashboard', 'processes'];

function showTab(tab) {
    TABS.forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        const btn = document.getElementById(`nav-${t}`);
        if (el) el.classList.toggle('hidden', t !== tab);
        if (btn) {
            btn.classList.toggle('bg-white/8', t === tab);
            btn.classList.toggle('text-slate-100', t === tab);
            btn.classList.toggle('text-slate-400', t !== tab);
        }
    });
}

function initNavigation() {
    TABS.forEach(t => {
        document.getElementById(`nav-${t}`)?.addEventListener('click', () => showTab(t));
    });
}

// ─── SIDEBAR TOGGLE ──────────────────────────────────────────────────────────

function initSidebar() {
    const toggle = document.getElementById('btn-sidebar-toggle');
    const collapse = document.getElementById('btn-sidebar-collapse');
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main-content');

    if (!sidebar || !main) return;

    const toggleSidebar = () => {
        const isClosed = sidebar.classList.contains('-translate-x-full');
        if (isClosed) {
            sidebar.classList.remove('-translate-x-full');
            main.classList.add('lg:pl-60');
        } else {
            sidebar.classList.add('-translate-x-full');
            main.classList.remove('lg:pl-60');
        }
    };

    toggle?.addEventListener('click', toggleSidebar);
    collapse?.addEventListener('click', toggleSidebar);
}

// ─── APP INIT ────────────────────────────────────────────────────────────────

async function init() {
    // Show loader
    toggleVisible('app-loader', true);
    toggleVisible('app-content', false);

    await loadData();

    // Wire up all components
    renderKPICards(processesData);
    updateAllCharts(processesData);
    renderTable(processesData);
    initFilters();
    initDetailModal();
    initNavigation();
    initSidebar();
    updateFilterCount(processesData.length);

    // Hide loader
    toggleVisible('app-loader', false);
    toggleVisible('app-content', true);
}

document.addEventListener('DOMContentLoaded', init);
