import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { getPool, closePool } from '../config/database';

dotenv.config();

const SALT_ROUNDS = 10;

interface SourceUser {
  userName: string;
  emailWork: string | null;
  securityUser: string;
  securityPassword: string;
  statusId: number;
}

async function importUsers() {
  const pool = await getPool();

  // Aplicar migración si falta la columna (en PG es nativo y simple)
  await pool.query(`
    ALTER TABLE Usuarios ADD COLUMN IF NOT EXISTS UsuarioLogin VARCHAR(50);
  `);

  // Se asume que la tabla security_users se encuentra cargada en el mismo PostgreSQL
  // debido a que las consultas cross-database no son nativas en PG como en SQL Server.
  let sourceUsers: SourceUser[] = [];
  try {
    const result = await pool.query(`
      SELECT userName, emailWork, securityUser, securityPassword, statusId
      FROM security_users
      WHERE securityUser IS NOT NULL
        AND trim(securityUser) <> ''
        AND securityPassword IS NOT NULL
        AND trim(securityPassword) <> ''
        AND statusId = 1
      ORDER BY userName
    `);
    sourceUsers = result.recordset as SourceUser[];
  } catch (err) {
    console.log('Advertencia: No se pudo leer de la tabla security_users. Asegúrate de que existe en PostgreSQL.');
    console.log((err as Error).message);
  }

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const src of sourceUsers) {
    const login = src.securityUser.trim();
    const nombre = (src.userName || login).trim();
    const email = (src.emailWork?.trim() || `${login}@quiniela.import`).toLowerCase();
    const hashedPassword = await bcrypt.hash(src.securityPassword.trim(), SALT_ROUNDS);

    const existing = await pool.query(
      `SELECT Id FROM Usuarios
       WHERE UsuarioLogin = $1 OR Email = $2`,
      [login, email]
    );

    if (existing.recordset.length > 0) {
      await pool.query(
        `UPDATE Usuarios
         SET Nombre = $1,
             Email = $2,
             Password = $3,
             UsuarioLogin = $4
         WHERE Id = $5 AND Rol = 'User'`,
        [
          nombre.substring(0, 100),
          email.substring(0, 255),
          hashedPassword,
          login.substring(0, 50),
          existing.recordset[0].Id
        ]
      );
      updated++;
      continue;
    }

    try {
      await pool.query(
        `INSERT INTO Usuarios (Nombre, Email, Password, Rol, UsuarioLogin)
         VALUES ($1, $2, $3, 'User', $4)`,
        [
          nombre.substring(0, 100),
          email.substring(0, 255),
          hashedPassword,
          login.substring(0, 50)
        ]
      );
      inserted++;
    } catch {
      skipped++;
    }
  }

  const total = await pool.query(
    "SELECT COUNT(*) AS total FROM Usuarios WHERE Rol = 'User'"
  );

  console.log('=== Importación completada ===');
  console.log(`Origen (security_users activos): ${sourceUsers.length}`);
  console.log(`Insertados: ${inserted}`);
  console.log(`Actualizados: ${updated}`);
  console.log(`Omitidos:   ${skipped}`);
  console.log(`Total usuarios User en Quiniela: ${total.recordset[0].total}`);

  await closePool();
}

importUsers().catch((err) => {
  console.error('Error en importación:', err);
  process.exit(1);
});
