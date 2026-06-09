import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { getPool } from '../config/database';
import { sendPasswordResetEmail } from './emailService';
import { JwtPayload, User, UserRole, UserPublic } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const SALT_ROUNDS = 10;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

const PASSWORD_RESET_MESSAGE =
  'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.';

function toPublicUser(user: User): UserPublic {
  const { Password: _, ...publicUser } = user;
  return publicUser;
}

export async function register(
  nombre: string,
  email: string,
  password: string
): Promise<{ user: UserPublic; token: string }> {
  const user = await createUser(nombre, email, password, 'User');
  const token = generateToken(user);
  return { user, token };
}

export async function createUser(
  nombre: string,
  email: string,
  password: string,
  rol: UserRole = 'User'
): Promise<UserPublic> {
  const pool = await getPool();

  const existing = await pool.query(
    'SELECT Id FROM Usuarios WHERE Email = $1',
    [email.trim().toLowerCase()]
  );

  if (existing.recordset.length > 0) {
    throw new Error('El email ya está registrado');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await pool.query(
    `INSERT INTO Usuarios (Nombre, Email, Password, Rol)
     VALUES ($1, $2, $3, $4)
     RETURNING Id, Nombre, Email, Rol, PuntosTotales, FechaRegistro`,
    [nombre.trim(), email.trim().toLowerCase(), hashedPassword, rol]
  );

  return result.recordset[0] as UserPublic;
}

export async function login(
  loginId: string,
  password: string
): Promise<{ user: UserPublic; token: string }> {
  const pool = await getPool();

  const result = await pool.query(
    `SELECT * FROM Usuarios
     WHERE Email = $1 OR UsuarioLogin = $1`,
    [loginId.trim()]
  );

  if (result.recordset.length === 0) {
    throw new Error('Credenciales inválidas');
  }

  const user = result.recordset[0] as User;
  const valid = await bcrypt.compare(password, user.Password!);

  if (!valid) {
    throw new Error('Credenciales inválidas');
  }

  const token = generateToken(user);
  return { user: toPublicUser(user), token };
}

export async function getUserById(id: number): Promise<UserPublic | null> {
  const pool = await getPool();

  const result = await pool.query(
    'SELECT Id, Nombre, Email, Rol, PuntosTotales, FechaRegistro FROM Usuarios WHERE Id = $1',
    [id]
  );

  return result.recordset[0] || null;
}

function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getAppBaseUrl(): string {
  return (process.env.APP_URL || 'http://localhost:5173').replace(/\/$/, '');
}

function validatePassword(password: string): void {
  if (password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  }
}

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const pool = await getPool();

  const result = await pool.query(
    'SELECT Id, Email FROM Usuarios WHERE Email = $1',
    [normalizedEmail]
  );

  if (result.recordset.length === 0) {
    return { message: PASSWORD_RESET_MESSAGE };
  }

  const user = result.recordset[0] as { Id: number; Email: string };
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashResetToken(rawToken);
  const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await pool.query(
    `UPDATE Usuarios
     SET ResetTokenHash = $1, ResetTokenExpires = $2
     WHERE Id = $3`,
    [tokenHash, expires, user.Id]
  );

  const resetUrl = `${getAppBaseUrl()}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.Email)}`;
  await sendPasswordResetEmail(user.Email, resetUrl);

  return { message: PASSWORD_RESET_MESSAGE };
}

export async function resetPasswordWithToken(
  email: string,
  token: string,
  newPassword: string
): Promise<{ message: string }> {
  validatePassword(newPassword);

  const normalizedEmail = email.trim().toLowerCase();
  const tokenHash = hashResetToken(token.trim());
  const pool = await getPool();

  const result = await pool.query(
    `SELECT Id FROM Usuarios
     WHERE Email = $1
       AND ResetTokenHash = $2
       AND ResetTokenExpires > now()`,
    [normalizedEmail, tokenHash]
  );

  if (result.recordset.length === 0) {
    throw new Error('El enlace no es válido o ya expiró. Solicita uno nuevo.');
  }

  const userId = result.recordset[0].Id as number;
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await pool.query(
    `UPDATE Usuarios
     SET Password = $1,
         ResetTokenHash = NULL,
         ResetTokenExpires = NULL
     WHERE Id = $2`,
    [hashedPassword, userId]
  );

  return { message: 'Contraseña actualizada. Ya puedes iniciar sesión.' };
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  validatePassword(newPassword);

  const pool = await getPool();
  const result = await pool.query(
    'SELECT Password FROM Usuarios WHERE Id = $1',
    [userId]
  );

  if (result.recordset.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  const storedHash = result.recordset[0].Password as string;
  const valid = await bcrypt.compare(currentPassword, storedHash);

  if (!valid) {
    throw new Error('La contraseña actual es incorrecta');
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await pool.query(
    `UPDATE Usuarios
     SET Password = $1,
         ResetTokenHash = NULL,
         ResetTokenExpires = NULL
     WHERE Id = $2`,
    [hashedPassword, userId]
  );

  return { message: 'Contraseña actualizada correctamente' };
}

export async function adminResetUserPassword(
  userId: number,
  newPassword: string
): Promise<{ message: string; user: UserPublic }> {
  validatePassword(newPassword);

  const pool = await getPool();
  const existing = await pool.query(
    'SELECT Id, Nombre, Email, Rol, PuntosTotales, FechaRegistro FROM Usuarios WHERE Id = $1',
    [userId]
  );

  if (existing.recordset.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await pool.query(
    `UPDATE Usuarios
     SET Password = $1,
         ResetTokenHash = NULL,
         ResetTokenExpires = NULL
     WHERE Id = $2`,
    [hashedPassword, userId]
  );

  return {
    message: 'Contraseña restablecida correctamente',
    user: existing.recordset[0] as UserPublic,
  };
}

export function generateTemporaryPassword(): string {
  const suffix = crypto.randomBytes(4).toString('hex');
  return `Quiniela${suffix}!`;
}

function generateToken(user: Pick<User, 'Id' | 'Email' | 'Rol'>): string {
  const payload: JwtPayload = {
    userId: user.Id,
    email: user.Email,
    rol: user.Rol,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}
