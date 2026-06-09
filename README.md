# Quiniela Mundial 2026

Sistema full-stack de quiniela para el Mundial 2026 con roles de **Usuario** y **Administrador**.

## Stack tecnológico

| Capa | Tecnologías |
|------|-------------|
| Frontend | Vite, React 18, TypeScript, Tailwind CSS, Zustand, React Router |
| Backend | Node.js, Express, TypeScript, JWT, bcrypt |
| Base de datos | SQL Server (T-SQL) |

## Estructura del proyecto

```
Pre_Mundial/
├── database/
│   └── schema.sql          # Script de creación de BD
├── backend/
│   ├── src/
│   │   ├── config/         # Conexión SQL Server
│   │   ├── controllers/    # Lógica de endpoints
│   │   ├── middleware/     # JWT y control de roles
│   │   ├── routes/         # Rutas REST
│   │   ├── services/       # Acceso a datos
│   │   ├── scripts/        # Seed de admin
│   │   └── types/          # Tipos TypeScript
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/     # UI reutilizable
    │   ├── pages/          # Vistas por rol
    │   ├── services/       # Cliente API
    │   ├── store/          # Estado global (Zustand)
    │   └── types/
    └── package.json
```

## Requisitos previos

- Node.js 18+
- SQL Server 2019+ (o SQL Server Express)
- SQL Server Management Studio (SSMS) o Azure Data Studio

## 1. Base de datos

1. Abre SSMS y conéctate a tu instancia de SQL Server.
2. Ejecuta el script `database/schema.sql`.
3. Verifica que se creó la base `QuinielaMundial2026` con las tablas:
   - `Usuarios`, `Partidos`, `Predicciones`, `Configuracion`
   - Stored procedure `sp_CalcularPuntosPartido`

## 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # Edita con tus credenciales de SQL Server
npm run seed:admin     # Crea admin@quiniela.com / Admin123!
npm run dev            # http://localhost:3001
```

### Variables de entorno (`.env`)

```env
PORT=3001
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=TuPassword
DB_NAME=QuinielaMundial2026
JWT_SECRET=clave-secreta-segura
CORS_ORIGIN=http://localhost:5173
```

### API Endpoints

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/api/auth/register` | Público | Registro de usuario |
| POST | `/api/auth/login` | Público | Inicio de sesión |
| GET | `/api/auth/profile` | Auth | Perfil del usuario |
| GET | `/api/matches` | Auth | Listar partidos (filtros: grupo, fase) |
| POST | `/api/matches` | Admin | Crear partido |
| PUT | `/api/matches/:id/score` | Admin | Actualizar marcador y calcular puntos |
| GET | `/api/predictions/mine` | Auth | Mis predicciones |
| POST | `/api/predictions` | Auth | Guardar/actualizar predicción |
| GET | `/api/predictions/leaderboard` | Auth | Tabla de posiciones |
| GET | `/api/admin/dashboard` | Admin | Estadísticas del dashboard |

## 3. Frontend

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

## Roles y funcionalidades

### Usuario (User)
- **Quiniela**: Predicciones por partido con bloqueo automático al iniciar el partido
- **Leaderboard**: Ranking por puntos totales

### Administrador (Admin)
- **Dashboard**: KPIs, ranking, partidos más predichos, estado de partidos
- **Gestor de Marcadores**: Ingresar resultados reales (dispara cálculo de puntos)
- **Creador de Fases**: Añadir partidos de eliminatorias

## Sistema de puntaje

Configurable en la tabla `Configuracion`:

| Regla | Puntos por defecto |
|-------|-------------------|
| Resultado exacto | 3 pts |
| Ganador o empate acertado | 1 pt |
| Incorrecto | 0 pts |

El cálculo se ejecuta automáticamente vía `sp_CalcularPuntosPartido` al cerrar un partido.

## Credenciales de prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@quiniela.com | Admin123! |

Los usuarios regulares se registran desde la pantalla de registro.
