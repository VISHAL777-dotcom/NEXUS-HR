import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AppShell from './components/layout/AppShell';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Directory from './pages/Directory';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import Leave from './pages/Leave';
import Recruitment from './pages/Recruitment';
import Organization from './pages/Organization';
import Analytics from './pages/Analytics';
import RolesManagement from './pages/RolesManagement';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/leave" element={<Leave />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/organization" element={<Organization />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/roles" element={<RolesManagement />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
