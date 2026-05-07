# Context_Proyect.md

## Estado actual del proyecto (hasta este chat)

### Enfoque acordado
- Arquitectura: **Hexagonal** (`domain`, `application`, `infrastructure`).
- Prioridad: implementación **simple y clara**, sin sobre-robustez innecesaria.
- Validación HTTP: **básica en middleware** (auth), no lógica de negocio en controller.
- Casos de uso: DTOs/tipos **cerca de cada use case** (sin archivo compartido de sesión).

---

## Auth implementado

### Registro
- Endpoint: `POST /api/auth/register`
- Flujo:
  1. Middleware valida campos básicos (`username`, `email`, `password`).
  2. `RegisterUserUseCase` valida reglas de negocio básicas.
  3. Hash de contraseña con `bcryptjs`.
  4. Guarda en Prisma con defaults:
     - `rol = PILOTO`
     - `rango = D`
     - `estado = ACTIVO`

### Login JWT + Refresh token
- Endpoint: `POST /api/auth/login`
- Flujo:
  1. Valida email/password.
  2. Verifica credenciales con bcrypt.
  3. Genera `accessToken` JWT.
  4. Genera `refreshToken` aleatorio.
  5. Guarda **hash SHA-256** del refresh token en BD.
  6. Devuelve al body:
     - `accessToken`
     - `tokenType`
     - `expiresIn`
     - `user` mínimo (`id`, `username`, `email`, `rol`, `rango`)
  7. Envía refresh token en cookie `HttpOnly`.

### Refresh de sesión
- Endpoint: `POST /api/auth/refresh`
- Toma refresh token de cookie (o body como fallback).
- Si es válido:
  - rota token (revoca el anterior y crea uno nuevo),
  - emite nuevo access token,
  - actualiza cookie.

### Logout
- Endpoint: `POST /api/auth/logout`
- Revoca refresh token actual y limpia cookie.

---

## Estructura de auth (resumen)

### Application
- `RegisterUserUseCase.ts`
- `LoginUserUseCase.ts`
- `RefreshSessionUseCase.ts`
- `LogoutUserUseCase.ts`
- `tokenUtils.ts`

### Domain
- `User.ts`
- `UserRepository.ts` (incluye `findById`)
- `RefreshTokenRepository.ts`

### Infrastructure
- `PrismaUserRepository.ts`
- `PrismaRefreshTokenRepository.ts`
- `AuthController.ts`
- `auth.routes.ts`
- middlewares:
  - `validateRegisterUserBody.ts`
  - `validateLoginUserBody.ts`
- DI:
  - `infrastructure/dependencies.ts`

---

## Cambios Prisma / BD

- Se agregó modelo `RefreshToken` en `prisma/schema.prisma`.
- Relación agregada en `User`: `refreshTokens`.
- Migración creada:
  - `prisma/migrations/20260502210924_add_refresh_tokens/migration.sql`

Tabla `refresh_tokens`:
- `id`
- `user_id`
- `token_hash` (unique)
- `expires_at`
- `revoked_at`
- `replaced_by_token_hash`
- `created_at`

---

## Configuración y variables de entorno

Requeridas para auth:
- `DATABASE_URL`
- `JWT_SECRET`

Opcionales con default:
- `ACCESS_TOKEN_EXPIRES_IN` (default: `15m`)
- `REFRESH_TOKEN_TTL_DAYS` (default: `7`, válido `1..30`)
- `CORS_ORIGIN` (para front; acepta múltiples separados por coma)

Cookie de refresh:
- `httpOnly: true`
- `sameSite: 'lax'`
- `secure: true` solo en producción
- `path: /api/auth`

---

## Ajustes técnicos importantes hechos

- `tsconfig.json`: `ignoreDeprecations` quedó en `"5.0"` para que compile.
- `main.ts` usa CORS con `credentials: true`.
- Manejo de errores del controller reforzado para no exponer errores internos.
- Se evitó respuesta de login con datos de perfil extensos (se dejó payload mínimo útil para front).

---

## Comandos recomendados (desde `api/`)

```bash
npm run prisma:generate
npx prisma migrate dev --name <nombre>
npm run build
npm start
```

Si algo falla por cliente Prisma desactualizado, regenerar y reiniciar:
```bash
npm run prisma:generate
npm run build
npm start
```

---

## Decisiones de estilo tomadas en este chat

- Mantener auth **simple** y legible.
- Evitar abstractions extra cuando no aportan.
- Evitar centralizar tipos de sesión en archivo aparte.
- Preferir claridad por use case aunque haya algo de repetición controlada.

---

## Estado funcional al cierre

- Register: ✅
- Login: ✅
- Refresh: ✅
- Logout: ✅
- Build TypeScript: ✅

---

## Actualización incremental (continuación del proyecto)

