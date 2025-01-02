// Storage handling
export class StorageManager {
  static async get(key) {
    const result = await chrome.storage.local.get(key);
    return result[key];
  }

  static async set(key, value) {
    await chrome.storage.local.set({ [key]: value });
  }
}