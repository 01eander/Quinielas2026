import { Trophy, Target, XCircle } from 'lucide-react';

interface ScoringRulesProps {
  compact?: boolean;
}

export default function ScoringRules({ compact = false }: ScoringRulesProps) {
  if (compact) {
    return (
      <p className="text-sm text-white/70 mb-6 card-glass !p-4 !py-3">
        <Trophy className="w-4 h-4 text-gold-400 inline mr-2 -mt-0.5" />
        <strong className="text-white">Puntaje:</strong>{' '}
        <span className="text-us-blue font-semibold">3 pts</span> resultado exacto ·{' '}
        <span className="text-us-blue font-semibold">1 pt</span> ganador o empate ·{' '}
        <span className="text-white/60">0 pts</span> si fallas
      </p>
    );
  }

  return (
    <div className="card mb-6 border-l-4 border-l-mx-green">
      <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-gold-500" />
        Reglas de puntaje
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl bg-mx-green/10 border border-mx-green/20 p-3 text-center">
          <p className="text-2xl font-black text-mx-green">3 pts</p>
          <p className="text-sm font-medium text-gray-800 mt-1">Resultado exacto</p>
          <p className="text-xs text-gray-500 mt-1">Aciertas goles local y visitante</p>
        </div>

        <div className="rounded-xl bg-us-blue/10 border border-us-blue/20 p-3 text-center">
          <p className="text-2xl font-black text-us-blue">1 pt</p>
          <p className="text-sm font-medium text-gray-800 mt-1">Ganador o empate</p>
          <p className="text-xs text-gray-500 mt-1">Aciertas quién gana o si empatan</p>
        </div>

        <div className="rounded-xl bg-gray-100 border border-gray-200 p-3 text-center">
          <p className="text-2xl font-black text-gray-500">0 pts</p>
          <p className="text-sm font-medium text-gray-800 mt-1">No acertaste</p>
          <p className="text-xs text-gray-500 mt-1">Marcador y tendencia incorrectos</p>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-2 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="font-medium text-gray-800 flex items-center gap-2">
          <Target className="w-4 h-4 text-mx-green shrink-0" />
          Ejemplo — Resultado real: México <strong>2 – 1</strong>
        </p>
        <ul className="space-y-1 pl-6 list-disc text-gray-600">
          <li>
            Predicción <strong>2 – 1</strong> → <span className="text-mx-green font-semibold">3 pts</span> (exacto)
          </li>
          <li>
            Predicción <strong>3 – 1</strong> o <strong>1 – 0</strong> → <span className="text-us-blue font-semibold">1 pt</span> (gana local)
          </li>
          <li>
            Predicción <strong>1 – 1</strong> o <strong>0 – 1</strong> → <span className="text-gray-500 font-semibold">0 pts</span>
          </li>
        </ul>
        <p className="text-xs text-gray-500 pt-1 flex items-start gap-1.5">
          <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          Los puntos se calculan cuando el administrador registra el resultado final del partido.
          Puedes editar tu predicción hasta que inicie el encuentro.
        </p>
      </div>
    </div>
  );
}
