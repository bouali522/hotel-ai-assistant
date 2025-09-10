# React Fundamentals Guide: Components, Hooks & Backend Integration

## Table of Contents
1. [React Core Concepts](#react-core-concepts)
2. [Props - Passing Data Between Components](#props---passing-data-between-components)
3. [State - Managing Component Data](#state---managing-component-data)
4. [React Components Basics](#react-components-basics)
5. [Understanding React Hooks](#understanding-react-hooks)
6. [Custom Hooks](#custom-hooks)
7. [Backend Integration](#backend-integration)
8. [Step-by-Step Examples](#step-by-step-examples)

---

## React Core Concepts

### What is React?
React is a JavaScript library for building user interfaces. It's based on the concept of **components** - reusable pieces of UI that manage their own state and logic.

### Key React Principles
1. **Component-Based**: Build encapsulated components that manage their own state
2. **Declarative**: Describe what the UI should look like for any given state
3. **Unidirectional Data Flow**: Data flows down from parent to child components
4. **Virtual DOM**: React creates a virtual representation of the DOM for efficient updates

---

## Props - Passing Data Between Components

### What are Props?
Props (short for "properties") are how you pass data from a parent component to a child component. Think of them as function parameters for components.

### Key Props Concepts
- **Read-Only**: Props cannot be modified by the child component
- **Unidirectional**: Data flows from parent to child only
- **Any Type**: Props can be strings, numbers, objects, functions, etc.

### Basic Props Example
```typescript
// Child Component - receives props
interface GreetingProps {
  name: string;
  age: number;
  isStudent: boolean;
}

const Greeting: React.FC<GreetingProps> = ({ name, age, isStudent }) => {
  return (
    <div>
      <h2>Hello, {name}!</h2>
      <p>You are {age} years old</p>
      {isStudent && <p>You are a student</p>}
    </div>
  );
};

// Parent Component - passes props
const App: React.FC = () => {
  return (
    <div>
      <Greeting name="Alice" age={25} isStudent={true} />
      <Greeting name="Bob" age={30} isStudent={false} />
    </div>
  );
};
```

### Props with Objects and Arrays
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserCardProps {
  user: User;
  hobbies: string[];
  onEdit: (userId: number) => void; // Function prop
}

const UserCard: React.FC<UserCardProps> = ({ user, hobbies, onEdit }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', margin: '8px' }}>
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      
      <h4>Hobbies:</h4>
      <ul>
        {hobbies.map((hobby, index) => (
          <li key={index}>{hobby}</li>
        ))}
      </ul>
      
      <button onClick={() => onEdit(user.id)}>
        Edit User
      </button>
    </div>
  );
};

// Usage
const UserList: React.FC = () => {
  const users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
  ];

  const handleEditUser = (userId: number) => {
    console.log(`Editing user ${userId}`);
  };

  return (
    <div>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          hobbies={["Reading", "Swimming", "Coding"]}
          onEdit={handleEditUser}
        />
      ))}
    </div>
  );
};
```

### Default Props
```typescript
interface ButtonProps {
  text: string;
  color?: string; // Optional prop
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  color = 'blue',     // Default value
  size = 'medium',    // Default value
  onClick
}) => {
  const buttonStyle = {
    backgroundColor: color,
    padding: size === 'small' ? '4px 8px' : size === 'large' ? '12px 24px' : '8px 16px',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer'
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      {text}
    </button>
  );
};

// Usage - some props will use defaults
const ButtonExample: React.FC = () => {
  return (
    <div>
      <Button text="Default Button" />
      <Button text="Red Button" color="red" />
      <Button text="Large Green Button" color="green" size="large" />
    </div>
  );
};
```

### Children Props
```typescript
interface CardProps {
  title: string;
  children: React.ReactNode; // Special prop for nested content
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
};

// Usage - content between opening and closing tags becomes 'children'
const CardExample: React.FC = () => {
  return (
    <div>
      <Card title="User Profile">
        <p>Name: John Doe</p>
        <p>Email: john@example.com</p>
        <button>Edit Profile</button>
      </Card>
      
      <Card title="Settings">
        <label>
          <input type="checkbox" /> Enable notifications
        </label>
        <label>
          <input type="checkbox" /> Dark mode
        </label>
      </Card>
    </div>
  );
};
```

---

## State - Managing Component Data

### What is State?
State is data that belongs to a component and can change over time. When state changes, React re-renders the component to reflect the new state.

### Key State Concepts
- **Mutable**: Unlike props, state can be changed by the component
- **Local**: Each component instance has its own state
- **Triggers Re-renders**: Changing state causes the component to re-render
- **Asynchronous**: State updates may be batched and asynchronous

### Basic State with useState
```typescript
import React, { useState } from 'react';

const Counter: React.FC = () => {
  // useState returns [currentValue, setterFunction]
  const [count, setCount] = useState(0); // Initial state is 0
  const [name, setName] = useState(''); // Initial state is empty string

  const increment = () => {
    setCount(count + 1); // Update state
  };

  const decrement = () => {
    setCount(prevCount => prevCount - 1); // Using previous state
  };

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <p>Hello, {name}!</p>
      </div>
    </div>
  );
};
```

### State with Objects
```typescript
interface UserProfile {
  name: string;
  email: string;
  age: number;
}

const ProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    age: 0
  });

  // Update specific field in object state
  const updateProfile = (field: keyof UserProfile, value: string | number) => {
    setProfile(prevProfile => ({
      ...prevProfile,  // Spread existing state
      [field]: value   // Update specific field
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile submitted:', profile);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          value={profile.name}
          onChange={(e) => updateProfile('name', e.target.value)}
        />
      </div>
      
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => updateProfile('email', e.target.value)}
        />
      </div>
      
      <div>
        <label>Age:</label>
        <input
          type="number"
          value={profile.age}
          onChange={(e) => updateProfile('age', parseInt(e.target.value))}
        />
      </div>
      
      <button type="submit">Save Profile</button>
      
      <div>
        <h3>Preview:</h3>
        <p>Name: {profile.name}</p>
        <p>Email: {profile.email}</p>
        <p>Age: {profile.age}</p>
      </div>
    </form>
  );
};
```

### State with Arrays
```typescript
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now(),
        text: inputText.trim(),
        completed: false
      };
      
      setTodos(prevTodos => [...prevTodos, newTodo]); // Add to array
      setInputText(''); // Clear input
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed } // Update specific item
          : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id)); // Remove item
  };

  return (
    <div>
      <h2>Todo List</h2>
      
      <div>
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Add a todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### State vs Props Comparison

| Aspect | Props | State |
|--------|-------|-------|
| **Mutability** | Read-only | Can be changed |
| **Ownership** | Passed from parent | Belongs to component |
| **Purpose** | Configure component | Track changing data |
| **Updates** | Parent re-renders | setState triggers re-render |
| **Scope** | Available in child | Local to component |

### When to Use Props vs State

**Use Props when:**
- Passing data from parent to child
- Configuring how a component should behave
- The data doesn't change within the component
- You want to reuse a component with different data

**Use State when:**
- Data changes over time (user input, API responses)
- The component needs to remember something
- You need to trigger re-renders when data changes
- Managing component's internal behavior

### Props and State Working Together
```typescript
// Parent component manages state
const ShoppingApp: React.FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const [budget, setBudget] = useState(100);

  const addItem = (item: string) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1>Shopping App</h1>
      
      {/* Pass state as props to children */}
      <BudgetDisplay budget={budget} />
      <ItemForm onAddItem={addItem} />
      <ItemList items={items} onRemoveItem={removeItem} />
    </div>
  );
};

// Child components receive props
interface BudgetDisplayProps {
  budget: number;
}

const BudgetDisplay: React.FC<BudgetDisplayProps> = ({ budget }) => {
  return <div>Budget: ${budget}</div>;
};

interface ItemFormProps {
  onAddItem: (item: string) => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ onAddItem }) => {
  const [inputValue, setInputValue] = useState(''); // Local state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddItem(inputValue.trim()); // Call parent function via props
      setInputValue(''); // Update local state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add item..."
      />
      <button type="submit">Add</button>
    </form>
  );
};

interface ItemListProps {
  items: string[];
  onRemoveItem: (index: number) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onRemoveItem }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item}
          <button onClick={() => onRemoveItem(index)}>Remove</button>
        </li>
      ))}
    </ul>
  );
};
```

---

## React Components Basics

### What is a Component?
A React component is a reusable piece of UI that can have its own state and logic.

### Basic Component Structure
```typescript
// Simple functional component
import React from 'react';

interface Props {
  title: string;
  message: string;
}

export const SimpleComponent: React.FC<Props> = ({ title, message }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  );
};
```

### Component with State
```typescript
import React, { useState } from 'react';

export const CounterComponent: React.FC = () => {
  // useState hook to manage component state
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
};
```

---

## Understanding React Hooks

### What are Hooks?
Hooks are functions that let you "hook into" React features like state and lifecycle methods.

### Most Common Hooks

#### 1. useState - Managing State
```typescript
import React, { useState } from 'react';

export const InputExample: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  
  return (
    <div>
      <input 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type something..."
      />
      <p>You typed: {inputValue}</p>
    </div>
  );
};
```

#### 2. useEffect - Side Effects
```typescript
import React, { useState, useEffect } from 'react';

export const TimerExample: React.FC = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // This runs after component mounts and updates
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup function (runs when component unmounts)
    return () => clearInterval(interval);
  }, []); // Empty dependency array = run once on mount

  return <div>Timer: {seconds} seconds</div>;
};
```

#### 3. useCallback - Optimizing Functions
```typescript
import React, { useState, useCallback } from 'react';

export const CallbackExample: React.FC = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // This function is recreated only when count changes
  const incrementCount = useCallback(() => {
    setCount(prev => prev + 1);
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementCount}>Increment</button>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
    </div>
  );
};
```

---

## Custom Hooks

### What is a Custom Hook?
A custom hook is a JavaScript function that starts with "use" and can call other hooks.

### Simple Custom Hook Example
```typescript
// hooks/useCounter.ts
import { useState, useCallback } from 'react';

export const useCounter = (initialValue: number = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return {
    count,
    increment,
    decrement,
    reset
  };
};
```

### Using the Custom Hook
```typescript
// components/CounterComponent.tsx
import React from 'react';
import { useCounter } from '../hooks/useCounter';

export const CounterComponent: React.FC = () => {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
```

---

## Backend Integration

### Basic Fetch Example
```typescript
// hooks/useApi.ts
import { useState, useEffect } from 'react';

interface ApiData {
  id: number;
  title: string;
  body: string;
}

export const useApi = (url: string) => {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
```

### POST Request Hook
```typescript
// hooks/usePost.ts
import { useState, useCallback } from 'react';

interface PostData {
  title: string;
  body: string;
}

export const usePost = (url: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const postData = useCallback(async (data: PostData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { postData, loading, error, success };
};
```

---

## Step-by-Step Examples

### Example 1: Simple Todo App

#### Step 1: Define Types
```typescript
// types/todo.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}
```

#### Step 2: Create Custom Hook
```typescript
// hooks/useTodos.ts
import { useState, useCallback } from 'react';
import { Todo } from '../types/todo';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTodos(prev => [...prev, newTodo]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo
  };
};
```

#### Step 3: Create Components
```typescript
// components/TodoItem.tsx
import React from 'react';
import { Todo } from '../types/todo';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete }) => {
  return (
    <div style={{ 
      textDecoration: todo.completed ? 'line-through' : 'none',
      padding: '8px',
      border: '1px solid #ccc',
      margin: '4px 0'
    }}>
      <span onClick={() => onToggle(todo.id)}>
        {todo.text}
      </span>
      <button 
        onClick={() => onDelete(todo.id)}
        style={{ marginLeft: '10px' }}
      >
        Delete
      </button>
    </div>
  );
};
```

```typescript
// components/TodoApp.tsx
import React, { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import { TodoItem } from './TodoItem';

export const TodoApp: React.FC = () => {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div>
      <h1>Todo App</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a todo..."
        />
        <button type="submit">Add</button>
      </form>

      <div>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>
    </div>
  );
};
```

### Example 2: Chat Component with Backend

#### Step 1: Define Types
```typescript
// types/chat.ts
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  history: Message[];
}

export interface ChatResponse {
  response: string;
  status: string;
}
```

#### Step 2: Create Chat Hook
```typescript
// hooks/useChat.ts
import { useState, useCallback } from 'react';
import { Message, ChatRequest, ChatResponse } from '../types/chat';

export const useChat = (apiUrl: string = 'http://localhost:8000') => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      // Prepare request
      const request: ChatRequest = {
        message: content,
        history: messages,
      };

      // Send to backend
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      // Add assistant message
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
      setLoading(false);
    }
  }, [messages, apiUrl]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
};
```

#### Step 3: Create Chat Components
```typescript
// components/ChatMessage.tsx
import React from 'react';
import { Message } from '../types/chat';

interface Props {
  message: Message;
}

export const ChatMessage: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      margin: '8px 0'
    }}>
      <div style={{
        backgroundColor: isUser ? '#007bff' : '#f1f1f1',
        color: isUser ? 'white' : 'black',
        padding: '8px 12px',
        borderRadius: '12px',
        maxWidth: '70%'
      }}>
        {message.content}
      </div>
    </div>
  );
};
```

```typescript
// components/ChatApp.tsx
import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { ChatMessage } from './ChatMessage';

export const ChatApp: React.FC = () => {
  const { messages, loading, error, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Chat App</h1>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}

      <div style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #ccc',
        padding: '10px',
        marginBottom: '10px'
      }}>
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {loading && <div>AI is typing...</div>}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          style={{ width: '80%', padding: '8px' }}
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          style={{ width: '18%', padding: '8px', marginLeft: '2%' }}
        >
          Send
        </button>
      </form>

      <button 
        onClick={clearMessages}
        style={{ marginTop: '10px', padding: '8px' }}
      >
        Clear Chat
      </button>
    </div>
  );
};
```

## Key Learning Points

1. **Components**: Focus on single responsibility - each component should do one thing well
2. **Hooks**: Use built-in hooks (useState, useEffect) to manage state and side effects
3. **Custom Hooks**: Extract reusable logic into custom hooks
4. **TypeScript**: Define interfaces for better code quality and IDE support
5. **Error Handling**: Always handle loading states and errors in API calls
6. **Separation of Concerns**: Keep API logic in hooks, UI logic in components

## Practice Exercises

1. Create a simple counter component using useState
2. Build a form component that validates input
3. Make a custom hook for fetching data from an API
4. Create a todo list with add/delete functionality
5. Build a simple chat interface that connects to your backend

Start with these basics and gradually build more complex features!