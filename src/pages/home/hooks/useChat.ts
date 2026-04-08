// src/hooks/useChat.ts
import chatAPI from '@/api/core/chat';
import { useState, useCallback, useRef } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message immediately
    const userMessage: ChatMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatAPI.sendMessage(content, sessionIdRef.current || undefined);
      // Save session ID if new
      if (response.session_id && !sessionIdRef.current) {
        sessionIdRef.current = response.session_id;
      }
      const assistantMessage: ChatMessage = { role: 'assistant', content: response.reply };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      // Remove the last user message on error? Optionally keep it.
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    sessionIdRef.current = null;
    setError(null);
  }, []);

  return { messages, sendMessage, isLoading, error, clearChat };
};