// src/api/chat.ts
import { apiClient } from "@/lib/fetcher";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  session_id?: string; // optional, will be generated on backend if not provided
}

export interface ChatResponse {
  reply: string;
  session_id: string;
}

class ChatAPI {
  private basePath = "/api/v2/portfolio/chat/"; // matches the URL pattern from v2.py

  /**
   * Send a message to the AI chatbot.
   * @param message - The user's message text.
   * @param sessionId - Optional session ID for maintaining conversation context.
   * @returns The bot's reply and the session ID.
   */
  async sendMessage(message: string, sessionId?: string): Promise<ChatResponse> {
    try {
      const payload: ChatRequest = { message };
      if (sessionId) {
        payload.session_id = sessionId;
      }

      const response = await apiClient.post<ChatResponse>(this.basePath, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Failed to send message to chatbot");
    }
  }
}

const chatAPI = new ChatAPI();
export default chatAPI;