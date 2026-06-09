import { Link } from 'react-router-dom';
import { ArrowLeft, Code2, User, Trophy } from 'lucide-react';
import CompanyLogo from '../components/CompanyLogo';
import HostNationStrip from '../components/HostNationStrip';
import { COMPANY_NAME } from '../constants/branding';
import { useAuthStore } from '../store/authStore';

export default function AboutPage() {
  const { user } = useAuthStore();
  const backTo = user ? '/quiniela' : '/login';

  return (
    <div className="min-h-screen flex flex-col bg-hero-gradient bg-pitch-pattern bg-pitch relative">
      <HostNationStrip />

      <header className="relative z-10 border-b border-white/10 bg-pitch-deepest/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={backTo}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
          <CompanyLogo size="sm" />
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-4 py-10 sm:py-14">
        <div className="text-center mb-10">
          <CompanyLogo size="3xl" className="mx-auto" />
          <h1 className="page-title mt-6 text-4xl">Acerca de</h1>
          <p className="page-subtitle mt-2">Quiniela Mundial 2026 · {COMPANY_NAME}</p>
        </div>

        <div className="card-glass space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-mx-green/20 border border-mx-green/30 shrink-0">
              <Trophy className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Quiniela Mundial 2026</h2>
              <p className="text-white/70 mt-2 text-sm leading-relaxed">
                Plataforma interna para registrar predicciones de partidos del Mundial FIFA 2026,
                consultar posiciones y competir con colegas de la organización en un ambiente
                corporativo seguro.
              </p>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-us-blue/30 border border-us-blue/40 shrink-0">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Área de Aplicaciones de TI</h2>
              <p className="text-white/70 mt-2 text-sm leading-relaxed">
                Esta aplicación fue desarrollada por el área de Aplicaciones de TI de{' '}
                {COMPANY_NAME}, con el objetivo de ofrecer una experiencia moderna, accesible
                desde la red corporativa y alineada con la identidad de la empresa.
              </p>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-ca-red/20 border border-ca-red/30 shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Desarrollador</h2>
              <p className="text-white/70 mt-2 text-sm leading-relaxed">
                Creado por <span className="text-gold-400 font-medium">oleander Software</span>.
              </p>
              <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-white/85 leading-relaxed italic">
                💬 Esta página fue hecha con cariño y humor para nuestro grupo de WhatsApp{' '}
                <span className="text-gold-400 font-semibold">"Bach. Tec. #8 sin Fosil"</span>.
                Se les recuerda que para mantener la paz y la sana competencia, <strong>¡no se permiten Nachos!</strong>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/40 mt-8">
          México · USA · Canadá 2026
        </p>
      </main>

      <HostNationStrip />
    </div>
  );
}
