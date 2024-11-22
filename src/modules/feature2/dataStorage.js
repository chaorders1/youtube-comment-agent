/**
 * Data Storage Module
 * Handles data persistence and retrieval
 */

export class DataStorage {
  constructor(namespace = 'default') {
    this.namespace = namespace;
  }

  /**
   * Save data to storage
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   * @returns {Promise} Promise that resolves when data is saved
   */
  async saveData(key, data) {
    const storageKey = `${this.namespace}_${key}`;
    try {
      await chrome.storage.sync.set({ [storageKey]: data });
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  /**
   * Retrieve data from storage
   * @param {string} key - Storage key
   * @returns {Promise<any>} Promise that resolves with stored data
   */
  async getData(key) {
    const storageKey = `${this.namespace}_${key}`;
    try {
      const result = await chrome.storage.sync.get(storageKey);
      return result[storageKey];
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }
} 