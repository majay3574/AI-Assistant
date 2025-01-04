  import { ChatStorage } from '../storage/ChatStorage.js';

  export class MemoryManager {
    constructor() {
      this.messages = [];
      this.loadMemory();
    }

    async loadMemory() {
      this.messages = await ChatStorage.load();
    }

    async addMessage(role, content) {
      if (!['user', 'model'].includes(role)) {
        throw new Error('Please use a valid role: user, model');
      }

      const message = {
        role,
        content,
        timestamp: new Date().toISOString()
      };
      
      this.messages.push(message);
      await ChatStorage.addMessage(message);
    }

    async clear() {
      this.messages = [];
      await ChatStorage.clearHistory();
    }

    async getMessages() {
      // Ensure we have the latest messages
      await this.loadMemory();
      return this.messages;
    }
  }