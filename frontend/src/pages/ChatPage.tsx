import React, { useState, useEffect, useRef } from 'react';
import { ChatInput } from '../components/chat/ChatInput';
import { MessageList } from '../components/chat/MessageList';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const responses = [
        "I'd be happy to help you find the perfect hotel! What dates are you looking to stay?",
        "Great choice! Let me search for available rooms in that area. What's your preferred budget range?",
        "I found several excellent hotels that match your criteria. Would you like to see rooms with ocean view or city view?",
        "Perfect! I can book that room for you. The rate includes complimentary breakfast and WiFi. Shall I proceed with the reservation?",
        "Your booking is confirmed! You'll receive a confirmation email shortly. Is there anything else I can help you with for your trip?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="d-flex align-items-center">
          <div className="avatar-hotel me-3">
            🏨
          </div>
          <div>
            <h5 className="mb-0 text-white">Hotel Booking Assistant</h5>
            <small className="text-light opacity-75">Online • Ready to help with your booking</small>
          </div>
        </div>
      </div>
      <div className="messages-container">
        <MessageList 
          messages={messages} 
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />
      </div>
      <div className="input-container">
        <ChatInput 
          onSend={handleSend} 
          disabled={isLoading}
          placeholder="Ask about hotels, rooms, bookings..."
        />
      </div>
    </div>
  );
};