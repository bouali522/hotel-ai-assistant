import React from 'react';
import type { Message } from '../../pages/ChatPage';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`d-flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 ${
        isUser 
          ? 'bg-primary text-white' 
          : 'bg-gradient text-white'
      }`} style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isUser ? '#2c5aa0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={`flex-grow-1 ${isUser ? 'text-end' : ''}`} style={{maxWidth: '70%'}}>
        <div className={`d-inline-block p-3 position-relative ${
          isUser ? 'message-bubble-user' : 'message-bubble-assistant'
        }`}>
          <div className="text-break" style={{whiteSpace: 'pre-wrap'}}>
            {message.content}
          </div>
          
          {!isUser && (
            <button
              onClick={handleCopy}
              className="btn btn-sm position-absolute"
              style={{
                top: '8px',
                right: '8px',
                padding: '2px',
                opacity: 0,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
              title="Copy message"
            >
              {copied ? (
                <Check size={12} className="text-success" />
              ) : (
                <Copy size={12} className="text-muted" />
              )}
            </button>
          )}
        </div>
        
        <div className={`text-muted small mt-1 px-1 ${
          isUser ? 'text-end' : 'text-start'
        }`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};