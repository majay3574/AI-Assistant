import { GeminiAPI } from './api/GeminiAPI.js';
import { MemoryManager } from './memory/MemoryManager.js';

export class AIHandler {
  constructor() {
    this.memoryManager = new MemoryManager();
  }

  async processMessage(message) {
    try {
      // Get conversation history
      const history = await this.memoryManager.getMessages();
      
      // Get AI response with context
      const aiResponse = await GeminiAPI.getResponse(message, history);
      
      // Save messages
      await this.memoryManager.addMessage('user', message);
      await this.memoryManager.addMessage('model', aiResponse);

      return aiResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async clearMemory() {
    await this.memoryManager.clear();
  }

  getMemory() {
    return this.memoryManager.getMessages();
  }
}