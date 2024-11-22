import { YouTubeCommentExtractor } from '../modules/feature3/comment-extractor.js';
import { YouTubeUtils } from '../modules/feature3/youtube-utils.js';

document.addEventListener('DOMContentLoaded', function() {
    const tabItems = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const resultContainer = document.getElementById('result-container');
    const commentExtractor = new YouTubeCommentExtractor();

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

    // Enhanced display result function for comments
    function displayComments(comments) {
        const statsDiv = resultContainer.querySelector('.comments-stats');
        const commentsDiv = resultContainer.querySelector('.comments-list');
        
        // Display statistics
        statsDiv.innerHTML = `
            <div class="stats-card">
                <h4>Statistics</h4>
                <p>Total Comments: ${comments.length}</p>
            </div>
        `;

        // Display comments
        commentsDiv.innerHTML = comments.map(comment => `
            <div class="comment-card">
                <div class="comment-header">
                    <strong>${comment.author.name}</strong>
                    ${comment.author.isChannelOwner ? '<span class="owner-badge">Owner</span>' : ''}
                    <span class="comment-date">${comment.publishedAt}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
                <div class="comment-footer">
                    <span>👍 ${comment.likeCount || '0'}</span>
                    ${comment.replyCount ? `<span>💬 ${comment.replyCount}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    // Enhanced error display
    function displayError(message) {
        resultContainer.innerHTML = `
            <div class="result-error">
                <h4>Error</h4>
                <p>${message}</p>
            </div>
        `;
    }

    // Action execution function
    async function executeFeature(feature, action) {
        try {
            if (feature === 'feature3' && action === 'extractComments') {
                // Get current tab URL
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                const videoId = YouTubeUtils.extractVideoId(tab.url);
                
                if (!videoId) {
                    throw new Error('Please open a YouTube video page first');
                }

                // Show loading state
                resultContainer.innerHTML = '<div class="loading">Extracting comments...</div>';

                // Get comments limit from input
                const limitInput = document.getElementById('commentsLimit');
                const limit = limitInput.value ? parseInt(limitInput.value) : Infinity;

                // Extract comments
                const comments = await commentExtractor.getAllComments(videoId, limit);
                displayComments(comments);
            } else {
                // Handle other features
                const response = await chrome.runtime.sendMessage({
                    type: 'RUN_FEATURE',
                    feature: feature,
                    action: action
                });
                displayResult(response.message, 'success');
            }
        } catch (error) {
            displayError(error.message);
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
            const originalText = button.textContent;
            button.textContent = 'Processing...';
            
            await executeFeature(feature, action);
            
            // Reset button state
            button.disabled = false;
            button.textContent = originalText;
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

    // Make sure initial tab is set
    document.addEventListener('DOMContentLoaded', () => {
        // Restore last active tab or default to first tab
        chrome.storage.sync.get(['lastActiveTab'], function(result) {
            if (result.lastActiveTab) {
                switchTab(result.lastActiveTab);
            } else {
                // Default to first tab if no last active tab
                const firstTab = document.querySelector('.tab-item');
                if (firstTab) {
                    const tabId = firstTab.getAttribute('data-tab');
                    switchTab(tabId);
                }
            }
        });
    });
}); 