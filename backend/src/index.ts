import app from './app';
import { getPool, closePool } from './config/database';
import { formatDbError, getDbConnectionSummary } from './utils/dbError';

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const LAN_IP = process.env.LAN_IP || '172.16.105.154';

async function start() {
  try {
    await getPool();
    console.log('Conectado a PostgreSQL');
    console.log(getDbConnectionSummary());

    app.listen(PORT, HOST, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Red local: http://${LAN_IP}:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor: no se pudo conectar a SQL Server');
    console.error(formatDbError(error));
    console.error(`Configuración: ${getDbConnectionSummary()}`);
    console.error('Ejecuta "npm run test:db" para diagnosticar la conexión.');
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});

start();
