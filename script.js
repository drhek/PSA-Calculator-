document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const totalPsaInput = document.getElementById('total-psa');
    const freePsaInput = document.getElementById('free-psa');
    const volumeInput = document.getElementById('prostate-volume');
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');

    const ratioValueSpan = document.getElementById('psa-ratio-value');
    const ratioInterpretationSpan = document.getElementById('psa-ratio-interpretation');
    const ratioResultItem = document.getElementById('ratio-result-item');

    const densityValueSpan = document.getElementById('psa-density-value');
    const densityInterpretationSpan = document.getElementById('psa-density-interpretation');
    const densityResultItem = document.getElementById('density-result-item');

    const errorMessageDiv = document.getElementById('error-message');
    const resultsSection = document.getElementById('results-section'); // To show/hide results

    // --- Event Listeners ---
    calculateBtn.addEventListener('click', handleCalculation);
    clearBtn.addEventListener('click', clearForm);

    // --- Functions ---

    function handleCalculation() {
        clearResultsAndErrors(); // Clear previous results first

        // Get and validate inputs
        const totalPSA = parseFloat(totalPsaInput.value);
        const freePSA = parseFloat(freePsaInput.value);
        const volume = parseFloat(volumeInput.value);

        let hasError = false;
        let errorMsg = '';

        // Validate Total PSA (required for both calculations)
        if (isNaN(totalPSA) || totalPSA <= 0) {
             if (!isNaN(freePSA) || !isNaN(volume)) { // Only show error if other fields were filled
                 errorMsg = 'Valid Total PSA value (> 0) is required.';
                 showError(errorMsg);
                 hasError = true;
             } else {
                 // If all are empty, don't show error, just do nothing
                 return;
             }
        }

        // --- Calculate PSA Ratio ---
        let ratioCalculated = false;
        if (!isNaN(freePSA) && freePSA > 0 && !hasError) {
             if (freePSA > totalPSA) {
                showError('Free PSA cannot be greater than Total PSA.');
                hasError = true;
             } else {
                const ratio = (freePSA / totalPSA) * 100;
                ratioValueSpan.textContent = ratio.toFixed(1); // One decimal place for ratio
                ratioInterpretationSpan.textContent = interpretRatio(ratio);
                ratioResultItem.style.display = 'block';
                ratioCalculated = true;
            }
        } else {
            ratioResultItem.style.display = 'none'; // Hide if not calculated
        }

        // --- Calculate PSA Density ---
        let densityCalculated = false;
        if (!isNaN(volume) && volume > 0 && !hasError) {
            const density = totalPSA / volume;
            densityValueSpan.textContent = density.toFixed(3); // Three decimal places for density
            densityInterpretationSpan.textContent = interpretDensity(density);
            densityResultItem.style.display = 'block';
            densityCalculated = true;
        } else {
             densityResultItem.style.display = 'none'; // Hide if not calculated
        }

        // Show results section if at least one calculation was successful and no critical error occurred
         if (!hasError && (ratioCalculated || densityCalculated)) {
            resultsSection.style.display = 'block';
         } else if (!hasError && !ratioCalculated && !densityCalculated && !isNaN(totalPSA)) {
             // If only Total PSA was entered, show a message maybe? Or just hide results.
             showError("Enter Free PSA for Ratio or Volume for Density calculation.");
             resultsSection.style.display = 'none';
         } else if (!hasError) {
             // If only total PSA is missing, error is handled above.
             resultsSection.style.display = 'none';
         }
    }

    function interpretRatio(ratio) {
        // --- PSA Ratio Interpretation (General Guidelines) ---
        // Thresholds can vary slightly in literature (e.g., <10%, <15%, <20%, >25%)
        // Using common cutoffs for educational illustration.
        if (ratio > 25) {
            return "Higher ratio (> 25%), generally associated with a lower probability of prostate cancer (more likely BPH). Requires clinical correlation.";
        } else if (ratio <= 15) { // Often <10% or <15% are cited as high risk
            return "Lower ratio (≤ 15%), suggests a higher probability of prostate cancer. Biopsy may be considered based on full clinical picture.";
        } else { // Intermediate range (e.g., 15.1% to 25%)
            return "Intermediate ratio (15.1% - 25%). Risk assessment requires integration with other clinical factors (PSAD, DRE, imaging, history, etc.).";
        }
    }

    function interpretDensity(density) {
        // --- PSA Density Interpretation (General Guidelines) ---
        // Common threshold is 0.15 ng/mL/cc
        if (density > 0.15) {
            return "Higher PSAD (> 0.15), suggests a greater likelihood of clinically significant prostate cancer relative to prostate size. Increases suspicion.";
        } else if (density <= 0.10){ // Adding a lower bound for clarity
             return "Lower PSAD (≤ 0.10), generally associated with lower likelihood of significant cancer, more likely due to BPH, especially in larger glands.";
        }
         else { // 0.10 to 0.15
            return "Borderline PSAD (0.11 - 0.15). Clinical significance is less clear; consider in context with other risk factors and PSA kinetics.";
        }
    }

     function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
        resultsSection.style.display = 'none'; // Hide results when error occurs
    }

    function clearResultsAndErrors() {
        ratioValueSpan.textContent = '-';
        ratioInterpretationSpan.textContent = '-';
        densityValueSpan.textContent = '-';
        densityInterpretationSpan.textContent = '-';
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
         // Keep results section visible initially until calculation determines otherwise
        resultsSection.style.display = 'block';
        ratioResultItem.style.display = 'block'; // Show blocks initially
        densityResultItem.style.display = 'block';
    }

    function clearForm() {
        totalPsaInput.value = '';
        freePsaInput.value = '';
        volumeInput.value = '';
        clearResultsAndErrors();
        resultsSection.style.display = 'block'; // Ensure results section is visible after clear
        ratioResultItem.style.display = 'block'; // Show blocks initially
        densityResultItem.style.display = 'block';
    }

    // Initial state
    clearForm(); // Clear on load

});