import { Match, PredictionWithMatch } from '../types';
import {
  formatMatchDate,
  getPredictionUiStatus,
  isMatchLocked,
  MatchDraft,
} from '../utils/matchHelpers';
import PredictionStatusBadge from './PredictionStatusBadge';

interface MatchListRowProps {
  match: Match;
  draft: MatchDraft;
  prediction?: PredictionWithMatch;
  onScoreChange: (local: number, visitante: number) => void;
}

export default function MatchListRow({ match, draft, prediction, onScoreChange }: MatchListRowProps) {
  const locked = isMatchLocked(match);
  const status = getPredictionUiStatus(match, draft);

  return (
    <div
      className={`flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 px-4 py-3 border-b border-gray-100 last:border-b-0 ${
        status === 'dirty' ? 'bg-gold-400/5' : 'hover:bg-gray-50/80'
      }`}
    >
      {/* Meta: fecha, grupo, resultado (desktop) */}
      <div className="lg:w-48 xl:w-52 shrink-0 flex items-center justify-between lg:block gap-2">
        <div>
          <p className="text-xs text-gray-500">{formatMatchDate(match.FechaHora)}</p>
          <p className="text-xs text-gray-400 mt-0.5">Grupo {match.Grupo}</p>
        </div>
        <div className="lg:hidden shrink-0">
          <PredictionStatusBadge status={status} compact />
        </div>
      </div>

      {/* Partido centrado — bloque compacto tipo marcador */}
      <div className="flex flex-1 items-center justify-center gap-2 sm:gap-3 min-w-0">
        <p className="w-[38%] sm:w-36 lg:w-40 xl:w-44 text-right font-semibold text-gray-900 text-sm leading-tight truncate">
          {match.EquipoLocal}
        </p>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <input
            type="number"
            min={0}
            max={20}
            value={draft.local}
            onChange={(e) => onScoreChange(parseInt(e.target.value, 10) || 0, draft.visitante)}
            disabled={locked}
            className="input-field w-12 sm:w-14 text-center font-bold text-lg py-2 disabled:bg-gray-100"
            aria-label={`Goles ${match.EquipoLocal}`}
          />
          <span className="text-gray-300 font-bold text-sm">-</span>
          <input
            type="number"
            min={0}
            max={20}
            value={draft.visitante}
            onChange={(e) => onScoreChange(draft.local, parseInt(e.target.value, 10) || 0)}
            disabled={locked}
            className="input-field w-12 sm:w-14 text-center font-bold text-lg py-2 disabled:bg-gray-100"
            aria-label={`Goles ${match.EquipoVisitante}`}
          />
        </div>

        <p className="w-[38%] sm:w-36 lg:w-40 xl:w-44 text-left font-semibold text-gray-900 text-sm leading-tight truncate">
          {match.EquipoVisitante}
        </p>
      </div>

      {/* Estado + resultado real (desktop) */}
      <div className="hidden lg:flex w-36 xl:w-40 shrink-0 flex-col items-end gap-1">
        <PredictionStatusBadge status={status} />
        {locked && match.GolesLocal !== null && (
          <span className="text-xs text-us-blue font-bold">
            Real: {match.GolesLocal}-{match.GolesVisitante}
            {prediction ? ` · +${prediction.PuntosGanados} pts` : ''}
          </span>
        )}
      </div>
    </div>
  );
}
