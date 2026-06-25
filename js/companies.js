/**
 * companies.js - Companies & excel-uploads API + excel upload (analyze) calls.
 */

const BASE_API_URL = 'http://localhost:3001';

/** GET /companies -> [{id, name, codigo, created_at}] */
async function fetchCompanies() {
  const res = await fetch(`${BASE_API_URL}/companies`);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching companies`);
  return res.json();
}

/** POST /companies {name, codigo?} -> created company */
async function createCompany(name, codigo) {
  const body = { name };
  if (codigo) body.codigo = codigo;
  const res = await fetch(`${BASE_API_URL}/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} creating company`);
  return res.json();
}

/** GET /companies/{company_id}/excel-uploads -> [{id, company_id, file_name, storage_path, uploaded_at}] */
async function fetchExcelUploads(companyId) {
  const res = await fetch(`${BASE_API_URL}/companies/${companyId}/excel-uploads`);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching excel-uploads`);
  return res.json();
}

/**
 * POST /automation-analysis/analyze?company_id=X (multipart) + optional query params.
 * file: File object from <input type="file">.
 * opts: { hourly_cost_usd?, infrastructure_cost?, initiative_cost?, stack_tecnologico? }
 */
async function uploadAndAnalyzeExcel(companyId, file, opts = {}) {
  const params = new URLSearchParams({ company_id: companyId });
  if (opts.hourly_cost_usd !== undefined) params.set('hourly_cost_usd', opts.hourly_cost_usd);
  if (opts.infrastructure_cost !== undefined) params.set('infrastructure_cost', opts.infrastructure_cost);
  if (opts.initiative_cost !== undefined) params.set('initiative_cost', opts.initiative_cost);
  if (opts.stack_tecnologico !== undefined) params.set('stack_tecnologico', opts.stack_tecnologico);

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_API_URL}/automation-analysis/analyze?${params.toString()}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} uploading/analyzing excel`);
  return res.json();
}

/** Returns the most recently uploaded excel from a list, or null if empty. */
function getMostRecentUpload(uploads) {
  if (!uploads || uploads.length === 0) return null;
  return [...uploads].sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))[0];
}
