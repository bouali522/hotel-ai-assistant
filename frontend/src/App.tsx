// App.tsx - Fixed layout with stable dimensions
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ChatPage } from './pages/ChatPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Header component
export const ChatHeader = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: '#2c5aa0' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/chat">
          🏨 HotelBot Assistant
        </Link>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/chat">
                Chat
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};


function App() {
  return (
    <Router>
      {/* Header */}
      <ChatHeader />

      <div className="app-container">
        <div className="chat-wrapper">
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/dashboard" element={
              <div className="p-4">
                <h2>Hotel Dashboard</h2>
                <p>Booking statistics and management</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;