import { useEffect, useMemo, useState } from 'react';
import { Save, CheckCircle, Settings } from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { api } from '../services/api';
import { Match, MatchPhase } from '../types';

const KNOCKOUT_PHASE_ORDER: MatchPhase[] = [
  'Dieciseisavos',
  'Octavos',
  'Cuartos',
  'Semifinal',
  'Final',
];

function getSectionLabel(match: Match): string {
  return match.Fase === 'Fase de Grupos' ? `Grupo ${match.Grupo}` : match.Fase;
}

function getSectionSortKey(label: string): string {
  if (label.startsWith('Grupo ')) {
    return `0-${label.slice(6).padStart(4, '0')}`;
  }
  const index = KNOCKOUT_PHASE_ORDER.indexOf(label as MatchPhase);
  return `1-${String(index >= 0 ? index : 99).padStart(2, '0')}`;
}

function groupMatchesBySection(matches: Match[]): Array<{ label: string; matches: Match[] }> {
  const sections = new Map<string, Match[]>();

  for (const match of matches) {
    const label = getSectionLabel(match);
    const list = sections.get(label) ?? [];
    list.push(match);
    sections.set(label, list);
  }

  return Array.from(sections.entries())
    .map(([label, sectionMatches]) => ({
      label,
      matches: [...sectionMatches].sort(
        (a, b) => new Date(a.FechaHora).getTime() - new Date(b.FechaHora).getTime()
      ),
    }))
    .sort((a, b) => getSectionSortKey(a.label).localeCompare(getSectionSortKey(b.label)));
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<Record<number, { local: number; visitante: number }>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [saved, setSaved] = useState<number | null>(null);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await api.matches.getAll();
      setMatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleSaveScore = async (matchId: number) => {
    const score = scores[matchId];
    if (!score) return;

    setSaving(matchId);
    try {
      await api.matches.updateScore(matchId, score.local, score.visitante);
      setSaved(matchId);
      await loadMatches();
      setTimeout(() => setSaved(null), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(null);
    }
  };

  const updateScore = (matchId: number, field: 'local' | 'visitante', value: number) => {
    setScores((prev) => ({
      ...prev,
      [matchId]: {
        local: field === 'local' ? value : (prev[matchId]?.local ?? 0),
        visitante: field === 'visitante' ? value : (prev[matchId]?.visitante ?? 0),
      },
    }));
  };

  const pendingMatches = useMemo(
    () => matches.filter((m) => m.Estado !== 'Finalizado'),
    [matches]
  );
  const finishedMatches = useMemo(
    () => matches.filter((m) => m.Estado === 'Finalizado'),
    [matches]
  );

  const pendingSections = useMemo(() => groupMatchesBySection(pendingMatches), [pendingMatches]);
  const finishedSections = useMemo(() => groupMatchesBySection(finishedMatches), [finishedMatches]);

  return (
    <Layout>
      <PageHeader
        icon={<Settings className="w-6 h-6 text-gold-400" />}
        title="Gestor de Partidos y Marcadores"
        subtitle="Ingresa los resultados reales para calcular puntos"
      />

      {loading ? (
        <div className="text-center py-12 text-white/50">Cargando partidos...</div>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-4">
              Partidos pendientes ({pendingMatches.length})
            </h2>

            {pendingSections.length === 0 ? (
              <p className="text-gray-500">No hay partidos pendientes</p>
            ) : (
              <div className="space-y-8">
                {pendingSections.map((section) => (
                  <div key={section.label}>
                    <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-mx-green" />
                      {section.label}
                      <span className="text-white/40 font-normal normal-case tracking-normal">
                        ({section.matches.length})
                      </span>
                    </h3>
                    <div className="space-y-3">
                      {section.matches.map((match) => (
                        <div
                          key={match.Id}
                          className="card flex flex-wrap items-center justify-between gap-4"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">
                              {match.EquipoLocal} vs {match.EquipoVisitante}
                            </p>
                            <p className="text-sm text-gray-500">
                              {match.Fase === 'Fase de Grupos'
                                ? match.Fase
                                : `${match.Fase}${match.Grupo ? ` · ${match.Grupo}` : ''}`}
                              {' · '}
                              {new Date(match.FechaHora).toLocaleString('es-MX')}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              min={0}
                              placeholder="Local"
                              value={scores[match.Id]?.local ?? ''}
                              onChange={(e) =>
                                updateScore(match.Id, 'local', parseInt(e.target.value, 10) || 0)
                              }
                              className="input-field w-20 text-center"
                            />
                            <span className="text-gray-400 font-bold">-</span>
                            <input
                              type="number"
                              min={0}
                              placeholder="Visit."
                              value={scores[match.Id]?.visitante ?? ''}
                              onChange={(e) =>
                                updateScore(match.Id, 'visitante', parseInt(e.target.value, 10) || 0)
                              }
                              className="input-field w-20 text-center"
                            />
                            <button
                              onClick={() => handleSaveScore(match.Id)}
                              disabled={saving === match.Id || scores[match.Id] === undefined}
                              className="btn-primary flex items-center gap-2"
                            >
                              {saved === match.Id ? (
                                <>
                                  <CheckCircle className="w-4 h-4" /> Guardado
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4" />
                                  {saving === match.Id ? 'Guardando...' : 'Cerrar partido'}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-4">
              Partidos finalizados ({finishedMatches.length})
            </h2>

            {finishedSections.length === 0 ? (
              <p className="text-gray-500">No hay partidos finalizados</p>
            ) : (
              <div className="space-y-8">
                {finishedSections.map((section) => (
                  <div key={section.label}>
                    <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-us-blue" />
                      {section.label}
                      <span className="text-white/40 font-normal normal-case tracking-normal">
                        ({section.matches.length})
                      </span>
                    </h3>
                    <div className="space-y-3">
                      {section.matches.map((match) => (
                        <div
                          key={match.Id}
                          className="card py-4 flex items-center justify-between gap-4"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {match.EquipoLocal} vs {match.EquipoVisitante}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(match.FechaHora).toLocaleString('es-MX')}
                            </p>
                          </div>
                          <span className="text-xl font-bold text-mx-green shrink-0">
                            {match.GolesLocal} - {match.GolesVisitante}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </Layout>
  );
}
