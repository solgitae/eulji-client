import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import LoginPage from './pages/web/auth/Login'
import './App.css'
import InboxesPage from './pages/dashboard/Inbox';
import LeadsPage from './pages/dashboard/Leads';
import ClientsPage from './pages/dashboard/Clients';
import ProjectsPage from './pages/dashboard/Projects';
import InvoicesPage from './pages/dashboard/Invoices';
import SettingsPage from './pages/dashboard/Settings';
import DashboardPage from './pages/dashboard/Index';
import TestPage from './pages/dashboard/Test';
import NotFoundPage from './pages/web/NotFound';

function App() {
  console.log("[App] Rendering, current location:", window.location.pathname);
  return (
    <div className="h-full">
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/dashboard/inbox" element={<Layout><InboxesPage /></Layout>} />
        <Route path="/dashboard/leads" element={<Layout><LeadsPage /></Layout>} />
        <Route path="/dashboard/clients" element={<Layout><ClientsPage /></Layout>} />
        <Route path="/dashboard/projects" element={<Layout><ProjectsPage /></Layout>} />
        <Route path="/dashboard/invoices" element={<Layout><InvoicesPage /></Layout>} />
        <Route path="/dashboard/settings" element={<Layout><SettingsPage /></Layout>} />
        <Route path="/dashboard/test" element={<Layout><TestPage /></Layout>} />
        <Route path="/dashboard/404" element={<Layout><NotFoundPage /></Layout>} />
        
        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  )
}

export default App
