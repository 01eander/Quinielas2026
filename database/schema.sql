-- ============================================================
-- Quiniela Mundial 2026 - Script de creación de base de datos
-- SQL Server (T-SQL)
-- ============================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'QuinielaMundial2026')
BEGIN
    CREATE DATABASE QuinielaMundial2026;
END
GO

USE QuinielaMundial2026;
GO

-- ============================================================
-- Eliminar tablas en orden correcto (FK dependencies)
-- ============================================================
IF OBJECT_ID('dbo.sp_CalcularPuntosPartido', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_CalcularPuntosPartido;
IF OBJECT_ID('dbo.Predicciones', 'U') IS NOT NULL DROP TABLE dbo.Predicciones;
IF OBJECT_ID('dbo.Partidos', 'U') IS NOT NULL DROP TABLE dbo.Partidos;
IF OBJECT_ID('dbo.Usuarios', 'U') IS NOT NULL DROP TABLE dbo.Usuarios;
IF OBJECT_ID('dbo.Configuracion', 'U') IS NOT NULL DROP TABLE dbo.Configuracion;
GO

-- ============================================================
-- Tabla: Usuarios
-- ============================================================
CREATE TABLE dbo.Usuarios (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    Nombre          NVARCHAR(100)  NOT NULL,
    Email           NVARCHAR(255)  NOT NULL,
    Password        NVARCHAR(255)  NOT NULL,
    UsuarioLogin    NVARCHAR(50)   NULL,
    Rol             NVARCHAR(20)   NOT NULL DEFAULT 'User'
                    CONSTRAINT CK_Usuarios_Rol CHECK (Rol IN ('User', 'Admin')),
    PuntosTotales   INT            NOT NULL DEFAULT 0,
    FechaRegistro   DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    ResetTokenHash  NVARCHAR(64)   NULL,
    ResetTokenExpires DATETIME2    NULL,
    CONSTRAINT UQ_Usuarios_Email UNIQUE (Email)
);
GO

CREATE INDEX IX_Usuarios_PuntosTotales ON dbo.Usuarios (PuntosTotales DESC);
GO

CREATE UNIQUE INDEX UQ_Usuarios_UsuarioLogin ON dbo.Usuarios (UsuarioLogin) WHERE UsuarioLogin IS NOT NULL;
GO

-- ============================================================
-- Tabla: Partidos
-- ============================================================
CREATE TABLE dbo.Partidos (
    Id                  INT IDENTITY(1,1) PRIMARY KEY,
    EquipoLocal         NVARCHAR(100) NOT NULL,
    EquipoVisitante     NVARCHAR(100) NOT NULL,
    Grupo               NVARCHAR(30)  NOT NULL,
    Fase                NVARCHAR(50)  NOT NULL
                        CONSTRAINT CK_Partidos_Fase CHECK (
                            Fase IN (
                                'Fase de Grupos',
                                'Dieciseisavos',
                                'Octavos',
                                'Cuartos',
                                'Semifinal',
                                'Final'
                            )
                        ),
    FechaHora           DATETIME2     NOT NULL,
    EstadioCiudad       NVARCHAR(150) NOT NULL,
    GolesLocal          INT           NULL,
    GolesVisitante      INT           NULL,
    Estado              NVARCHAR(20)  NOT NULL DEFAULT 'Pendiente'
                        CONSTRAINT CK_Partidos_Estado CHECK (
                            Estado IN ('Pendiente', 'En Progreso', 'Finalizado')
                        )
);
GO

CREATE INDEX IX_Partidos_FechaHora ON dbo.Partidos (FechaHora);
CREATE INDEX IX_Partidos_Grupo ON dbo.Partidos (Grupo);
CREATE INDEX IX_Partidos_Fase ON dbo.Partidos (Fase);
CREATE INDEX IX_Partidos_Estado ON dbo.Partidos (Estado);
GO

-- ============================================================
-- Tabla: Predicciones
-- ============================================================
CREATE TABLE dbo.Predicciones (
    Id                  INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId           INT           NOT NULL,
    PartidoId           INT           NOT NULL,
    PrediccionLocal     INT           NOT NULL
                        CONSTRAINT CK_Predicciones_Local CHECK (PrediccionLocal >= 0),
    PrediccionVisitante INT           NOT NULL
                        CONSTRAINT CK_Predicciones_Visitante CHECK (PrediccionVisitante >= 0),
    PuntosGanados       INT           NOT NULL DEFAULT 0,
    FechaModificacion   DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Predicciones_Usuarios FOREIGN KEY (UsuarioId)
        REFERENCES dbo.Usuarios (Id) ON DELETE CASCADE,
    CONSTRAINT FK_Predicciones_Partidos FOREIGN KEY (PartidoId)
        REFERENCES dbo.Partidos (Id) ON DELETE CASCADE,
    CONSTRAINT UQ_Predicciones_Usuario_Partido UNIQUE (UsuarioId, PartidoId)
);
GO

CREATE INDEX IX_Predicciones_PartidoId ON dbo.Predicciones (PartidoId);
CREATE INDEX IX_Predicciones_UsuarioId ON dbo.Predicciones (UsuarioId);
GO

-- ============================================================
-- Tabla: Configuracion (sistema de puntaje)
-- ============================================================
CREATE TABLE dbo.Configuracion (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    PuntosResultadoExacto   INT NOT NULL DEFAULT 3,
    PuntosGanadorEmpate     INT NOT NULL DEFAULT 1,
    FechaActualizacion      DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- ============================================================
-- Datos iniciales
-- ============================================================

INSERT INTO dbo.Configuracion (PuntosResultadoExacto, PuntosGanadorEmpate)
VALUES (3, 1);

-- Usuario administrador: ejecutar `npm run seed:admin` en backend después de crear la BD
-- Credenciales por defecto: admin@quiniela.com / Admin123!

-- Partidos oficiales: ver database/seed_group_stage_2026.sql (72 partidos, fase de grupos)
-- Ejecutar seed_group_stage_2026.sql después de crear la BD
GO

-- ============================================================
-- Procedimiento: Calcular puntos de predicciones de un partido
-- ============================================================
CREATE PROCEDURE dbo.sp_CalcularPuntosPartido
    @PartidoId INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @GolesLocal INT, @GolesVisitante INT;
    DECLARE @PtsExacto INT, @PtsGanador INT;

    SELECT @GolesLocal = GolesLocal, @GolesVisitante = GolesVisitante
    FROM dbo.Partidos WHERE Id = @PartidoId;

    IF @GolesLocal IS NULL OR @GolesVisitante IS NULL
        RETURN;

    SELECT TOP 1
        @PtsExacto = PuntosResultadoExacto,
        @PtsGanador = PuntosGanadorEmpate
    FROM dbo.Configuracion
    ORDER BY Id DESC;

    UPDATE p
    SET PuntosGanados = CASE
        WHEN p.PrediccionLocal = @GolesLocal AND p.PrediccionVisitante = @GolesVisitante
            THEN @PtsExacto
        WHEN (CASE WHEN p.PrediccionLocal > p.PrediccionVisitante THEN 1
                   WHEN p.PrediccionLocal < p.PrediccionVisitante THEN -1 ELSE 0 END)
           = (CASE WHEN @GolesLocal > @GolesVisitante THEN 1
                   WHEN @GolesLocal < @GolesVisitante THEN -1 ELSE 0 END)
            THEN @PtsGanador
        ELSE 0
    END
    FROM dbo.Predicciones p
    WHERE p.PartidoId = @PartidoId;

    UPDATE u
    SET PuntosTotales = (
        SELECT ISNULL(SUM(pr.PuntosGanados), 0)
        FROM dbo.Predicciones pr
        WHERE pr.UsuarioId = u.Id
    )
    FROM dbo.Usuarios u
    WHERE u.Id IN (
        SELECT DISTINCT UsuarioId FROM dbo.Predicciones WHERE PartidoId = @PartidoId
    );
END
GO

PRINT 'Base de datos QuinielaMundial2026 creada exitosamente.';
GO
