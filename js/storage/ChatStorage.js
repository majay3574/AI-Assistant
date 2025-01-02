import { StorageManager } from './StorageManager.js';

export class ChatStorage {
  static CHAT_KEY = 'chatHistory';

  static async load() {
    try {
      const messages = await StorageManager.get(this.CHAT_KEY);
      return messages || [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }

  static async save(messages) {
    try {
      await StorageManager.set(this.CHAT_KEY, messages);
    } catch (error) {
      console.error('Error saving chat history:', error);
      throw error;
    }
  }

  static async addMessage(message) {
    const messages = await this.load();
    messages.push(message);
    await this.save(messages);
  }

  static async clearHistory() {
    await this.save([]);
  }
}