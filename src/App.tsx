import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import Dashboard from './pages/Dashboard';
import FundraisingManager from './pages/FundraisingManager';
import DonorManager from './pages/DonorManager';
import SidebarView from './components/sidebar';
import ResizableChatSidebar from './components/chat/ResizableChatSidebar';
import { ChatSidebarProvider } from './context/ChatSidebarContext';
import DataLibrary from './pages/DataLibrary';
import './App.css';
import './pages/styles/Dashboard.css';

function App() {
  return (
    <ChatSidebarProvider>
      <Router>
        <div className="app-container">
          <SidebarView />
          <div className="content-wrapper">
            <div className="main-content">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/fundraising-manager" element={<FundraisingManager />} />
                <Route path="/donor-manager" element={<DonorManager />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/data-library" element={<DataLibrary />} />
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
