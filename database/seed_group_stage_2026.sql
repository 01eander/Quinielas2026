-- ============================================================
-- Mundial 2026 - Fase de Grupos (72 partidos oficiales FIFA)
-- Fuente: FIFA World Cup 2026 schedule (Jun 11-27, 2026)
-- ============================================================
USE QuinielaMundial2026;
GO

-- Eliminar predicciones y partidos de fase de grupos (datos incorrectos)
DELETE FROM dbo.Partidos WHERE Fase = N'Fase de Grupos';
GO

INSERT INTO dbo.Partidos (EquipoLocal, EquipoVisitante, Grupo, Fase, FechaHora, EstadioCiudad, Estado)
VALUES
-- Jornada 1
(N'México',              N'Sudáfrica',              N'A', N'Fase de Grupos', '2026-06-11 19:00:00', N'Estadio Ciudad de México, Ciudad de México',           N'Pendiente'),
(N'Corea del Sur',       N'Chequia',                N'A', N'Fase de Grupos', '2026-06-12 02:00:00', N'Estadio Guadalajara, Guadalajara',                     N'Pendiente'),
(N'Canadá',              N'Bosnia y Herzegovina',   N'B', N'Fase de Grupos', '2026-06-12 19:00:00', N'Toronto Stadium, Toronto',                             N'Pendiente'),
(N'Estados Unidos',      N'Paraguay',               N'D', N'Fase de Grupos', '2026-06-13 01:00:00', N'Los Angeles Stadium, Los Angeles',                     N'Pendiente'),
(N'Qatar',               N'Suiza',                  N'B', N'Fase de Grupos', '2026-06-13 19:00:00', N'San Francisco Bay Area Stadium, Santa Clara',          N'Pendiente'),
(N'Brasil',              N'Marruecos',              N'C', N'Fase de Grupos', '2026-06-13 22:00:00', N'New York/New Jersey Stadium, East Rutherford',         N'Pendiente'),
(N'Haití',               N'Escocia',                N'C', N'Fase de Grupos', '2026-06-14 01:00:00', N'Boston Stadium, Boston',                               N'Pendiente'),
(N'Australia',           N'Turquía',                N'D', N'Fase de Grupos', '2026-06-14 04:00:00', N'BC Place, Vancouver',                                  N'Pendiente'),
(N'Alemania',            N'Curazao',                N'E', N'Fase de Grupos', '2026-06-14 17:00:00', N'Houston Stadium, Houston',                             N'Pendiente'),
(N'Países Bajos',        N'Japón',                  N'F', N'Fase de Grupos', '2026-06-14 20:00:00', N'Dallas Stadium, Arlington',                            N'Pendiente'),
(N'Costa de Marfil',     N'Ecuador',                N'E', N'Fase de Grupos', '2026-06-14 23:00:00', N'Philadelphia Stadium, Philadelphia',                   N'Pendiente'),
(N'Suecia',              N'Túnez',                  N'F', N'Fase de Grupos', '2026-06-15 02:00:00', N'Estadio Monterrey, Monterrey',                         N'Pendiente'),
(N'España',              N'Cabo Verde',             N'H', N'Fase de Grupos', '2026-06-15 16:00:00', N'Atlanta Stadium, Atlanta',                             N'Pendiente'),
(N'Bélgica',             N'Egipto',                 N'G', N'Fase de Grupos', '2026-06-15 19:00:00', N'Seattle Stadium, Seattle',                             N'Pendiente'),
(N'Arabia Saudita',      N'Uruguay',                N'H', N'Fase de Grupos', '2026-06-15 22:00:00', N'Miami Stadium, Miami',                                 N'Pendiente'),
(N'Irán',                N'Nueva Zelanda',          N'G', N'Fase de Grupos', '2026-06-16 01:00:00', N'Los Angeles Stadium, Los Angeles',                     N'Pendiente'),
(N'Francia',             N'Senegal',                N'I', N'Fase de Grupos', '2026-06-16 19:00:00', N'New York/New Jersey Stadium, East Rutherford',         N'Pendiente'),
(N'Irak',                N'Noruega',                N'I', N'Fase de Grupos', '2026-06-16 22:00:00', N'Boston Stadium, Boston',                               N'Pendiente'),
(N'Argentina',           N'Argelia',                N'J', N'Fase de Grupos', '2026-06-17 01:00:00', N'Kansas City Stadium, Kansas City',                     N'Pendiente'),
(N'Austria',             N'Jordania',               N'J', N'Fase de Grupos', '2026-06-17 04:00:00', N'San Francisco Bay Area Stadium, Santa Clara',          N'Pendiente'),
(N'Portugal',            N'RD Congo',               N'K', N'Fase de Grupos', '2026-06-17 17:00:00', N'Houston Stadium, Houston',                             N'Pendiente'),
(N'Inglaterra',          N'Croacia',                N'L', N'Fase de Grupos', '2026-06-17 20:00:00', N'Dallas Stadium, Arlington',                            N'Pendiente'),
(N'Ghana',               N'Panamá',                 N'L', N'Fase de Grupos', '2026-06-17 23:00:00', N'Toronto Stadium, Toronto',                             N'Pendiente'),
(N'Uzbekistán',          N'Colombia',               N'K', N'Fase de Grupos', '2026-06-18 02:00:00', N'Estadio Ciudad de México, Ciudad de México',           N'Pendiente'),
-- Jornada 2
(N'Chequia',             N'Sudáfrica',              N'A', N'Fase de Grupos', '2026-06-18 16:00:00', N'Atlanta Stadium, Atlanta',                             N'Pendiente'),
(N'Suiza',               N'Bosnia y Herzegovina',   N'B', N'Fase de Grupos', '2026-06-18 19:00:00', N'Los Angeles Stadium, Los Angeles',                     N'Pendiente'),
(N'Canadá',              N'Qatar',                  N'B', N'Fase de Grupos', '2026-06-18 22:00:00', N'BC Place, Vancouver',                                  N'Pendiente'),
(N'México',              N'Corea del Sur',          N'A', N'Fase de Grupos', '2026-06-19 01:00:00', N'Estadio Guadalajara, Guadalajara',                     N'Pendiente'),
(N'Estados Unidos',      N'Australia',              N'D', N'Fase de Grupos', '2026-06-19 19:00:00', N'Seattle Stadium, Seattle',                             N'Pendiente'),
(N'Escocia',             N'Marruecos',              N'C', N'Fase de Grupos', '2026-06-19 22:00:00', N'Boston Stadium, Boston',                               N'Pendiente'),
(N'Brasil',              N'Haití',                  N'C', N'Fase de Grupos', '2026-06-20 00:30:00', N'Philadelphia Stadium, Philadelphia',                   N'Pendiente'),
(N'Turquía',             N'Paraguay',               N'D', N'Fase de Grupos', '2026-06-20 03:00:00', N'San Francisco Bay Area Stadium, Santa Clara',          N'Pendiente'),
(N'Países Bajos',        N'Suecia',                 N'F', N'Fase de Grupos', '2026-06-20 17:00:00', N'Houston Stadium, Houston',                             N'Pendiente'),
(N'Alemania',            N'Costa de Marfil',        N'E', N'Fase de Grupos', '2026-06-20 20:00:00', N'Toronto Stadium, Toronto',                             N'Pendiente'),
(N'Ecuador',             N'Curazao',                N'E', N'Fase de Grupos', '2026-06-21 00:00:00', N'Kansas City Stadium, Kansas City',                     N'Pendiente'),
(N'Túnez',               N'Japón',                  N'F', N'Fase de Grupos', '2026-06-21 04:00:00', N'Estadio Monterrey, Monterrey',                         N'Pendiente'),
(N'España',              N'Arabia Saudita',         N'H', N'Fase de Grupos', '2026-06-21 16:00:00', N'Atlanta Stadium, Atlanta',                             N'Pendiente'),
(N'Bélgica',             N'Irán',                   N'G', N'Fase de Grupos', '2026-06-21 19:00:00', N'Los Angeles Stadium, Los Angeles',                     N'Pendiente'),
(N'Uruguay',             N'Cabo Verde',             N'H', N'Fase de Grupos', '2026-06-21 22:00:00', N'Miami Stadium, Miami',                                 N'Pendiente'),
(N'Nueva Zelanda',       N'Egipto',                 N'G', N'Fase de Grupos', '2026-06-22 01:00:00', N'BC Place, Vancouver',                                  N'Pendiente'),
(N'Argentina',           N'Austria',                N'J', N'Fase de Grupos', '2026-06-22 17:00:00', N'Dallas Stadium, Arlington',                            N'Pendiente'),
(N'Francia',             N'Irak',                   N'I', N'Fase de Grupos', '2026-06-22 21:00:00', N'Philadelphia Stadium, Philadelphia',                   N'Pendiente'),
(N'Noruega',             N'Senegal',                N'I', N'Fase de Grupos', '2026-06-23 00:00:00', N'New York/New Jersey Stadium, East Rutherford',         N'Pendiente'),
(N'Jordania',            N'Argelia',                N'J', N'Fase de Grupos', '2026-06-23 03:00:00', N'San Francisco Bay Area Stadium, Santa Clara',          N'Pendiente'),
(N'Portugal',            N'Uzbekistán',             N'K', N'Fase de Grupos', '2026-06-23 17:00:00', N'Houston Stadium, Houston',                             N'Pendiente'),
(N'Inglaterra',          N'Ghana',                  N'L', N'Fase de Grupos', '2026-06-23 20:00:00', N'Boston Stadium, Boston',                               N'Pendiente'),
(N'Panamá',              N'Croacia',                N'L', N'Fase de Grupos', '2026-06-23 23:00:00', N'Toronto Stadium, Toronto',                             N'Pendiente'),
(N'Colombia',            N'RD Congo',               N'K', N'Fase de Grupos', '2026-06-24 02:00:00', N'Estadio Guadalajara, Guadalajara',                     N'Pendiente'),
-- Jornada 3
(N'Suiza',               N'Canadá',                 N'B', N'Fase de Grupos', '2026-06-24 19:00:00', N'BC Place, Vancouver',                                  N'Pendiente'),
(N'Bosnia y Herzegovina', N'Qatar',                 N'B', N'Fase de Grupos', '2026-06-24 19:00:00', N'Seattle Stadium, Seattle',                             N'Pendiente'),
(N'Escocia',             N'Brasil',                 N'C', N'Fase de Grupos', '2026-06-24 22:00:00', N'Miami Stadium, Miami',                                 N'Pendiente'),
(N'Marruecos',           N'Haití',                  N'C', N'Fase de Grupos', '2026-06-24 22:00:00', N'Atlanta Stadium, Atlanta',                             N'Pendiente'),
(N'Chequia',             N'México',                 N'A', N'Fase de Grupos', '2026-06-25 01:00:00', N'Estadio Ciudad de México, Ciudad de México',           N'Pendiente'),
(N'Sudáfrica',           N'Corea del Sur',          N'A', N'Fase de Grupos', '2026-06-25 01:00:00', N'Estadio Monterrey, Monterrey',                         N'Pendiente'),
(N'Curazao',             N'Costa de Marfil',        N'E', N'Fase de Grupos', '2026-06-25 20:00:00', N'Philadelphia Stadium, Philadelphia',                   N'Pendiente'),
(N'Ecuador',             N'Alemania',               N'E', N'Fase de Grupos', '2026-06-25 20:00:00', N'New York/New Jersey Stadium, East Rutherford',         N'Pendiente'),
(N'Japón',               N'Suecia',                 N'F', N'Fase de Grupos', '2026-06-25 23:00:00', N'Dallas Stadium, Arlington',                            N'Pendiente'),
(N'Túnez',               N'Países Bajos',           N'F', N'Fase de Grupos', '2026-06-25 23:00:00', N'Kansas City Stadium, Kansas City',                     N'Pendiente'),
(N'Turquía',             N'Estados Unidos',         N'D', N'Fase de Grupos', '2026-06-26 02:00:00', N'Los Angeles Stadium, Los Angeles',                     N'Pendiente'),
(N'Paraguay',            N'Australia',              N'D', N'Fase de Grupos', '2026-06-26 02:00:00', N'San Francisco Bay Area Stadium, Santa Clara',          N'Pendiente'),
(N'Noruega',             N'Francia',                N'I', N'Fase de Grupos', '2026-06-26 19:00:00', N'Boston Stadium, Boston',                               N'Pendiente'),
(N'Senegal',             N'Irak',                   N'I', N'Fase de Grupos', '2026-06-26 19:00:00', N'Toronto Stadium, Toronto',                             N'Pendiente'),
(N'Cabo Verde',          N'Arabia Saudita',         N'H', N'Fase de Grupos', '2026-06-27 00:00:00', N'Houston Stadium, Houston',                             N'Pendiente'),
(N'Uruguay',             N'España',                 N'H', N'Fase de Grupos', '2026-06-27 00:00:00', N'Estadio Guadalajara, Guadalajara',                     N'Pendiente'),
(N'Egipto',              N'Irán',                   N'G', N'Fase de Grupos', '2026-06-27 03:00:00', N'Seattle Stadium, Seattle',                             N'Pendiente'),
(N'Nueva Zelanda',       N'Bélgica',                N'G', N'Fase de Grupos', '2026-06-27 03:00:00', N'BC Place, Vancouver',                                  N'Pendiente'),
(N'Panamá',              N'Inglaterra',             N'L', N'Fase de Grupos', '2026-06-27 21:00:00', N'New York/New Jersey Stadium, East Rutherford',         N'Pendiente'),
(N'Croacia',             N'Ghana',                  N'L', N'Fase de Grupos', '2026-06-27 21:00:00', N'Philadelphia Stadium, Philadelphia',                   N'Pendiente'),
(N'Colombia',            N'Portugal',               N'K', N'Fase de Grupos', '2026-06-27 23:30:00', N'Miami Stadium, Miami',                                 N'Pendiente'),
(N'RD Congo',            N'Uzbekistán',             N'K', N'Fase de Grupos', '2026-06-27 23:30:00', N'Atlanta Stadium, Atlanta',                             N'Pendiente'),
(N'Argelia',             N'Austria',                N'J', N'Fase de Grupos', '2026-06-28 02:00:00', N'Kansas City Stadium, Kansas City',                     N'Pendiente'),
(N'Jordania',            N'Argentina',              N'J', N'Fase de Grupos', '2026-06-28 02:00:00', N'Dallas Stadium, Arlington',                            N'Pendiente');
GO

PRINT CONCAT('Partidos de fase de grupos insertados: ', @@ROWCOUNT);
GO
