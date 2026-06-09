import { useEffect, useState } from 'react';
import { Trophy, Medal } from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import ScoringRules from '../components/ScoringRules';import { api } from '../services/api';
import { LeaderboardEntry } from '../types';
import { useAuthStore } from '../store/authStore';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    api.predictions.leaderboard()
      .then(setLeaderboard)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const medalColor = (pos: number) => {
    if (pos === 1) return 'text-gold-400';
    if (pos === 2) return 'text-gray-300';
    if (pos === 3) return 'text-amber-600';
    return 'text-gray-400';
  };

  const rowHighlight = (pos: number) => {
    if (pos === 1) return 'bg-gold-400/10';
    if (pos === 2) return 'bg-gray-100/80';
    if (pos === 3) return 'bg-amber-50/80';
    return '';
  };

  return (
    <Layout>
      <PageHeader
        icon={<Trophy className="w-6 h-6 text-gold-400" />}
        title="Tabla de Posiciones"
        subtitle="Ranking general de participantes"
      />

      <ScoringRules compact />

      <div className="table-glass">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Cargando ranking...</div>
        ) : leaderboard.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aún no hay participantes</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-mx-green/10 via-us-blue/10 to-ca-red/10 border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wide">#</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wide">Participante</th>
                  <th className="text-right py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wide">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr
                    key={entry.Id}
                    className={`border-b border-gray-100 hover:bg-mx-green/5 transition-colors ${rowHighlight(entry.Posicion)} ${
                      user?.Id === entry.Id ? 'ring-2 ring-inset ring-mx-green/30 bg-mx-green/5' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {entry.Posicion <= 3 ? (
                          <Medal className={`w-5 h-5 ${medalColor(entry.Posicion)}`} />
                        ) : null}
                        <span className="font-bold text-gray-700">{entry.Posicion}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">
                        {entry.Nombre}
                        {user?.Id === entry.Id && (
                          <span className="ml-2 text-xs bg-gradient-to-r from-mx-green to-us-blue text-white px-2.5 py-0.5 rounded-full font-semibold">
                            Tú
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-black text-us-blue text-xl">{entry.PuntosTotales}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
