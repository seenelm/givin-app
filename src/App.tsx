import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import Dashboard from './pages/Dashboard';
import FundraisingManager from './pages/FundraisingManager';
import DonorManager from './pages/DonorManager';
import GivinAssistant from './pages/GivinAssistant';
import Sidebar from './components/Sidebar';
import './App.css';
import './pages/styles/Dashboard.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/fundraising-manager" element={<FundraisingManager />} />
            <Route path="/donor-manager" element={<DonorManager />} />
            <Route path="/givin-assistant" element={<GivinAssistant />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

