import { DataProcessor as Feature1Processor } from '../modules/feature1/dataProcessor.js';
import { DataProcessor as Feature2Processor } from '../modules/feature2/dataProcessor.js';

const feature1Processor = new Feature1Processor();
const feature2Processor = new Feature2Processor();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'RUN_FEATURE') {
    (async () => {
      try {
        let result;
        
        // Handle Feature 1 actions
        if (request.feature === 'feature1') {
          switch (request.action) {
            case 'getCurrentUrl':
              result = await feature1Processor.processData('getCurrentUrl');
              break;
            case 'processData':
              result = await feature1Processor.processData('processData');
              break;
            case 'storeData':
              result = await feature1Processor.processData('storeData');
              break;
            default:
              throw new Error(`Unknown action for feature1: ${request.action}`);
          }
        }
        // Handle Feature 2 actions
        else if (request.feature === 'feature2') {
          switch (request.action) {
            case 'exportTxt':
              result = await feature2Processor.processData('exportTxt');
              break;
            case 'processExport':
              result = await feature2Processor.processData('processExport');
              break;
            default:
              throw new Error(`Unknown action for feature2: ${request.action}`);
          }
        }
        else {
          throw new Error(`Unknown feature: ${request.feature}`);
        }

        sendResponse({ 
          message: result,
          status: 'success'
        });
      } catch (error) {
        sendResponse({ 
          message: error.message,
          status: 'error'
        });
      }
    })();
    return true; // Will respond asynchronously
  }
  return false;
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Open side panel
    await chrome.sidePanel.open({ windowId: tab.windowId });
    
    // Set panel options
    await chrome.sidePanel.setOptions({
      enabled: true,
      path: 'src/panel/panel.html'
    });
  } catch (error) {
    console.error('Failed to open side panel:', error);
  }
});

