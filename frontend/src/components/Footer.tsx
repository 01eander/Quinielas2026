import { Link } from 'react-router-dom';
import CompanyLogo from './CompanyLogo';
import { COMPANY_NAME } from '../constants/branding';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-pitch-deepest/80 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/acerca-de" className="flex items-center gap-3 group">
          <CompanyLogo size="sm" />
          <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
            Quiniela Mundial 2026
          </span>
        </Link>

        <div className="text-center sm:text-right text-xs text-white/45">
          <p>© {new Date().getFullYear()} {COMPANY_NAME}</p>
          <Link
            to="/acerca-de"
            className="text-white/60 hover:text-gold-400 transition-colors underline-offset-2 hover:underline"
          >
            Acerca de
          </Link>
        </div>
      </div>
    </footer>
  );
}
