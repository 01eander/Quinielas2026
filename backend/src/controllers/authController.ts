import { Request, Response } from 'express';
import * as authService from '../services/authService';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      res.status(400).json({ message: 'Nombre, email y password son requeridos' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    const result = await authService.register(nombre, email, password);
    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al registrar';
    res.status(400).json({ message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email y password son requeridos' });
      return;
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
    res.status(401).json({ message });
  }
}

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const user = await authService.getUserById(req.user!.userId);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      res.status(400).json({ message: 'El email es requerido' });
      return;
    }

    const result = await authService.requestPasswordReset(email);
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const { email, token, newPassword } = req.body;

    if (!email?.trim() || !token?.trim() || !newPassword) {
      res.status(400).json({ message: 'Email, token y nueva contraseña son requeridos' });
      return;
    }

    const result = await authService.resetPasswordWithToken(email, token, newPassword);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al restablecer contraseña';
    res.status(400).json({ message });
  }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Contraseña actual y nueva contraseña son requeridas' });
      return;
    }

    const result = await authService.changePassword(
      req.user!.userId,
      currentPassword,
      newPassword
    );
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al cambiar contraseña';
    res.status(400).json({ message });
  }
}
