import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AuthLayout from '../components/AuthLayout';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register(nombre, email, password);
      navigate('/quiniela');
    } catch {
      // error handled in store
    }
  };

  return (
    <AuthLayout title="Crear cuenta" subtitle="Únete a la quiniela del Mundial">
      <form onSubmit={handleSubmit} className="bg-neutral-950/80 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-2xl p-6">
        {error && (
          <div className="mb-4 p-3 bg-ca-red/10 border border-ca-red/30 text-ca-red rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Nombre</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mx-green" />
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2.5 pl-10 bg-neutral-900 border border-neutral-850 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-mx-green/50 focus:border-mx-green"
                placeholder="Tu nombre"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-us-blue" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 pl-10 bg-neutral-900 border border-neutral-850 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-mx-green/50 focus:border-mx-green"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ca-red" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 pl-10 bg-neutral-900 border border-neutral-850 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-mx-green/50 focus:border-mx-green"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
          <UserPlus className="w-4 h-4" />
          {isLoading ? 'Registrando...' : 'Crear cuenta'}
        </button>

        <p className="text-center text-sm text-neutral-400 mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-gold-400 hover:text-white font-semibold transition-colors">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
