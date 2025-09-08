import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Calendar, Users } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = "Type your message..."
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea but limit max height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 100)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const quickActions = [
    { icon: MapPin, text: "Find hotels", action: () => setMessage("Find hotels near me") },
    { icon: Calendar, text: "Check dates", action: () => setMessage("Check availability for this weekend") },
    { icon: Users, text: "Group booking", action: () => setMessage("I need rooms for 4 people") }
  ];

  return (
    <div className="chat-input-wrapper">
      {/* Quick Action Buttons */}
      <div className="quick-actions mb-2">
        {quickActions.map((action, index) => (
          <button
            key={index}
            type="button"
            className="btn btn-outline-primary btn-sm me-2"
            onClick={action.action}
            disabled={disabled}
          >
            <action.icon size={14} className="me-1" />
            {action.text}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-group">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="form-control chat-textarea"
          />
          <button 
            type="submit" 
            className="btn btn-primary send-button" 
            disabled={!message.trim() || disabled}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};