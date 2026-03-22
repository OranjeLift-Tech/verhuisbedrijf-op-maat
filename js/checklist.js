(function() {
  'use strict';

  var STORAGE_KEY = 'verhuischecklist-2026';

  // Get all checkboxes
  var checkboxes = document.querySelectorAll('.checklist-item__checkbox');
  var progressFill = document.getElementById('progress-fill');
  var progressText = document.getElementById('progress-text');
  var progressPercent = document.getElementById('progress-percent');
  var totalTasks = checkboxes.length;

  // Load saved state
  function loadState() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};
    try { return JSON.parse(saved); } catch(e) { return {}; }
  }

  // Save state
  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // Update progress bar
  function updateProgress() {
    var done = document.querySelectorAll('.checklist-item__checkbox:checked').length;
    var percent = totalTasks > 0 ? Math.round((done / totalTasks) * 100) : 0;

    if (progressFill) progressFill.style.width = percent + '%';
    if (progressText) progressText.textContent = done + ' van ' + totalTasks + ' taken voltooid';
    if (progressPercent) progressPercent.textContent = percent + '%';

    // Update phase counters
    var phases = document.querySelectorAll('.checklist-phase');
    phases.forEach(function(phase) {
      var phaseBoxes = phase.querySelectorAll('.checklist-item__checkbox');
      var phaseDone = phase.querySelectorAll('.checklist-item__checkbox:checked').length;
      var doneEl = phase.querySelector('.phase-done');
      var totalEl = phase.querySelector('.phase-total');
      if (doneEl) doneEl.textContent = phaseDone;
      if (totalEl) totalEl.textContent = phaseBoxes.length;
    });
  }

  // Initialize
  function init() {
    var state = loadState();

    // Restore checkboxes
    checkboxes.forEach(function(cb) {
      var task = cb.getAttribute('data-task');
      if (state[task]) cb.checked = true;

      // Listen for changes
      cb.addEventListener('change', function() {
        var currentState = loadState();
        if (this.checked) {
          currentState[this.getAttribute('data-task')] = true;
        } else {
          delete currentState[this.getAttribute('data-task')];
        }
        saveState(currentState);
        updateProgress();
      });
    });

    updateProgress();
  }

  // Reset function (global)
  window.resetChecklist = function() {
    if (confirm('Weet u zeker dat u de checklist wilt resetten? Alle vinkjes worden verwijderd.')) {
      localStorage.removeItem(STORAGE_KEY);
      checkboxes.forEach(function(cb) { cb.checked = false; });
      updateProgress();
    }
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
