import { useState, useCallback, useRef, useEffect } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatRequest {
  message: string;
  conversation_history: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  status: string;
}

export const useChat = (baseUrl: string = 'http://localhost:8000') => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Convert current messages to the format expected by the chat service
      const conversationHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const request: ChatRequest = {
        message,
        conversation_history: conversationHistory
      };

      const response = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          `HTTP error! status: ${response.status}`
        );
      }

      const data: ChatResponse = await response.json();
      
      if (data.status !== 'success') {
        throw new Error('Chat service returned an error status');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      
      let errorContent = 'Sorry, I encountered an error. Please try again.';
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('connect')) {
          errorContent = 'Unable to connect to the chat service. Please make sure the backend server is running on port 8000.';
        } else if (error.message.includes('HTTP error')) {
          errorContent = 'The chat service is experiencing issues. Please try again in a moment.';
        } else {
          errorContent = `Error: ${error.message}`;
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      setError(errorContent);
    } finally {
      setIsLoading(false);
    }
  }, [messages, baseUrl]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const healthCheck = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }, [baseUrl]);

  const getServiceInfo = useCallback(async (): Promise<any> => {
    try {
      const response = await fetch(`${baseUrl}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting service info:', error);
      throw error;
    }
  }, [baseUrl]);

  return {
    messages,
    isLoading,
    error,
    messagesEndRef,
    sendMessage,
    clearMessages,
    healthCheck,
    getServiceInfo
  };
};

export default useChat;