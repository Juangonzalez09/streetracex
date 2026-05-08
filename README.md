# StreetRaceX

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-22%2B-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.6.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Plataforma digital para conectar pilotos de calle, retarse y competir en diferentes modalidades. Los pilotos ascienden en un sistema de rangos competitivo basado en victorias consecutivas.

---

## Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Cómo Correr el Proyecto](#cómo-correr-el-proyecto)
- [Variables de Entorno](#variables-de-entorno)
- [Scripts Disponibles](#scripts-disponibles)
- [Módulos Implementados](#módulos-implementados)
- [Próximas Etapas](#próximas-etapas)

---

## Características

- **Emparejamiento Inteligente** — conecta pilotos del mismo rango y tipo de vehículo
- **Sistema de Retos** — cuarto de milla, vueltas, derrape con flujo completo (enviar → aceptar → iniciar → resultado)
- **Doble Confirmación** — ambos pilotos reportan el ganador; si coinciden se auto-completa
- **Resolución por Admin** — el administrador resuelve disputas
- **Evolución por Rangos** — D → C → B → A → S con 2 victorias consecutivas
- **Notificaciones** — eventos internos en cada acción del flujo de retos
- **JWT + Refresh Token** — sesiones seguras con rotación de tokens y cookie HttpOnly
- **Documentación Swagger** — disponible en `/api/docs`

---

## Arquitectura

El backend sigue **Arquitectura Hexagonal** (Ports & Adapters):

```
api/src/
├── domain/              # Entidades e interfaces (sin dependencias externas)
│   ├── auth/
│   ├── profile/
│   ├── vehicle/
│   ├── matchmaking/
│   ├── challenge/
│   └── notification/
├── application/         # Casos de uso (orquestación pura del dominio)
│   ├── auth/
│   ├── profile/
│   ├── vehicle/
│   ├── matchmaking/
│   └── challenge/
└── infrastructure/      # Adaptadores (Prisma, Express, HTTP)
    ├── auth/
    ├── profile/
    ├── vehicle/
    ├── matchmaking/
    ├── challenge/
    ├── notification/
    ├── http/
    │   ├── controllers/
    │   ├── routes/
    │   ├── middlewares/
    │   ├── schemas/        # Validación Zod por endpoint
    │   └── docs/           # OpenAPI modular (paths/ + schemas/)
    └── dependencies.ts     # Composition root — inyección de dependencias
```

---

## Requisitos Previos

- **Node.js 22+**
- **npm 10+**
- **PostgreSQL 13+**

```bash
node --version   # v22.x.x o superior
psql --version   # 13.x o superior
```

---

## Cómo Correr el Proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/streetracex.git
cd streetracex
```

### 2. Instalar dependencias

```bash
cd api
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `api/.env` con tus credenciales (ver sección [Variables de Entorno](#variables-de-entorno)).

> Si la base de datos no existe, créala primero:
> ```sql
> CREATE DATABASE streetracex;
> ```

### 4. Generar el cliente Prisma

```bash
npm run prisma:generate
```

### 5. Aplicar migraciones

```bash
npm run prisma:migrate:dev
```

Esto crea todas las tablas: `users`, `refresh_tokens`, `matchmaking_profiles`, `vehicles`, `challenges`, `notifications`, etc.

### 6. Levantar el servidor

```bash
npm start          # producción (requiere build previo)
npm run dev        # desarrollo con hot reload
```

Salida esperada:
```
->>>>>> 🏎️ Street Race X encendido!
->>>>>> Modo: development
->>>>>> Puerto: 3000
```

### 7. Verificar la documentación

Abre en el navegador:
```
http://localhost:3000/api/docs
```

---

## Variables de Entorno

| Variable | Requerida | Default | Descripción |
|---|---|---|---|
| `DATABASE_URL` | Sí | — | URL de conexión PostgreSQL |
| `JWT_SECRET` | Sí | — | Secreto para firmar JWT |
| `PORT` | No | `3000` | Puerto del servidor |
| `ACCESS_TOKEN_EXPIRES_IN` | No | `15m` | Duración del access token |
| `REFRESH_TOKEN_TTL_DAYS` | No | `7` | Duración del refresh token (1-30) |
| `CORS_ORIGIN` | No | `*` | Origen(es) permitidos (separados por coma) |
| `API_URL` | No | `http://localhost:3000` | URL base para Swagger en producción |

Ejemplo de `api/.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/streetracex
JWT_SECRET=un_secreto_largo_y_muy_seguro_aqui
PORT=3000
```

---

## Scripts Disponibles

Todos desde `api/`:

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor en modo desarrollo con hot reload |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta el build compilado |
| `npm run prisma:generate` | Genera el cliente Prisma desde el schema |
| `npm run prisma:migrate:dev` | Crea y aplica una migración en desarrollo |
| `npm run prisma:migrate:deploy` | Aplica migraciones pendientes en producción |
| `npm run prisma:studio` | Explorador visual de la base de datos |

---

## Módulos Implementados

### Auth — `/api/auth`
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/register` | Registro de nuevo piloto |
| POST | `/login` | Login con JWT + cookie de refresh |
| POST | `/refresh` | Rotar refresh token y emitir nuevo access token |
| POST | `/logout` | Revocar refresh token y limpiar cookie |

### Profile — `/api/profile`
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/me` | Ver mi perfil completo con estadísticas y vehículos |
| PATCH | `/me` | Actualizar username, foto y zona |
| DELETE | `/me` | Desactivar cuenta (soft delete) |
| GET | `/:userId` | Ver perfil público de otro piloto |

### Vehicles — `/api/vehicles`
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Listar mis vehículos |
| POST | `/` | Registrar vehículo (máx. 3) |
| PATCH | `/:vehicleId` | Editar vehículo |
| DELETE | `/:vehicleId` | Eliminar vehículo |
| PATCH | `/:vehicleId/activate` | Marcar como vehículo activo |

### Matchmaking — `/api/matchmaking`
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Listar pilotos del mismo rango y tipo de vehículo (paginado) |

### Challenges — `/api/challenges`
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/` | Piloto | Enviar reto (con `pistaId` opcional) |
| GET | `/` | Piloto | Listar mis retos (filtros: tipo, estado) |
| PATCH | `/:id/accept` | Piloto (retado) | Aceptar reto recibido |
| PATCH | `/:id/reject` | Piloto (retado) | Rechazar reto recibido |
| PATCH | `/:id/cancel` | Piloto | Cancelar reto (PENDIENTE o ACEPTADO) |
| PATCH | `/:id/start` | Piloto (retador) | Iniciar reto → EN_CURSO |
| PATCH | `/:id/result` | Piloto | Reportar ganador (doble confirmación) |
| PATCH | `/:id/admin-resolve` | Admin | Resolver disputa y forzar resultado |

### Tracks — `/api/tracks`
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/` | Piloto | Listar pistas activas (filtro: tipoCarrera, soloActivas) |
| GET | `/:trackId` | Piloto | Ver detalle de una pista |
| POST | `/` | Admin | Crear nueva pista |
| PATCH | `/:trackId` | Admin | Actualizar datos de una pista |
| PATCH | `/:trackId/deactivate` | Admin | Desactivar pista |

### Notifications — `/api/notifications`
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/` | Piloto | Listar mis notificaciones (filtro: soloNoLeidas) |
| PATCH | `/read-all` | Piloto | Marcar todas como leídas |
| PATCH | `/:id/read` | Piloto | Marcar una notificación como leída |

---

## Próximas Etapas

- [x] Arquitectura hexagonal (Domain → Application → Infrastructure)
- [x] Base de datos con Prisma + PostgreSQL
- [x] Auth completo (registro, login, refresh, logout)
- [x] Gestión de perfil y perfil público
- [x] Gestión de vehículos con reglas de negocio
- [x] Matchmaking por rango y tipo de vehículo
- [x] Sistema de retos completo con flujo de estados
- [x] Actualización de estadísticas y ascenso de rango
- [x] Pistas de carrera con gestión por administrador
- [x] Notificaciones internas + endpoints HTTP
- [x] Documentación Swagger / OpenAPI modular
- [ ] WebSockets con Socket.io (eventos en tiempo real)
- [ ] Frontend web (React / Next.js)
- [ ] Tests unitarios e integración