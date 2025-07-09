import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { useLocation } from 'react-router'; 
import Dashboard from './pages/Dashboard';
import FundraisingManager from './pages/FundraisingManager';
import DonorManager from './pages/DonorManager';
import SidebarView from './components/sidebar';
import ResizableChatSidebar from './components/chat/ResizableChatSidebar';
import FloatingChatButton from './components/chat/FloatingChatButton';
import { ChatSidebarProvider } from './context/ChatSidebarContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import { AuthProvider } from './context/AuthContext'; 
import DataLibrary from './pages/DataLibrary';
import './App.css';
import './pages/styles/Dashboard.css';
import Login from './pages/Login';
import PrivateRoute from './routes/PrivateRoute';

// Content component that uses the sidebar context
const AppContent = () => {
  const { isCollapsed } = useSidebar();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  return (
    <div className="app-container">
      {!isLoginPage && <SidebarView />}
      <div className={`content-wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`} style={isLoginPage ? { marginLeft: 0, width: '100%' } : undefined}>
        <div className="main-content">
          <Routes>

            <Route path="/login" element={<Login />} /> 

            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />

            <Route path="/fundraising-manager" element={
              <PrivateRoute>
                <FundraisingManager />
              </PrivateRoute>
            } />

            <Route path="/donor-manager" element={
              <PrivateRoute>
                <DonorManager />
              </PrivateRoute>
            } />

            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/data-library" element={
              <PrivateRoute>
                <DataLibrary />
              </PrivateRoute>
            } />

          </Routes>
        </div>
        {!isLoginPage && <ResizableChatSidebar />}
        {!isLoginPage && <FloatingChatButton />}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
    <ChatSidebarProvider>
      <SidebarProvider>
        <Router>
          <AppContent />
        </Router>
      </SidebarProvider>
    </ChatSidebarProvider>
    </AuthProvider>
  );
}

export default App;
