import bcrypt from 'bcrypt';
import { getPool, closePool } from '../config/database';

async function seedAdmin() {
  const password = 'Admin123!';
  const hash = await bcrypt.hash(password, 10);

  const pool = await getPool();

  const existing = await pool.query(
    'SELECT Id FROM Usuarios WHERE Email = $1',
    ['admin@quiniela.com']
  );

  if (existing.recordset.length > 0) {
    await pool.query(
      'UPDATE Usuarios SET Password = $1 WHERE Email = $2',
      [hash, 'admin@quiniela.com']
    );

    console.log('Admin actualizado: admin@quiniela.com / Admin123!');
  } else {
    await pool.query(
      `INSERT INTO Usuarios (Nombre, Email, Password, Rol)
       VALUES ($1, $2, $3, 'Admin')`,
      ['Administrador', 'admin@quiniela.com', hash]
    );

    console.log('Admin creado: admin@quiniela.com / Admin123!');
  }

  await closePool();
}

seedAdmin().catch(console.error);
