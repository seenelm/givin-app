import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import Dashboard from './pages/Dashboard';
import FundraisingManager from './pages/FundraisingManager';
import DonorManager from './pages/DonorManager';
import SidebarView from './components/sidebar';
import ResizableChatSidebar from './components/chat/ResizableChatSidebar';
import FloatingChatButton from './components/chat/FloatingChatButton';
import { ChatSidebarProvider } from './context/ChatSidebarContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import DataLibrary from './pages/DataLibrary';
import './App.css';
import './pages/styles/Dashboard.css';

// Content component that uses the sidebar context
const AppContent = () => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="app-container">
      <SidebarView />
      <div className={`content-wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
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
        <FloatingChatButton />
      </div>
    </div>
  );
};

function App() {
  return (
    <ChatSidebarProvider>
      <SidebarProvider>
        <Router>
          <AppContent />
        </Router>
      </SidebarProvider>
    </ChatSidebarProvider>
  );
}

export default App;
