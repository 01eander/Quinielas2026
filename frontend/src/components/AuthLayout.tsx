import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import HostNationStrip from './HostNationStrip';
import CompanyLogo from './CompanyLogo';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 relative overflow-hidden">
      <HostNationStrip />

      {/* Sleek premium glowing background dots / highlights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_-20%,rgba(0,104,71,0.15),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_120%,rgba(0,40,104,0.15),transparent)] pointer-events-none" />

      <div className="flex-1 flex items-center justify-center px-4 py-10 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <CompanyLogo size="3xl" className="mx-auto mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-mx-green ring-2 ring-white/30" title="México" />
              <span className="w-3 h-3 rounded-full bg-us-blue ring-2 ring-white/30" title="USA" />
              <span className="w-3 h-3 rounded-full bg-ca-red ring-2 ring-white/30" title="Canadá" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md">{title}</h1>
            <p className="text-white/60 mt-2 text-sm sm:text-base">{subtitle}</p>
            <p className="text-gold-400/90 text-xs font-semibold tracking-widest uppercase mt-3">
              México · USA · Canadá 2026
            </p>
          </div>

          {children}
        </div>
      </div>

      <div className="relative z-10 pb-4 text-center">
        <Link
          to="/acerca-de"
          className="text-xs text-white/45 hover:text-gold-400 transition-colors"
        >
          Acerca de
        </Link>
      </div>

      <HostNationStrip />
    </div>
  );
}
