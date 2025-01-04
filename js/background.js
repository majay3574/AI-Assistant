import fs from 'fs';
import path from 'path';

class AIHandler {
  constructor(API_KEY) {
    this.API_KEY = API_KEY;
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.runtimeMemory = [];
    this.persistentMemory = [];
    // Load persistent memory from file
    this.loadPersistentMemory();  
  }

  // Load persistent memory from a JSON file
  loadPersistentMemory() {
    const memoryFile = path.join(__dirname, 'memory.json');
    if (fs.existsSync(memoryFile)) {
      const savedMemory = fs.readFileSync(memoryFile, 'utf8');
      try {
        this.persistentMemory = JSON.parse(savedMemory);
      } catch (error) {
        console.error('Error reading or parsing the memory file', error);
        this.persistentMemory = [];
      }
    }
  }

  // Save combined memory to a JSON file
  savePersistentMemory() {
    const memoryFile = path.join(__dirname, 'memory.json');
    const combinedMemory = [...this.persistentMemory, ...this.runtimeMemory];
    fs.writeFileSync(memoryFile, JSON.stringify(combinedMemory, null, 2), 'utf8');
  }

  // Process user input and get AI response
  async processCommand(command) {
    const combinedMemory = [...this.persistentMemory, ...this.runtimeMemory];
    const prompt = `${combinedMemory.join("\n")}\nUser: ${command}`;

    try {
      const result = await this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }).generateContent(prompt);
      const aiResponse = result.response.text();

      this.runtimeMemory.push(`User: ${command}`);
      this.runtimeMemory.push(`AI: ${aiResponse}`);

      this.savePersistentMemory();
      return aiResponse;
    } catch (error) {
      console.error("Error processing the command:", error);
      throw new Error("Failed to process the command.");
    }
  }

  clearMemory() {
    this.runtimeMemory = [];
    this.savePersistentMemory();
  }
}

const aiHandler = new AIHandler('YOUR_API_KEY');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command) {
    aiHandler.processCommand(message.command).then(response => {
      sendResponse({ response });
    });
  } else if (message.clearMemory) {
    aiHandler.clearMemory();
    sendResponse({ response: 'Memory cleared' });
  }
  return true;
});
