// Carga la URL del archivo .env
window.API_URL = 'http://localhost:3001/automation-analysis/analysis-results';

async function loadEnv() {
  try {
    const response = await fetch('./.env');
    const content = await response.text();
    const lines = content.split('\n');
    for (let line of lines) {
      if (line.startsWith('API_URL=')) {
        window.API_URL = line.split('=')[1].trim();
        break;
      }
    }
  } catch (e) {
    // Si falla, usa el valor por defecto
  }
}

loadEnv();
