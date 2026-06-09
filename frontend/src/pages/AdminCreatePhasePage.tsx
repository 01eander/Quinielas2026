import { useState, FormEvent } from 'react';
import { PlusCircle, CheckCircle, Target } from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { api } from '../services/api';
import { MatchPhase } from '../types';

const FASES_ELIMINATORIAS: MatchPhase[] = [
  'Dieciseisavos',
  'Octavos',
  'Cuartos',
  'Semifinal',
  'Final',
];

export default function AdminCreatePhasePage() {
  const [form, setForm] = useState({
    equipoLocal: '',
    equipoVisitante: '',
    grupo: 'Eliminatoria',
    fase: 'Dieciseisavos' as MatchPhase,
    fechaHora: '',
    estadioCiudad: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.matches.create(form);
      setSuccess(true);
      setForm({
        equipoLocal: '',
        equipoVisitante: '',
        grupo: 'Eliminatoria',
        fase: form.fase,
        fechaHora: '',
        estadioCiudad: '',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear partido');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <PageHeader
        icon={<Target className="w-6 h-6 text-gold-400" />}
        title="Creador de Fases Eliminatorias"
        subtitle="Añade partidos de Dieciseisavos, Octavos, Cuartos, Semifinal y Final"
      />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Partido creado exitosamente
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipo Local</label>
              <input
                type="text"
                value={form.equipoLocal}
                onChange={(e) => updateField('equipoLocal', e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipo Visitante</label>
              <input
                type="text"
                value={form.equipoVisitante}
                onChange={(e) => updateField('equipoVisitante', e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fase</label>
              <select
                value={form.fase}
                onChange={(e) => updateField('fase', e.target.value)}
                className="input-field"
              >
                {FASES_ELIMINATORIAS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
              <input
                type="text"
                value={form.grupo}
                onChange={(e) => updateField('grupo', e.target.value)}
                className="input-field"
                placeholder="Eliminatoria"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
              <input
                type="datetime-local"
                value={form.fechaHora}
                onChange={(e) => updateField('fechaHora', e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estadio / Ciudad</label>
              <input
                type="text"
                value={form.estadioCiudad}
                onChange={(e) => updateField('estadioCiudad', e.target.value)}
                className="input-field"
                placeholder="Ej: MetLife Stadium, New Jersey"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            {loading ? 'Creando...' : 'Crear partido'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
