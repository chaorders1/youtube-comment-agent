/**
 * Data Processing Module
 * Handles data processing and transformation
 */

export class DataProcessor {
  constructor() {
    this.processors = new Map();
    this.registerProcessor('getCurrentUrl', async () => {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      return tabs[0] ? `Current URL: ${tabs[0].url}` : 'No active tab found';
    });
  }

  /**
   * Register a new data processor
   * @param {string} type - Processor type
   * @param {Function} processor - Processing function
   */
  registerProcessor(type, processor) {
    this.processors.set(type, processor);
  }

  /**
   * Process data using registered processor
   * @param {string} type - Processor type
   * @param {any} data - Data to process
   * @returns {Promise<string>} Processed data
   */
  async processData(type) {
    const processor = this.processors.get(type);
    if (!processor) {
      throw new Error(`No processor registered for type: ${type}`);
    }
    return await processor();
  }
} 