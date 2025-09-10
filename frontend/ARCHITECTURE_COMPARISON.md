# Services vs Hooks Pattern Comparison

## Current Implementation (Services Pattern)

### `/services/chatService.ts`
```typescript
export class ChatService {
  private baseUrl: string;
  
  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    // API call logic
  }

  async healthCheck(): Promise<boolean> {
    // Health check logic
  }
}

export const chatService = new ChatService();
```

### Usage in Component (`ChatPage.tsx`)
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [isLoading, setIsLoading] = useState(false);

const handleSend = async (message: string) => {
  setIsLoading(true);
  try {
    const response = await chatService.sendMessage(message, conversationHistory);
    setMessages(prev => [...prev, assistantMessage]);
  } catch (error) {
    // Error handling
  } finally {
    setIsLoading(false);
  }
};
```

## Alternative Implementation (Custom Hook Pattern)

### `/hooks/useChat.ts`
```typescript
export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversation_history: conversationHistory
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
};
```

### Usage in Component (Hook Pattern)
```typescript
const ChatPage: React.FC = () => {
  const { messages, isLoading, error, sendMessage } = useChat();

  const handleSend = (message: string) => {
    sendMessage(message); // Much simpler!
  };

  return (
    <div className="chat-container">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSend} disabled={isLoading} />
      {error && <div className="error">{error}</div>}
    </div>
  );
};
```

## Key Differences

### Services Pattern (Current)
**Pros:**
- ✅ Clear separation of concerns
- ✅ Reusable across different components
- ✅ Easy to test in isolation
- ✅ Can be used outside React components
- ✅ Good for complex business logic

**Cons:**
- ❌ Component handles all state management
- ❌ More boilerplate in components
- ❌ State logic scattered across components

### Custom Hook Pattern
**Pros:**
- ✅ Encapsulates both logic AND state
- ✅ Very React-idiomatic
- ✅ Cleaner component code
- ✅ Built-in state management
- ✅ Easy to share stateful logic

**Cons:**
- ❌ Tightly coupled to React
- ❌ Can't be used outside React components
- ❌ May become complex for large applications

## Recommendation for Your Project

For a chatbot application, the **Custom Hook Pattern** is more suitable because:

1. **State Co-location**: Chat state (messages, loading, errors) naturally belongs together
2. **Simpler Components**: Components become much cleaner and focused on UI
3. **Better React Integration**: Uses React's built-in patterns (useState, useCallback, useEffect)
4. **Eliminates Redundancy**: No need for separate services and hooks folders

## Migration Path

1. Create `useChat` hook combining service logic + state management
2. Update `ChatPage` to use the hook
3. Remove the `/services` folder structure and place the code in hooks
4. Keep services pattern only for pure API utilities (if needed in future)