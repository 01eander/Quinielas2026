import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Trophy, LogOut, LayoutDashboard, Target, Users, Settings, Info, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import CompanyLogo from './CompanyLogo';
export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
      isActive(path) ? 'nav-link-active' : 'nav-link'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-pitch-deepest/95 via-us-blue/90 to-pitch-deepest/95 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <CompanyLogo size="xs" />
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-mx-green to-us-blue group-hover:scale-105 transition-transform hidden sm:block">
              <Trophy className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <span className="font-bold text-white text-lg leading-tight block">Quiniela 2026</span>
              <span className="text-[10px] text-white/50 tracking-wider uppercase hidden sm:block">
                Mundial · MX · US · CA
              </span>
            </div>
          </Link>
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1">
                <Link to="/quiniela" className={linkClass('/quiniela')}>
                  <Target className="w-4 h-4" />
                  Quiniela
                </Link>
                <Link to="/leaderboard" className={linkClass('/leaderboard')}>
                  <Users className="w-4 h-4" />
                  Posiciones
                </Link>
                {user.Rol === 'Admin' && (
                  <>
                    <span className="w-px h-5 bg-white/15 mx-1" aria-hidden />
                    <Link to="/admin" className={linkClass('/admin')}>
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link to="/admin/partidos" className={linkClass('/admin/partidos')}>
                      <Settings className="w-4 h-4" />
                      Partidos
                    </Link>
                    <Link to="/admin/fases" className={linkClass('/admin/fases')}>
                      <Target className="w-4 h-4" />
                      Crear Fases
                    </Link>
                    <Link to="/admin/admins" className={linkClass('/admin/admins')}>
                      <ShieldCheck className="w-4 h-4" />
                      Admins
                    </Link>
                  </>
                )}
                <Link to="/acerca-de" className={linkClass('/acerca-de')}>
                  <Info className="w-4 h-4" />
                  Acerca de
                </Link>
                <Link to="/cuenta/contrasena" className={linkClass('/cuenta/contrasena')}>
                  <KeyRound className="w-4 h-4" />
                  Contraseña
                </Link>
              </div>
              <div className="flex items-center gap-3 pl-3 border-l border-white/15">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{user.Nombre}</p>
                  <p className="text-xs text-gold-400/90">
                    {user.PuntosTotales} pts
                    {user.Rol === 'Admin' && (
                      <span className="text-white/50"> · Admin</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-white/60 hover:text-ca-red hover:bg-white/10 rounded-xl transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
