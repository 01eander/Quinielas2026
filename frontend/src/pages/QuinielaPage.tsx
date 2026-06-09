import { useEffect, useState, useCallback, useMemo } from 'react';
import { Filter, Target, LayoutGrid, List } from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import MatchCard from '../components/MatchCard';
import MatchListRow from '../components/MatchListRow';
import QuinielaSaveBar from '../components/QuinielaSaveBar';
import ScoringRules from '../components/ScoringRules';
import Mascot from '../components/Mascot';
import { api } from '../services/api';
import { Match, PredictionWithMatch } from '../types';
import {
  createDraftFromPrediction,
  isDraftDirty,
  isMatchLocked,
  MatchDraft,
} from '../utils/matchHelpers';

type ViewMode = 'cards' | 'list';

function buildDraftsFromData(
  matches: Match[],
  predictions: PredictionWithMatch[]
): Record<number, MatchDraft> {
  const drafts: Record<number, MatchDraft> = {};

  for (const match of matches) {
    const prediction = predictions.find((p) => p.PartidoId === match.Id);
    if (prediction) {
      drafts[match.Id] = createDraftFromPrediction(
        prediction.PrediccionLocal,
        prediction.PrediccionVisitante,
        true
      );
    } else {
      drafts[match.Id] = createDraftFromPrediction(0, 0, false);
    }
  }

  return drafts;
}

