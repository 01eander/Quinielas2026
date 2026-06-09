-- ============================================================
-- Quiniela Mundial 2026 - Script de creación de base de datos
-- PostgreSQL (PL/pgSQL)
-- ============================================================

-- Eliminar tablas en orden correcto (FK dependencies)
DROP PROCEDURE IF EXISTS sp_CalcularPuntosPartido;
DROP TABLE IF EXISTS Predicciones;
DROP TABLE IF EXISTS Partidos;
DROP TABLE IF EXISTS Usuarios;
DROP TABLE IF EXISTS Configuracion;

-- ============================================================
-- Tabla: Usuarios
-- ============================================================
CREATE TABLE Usuarios (
    Id              SERIAL PRIMARY KEY,
    Nombre          VARCHAR(100)  NOT NULL,
    Email           VARCHAR(255)  NOT NULL,
    Password        VARCHAR(255)  NOT NULL,
    UsuarioLogin    VARCHAR(50)   NULL,
    Rol             VARCHAR(20)   NOT NULL DEFAULT 'User'
                    CONSTRAINT CK_Usuarios_Rol CHECK (Rol IN ('User', 'Admin')),
    PuntosTotales   INT            NOT NULL DEFAULT 0,
    FechaRegistro   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ResetTokenHash  VARCHAR(64)   NULL,
    ResetTokenExpires TIMESTAMP    NULL,
    CONSTRAINT UQ_Usuarios_Email UNIQUE (Email)
);

CREATE INDEX IX_Usuarios_PuntosTotales ON Usuarios (PuntosTotales DESC);
CREATE UNIQUE INDEX UQ_Usuarios_UsuarioLogin ON Usuarios (UsuarioLogin) WHERE UsuarioLogin IS NOT NULL;

-- ============================================================
-- Tabla: Partidos
-- ============================================================
CREATE TABLE Partidos (
    Id                  SERIAL PRIMARY KEY,
    EquipoLocal         VARCHAR(100) NOT NULL,
    EquipoVisitante     VARCHAR(100) NOT NULL,
    Grupo               VARCHAR(30)  NOT NULL,
    Fase                VARCHAR(50)  NOT NULL
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
    FechaHora           TIMESTAMP     NOT NULL,
    EstadioCiudad       VARCHAR(150) NOT NULL,
    GolesLocal          INT           NULL,
    GolesVisitante      INT           NULL,
    Estado              VARCHAR(20)  NOT NULL DEFAULT 'Pendiente'
                        CONSTRAINT CK_Partidos_Estado CHECK (
                            Estado IN ('Pendiente', 'En Progreso', 'Finalizado')
                        )
);

CREATE INDEX IX_Partidos_FechaHora ON Partidos (FechaHora);
CREATE INDEX IX_Partidos_Grupo ON Partidos (Grupo);
CREATE INDEX IX_Partidos_Fase ON Partidos (Fase);
CREATE INDEX IX_Partidos_Estado ON Partidos (Estado);

-- ============================================================
-- Tabla: Predicciones
-- ============================================================
CREATE TABLE Predicciones (
    Id                  SERIAL PRIMARY KEY,
    UsuarioId           INT           NOT NULL,
    PartidoId           INT           NOT NULL,
    PrediccionLocal     INT           NOT NULL
                        CONSTRAINT CK_Predicciones_Local CHECK (PrediccionLocal >= 0),
    PrediccionVisitante INT           NOT NULL
                        CONSTRAINT CK_Predicciones_Visitante CHECK (PrediccionVisitante >= 0),
    PuntosGanados       INT           NOT NULL DEFAULT 0,
    FechaModificacion   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Predicciones_Usuarios FOREIGN KEY (UsuarioId)
        REFERENCES Usuarios (Id) ON DELETE CASCADE,
    CONSTRAINT FK_Predicciones_Partidos FOREIGN KEY (PartidoId)
        REFERENCES Partidos (Id) ON DELETE CASCADE,
    CONSTRAINT UQ_Predicciones_Usuario_Partido UNIQUE (UsuarioId, PartidoId)
);

CREATE INDEX IX_Predicciones_PartidoId ON Predicciones (PartidoId);
CREATE INDEX IX_Predicciones_UsuarioId ON Predicciones (UsuarioId);

-- ============================================================
-- Tabla: Configuracion (sistema de puntaje)
-- ============================================================
CREATE TABLE Configuracion (
    Id                      SERIAL PRIMARY KEY,
    PuntosResultadoExacto   INT NOT NULL DEFAULT 3,
    PuntosGanadorEmpate     INT NOT NULL DEFAULT 1,
    FechaActualizacion      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Datos iniciales
-- ============================================================
INSERT INTO Configuracion (PuntosResultadoExacto, PuntosGanadorEmpate)
VALUES (3, 1);

-- ============================================================
-- Procedimiento: Calcular puntos de predicciones de un partido
-- ============================================================
CREATE OR REPLACE PROCEDURE sp_CalcularPuntosPartido(p_PartidoId INT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_GolesLocal INT;
    v_GolesVisitante INT;
    v_PtsExacto INT;
    v_PtsGanador INT;
BEGIN
    -- Obtener goles del partido
    SELECT GolesLocal, GolesVisitante INTO v_GolesLocal, v_GolesVisitante
    FROM Partidos WHERE Id = p_PartidoId;

    -- Si no ha finalizado o no tiene goles cargados, no hacer nada
    IF v_GolesLocal IS NULL OR v_GolesVisitante IS NULL THEN
        RETURN;
    END IF;

    -- Obtener configuración de puntaje más reciente
    SELECT PuntosResultadoExacto, PuntosGanadorEmpate INTO v_PtsExacto, v_PtsGanador
    FROM Configuracion
    ORDER BY Id DESC
    LIMIT 1;

    -- Actualizar puntos ganados para cada predicción de este partido
    UPDATE Predicciones p
    SET PuntosGanados = CASE
        WHEN p.PrediccionLocal = v_GolesLocal AND p.PrediccionVisitante = v_GolesVisitante
            THEN v_PtsExacto
        WHEN (CASE WHEN p.PrediccionLocal > p.PrediccionVisitante THEN 1
                   WHEN p.PrediccionLocal < p.PrediccionVisitante THEN -1 ELSE 0 END)
           = (CASE WHEN v_GolesLocal > v_GolesVisitante THEN 1
                   WHEN v_GolesLocal < v_GolesVisitante THEN -1 ELSE 0 END)
            THEN v_PtsGanador
        ELSE 0
    END
    WHERE p.PartidoId = p_PartidoId;

    -- Recalcular puntos totales de los usuarios que predijeron este partido
    UPDATE Usuarios
    SET PuntosTotales = COALESCE((
        SELECT SUM(pr.PuntosGanados)
        FROM Predicciones pr
        WHERE pr.UsuarioId = Usuarios.Id
    ), 0)
    WHERE Id IN (
        SELECT DISTINCT UsuarioId 
        FROM Predicciones 
        WHERE PartidoId = p_PartidoId
    );
END;
$$;
