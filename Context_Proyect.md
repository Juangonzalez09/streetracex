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
