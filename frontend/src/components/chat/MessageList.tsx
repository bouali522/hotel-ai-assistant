import React from 'react';
import type { Message } from '../../pages/ChatPage';
import { MessageBubble } from './MessageBubble';
import { LoadingMessage } from './LoadingMessage';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement> | null;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  messagesEndRef
}) => {
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="empty-chat-state">
        <div className="welcome-card">
          <div className="hotel-icon">🏨</div>
          <h4 className="text-primary mb-3">Welcome to HotelBot!</h4>
          <p className="text-muted mb-4">
            I'm here to help you find and book the perfect hotel for your stay.
          </p>
          <div className="suggestions">
            <div className="text-muted mb-2">
              <small>Try asking:</small>
            </div>
            <div className="suggestion-list">
              <div className="suggestion-item">🏖️ "Find hotels near the beach"</div>
              <div className="suggestion-item">💼 "Business hotels downtown"</div>
              <div className="suggestion-item">💰 "Budget-friendly options"</div>
              <div className="suggestion-item">⭐ "Luxury hotels with spa"</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-scroll">
      <div className="messages-content">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && <LoadingMessage />}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};