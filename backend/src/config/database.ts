import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const keyMapping: Record<string, string> = {
  id: 'Id',
  nombre: 'Nombre',
  email: 'Email',
  password: 'Password',
  usuariologin: 'UsuarioLogin',
  rol: 'Rol',
  puntostotales: 'PuntosTotales',
  fecharegistro: 'FechaRegistro',
  resettokenhash: 'ResetTokenHash',
  resettokenexpires: 'ResetTokenExpires',
  equipolocal: 'EquipoLocal',
  equipovisitante: 'EquipoVisitante',
  grupo: 'Grupo',
  fase: 'Fase',
  fechahora: 'FechaHora',
  estadiociudad: 'EstadioCiudad',
  goleslocal: 'GolesLocal',
  golesvisitante: 'GolesVisitante',
  estado: 'Estado',
  usuarioid: 'UsuarioId',
  partidoid: 'PartidoId',
  prediccionlocal: 'PrediccionLocal',
  prediccionvisitante: 'PrediccionVisitante',
  puntosganados: 'PuntosGanados',
  fechamodificacion: 'FechaModificacion',
  puntosresultadoexacto: 'PuntosResultadoExacto',
  puntosganadorempate: 'PuntosGanadorEmpate',
  fechaactualizacion: 'FechaActualizacion',
  totalpredicciones: 'TotalPredicciones',
  total: 'total',
};

function mapRow(row: any) {
  if (!row) return row;
  const mapped: any = {};
  for (const key of Object.keys(row)) {
    const mappedKey = keyMapping[key] || key;
    mapped[mappedKey] = row[key];
    if (mappedKey !== key) {
      mapped[key] = row[key];
    }
  }
  return mapped;
}

function mapQueryResults(res: any) {
  if (Array.isArray(res)) {
    const mappedResults = res.map(r => {
      const mappedRows = r.rows ? r.rows.map(mapRow) : [];
      return {
        rows: mappedRows,
        recordset: mappedRows,
        recordsets: [mappedRows],
        rowCount: r.rowCount,
      };
    });
    const lastRes = mappedResults[mappedResults.length - 1];
    return {
      ...lastRes,
      results: mappedResults,
    };
  }

  const mappedRows = res.rows ? res.rows.map(mapRow) : [];
  return {
    rows: mappedRows,
    recordset: mappedRows,
    recordsets: [mappedRows],
    rowCount: res.rowCount,
  };
}

export class PostgresPoolWrapper {
  public pool: Pool;

  constructor(config: PoolConfig) {
    this.pool = new Pool(config);
  }

  async query(text: string, params?: any[]): Promise<any> {
    const res = await this.pool.query(text, params);
    return mapQueryResults(res);
  }

  async connect(): Promise<any> {
    const client = await this.pool.connect();
    const originalQuery = client.query.bind(client);
    
    client.query = async function(text: any, params?: any): Promise<any> {
      const res = await originalQuery(text, params);
      return mapQueryResults(res);
    };
    
    return client;
  }

  async end(): Promise<void> {
    await this.pool.end();
  }
}

function buildConfig(): PoolConfig {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgrespassword',
    database: process.env.DB_NAME || 'QuinielaMundial2026',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
}

let pool: PostgresPoolWrapper | null = null;

export async function getPool(): Promise<PostgresPoolWrapper> {
  if (!pool) {
    pool = new PostgresPoolWrapper(buildConfig());
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Dummy sql object for compilation backwards compatibility during refactoring
export const sql = {
  Int: 'int',
  NVarChar: (size?: number) => `varchar(${size || 255})`,
  DateTime2: 'timestamp',
};
