import { Match, PredictionWithMatch } from '../types';
import {
  formatMatchDate,
  getPredictionUiStatus,
  isMatchLocked,
  MatchDraft,
} from '../utils/matchHelpers';
import PredictionStatusBadge from './PredictionStatusBadge';

interface MatchCardProps {
  match: Match;
  draft: MatchDraft;
  prediction?: PredictionWithMatch;
  onScoreChange: (local: number, visitante: number) => void;
}

export default function MatchCard({ match, draft, prediction, onScoreChange }: MatchCardProps) {
  const locked = isMatchLocked(match);
  const status = getPredictionUiStatus(match, draft);

  const statusBadge = {
    Pendiente: 'bg-gold-400/20 text-gold-600 border border-gold-400/30',
    'En Progreso': 'bg-us-blue/15 text-us-blue border border-us-blue/25',
    Finalizado: 'bg-mx-green/15 text-mx-green border border-mx-green/25',
  }[match.Estado];

  return (
    <div
      className={`card-match ${status === 'dirty' ? 'ring-2 ring-gold-400/50 border-gold-400/40' : ''}`}
    >
      <div className="h-1 w-full rounded-full bg-gradient-to-r from-mx-green via-us-blue to-ca-red mb-4 -mt-2 opacity-80" />

      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge-group">Grupo {match.Grupo}</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge}`}>
            {match.Estado}
          </span>
        </div>
        <PredictionStatusBadge status={status} />
      </div>

      <p className="text-xs text-gray-500 font-medium mb-3 text-center">{formatMatchDate(match.FechaHora)}</p>

      <div className="flex items-center justify-between gap-4 py-2">
        <div className="flex-1 text-center">
          <p className="font-bold text-gray-900 text-sm sm:text-base leading-tight">{match.EquipoLocal}</p>
          <input
            type="number"
            min={0}
            max={20}
            value={draft.local}
            onChange={(e) => onScoreChange(parseInt(e.target.value, 10) || 0, draft.visitante)}
            disabled={locked}
            className="input-field w-14 sm:w-16 text-center mx-auto mt-2 text-lg font-bold disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">vs</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mx-green/20 to-us-blue/20 flex items-center justify-center mt-1">
            <span className="text-xs">⚽</span>
          </div>
        </div>

        <div className="flex-1 text-center">
          <p className="font-bold text-gray-900 text-sm sm:text-base leading-tight">{match.EquipoVisitante}</p>
          <input
            type="number"
            min={0}
            max={20}
            value={draft.visitante}
            onChange={(e) => onScoreChange(draft.local, parseInt(e.target.value, 10) || 0)}
            disabled={locked}
            className="input-field w-14 sm:w-16 text-center mx-auto mt-2 text-lg font-bold disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {locked && match.GolesLocal !== null && (
        <div className="mt-4 text-center p-3 rounded-xl bg-pitch-deepest/5 border border-pitch-deepest/10">
          <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Resultado real</p>
          <p className="text-2xl font-black text-us-blue mt-1">
            {match.GolesLocal} <span className="text-gray-300">-</span> {match.GolesVisitante}
          </p>
          {prediction && (
            <p className="text-sm text-mx-green font-semibold mt-1">+{prediction.PuntosGanados} pts</p>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3 text-center flex items-center justify-center gap-1">
        <span>📍</span> {match.EstadioCiudad}
      </p>
    </div>
  );
}
