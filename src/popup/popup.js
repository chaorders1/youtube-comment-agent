document.addEventListener('DOMContentLoaded', function() {
    const feature1Toggle = document.getElementById('feature1Toggle');
    const feature2Toggle = document.getElementById('feature2Toggle');
    const runFeature1 = document.getElementById('runFeature1');
    const runFeature2 = document.getElementById('runFeature2');
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const statusDiv = document.getElementById('status');

    // Load saved settings
    chrome.storage.sync.get(['feature1Enabled', 'feature2Enabled'], function(result) {
        feature1Toggle.checked = result.feature1Enabled || false;
        feature2Toggle.checked = result.feature2Enabled || false;
        runFeature1.disabled = !result.feature1Enabled;
        runFeature2.disabled = !result.feature2Enabled;
    });

    // Toggle run buttons
    feature1Toggle.addEventListener('change', () => {
        runFeature1.disabled = !feature1Toggle.checked;
    });

    feature2Toggle.addEventListener('change', () => {
        runFeature2.disabled = !feature2Toggle.checked;
    });

    // Run features
    runFeature1.addEventListener('click', async () => {
        const response = await chrome.runtime.sendMessage({
            type: 'RUN_FEATURE',
            feature: 'feature1'
        });
        statusDiv.textContent = response.message;
    });

    runFeature2.addEventListener('click', async () => {
        const response = await chrome.runtime.sendMessage({
            type: 'RUN_FEATURE',
            feature: 'feature2'
        });
        statusDiv.textContent = response.message;
    });

    // Save settings
    saveBtn.addEventListener('click', function() {
        const settings = {
            feature1Enabled: feature1Toggle.checked,
            feature2Enabled: feature2Toggle.checked
        };

        chrome.storage.sync.set(settings, function() {
            chrome.runtime.sendMessage({
                type: 'SETTINGS_UPDATED',
                settings: settings
            });
            statusDiv.textContent = 'Settings saved!';
        });
    });

    // Reset settings
    resetBtn.addEventListener('click', function() {
        feature1Toggle.checked = false;
        feature2Toggle.checked = false;
        runFeature1.disabled = true;
        runFeature2.disabled = true;
        
        chrome.storage.sync.set({
            feature1Enabled: false,
            feature2Enabled: false
        }, function() {
            statusDiv.textContent = 'Settings reset!';
        });
    });
});
