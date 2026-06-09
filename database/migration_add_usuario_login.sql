-- Agregar columna de login Silliker a Usuarios
USE QuinielaMundial2026;
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.Usuarios') AND name = 'UsuarioLogin'
)
BEGIN
    ALTER TABLE dbo.Usuarios
    ADD UsuarioLogin NVARCHAR(50) NULL;

    CREATE UNIQUE INDEX UQ_Usuarios_UsuarioLogin
        ON dbo.Usuarios (UsuarioLogin)
        WHERE UsuarioLogin IS NOT NULL;
END
GO
