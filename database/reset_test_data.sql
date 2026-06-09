-- Reset de datos de prueba: elimina Final de prueba, restablece partidos finalizados,
-- borra usuarios excepto admin y limpia puntos.
USE QuinielaMundial2026;
GO

BEGIN TRANSACTION;

DELETE FROM Predicciones
WHERE PartidoId IN (SELECT Id FROM Partidos WHERE Fase = 'Final');

DELETE FROM Partidos WHERE Fase = 'Final';

UPDATE Partidos
SET Estado = 'Pendiente',
    GolesLocal = NULL,
    GolesVisitante = NULL
WHERE Estado IN ('Finalizado', 'En Progreso');

UPDATE Predicciones SET PuntosGanados = 0;

DELETE FROM Usuarios WHERE Rol <> 'Admin';

UPDATE Usuarios SET PuntosTotales = 0 WHERE Rol = 'Admin';

COMMIT TRANSACTION;
GO
