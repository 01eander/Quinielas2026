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
  UsuarioLogin?: string | null;
  Password?: string;
  Rol: UserRole;
  PuntosTotales: number;
  FechaRegistro: Date;
}

export interface UserPublic {
  Id: number;
  Nombre: string;
  Email: string;
  Rol: UserRole;
  PuntosTotales: number;
  FechaRegistro: Date;
}

export interface Match {
  Id: number;
  EquipoLocal: string;
  EquipoVisitante: string;
  Grupo: string;
  Fase: MatchPhase;
  FechaHora: Date;
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
  FechaModificacion: Date;
}

export interface PredictionWithMatch extends Prediction {
  EquipoLocal: string;
  EquipoVisitante: string;
  Grupo: string;
  Fase: MatchPhase;
  FechaHora: Date;
  GolesLocal: number | null;
  GolesVisitante: number | null;
  Estado: MatchStatus;
}

export interface Config {
  Id: number;
  PuntosResultadoExacto: number;
  PuntosGanadorEmpate: number;
  FechaActualizacion: Date;
}

export interface JwtPayload {
  userId: number;
  email: string;
  rol: UserRole;
}

export interface DashboardStats {
  totalUsuarios: number;
  partidosJugados: number;
  partidosPendientes: number;
  totalPredicciones: number;
  efectividadGlobal: number;
  ranking: UserPublic[];
  partidosMasPredichos: Array<{
    PartidoId: number;
    EquipoLocal: string;
    EquipoVisitante: string;
    TotalPredicciones: number;
  }>;
  partidosPorEstado: Array<{ Estado: string; Total: number }>;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
