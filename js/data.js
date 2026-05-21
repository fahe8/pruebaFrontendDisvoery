/**
 * data.js - Data layer: loads and normalizes process data
 */

// Configuration
const API_URL = 'https://discovery-tsm7.onrender.com/automation-analysis/analysis-results';
// const API_URL = 'http://localhost:3001/automation-analysis/analysis-results';

// Normalized dataset will be stored here after fetch
let processesData = [];

/**
 * Load data from dynamic API and normalize/enrich each record.
 */
async function loadData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const raw = await response.json();

    processesData = raw.map((item, index) => {
      const cp = item.comportamiento_proceso || {};
      return {
        id: item.id || (index + 1),
        // Core identifiers
        nombre: cp['Proceso'] || cp['proceso'] || `Proceso ${index + 1}`,
        lineaNegocio: cp['Línea de negocio'] || cp['linea_de_negocio'] || 'Sin clasificar',
        nameModel: cp['Línea de negocio'] || cp['linea_de_negocio'] || 'Sin clasificar',
        responsable: cp['Responsable'] || cp['responsable'] || 'N/A',
        correo: cp['Correo'] || cp['correo'] || 'N/A',
        descripcion: cp['Descripcion'] || cp['descripcion'] || '',
        pdf: cp['pdf'] || 'No',

        // Operational metrics
        frecuencia: (cp['FRECUENCIA'] || cp['Frecuencia'] || cp['frecuencia'] || 'N/A').toLowerCase(),
        personas: cp['PERSONAS'] || cp['personas'] || 0,
        transacciones: cp['TRANSACCIONES PO'] || cp['transacciones'] || 0,
        tmo: cp['TMO MINUTOS'] || cp['tmo_minutos'] || 0,
        tiempoRaw: cp['tiempo_raw'] || '',
        transaccionesRaw: cp['transacciones_raw'] || '',
        hhMes: cp['POTENCIAL BENEFICIO MES HH'] || cp['potencial_beneficio_mes_hh'] || 0,
        hhTotal: cp['POTENCIAL BENEFICIO MES HH'] || cp['potencial_beneficio_mes_hh'] || 0,
        tamano: cp['Tamaño'] || cp['tamano'] || 'N/A',

        // Alerts
        hasAlert: cp['FLAG ALERTA'] === true || cp['flag_alerta'] === true,
        alertMessage: cp['AVISO ALERTA'] || cp['aviso_alerta'] || '',

        // Automation assessment
        ranking: item.ranking_factibilidad || 0,
        ponderacion: item.ponderacion_factibilidad || 0,
        viabilidad: item.viabilidad || 'N/A',
        complejidad: item.complejidad_implementacion || 'N/A',
        complejidadValor: item.complejidad_implementacion === 'Alta' ? 3 : item.complejidad_implementacion === 'Media' ? 2 : 1,
        prioridad: item.prioridad || 'N/A',
        resumenEjecutivo: item.resumen_ejecutivo || '',
        soluciones: item.soluciones_recomendadas || [],
        prioridadSugerida: cp['prioridad_sugerida'] || 'N/A',
        
        // ROI & Financials
        roi: item.roi || cp['roi'] || 0,
        paybackMonths: item.payback_months || cp['payback_months'] || 0,
        estandarizacion: cp['estandarizacion_pct'] || 0,
        scoreAutomatizacion: cp['score_automatizacion'] || 0,

        // Derived: semaphore based on ponderacion
        semaphore: getSemaphore(item.ponderacion_factibilidad || 0),
      };
    });

    return processesData;
  } catch (err) {
    console.error('Error loading data:', err);
    return [];
  }
}

/**
 * Returns a semaphore color key based on automation feasibility score.
 */
function getSemaphore(score) {
  if (score >= 70) return 'green';
  if (score >= 45) return 'yellow';
  return 'red';
}

/**
 * Update process metrics via API
 */
async function updateProcessData(id, data) {
  try {
    const url = `${API_URL}/${id}/update-operational-values`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // Refresh data after update
    await loadData();
    return true;
  } catch (err) {
    console.error('Error updating process:', err);
    return false;
  }
}

/**
 * Update recommended solutions via API
 */
async function updateSolutions(id, data) {
  try {
    const url = `${API_URL}/${id}/solutions`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // Refresh data after update
    await loadData();
    return true;
  } catch (err) {
    console.error('Error updating solutions:', err);
    return false;
  }
}

/**
 * Update process assessment details (summary, viability, complexity, priority) via API
 */
async function updateProcessDetails(id, data) {
  try {
    const url = `${API_URL}/${id}/details`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // Refresh data after update
    await loadData();
    return true;
  } catch (err) {
    console.error('Error updating process details:', err);
    return false;
  }
}

/**
 * Update core process identification (name, line, responsible, etc.) via API
 */
async function updateProcessBehavior(id, data) {
  try {
    const url = `${API_URL}/${id}/comportamiento-proceso`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // Refresh data after update
    await loadData();
    return true;
  } catch (err) {
    console.error('Error updating process behavior:', err);
    return false;
  }
}

/** Get all unique values for a given field (for filter dropdowns) */
function getUniqueValues(field) {
  return [...new Set(processesData.map(p => p[field]).filter(Boolean))].sort();
}

/** Filter dataset with the current filter state object */
function filterProcesses(filters = {}) {
  return processesData.filter(p => {
    // Global text search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = [p.nombre, p.lineaNegocio, p.frecuencia, p.viabilidad, p.prioridad]
        .join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    // nameModel filter
    if (filters.nameModel && filters.nameModel !== 'all') {
      if (p.nameModel !== filters.nameModel) return false;
    }
    // Frecuencia filter
    if (filters.frecuencia && filters.frecuencia !== 'all') {
      if (p.frecuencia !== filters.frecuencia) return false;
    }
    // Viabilidad (automatización) filter
    if (filters.viabilidad && filters.viabilidad !== 'all') {
      if (p.viabilidad !== filters.viabilidad) return false;
    }
    // HH Mes range
    if (filters.hhMin !== undefined && filters.hhMin !== '') {
      if (p.hhMes < Number(filters.hhMin)) return false;
    }
    if (filters.hhMax !== undefined && filters.hhMax !== '') {
      if (p.hhMes > Number(filters.hhMax)) return false;
    }
    return true;
  });
}

/** Compute aggregate KPIs from a list of processes */
function computeKPIs(processes) {
  const total = processes.length;
  const totalHH = processes.reduce((s, p) => s + p.hhTotal, 0);
  const avgPonderacion = total
    ? processes.reduce((s, p) => s + p.ponderacion, 0) / total
    : 0;
  return { total, totalHH, avgPonderacion };
}

/**
 * reevaluateWithLLM - POST to trigger AI re-evaluation
 */
async function reevaluateWithLLM(id, data) {
  try {
    const url = `${API_URL}/${id}/reevaluate-with-llm?llm_provider=azure_openai`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // Refresh data after AI re-evaluation
    await loadData();
    return true;
  } catch (err) {
    console.error('Error re-evaluating process:', err);
    return false;
  }
}

/**
 * reevaluateBatch - Global re-evaluation call
 */
async function reevaluateBatch(data) {
  try {
    const url = `${API_URL}/reevaluate-with-llm`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // Refresh data after global re-evaluation
    await loadData();
    return true;
  } catch (err) {
    console.error('Error in reevaluateBatch:', err);
    return false;
  }
}
