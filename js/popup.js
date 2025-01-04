import { AIHandler } from './aiHandler.js';

const aiHandler = new AIHandler();
let chatContainer;

// Initialize UI elements after DOM is loaded
function initializeUI() {
  chatContainer = document.getElementById('chatContainer');
  const userInput = document.getElementById('userInput');
  const sendButton = document.getElementById('sendButton');
  const clearMemoryButton = document.getElementById('clearMemory');

  if (!chatContainer || !userInput || !sendButton || !clearMemoryButton) {
    console.error('Required UI elements not found');
    return;
  }

  setupEventListeners(userInput, sendButton, clearMemoryButton);
  loadChatHistory();
}

function createMessageElement(message, isUser) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;

  const textElement = document.createElement('pre');
  textElement.className = 'message-text';
  textElement.textContent = message;
  
  messageDiv.appendChild(textElement);
  return messageDiv;
}

function displayMessage(message, isUser) {
  if (!chatContainer) return;

  const messageElement = createMessageElement(message, isUser);

  // Check if the message is script-level (e.g., contains specific keywords or tags)
  if (isScriptLevelMessage(message)) {
    messageElement.classList.add('script-message');
  }

  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Utility to check if the message contains script-level content
function isScriptLevelMessage(message) {
  // Example check: looking for code blocks or script tags (you can adjust based on your needs)
  return message.includes('<script>') || message.includes('</script>') || message.trim().startsWith('```');
}

async function loadChatHistory() {
  try {
    const memory = aiHandler.getMemory();
    if (!chatContainer) return;
    
    chatContainer.innerHTML = '';
    memory.forEach(msg => {
      displayMessage(msg.content, msg.role === 'user');
    });
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
}

async function handleSendMessage(userInput, sendButton) {
  const message = userInput.value.trim();
  if (!message) return;

  try {
    userInput.value = '';
    userInput.disabled = true;
    sendButton.disabled = true;
    
    displayMessage(message, true);
    const response = await aiHandler.processMessage(message);
    displayMessage(response, false);
  } catch (error) {
    displayMessage('Error: ' + error.message, false);
  } finally {
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
  }
}

function setupEventListeners(userInput, sendButton, clearMemoryButton) {
  sendButton.addEventListener('click', () => handleSendMessage(userInput, sendButton));

  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(userInput, sendButton);
    }
  });

  clearMemoryButton.addEventListener('click', async () => {
    try {
      await aiHandler.clearMemory();
      if (chatContainer) {
        chatContainer.innerHTML = '';
      }
    } catch (error) {
      console.error('Error clearing memory:', error);
      displayMessage('Error clearing chat history. Please try again.', false);
    }
  });
}

document.addEventListener('DOMContentLoaded', initializeUI);
