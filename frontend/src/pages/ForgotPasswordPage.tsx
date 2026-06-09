import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { api } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const result = await api.auth.forgotPassword(email.trim());
      setSuccess(result.message);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="¿Olvidaste tu contraseña?"
      subtitle="Te enviaremos un enlace a tu correo registrado"
    >
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

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Email registrado</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mx-green" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 pl-10 bg-neutral-900 border border-neutral-850 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-mx-green/50 focus:border-mx-green"
              placeholder="tu@empresa.com"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          {isLoading ? 'Enviando...' : 'Enviar enlace'}
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
