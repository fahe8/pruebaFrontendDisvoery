/**
 * data.js - Data layer: loads and normalizes process data
 */

// Normalized dataset will be stored here after fetch
let processesData = [];

/**
 * Load data from data.json and normalize/enrich each record.
 */
async function loadData() {
  try {
    const response = await fetch('./data.json');
    const raw = await response.json();

    processesData = raw.map((item, index) => {
      const cp = item.comportamiento_proceso || {};
      return {
        id: index + 1,
        // Core identifiers
        nombre: cp['Proceso'] || `Proceso ${index + 1}`,
        lineaNegocio: cp['Línea de negocio'] || 'Sin clasificar',
        nameModel: cp['Línea de negocio'] || 'Sin clasificar',  // alias for filter
        responsable: cp['Responsable'] || 'N/A',
        correo: cp['Correo'] || 'N/A',
        descripcion: cp['Descripcion'] || '',

        // Operational metrics
        frecuencia: cp['FRECUENCIA'] || cp['Frecuencia'] || 'N/A',
        personas: cp['PERSONAS'] || 0,
        transacciones: cp['TRANSACCIONES PO'] || 0,
        tmo: cp['TMO MINUTOS'] || 0,
        tiempoRaw: cp['tiempo_raw'] || '',
        transaccionesRaw: cp['transacciones_raw'] || '',
        hhMes: cp['POTENCIAL BENEFICIO MES HH'] || 0,
        hhTotal: cp['POTENCIAL BENEFICIO MES HH'] || 0, // Fallback for KPI calculations
        tamano: cp['Tamaño'] || 'N/A',

        // Alerts
        hasAlert: cp['FLAG ALERTA'] === true,
        alertMessage: cp['AVISO ALERTA'] || '',

        // Automation assessment
        ranking: item.ranking_factibilidad || 0,
        ponderacion: item.ponderacion_factibilidad || 0,
        viabilidad: item.viabilidad || 'N/A',
        complejidad: item.complejidad_implementacion || 'N/A',
        prioridad: item.prioridad || 'N/A',
        resumenEjecutivo: item.resumen_ejecutivo || '',
        soluciones: item.soluciones_recomendadas || [],

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
