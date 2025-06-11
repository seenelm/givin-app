import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import Dashboard from './pages/Dashboard';
import FundraisingManager from './pages/FundraisingManager';
import DonorManager from './pages/DonorManager';
import Sidebar from './components/sidebar';
import ResizableChatSidebar from './components/chat/ResizableChatSidebar';
import { ChatSidebarProvider } from './context/ChatSidebarContext';
import './App.css';
import './pages/styles/Dashboard.css';

function App() {
  return (
    <ChatSidebarProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <div className="content-wrapper">
            <div className="main-content">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/fundraising-manager" element={<FundraisingManager />} />
                <Route path="/donor-manager" element={<DonorManager />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
            <ResizableChatSidebar />
          </div>
        </div>
      </Router>
    </ChatSidebarProvider>
  );
}

export default App;
