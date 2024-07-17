import { Anthropic } from '@anthropic-ai/sdk';
import { Message, Tool, ToolResult } from './types';

class ClaudeAssistant {
    private anthropic: Anthropic;
    private conversationHistory: Message[] = [];
    private chatContainer: HTMLElement;
    private userInput: HTMLTextAreaElement;
    private sendButton: HTMLButtonElement;

    constructor() {
        this.anthropic = new Anthropic({ apiKey: 'your-api-key-here' });
        this.chatContainer = document.getElementById('chat-container') as HTMLElement;
        this.userInput = document.getElementById('user-input') as HTMLTextAreaElement;
        this.sendButton = document.getElementById('send-button') as HTMLButtonElement;

        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    private async sendMessage() {
        const userMessage = this.userInput.value.trim();
        if (!userMessage) return;

        this.addMessageToChat('user', userMessage);
        this.userInput.value = '';

        try {
            const response = await this.chatWithClaude(userMessage);
            this.addMessageToChat('assistant', response);
        } catch (error) {
            console.error('Error communicating with Claude:', error);
            this.addMessageToChat('assistant', "I'm sorry, there was an error communicating with the AI. Please try again.");
        }
    }

    private async chatWithClaude(userInput: string): Promise<string> {
        const messages: Message[] = [
            ...this.conversationHistory,
            { role: 'user', content: userInput }
        ];

        const response = await this.anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1000,
            messages: messages,
            system: "You are Claude, an AI assistant specialized in software development.",
            temperature: 0.7,
        });

        const assistantResponse = response.content[0].text;
        this.conversationHistory.push({ role: 'user', content: userInput });
        this.conversationHistory.push({ role: 'assistant', content: assistantResponse });

        return assistantResponse;
    }

    private addMessageToChat(role: 'user' | 'assistant', content: string) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', role);
        messageElement.textContent = content;
        this.chatContainer.appendChild(messageElement);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
}

// Initialize the assistant when the popup is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ClaudeAssistant();
});
