import { Request, Response } from 'express';
import * as adminService from '../services/adminService';
import * as authService from '../services/authService';
import { parseRouteParamId } from '../utils/routeParams';export async function getDashboard(_req: Request, res: Response): Promise<void> {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch {
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
}

export async function getConfig(_req: Request, res: Response): Promise<void> {
  try {
    const config = await adminService.getConfig();
    res.json(config);
  } catch {
    res.status(500).json({ message: 'Error al obtener configuración' });
  }
}

export async function updateConfig(req: Request, res: Response): Promise<void> {
  try {
    const { puntosResultadoExacto, puntosGanadorEmpate } = req.body;

    if (puntosResultadoExacto === undefined || puntosGanadorEmpate === undefined) {
      res.status(400).json({ message: 'puntosResultadoExacto y puntosGanadorEmpate son requeridos' });
      return;
    }

    const config = await adminService.updateConfig(puntosResultadoExacto, puntosGanadorEmpate);
    res.json(config);
  } catch {
    res.status(500).json({ message: 'Error al actualizar configuración' });
  }
}

export async function listAdmins(_req: Request, res: Response): Promise<void> {
  try {
    const admins = await adminService.listAdmins();
    res.json(admins);
  } catch {
    res.status(500).json({ message: 'Error al obtener administradores' });
  }
}

export async function createAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre?.trim() || !email?.trim() || !password) {
      res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    const admin = await authService.createUser(nombre, email, password, 'Admin');
    res.status(201).json(admin);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear administrador';
    const status = message.includes('registrado') ? 409 : 500;
    res.status(status).json({ message });
  }
}

export async function listUsers(_req: Request, res: Response): Promise<void> {
  try {
    const users = await adminService.listUsers();
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
}

export async function promoteUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = parseRouteParamId(req.params.id);

    if (Number.isNaN(userId)) {
      res.status(400).json({ message: 'ID de usuario inválido' });
      return;
    }

    const admin = await adminService.promoteUserToAdmin(userId);
    res.json(admin);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al promover usuario';
    const status = message.includes('no encontrado') || message.includes('ya es') ? 400 : 500;
    res.status(status).json({ message });
  }
}

export async function resetUserPassword(req: Request, res: Response): Promise<void> {
  try {
    const userId = parseRouteParamId(req.params.id);

    if (Number.isNaN(userId)) {
      res.status(400).json({ message: 'ID de usuario inválido' });
      return;
    }

    const { newPassword, generate } = req.body as { newPassword?: string; generate?: boolean };
    let password = newPassword?.trim();

    if (generate) {
      password = authService.generateTemporaryPassword();
    }

    if (!password) {
      res.status(400).json({ message: 'Indica una nueva contraseña o usa generate: true' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    const result = await authService.adminResetUserPassword(userId, password);
    res.json({
      ...result,
      temporaryPassword: generate ? password : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al restablecer contraseña';
    const status = message.includes('no encontrado') ? 404 : 400;
    res.status(status).json({ message });
  }
}