export default function QuinielaPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<PredictionWithMatch[]>([]);
  const [drafts, setDrafts] = useState<Record<number, MatchDraft>>({});
  const [grupos, setGrupos] = useState<string[]>([]);
  const [fases, setFases] = useState<string[]>([]);
  const [filterGrupo, setFilterGrupo] = useState('');
  const [filterFase, setFilterFase] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setSaveError('');
    try {
      const [matchesData, predictionsData, filters] = await Promise.all([
        api.matches.getAll({
          grupo: filterGrupo || undefined,
          fase: filterFase || undefined,
        }),
        api.predictions.getMine(),
        api.matches.getFilters(),
      ]);
      setMatches(matchesData);
      setPredictions(predictionsData);
      setDrafts(buildDraftsFromData(matchesData, predictionsData));
      setGrupos(filters.grupos);
      setFases(filters.fases);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterGrupo, filterFase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getPrediction = (partidoId: number) =>
    predictions.find((p) => p.PartidoId === partidoId);

  const updateDraft = (partidoId: number, local: number, visitante: number) => {
    setSaveMessage(null);
    setDrafts((prev) => {
      const current = prev[partidoId];
      if (!current) return prev;
      return {
        ...prev,
        [partidoId]: { ...current, local, visitante },
      };
    });
  };

  const dirtyMatches = useMemo(
    () =>
      matches.filter((match) => {
        const draft = drafts[match.Id];
        return draft && !isMatchLocked(match) && isDraftDirty(draft);
      }),
    [matches, drafts]
  );

  const savedCount = useMemo(
    () =>
      matches.filter((match) => {
        const draft = drafts[match.Id];
        return draft?.hasSavedOnServer && !isDraftDirty(draft);
      }).length,
    [matches, drafts]
  );

  const progressPercent = matches.length > 0 ? Math.round((savedCount / matches.length) * 100) : 0;

  const handleSaveAll = async () => {
    if (dirtyMatches.length === 0) return;

    setSaving(true);
    setSaveError('');
    setSaveMessage(null);

    const results = await Promise.allSettled(
      dirtyMatches.map((match) => {
        const draft = drafts[match.Id];
        return api.predictions.save(match.Id, draft.local, draft.visitante);
      })
    );

    const failed = results.filter((r) => r.status === 'rejected').length;
    const succeeded = results.length - failed;

    if (succeeded > 0) {
      try {
        const predictionsData = await api.predictions.getMine();
        setPredictions(predictionsData);
        setDrafts((prev) => {
          const next = { ...prev };
          dirtyMatches.forEach((match, index) => {
            if (results[index].status === 'fulfilled') {
              const draft = next[match.Id];
              if (draft) {
                next[match.Id] = {
                  ...draft,
                  hasSavedOnServer: true,
                  savedLocal: draft.local,
                  savedVisitante: draft.visitante,
                };
              }
            }
          });
          return next;
        });
      } catch {
        await loadData();
      }
    }

    if (failed === 0) {
      setSaveMessage(
        succeeded === 1
          ? 'Se guardó 1 predicción'
          : `Se guardaron ${succeeded} predicciones`
      );
      setTimeout(() => setSaveMessage(null), 4000);
    } else if (succeeded === 0) {
      setSaveError('No se pudo guardar. Revisa tu conexión e intenta de nuevo.');
    } else {
      setSaveError(`Se guardaron ${succeeded}, pero ${failed} fallaron. Intenta de nuevo.`);
      await loadData();
    }

    setSaving(false);
  };

  return (
    <Layout>
      <div className="pb-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <PageHeader
            icon={<Target className="w-6 h-6 text-gold-400" />}
            title="Mi Quiniela"
            subtitle="Captura tus marcadores y guarda todo con un solo clic"
            className="mb-0"
          />
          <div className="flex justify-center lg:justify-end shrink-0 pb-2">
            <Mascot size="lg" className="lg:-mb-2" />
          </div>
        </div>

        <ScoringRules />

        {!loading && matches.length > 0 && (
          <div className="card-glass mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-semibold text-white">Progreso de predicciones</p>
                <p className="text-xs text-white/60 mt-0.5">
                  {savedCount} de {matches.length} partidos guardados
                  {dirtyMatches.length > 0 && (
                    <span className="text-gold-400"> · {dirtyMatches.length} sin guardar</span>
                  )}
                </p>
              </div>
              <p className="text-2xl font-black text-gold-400">{progressPercent}%</p>
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-mx-green to-us-blue transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-mx-green" />
              <h2 className="font-semibold text-gray-900">Filtros</h2>
            </div>

            <div className="flex rounded-xl border border-gray-200 p-1 bg-gray-50 self-start">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-us-blue shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
                Lista
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-us-blue shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Tarjetas
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <select
              value={filterGrupo}
              onChange={(e) => setFilterGrupo(e.target.value)}
              className="input-field w-auto min-w-[150px]"
            >
              <option value="">Todos los grupos</option>
              {grupos.map((g) => (
                <option key={g} value={g}>
                  Grupo {g}
                </option>
              ))}
            </select>

            <select
              value={filterFase}
              onChange={(e) => setFilterFase(e.target.value)}
              className="input-field w-auto min-w-[200px]"
            >
              <option value="">Todas las fases</option>
              {fases.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {saveError && (
          <div className="mb-6 p-3 bg-ca-red/10 border border-ca-red/30 text-ca-red rounded-xl text-sm">
            {saveError}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-white/50">
            <span className="inline-block text-4xl mb-3 animate-pulse">⚽</span>
            <p>Cargando partidos...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="card-glass text-center py-12">No hay partidos disponibles</div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchCard
                key={match.Id}
                match={match}
                draft={drafts[match.Id] ?? createDraftFromPrediction(0, 0, false)}
                prediction={getPrediction(match.Id)}
                onScoreChange={(local, visitante) => updateDraft(match.Id, local, visitante)}
              />
            ))}
          </div>
        ) : (
          <div className="card p-0 overflow-hidden max-w-5xl mx-auto w-full">
            <div className="hidden lg:flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wide">
              <span className="w-48 xl:w-52 shrink-0">Fecha / Grupo</span>
              <span className="flex-1 text-center">Partido</span>
              <span className="w-36 xl:w-40 shrink-0 text-right">Estado</span>
            </div>
            {matches.map((match) => (
              <MatchListRow
                key={match.Id}
                match={match}
                draft={drafts[match.Id] ?? createDraftFromPrediction(0, 0, false)}
                prediction={getPrediction(match.Id)}
                onScoreChange={(local, visitante) => updateDraft(match.Id, local, visitante)}
              />
            ))}
          </div>
        )}
      </div>

      {!loading && matches.length > 0 && (
        <QuinielaSaveBar
          dirtyCount={dirtyMatches.length}
          saving={saving}
          saveMessage={saveMessage}
          onSaveAll={handleSaveAll}
        />
      )}
    </Layout>
  );
}
