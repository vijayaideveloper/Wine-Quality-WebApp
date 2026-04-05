// ── SLIDER <-> NUMBER INPUT SYNC ─────────────────────────────────────────────
document.querySelectorAll('.slider').forEach(slider => {
  const numId  = slider.dataset.num;
  const numInput = document.getElementById(numId);

  // Update number input when slider moves
  slider.addEventListener('input', () => {
    numInput.value = slider.value;
    updateSliderFill(slider);
  });

  // Update slider when number input changes
  numInput.addEventListener('input', () => {
    const val = parseFloat(numInput.value);
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    if (!isNaN(val) && val >= min && val <= max) {
      slider.value = val;
      updateSliderFill(slider);
    }
  });

  // Initialize fill on load
  updateSliderFill(slider);
});

// Fills slider track left of thumb with wine color using a CSS gradient trick
function updateSliderFill(slider) {
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  const val = parseFloat(slider.value);
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(to right,
    #c0304d 0%, #c0304d ${pct}%,
    #271519 ${pct}%, #271519 100%)`;
}

// ── FORM SUBMISSION ───────────────────────────────────────────────────────────
const form        = document.getElementById('wineForm');
const predictBtn  = document.getElementById('predictBtn');
const idleCard    = document.getElementById('idleCard');
const resultCard  = document.getElementById('resultCard');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Collect all field values
  const data = {};
  form.querySelectorAll('input[name]').forEach(input => {
    data[input.name] = parseFloat(input.value);
  });

  // Loading state
  predictBtn.classList.add('loading');
  predictBtn.querySelector('.btn-label').textContent = 'Analysing...';

  try {
    const response = await fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Server error');
    const result = await response.json();
    if (result.error)  throw new Error(result.error);

    displayResult(result);

  } catch (err) {
    alert('Prediction failed: ' + err.message);
  } finally {
    predictBtn.classList.remove('loading');
    predictBtn.querySelector('.btn-label').textContent = 'Analyse Wine';
  }
});

// ── DISPLAY RESULT ────────────────────────────────────────────────────────────
function displayResult(r) {
  // Show result card, hide idle
  idleCard.classList.add('hidden');
  resultCard.classList.remove('hidden');

  const isGood = r.prediction === 1;

  // Badge
  const badge = document.getElementById('resultBadge');
  badge.className = 'result-badge ' + (isGood ? 'good-quality' : 'bad-quality');
  document.getElementById('badgeIcon').textContent  = isGood ? '✓' : '✗';
  document.getElementById('badgeLabel').textContent = r.label;

  // Confidence bar
  const conf = r.confidence;
  document.getElementById('confBar').style.width = conf + '%';
  document.getElementById('confVal').textContent  = conf.toFixed(1) + '% confidence';

  // Probabilities
  document.getElementById('probBad').textContent  = r.prob_bad.toFixed(1) + '%';
  document.getElementById('probGood').textContent = r.prob_good.toFixed(1) + '%';

  // Top features
  const tfList = document.getElementById('tfList');
  tfList.innerHTML = '';
  const maxImp = r.top_features[0].importance;
  r.top_features.forEach(feat => {
    const barWidth = Math.round((feat.importance / maxImp) * 100);
    tfList.innerHTML += `
      <div class="tf-item">
        <span class="tf-name">${feat.name}</span>
        <div class="tf-imp-bar-wrap">
          <div class="tf-imp-bar" style="width:${barWidth}%"></div>
        </div>
        <span class="tf-pct">${feat.importance.toFixed(1)}%</span>
      </div>
    `;
  });

  // Smooth scroll to result on mobile
  if (window.innerWidth < 980) {
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── RESET BUTTON ──────────────────────────────────────────────────────────────
document.getElementById('resetBtn').addEventListener('click', async () => {
  try {
    const res  = await fetch('/reset');
    const data = await res.json();

    Object.entries(data).forEach(([feat, val]) => {
      // Find the matching input by name
      const numInput = form.querySelector(`input[name="${feat}"]`);
      const slider   = form.querySelector(`input[type="range"][data-num="${numInput.id}"]`);
      if (numInput && slider) {
        numInput.value = val;
        slider.value   = val;
        updateSliderFill(slider);
      }
    });

    // Reset results view
    idleCard.classList.remove('hidden');
    resultCard.classList.add('hidden');

  } catch (err) {
    console.error('Reset failed:', err);
  }
});
