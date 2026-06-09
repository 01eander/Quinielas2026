import { useEffect, useMemo, useState, FormEvent } from 'react';
import {
  ShieldCheck,
  UserPlus,
  CheckCircle,
  Mail,
  Lock,
  User,
  Search,
  ArrowUpCircle,
  KeyRound,
  X,
  Copy,
} from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { api } from '../services/api';
import { User as AppUser } from '../types';

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState<AppUser[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [promotingId, setPromotingId] = useState<number | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [passwordSearch, setPasswordSearch] = useState('');
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [resetTarget, setResetTarget] = useState<AppUser | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resettingId, setResettingId] = useState<number | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.admin.listAdmins(), api.admin.listUsers()])
      .then(([adminList, userList]) => {
        setAdmins(adminList);
        setUsers(userList);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Error al cargar datos')
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (user) =>
        user.Nombre.toLowerCase().includes(term) ||
        user.Email.toLowerCase().includes(term)
    );
  }, [users, search]);

  const allAccounts = useMemo(() => {
    const byId = new Map<number, AppUser>();
    [...users, ...admins].forEach((account) => byId.set(account.Id, account));
    return Array.from(byId.values()).sort((a, b) => a.Nombre.localeCompare(b.Nombre));
  }, [users, admins]);

  const filteredAccounts = useMemo(() => {
    const term = passwordSearch.trim().toLowerCase();
    if (!term) return allAccounts;
    return allAccounts.filter(
      (account) =>
        account.Nombre.toLowerCase().includes(term) ||
        account.Email.toLowerCase().includes(term)
    );
  }, [allAccounts, passwordSearch]);

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const created = await api.admin.createAdmin(form);
      setAdmins((prev) => [...prev, created]);
      setForm({ nombre: '', email: '', password: '' });
      showSuccess('Administrador creado exitosamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear administrador');
    } finally {
      setSaving(false);
    }
  };

  const handlePromote = async (user: AppUser) => {
    setPromotingId(user.Id);
    setError('');
    setSuccess('');

    try {
      const promoted = await api.admin.promoteUser(user.Id);
      setUsers((prev) => prev.filter((item) => item.Id !== user.Id));
      setAdmins((prev) => [...prev, promoted]);
      showSuccess(`${user.Nombre} ahora es administrador`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al promover usuario');
    } finally {
      setPromotingId(null);
    }
  };

  const openResetModal = (user: AppUser) => {
    setResetTarget(user);
    setResetPassword('');
    setGeneratedPassword(null);
    setError('');
  };

  const closeResetModal = () => {
    setResetTarget(null);
    setResetPassword('');
    setGeneratedPassword(null);
  };

  const handleResetPassword = async (generate: boolean) => {
    if (!resetTarget) return;

    if (!generate && resetPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setResettingId(resetTarget.Id);
    setError('');
    setSuccess('');

    try {
      const result = await api.admin.resetUserPassword(resetTarget.Id, {
        ...(generate ? { generate: true } : { newPassword: resetPassword }),
      });

      if (result.temporaryPassword) {
        setGeneratedPassword(result.temporaryPassword);
      } else {
        closeResetModal();
      }

      showSuccess(`Contraseña de ${resetTarget.Nombre} actualizada`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restablecer contraseña');
    } finally {
      setResettingId(null);
    }
  };

  const copyGeneratedPassword = async () => {
    if (!generatedPassword) return;
    await navigator.clipboard.writeText(generatedPassword);
    showSuccess('Contraseña copiada al portapapeles');
  };

  return (
    <Layout>
      <PageHeader
        icon={<ShieldCheck className="w-6 h-6 text-gold-400" />}
        title="Administradores"
        subtitle="Crea admins nuevos o promueve usuarios que ya estén registrados"
      />

      {(error || success) && (
        <div className="mb-6">
          {error && (
            <div className="p-3 bg-ca-red/10 border border-ca-red/30 text-ca-red rounded-xl text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-mx-green/10 border border-mx-green/30 text-mx-green rounded-xl text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <form onSubmit={handleSubmit} className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Nuevo administrador</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mx-green" />
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
                  className="input-field pl-10"
                  placeholder="Nombre completo"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-us-blue" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="input-field pl-10"
                  placeholder="admin@empresa.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ca-red" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="input-field pl-10"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            {saving ? 'Creando...' : 'Crear administrador'}
          </button>
        </form>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">
            Administradores activos ({admins.length})
          </h2>

          {loading ? (
            <p className="text-gray-500 text-sm">Cargando...</p>
          ) : admins.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay administradores registrados.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {admins.map((admin) => (
                <div
                  key={admin.Id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div>
                    <p className="font-medium text-gray-900">{admin.Nombre}</p>
                    <p className="text-sm text-gray-500">{admin.Email}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-us-blue/10 text-us-blue">
                    Admin
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-1">Promover usuario existente</h2>
        <p className="text-sm text-gray-500 mb-4">
          Selecciona un usuario registrado para darle acceso de administrador.
        </p>

        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
            placeholder="Buscar por nombre o email..."
          />
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Cargando usuarios...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {users.length === 0
              ? 'No hay usuarios registrados para promover.'
              : 'No se encontraron usuarios con ese criterio.'}
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.Id}
                className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div>
                  <p className="font-medium text-gray-900">{user.Nombre}</p>
                  <p className="text-sm text-gray-500">{user.Email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePromote(user)}
                  disabled={promotingId === user.Id}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-us-blue text-white hover:bg-us-blue/90 disabled:opacity-50 transition-colors"
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  {promotingId === user.Id ? 'Promoviendo...' : 'Hacer admin'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card mt-6">
        <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-us-blue" />
          Restablecer contraseña
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Asigna una contraseña temporal a cualquier usuario o administrador.
        </p>

        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={passwordSearch}
            onChange={(e) => setPasswordSearch(e.target.value)}
            className="input-field pl-10"
            placeholder="Buscar cuenta por nombre o email..."
          />
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Cargando cuentas...</p>
        ) : filteredAccounts.length === 0 ? (
          <p className="text-gray-500 text-sm">No se encontraron cuentas.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredAccounts.map((account) => (
              <div
                key={account.Id}
                className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div>
                  <p className="font-medium text-gray-900">{account.Nombre}</p>
                  <p className="text-sm text-gray-500">{account.Email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {account.Rol === 'Admin' && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-us-blue/10 text-us-blue">
                      Admin
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => openResetModal(account)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-mx-green text-white hover:bg-mx-green/90 transition-colors"
                  >
                    <KeyRound className="w-4 h-4" />
                    Resetear
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="card w-full max-w-md shadow-2xl relative">
            <button
              type="button"
              onClick={closeResetModal}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-semibold text-gray-900 mb-1">Restablecer contraseña</h3>
            <p className="text-sm text-gray-500 mb-4">
              {resetTarget.Nombre} · {resetTarget.Email}
            </p>

            {generatedPassword ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-mx-green/10 border border-mx-green/30">
                  <p className="text-sm text-gray-600 mb-2">Contraseña temporal generada:</p>
                  <p className="font-mono text-lg font-bold text-gray-900 break-all">
                    {generatedPassword}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  Comparte esta contraseña con el usuario por un canal seguro. Deberá cambiarla al
                  iniciar sesión si lo deseas.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={copyGeneratedPassword}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </button>
                  <button type="button" onClick={closeResetModal} className="btn-secondary flex-1">
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ca-red" />
                    <input
                      type="text"
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      className="input-field pl-10"
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => handleResetPassword(false)}
                    disabled={resettingId === resetTarget.Id || resetPassword.length < 6}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <KeyRound className="w-4 h-4" />
                    {resettingId === resetTarget.Id ? 'Guardando...' : 'Guardar contraseña'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResetPassword(true)}
                    disabled={resettingId === resetTarget.Id}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Generar temporal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
