export type UserRole = 'User' | 'Admin';
export type MatchStatus = 'Pendiente' | 'En Progreso' | 'Finalizado';
export type MatchPhase =
  | 'Fase de Grupos'
  | 'Dieciseisavos'
  | 'Octavos'
  | 'Cuartos'
  | 'Semifinal'
  | 'Final';

export interface User {
  Id: number;
  Nombre: string;
  Email: string;
  Rol: UserRole;
  PuntosTotales: number;
  FechaRegistro: string;
}

export interface Match {
  Id: number;
  EquipoLocal: string;
  EquipoVisitante: string;
  Grupo: string;
  Fase: MatchPhase;
  FechaHora: string;
  EstadioCiudad: string;
  GolesLocal: number | null;
  GolesVisitante: number | null;
  Estado: MatchStatus;
}

export interface Prediction {
  Id: number;
  UsuarioId: number;
  PartidoId: number;
  PrediccionLocal: number;
  PrediccionVisitante: number;
  PuntosGanados: number;
  FechaModificacion: string;
}

export interface PredictionWithMatch extends Prediction {
  EquipoLocal: string;
  EquipoVisitante: string;
  Grupo: string;
  Fase: MatchPhase;
  FechaHora: string;
  GolesLocal: number | null;
  GolesVisitante: number | null;
  Estado: MatchStatus;
}

export interface LeaderboardEntry {
  Id: number;
  Nombre: string;
  PuntosTotales: number;
  Posicion: number;
}

export interface DashboardStats {
  totalUsuarios: number;
  partidosJugados: number;
  partidosPendientes: number;
  totalPredicciones: number;
  efectividadGlobal: number;
  ranking: User[];
  partidosMasPredichos: Array<{
    PartidoId: number;
    EquipoLocal: string;
    EquipoVisitante: string;
    TotalPredicciones: number;
  }>;
  partidosPorEstado: Array<{ Estado: string; Total: number }>;
}

export interface AuthResponse {
  user: User;
  token: string;
}
