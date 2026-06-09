import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import QuinielaPage from './pages/QuinielaPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminMatchesPage from './pages/AdminMatchesPage';
import AdminCreatePhasePage from './pages/AdminCreatePhasePage';
import AdminAdminsPage from './pages/AdminAdminsPage';
import AboutPage from './pages/AboutPage';
import { useAuthStore } from './store/authStore';
function HomeRedirect() {
  const { user, token } = useAuthStore();

  if (!token || !user) return <Navigate to="/login" replace />;
  return <Navigate to="/quiniela" replace />;
}

export default function App() {
  const { loadProfile } = useAuthStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/acerca-de" element={<AboutPage />} />
      <Route path="/" element={<HomeRedirect />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/quiniela" element={<QuinielaPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/cuenta/contrasena" element={<ChangePasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/partidos" element={<AdminMatchesPage />} />
        <Route path="/admin/fases" element={<AdminCreatePhasePage />} />
        <Route path="/admin/admins" element={<AdminAdminsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