### Documentación API (Swagger/OpenAPI) refinada
- Se consolidó documentación modular en `api/src/infrastructure/http/docs/`:
  - `openapi.ts`
  - `paths/auth.paths.ts`
  - `schemas/auth.schemas.ts`
  - `schemas/common.schemas.ts`
  - `swagger.ts`
- Swagger quedó expuesto en:
  - `GET /api/docs`
- Se removió `GET /api/openapi.json` para simplificar.
- Se añadieron ejemplos de request/response, descripciones, `operationId`, tags y mejoras de UI Swagger:
  - `displayRequestDuration`
  - `filter`
  - `docExpansion: list`

### Ajuste de seguridad/contrato en Register
- `POST /api/auth/register` ahora devuelve payload mínimo:
  - `id`, `username`, `email`, `createdAt`
- Se actualizó schema OpenAPI de respuesta de register para reflejar ese cambio.

### Validación HTTP con Zod en endpoints Auth
- Se reemplazaron middlewares manuales de auth por validación genérica con Zod:
  - Nuevo middleware: `api/src/infrastructure/http/middlewares/validateBody.ts`
  - Schemas:
    - `api/src/infrastructure/http/schemas/auth/registerUserBodySchema.ts`
    - `api/src/infrastructure/http/schemas/auth/loginUserBodySchema.ts`
- Eliminados:
  - `validateRegisterUserBody.ts`
  - `validateLoginUserBody.ts`
- `auth.routes.ts` ahora usa `validateBody(...)`.

### Primer paso post-login implementado: módulo Profile
- Se implementó solo el paso 1 del flow acordado (uno por uno), dejando pendiente vehículos y siguientes módulos.
- Rutas nuevas:
  - `GET /api/profile/me` (protegida)
  - `PATCH /api/profile/me` (protegida)
  - `DELETE /api/profile/me` (protegida, desactiva cuenta)
  - `GET /api/profile/:userId` (protegida, perfil público)
- Middleware JWT requerido:
  - `api/src/infrastructure/http/middlewares/auth/requireAuth.ts`
  - Inyecta `req.auth` (`userId`, `email`, `rol`) usando tipos en:
    - `api/src/shared/http/AuthContext.ts`
    - `api/src/shared/types/express.d.ts`
- Capa profile agregada:
  - `domain/profile/ProfileRepository.ts`
  - `application/profile/*UseCase.ts`
  - `infrastructure/profile/PrismaProfileRepository.ts`
  - `infrastructure/http/controllers/ProfileController.ts`
  - `infrastructure/http/routes/profile.routes.ts`
  - `infrastructure/http/schemas/profile/updateMyProfileBodySchema.ts`
  - `infrastructure/http/schemas/common/userIdParamSchema.ts`
- Integración realizada en:
  - `infrastructure/dependencies.ts`
  - `main.ts` con `app.use('/api/profile', profileRoutes)`
- `validateBody.ts` evolucionó para soportar también:
  - `validateParams(...)`
  - `validateQuery(...)`

### Actualización incremental (módulo Vehículos)
- Se implementó el módulo `rf_vehiculos` siguiendo la misma línea hexagonal del proyecto:
  - `domain/vehicle/VehicleRepository.ts`
  - `application/vehicle/*UseCase.ts`
  - `infrastructure/vehicle/PrismaVehicleRepository.ts`
  - `infrastructure/http/controllers/VehicleController.ts`
  - `infrastructure/http/routes/vehicle.routes.ts`
  - `infrastructure/http/schemas/vehicle/*`
  - `infrastructure/http/schemas/common/vehicleIdParamSchema.ts`
- Integración realizada en:
  - `infrastructure/dependencies.ts`
  - `main.ts` con `app.use('/api/vehicles', vehicleRoutes)`

### Endpoints de Vehículos implementados (protegidos con JWT)
- `GET /api/vehicles` (listar mis vehículos)
- `POST /api/vehicles` (crear vehículo)
- `PATCH /api/vehicles/:vehicleId` (editar vehículo)
- `DELETE /api/vehicles/:vehicleId` (eliminar vehículo)
- `PATCH /api/vehicles/:vehicleId/activate` (marcar vehículo activo)

### Reglas de negocio aplicadas en Vehículos
- Máximo **3 vehículos** por usuario.
- Solo **1 vehículo activo** por usuario (al activar uno, los demás quedan inactivos).
- `placa` obligatoria para `AUTO` y `MOTO`.
- `placa` no aplica para `MONOPATIN_ELECTRICO`.
- Conflicto de placa única manejado con respuesta de negocio clara.

### Estado de avance actualizado
- Auth: ✅
- Profile: ✅
- Vehículos: ✅

### Pendiente para siguientes pasos (orden secuencial acordado)
- Ajuste pendiente de Profile público (según regla de negocio): incluir datos completos esperados al exponer perfil.
- Descubrimiento.
- Retos.
- Resultado del reto + actualización de rango.
- Notificaciones.
- Ampliación de OpenAPI para módulos nuevos.
