
import { StorageManager } from './StorageManager.js';

export class SettingsStorage {
  static API_KEY = 'apiKey';

  static async getApiKey() {
    return StorageManager.get(this.API_KEY);
  }

  static async saveApiKey(apiKey) {
    return StorageManager.set(this.API_KEY, apiKey);
  }
}
