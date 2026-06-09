import { Match } from '../types';

export function isMatchLocked(match: Match): boolean {
  if (match.Estado !== 'Pendiente') return true;
  return new Date() >= new Date(match.FechaHora);
}

export function formatMatchDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export type PredictionUiStatus = 'saved' | 'dirty' | 'empty' | 'locked';

export interface MatchDraft {
  local: number;
  visitante: number;
  hasSavedOnServer: boolean;
  savedLocal: number;
  savedVisitante: number;
}

export function createDraftFromPrediction(
  local: number,
  visitante: number,
  hasSaved: boolean
): MatchDraft {
  return {
    local,
    visitante,
    hasSavedOnServer: hasSaved,
    savedLocal: local,
    savedVisitante: visitante,
  };
}

export function isDraftDirty(draft: MatchDraft): boolean {
  return draft.local !== draft.savedLocal || draft.visitante !== draft.savedVisitante;
}

export function getPredictionUiStatus(match: Match, draft: MatchDraft): PredictionUiStatus {
  if (isMatchLocked(match)) return 'locked';
  if (isDraftDirty(draft)) return 'dirty';
  if (draft.hasSavedOnServer) return 'saved';
  return 'empty';
}
