import { useState, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, KeyRound, ArrowLeft } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { api } from '../services/api';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emailFromUrl = searchParams.get('email') || '';
  const tokenFromUrl = searchParams.get('token') || '';

  const [email, setEmail] = useState(emailFromUrl);
  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      const result = await api.auth.resetPassword(email.trim(), token.trim(), newPassword);
      setSuccess(result.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restablecer contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Nueva contraseña" subtitle="Elige una contraseña segura (mínimo 6 caracteres)">
      <form onSubmit={handleSubmit} className="bg-neutral-950/80 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-2xl p-6">
        {error && (
          <div className="mb-4 p-3 bg-ca-red/10 border border-ca-red/30 text-ca-red rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-mx-green/10 border border-mx-green/30 text-mx-green rounded-xl text-sm">
            {success}
          </div>
        )}

        <div className="space-y-4">
          {!emailFromUrl && (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-850 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-mx-green/50 focus:border-mx-green"
                required
              />
            </div>
          )}

          {!tokenFromUrl && (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Código del enlace</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-850 rounded-xl text-white placeholder:text-neutral-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-mx-green/50 focus:border-mx-green"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Nueva contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-us-blue" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2.5 pl-10 bg-neutral-900 border border-neutral-850 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-mx-green/50 focus:border-mx-green"
                minLength={6}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Confirmar contraseña</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mx-green" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2.5 pl-10 bg-neutral-900 border border-neutral-850 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-mx-green/50 focus:border-mx-green"
                minLength={6}
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || Boolean(success)}
          className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
        >
          <KeyRound className="w-4 h-4" />
          {isLoading ? 'Guardando...' : 'Restablecer contraseña'}
        </button>

        <p className="text-center text-sm text-neutral-400 mt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-gold-400 hover:text-white font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
