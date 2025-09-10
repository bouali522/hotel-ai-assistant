import React from 'react';
import { ChatInput } from '../components/chat/ChatInput';
import { MessageList } from '../components/chat/MessageList';
import { useChat } from '../hooks/useChat';


export const ChatPage: React.FC = () => {
  const { messages, isLoading, messagesEndRef, sendMessage } = useChat();

  const handleSend = (message: string) => {
    sendMessage(message);
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
