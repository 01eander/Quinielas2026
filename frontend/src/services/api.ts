const API_BASE = '/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud');
  }

  return data as T;
}

export const api = {
  auth: {
    register: (nombre: string, email: string, password: string) =>
      request<import('../types').AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ nombre, email, password }),
      }),
    login: (email: string, password: string) =>
      request<import('../types').AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    forgotPassword: (email: string) =>
      request<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    resetPassword: (email: string, token: string, newPassword: string) =>
      request<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, token, newPassword }),
      }),
    changePassword: (currentPassword: string, newPassword: string) =>
      request<{ message: string }>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
    profile: () => request<import('../types').User>('/auth/profile'),
  },
  matches: {
    getAll: (params?: { grupo?: string; fase?: string }) => {
      const query = new URLSearchParams();
      if (params?.grupo) query.set('grupo', params.grupo);
      if (params?.fase) query.set('fase', params.fase);
      const qs = query.toString();
      return request<import('../types').Match[]>(`/matches${qs ? `?${qs}` : ''}`);
    },
    getFilters: () =>
      request<{ grupos: string[]; fases: string[] }>('/matches/filters'),
    create: (data: {
      equipoLocal: string;
      equipoVisitante: string;
      grupo: string;
      fase: string;
      fechaHora: string;
      estadioCiudad: string;
    }) =>
      request<import('../types').Match>('/matches', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateScore: (id: number, golesLocal: number, golesVisitante: number) =>
      request<import('../types').Match>(`/matches/${id}/score`, {
        method: 'PUT',
        body: JSON.stringify({ golesLocal, golesVisitante }),
      }),
  },
  predictions: {
    getMine: () =>
      request<import('../types').PredictionWithMatch[]>('/predictions/mine'),
    save: (partidoId: number, prediccionLocal: number, prediccionVisitante: number) =>
      request<import('../types').Prediction>('/predictions', {
        method: 'POST',
        body: JSON.stringify({ partidoId, prediccionLocal, prediccionVisitante }),
      }),
    leaderboard: () =>
      request<import('../types').LeaderboardEntry[]>('/predictions/leaderboard'),
  },
  admin: {
    dashboard: () => request<import('../types').DashboardStats>('/admin/dashboard'),
    listAdmins: () => request<import('../types').User[]>('/admin/admins'),
    createAdmin: (data: { nombre: string; email: string; password: string }) =>
      request<import('../types').User>('/admin/admins', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    listUsers: () => request<import('../types').User[]>('/admin/users'),
    promoteUser: (id: number) =>
      request<import('../types').User>(`/admin/users/${id}/promote`, { method: 'PUT' }),
    resetUserPassword: (id: number, data: { newPassword?: string; generate?: boolean }) =>
      request<{ message: string; user: import('../types').User; temporaryPassword?: string }>(
        `/admin/users/${id}/reset-password`,
        { method: 'PUT', body: JSON.stringify(data) }
      ),
  },
};
