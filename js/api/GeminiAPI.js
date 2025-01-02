import { CONFIG } from '../config.js';
import { SettingsStorage } from '../storage/SettingsStorage.js';

export class GeminiAPI {
  static async getResponse(message, context = []) {
    const apiKey = await SettingsStorage.getApiKey();
    if (!apiKey) {
      throw new Error('API key not found. Please set your API key in the extension options.');
    }

    // Format conversation history for the API
    const conversationHistory = context.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Add current message
    conversationHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(`${CONFIG.API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: conversationHistory,
        generationConfig: CONFIG.MODEL_CONFIG
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from API');
    }

    return data.candidates[0].content.parts[0].text;
  }
}