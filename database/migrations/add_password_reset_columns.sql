-- Ejecutar en BD existente (QuinielaMundial2026)
USE QuinielaMundial2026;
GO

IF COL_LENGTH('dbo.Usuarios', 'ResetTokenHash') IS NULL
BEGIN
    ALTER TABLE dbo.Usuarios
        ADD ResetTokenHash NVARCHAR(64) NULL,
            ResetTokenExpires DATETIME2 NULL;
END
GO

PRINT 'Columnas de restablecimiento de contraseña listas.';
GO
