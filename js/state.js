/**
 * state.js - Selection state (company/excel-upload) persisted in localStorage.
 * Must load BEFORE data.js (data.js reads selection to build query strings).
 */

const STATE_KEYS = {
  company: 'pi-company-id',
  excelUpload: 'pi-excel-upload-id',
};

function getSelectedCompanyId() {
  const v = localStorage.getItem(STATE_KEYS.company);
  return v ? Number(v) : null;
}

function setSelectedCompanyId(id) {
  if (id === null || id === undefined) {
    localStorage.removeItem(STATE_KEYS.company);
  } else {
    localStorage.setItem(STATE_KEYS.company, String(id));
  }
}

function getSelectedExcelUploadId() {
  const v = localStorage.getItem(STATE_KEYS.excelUpload);
  return v ? Number(v) : null;
}

function setSelectedExcelUploadId(id) {
  if (id === null || id === undefined) {
    localStorage.removeItem(STATE_KEYS.excelUpload);
  } else {
    localStorage.setItem(STATE_KEYS.excelUpload, String(id));
  }
}

/** Clear excel selection (used when switching companies, to avoid a stale cross-company id) */
function clearSelectedExcelUploadId() {
  localStorage.removeItem(STATE_KEYS.excelUpload);
}

// In-memory cache of the currently-loaded companies/uploads lists, used by the selector UI.
let companiesCache = [];
let excelUploadsCache = [];
