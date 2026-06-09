import { useEffect, useState } from 'react';
import { Users, Calendar, Target, TrendingUp, BarChart3 } from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import KpiCard from '../components/KpiCard';
import { api } from '../services/api';
import { DashboardStats } from '../types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.dashboard()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12 text-white/50">Cargando dashboard...</div>
      </Layout>
    );
  }

  if (!stats) {
    return (
      <Layout>
        <div className="text-center py-12 text-ca-red">Error al cargar estadísticas</div>
      </Layout>
    );
  }

  const maxPredicciones = Math.max(...stats.partidosMasPredichos.map((p) => p.TotalPredicciones), 1);

  return (
    <Layout>
      <PageHeader
        icon={<BarChart3 className="w-6 h-6 text-gold-400" />}
        title="Dashboard Administrativo"
        subtitle="Estadísticas generales de la quiniela"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Total Usuarios" value={stats.totalUsuarios} icon={Users} color="mx" />
        <KpiCard title="Partidos Jugados" value={stats.partidosJugados} icon={Calendar} color="us" />
        <KpiCard title="Predicciones" value={stats.totalPredicciones} icon={Target} color="gold" />
        <KpiCard title="Efectividad Global" value={`${stats.efectividadGlobal}%`} icon={TrendingUp} color="ca" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-mx-green" />
            Top 10 Ranking
          </h2>
          <div className="space-y-3">
            {stats.ranking.slice(0, 10).map((user, i) => (
              <div key={user.Id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-mx-green to-us-blue text-white rounded-full text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{user.Nombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 bg-gradient-to-r from-mx-green to-us-blue rounded-full"
                    style={{ width: `${Math.max((user.PuntosTotales / (stats.ranking[0]?.PuntosTotales || 1)) * 120, 4)}px` }}
                  />
                  <span className="text-sm font-bold text-us-blue w-8 text-right">
                    {user.PuntosTotales}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Partidos más predichos</h2>
          <div className="space-y-4">
            {stats.partidosMasPredichos.map((p) => (
              <div key={p.PartidoId}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-900">
                    {p.EquipoLocal} vs {p.EquipoVisitante}
                  </span>
                  <span className="text-gray-500">{p.TotalPredicciones}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-400 to-ca-red rounded-full transition-all"
                    style={{ width: `${(p.TotalPredicciones / maxPredicciones) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Estado de partidos</h2>
          <div className="flex flex-wrap gap-4">
            {stats.partidosPorEstado.map((item) => {
              const colors: Record<string, string> = {
                Pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                'En Progreso': 'bg-blue-100 text-blue-800 border-blue-200',
                Finalizado: 'bg-green-100 text-green-800 border-green-200',
              };
              return (
                <div
                  key={item.Estado}
                  className={`flex-1 min-w-[140px] p-4 rounded-xl border text-center ${colors[item.Estado] || 'bg-gray-100'}`}
                >
                  <p className="text-3xl font-bold">{item.Total}</p>
                  <p className="text-sm font-medium mt-1">{item.Estado}</p>
                </div>
              );
            })}
            <div className="flex-1 min-w-[140px] p-4 rounded-xl border text-center bg-gray-50 text-gray-700 border-gray-200">
              <p className="text-3xl font-bold">{stats.partidosPendientes}</p>
              <p className="text-sm font-medium mt-1">Por jugar</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
