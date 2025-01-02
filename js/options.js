import { SettingsStorage } from './storage/SettingsStorage.js';

document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('saveApiKey');
  const status = document.getElementById('status');

  // Load saved API key
  const savedApiKey = await SettingsStorage.getApiKey();
  if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
  }

  saveButton.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      status.textContent = 'Please enter an API key';
      status.className = 'status error';
      return;
    }

    try {
      await SettingsStorage.saveApiKey(apiKey);
      status.textContent = 'API key saved successfully!';
      status.className = 'status success';
      
      setTimeout(() => {
        status.textContent = '';
      }, 3000);
    } catch (error) {
      status.textContent = 'Error saving API key';
      status.className = 'status error';
    }
  });
});