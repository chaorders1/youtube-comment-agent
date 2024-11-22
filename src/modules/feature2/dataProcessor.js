/**
 * Data Processing Module
 * Handles data processing and transformation
 */

export class DataProcessor {
  constructor() {
    this.processors = new Map();
    this.registerProcessor('exportTxt', async () => {
      const content = 'This is an export test';
      const blob = new Blob([content], { type: 'text/plain' });
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            await chrome.downloads.download({
              url: reader.result,
              filename: 'export_test.txt',
              saveAs: false
            });
            resolve('File exported successfully!');
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
    });
  }

  registerProcessor(type, processor) {
    this.processors.set(type, processor);
  }

  async processData(type) {
    const processor = this.processors.get(type);
    if (!processor) throw new Error(`No processor registered for type: ${type}`);
    return await processor();
  }
} 