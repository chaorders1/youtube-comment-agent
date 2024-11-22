document.addEventListener('DOMContentLoaded', function() {
    const tabItems = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const resultContainer = document.getElementById('result-container');

    // Tab switching function
    function switchTab(tabId) {
        // Remove active class from all tabs and contents
        tabItems.forEach(item => item.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and content
        const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(`${tabId}-content`);
        
        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active');
            selectedContent.classList.add('active');
            
            // Save the last active tab
            chrome.storage.sync.set({ lastActiveTab: tabId });
        }
    }

    // Action execution function
    async function executeFeature(feature, action) {
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'RUN_FEATURE',
                feature: feature,
                action: action
            });

            displayResult(response.message, 'success');
        } catch (error) {
            displayResult(error.message, 'error');
        }
    }

    // Display result function
    function displayResult(message, type = 'success') {
        resultContainer.innerHTML = `
            <div class="result-${type}">
                ${message}
                <div class="result-timestamp">
                    ${new Date().toLocaleTimeString()}
                </div>
            </div>
        `;
    }

    // Add click listeners to tabs
    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Add click listeners to action buttons
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const feature = button.getAttribute('data-feature');
            const action = button.getAttribute('data-action');
            
            // Show loading state
            button.disabled = true;
            button.innerHTML = 'Processing...';
            
            await executeFeature(feature, action);
            
            // Reset button state
            button.disabled = false;
            button.innerHTML = button.innerHTML.replace('Processing...', 
                action.replace(/([A-Z])/g, ' $1').trim());
        });
    });

    // Restore last active tab
    chrome.storage.sync.get(['lastActiveTab'], function(result) {
        if (result.lastActiveTab) {
            switchTab(result.lastActiveTab);
        }
    });

    // Optional: Add keyboard shortcuts for tab switching
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key >= '1' && e.key <= '5') {
            const index = parseInt(e.key) - 1;
            const tab = tabItems[index];
            if (tab) {
                const tabId = tab.getAttribute('data-tab');
                switchTab(tabId);
            }
        }
    });
}); 