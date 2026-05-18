/**
 * reevaluate.js - Logic for AI re-evaluation modal (global or specific)
 */

let currentReevaluateId = null;

function initReevaluateModal() {
  const modal = document.getElementById('reevaluate-modal');
  const closeBtn = document.getElementById('btn-close-reevaluate');
  const cancelBtn = document.getElementById('btn-cancel-reevaluate');
  const confirmBtn = document.getElementById('btn-confirm-reevaluate');
  const spinner = document.getElementById('reev-spinner');

  if (!modal) return;

  const toggleModal = (show) => {
    const panel = modal.querySelector('.modal-panel');
    if (show) {
      modal.classList.remove('hidden');
      setTimeout(() => {
        panel.classList.remove('opacity-0', 'translate-y-4', 'scale-95');
      }, 10);
    } else {
      panel.classList.add('opacity-0', 'translate-y-4', 'scale-95');
      setTimeout(() => {
        modal.classList.add('hidden');
        currentReevaluateId = null;
      }, 250);
    }
  };

  window.openReevaluateModal = (id = null) => {
    currentReevaluateId = id;
    toggleModal(true);
  };

  closeBtn.addEventListener('click', () => toggleModal(false));
  cancelBtn.addEventListener('click', () => toggleModal(false));

  confirmBtn.addEventListener('click', async () => {
    const hourly_cost_usd = parseFloat(document.getElementById('reev-hourly-cost').value) || 0;
    const infrastructure_cost = parseFloat(document.getElementById('reev-infra-cost').value) || 0;
    const initiative_cost = parseFloat(document.getElementById('reev-init-cost').value) || 0;
    const stack_tecnologico = document.getElementById('reev-stack').value.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      hourly_cost_usd,
      infrastructure_cost,
      initiative_cost,
      stack_tecnologico
    };

    // Show loading state
    confirmBtn.disabled = true;
    spinner.classList.remove('hidden');

    try {
      let success = false;
      if (currentReevaluateId) {
        // Specific process re-evaluation
        success = await reevaluateWithLLM(currentReevaluateId, payload);
      } else {
        // Global re-evaluation
        success = await reevaluateBatch(payload);
      }
      
      if (success) {
        toggleModal(false);
        // Refresh the whole app data
        await init(); 
      } else {
        alert('Error al iniciar la reevaluación. Por favor, intente de nuevo.');
      }
    } catch (err) {
      console.error('Reevaluation failed:', err);
      alert('Error crítico durante la reevaluación.');
    } finally {
      confirmBtn.disabled = false;
      spinner.classList.add('hidden');
    }
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) toggleModal(false);
  });
}
