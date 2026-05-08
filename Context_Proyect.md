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
 - Matchmaking: ✅

### Pendiente para siguientes pasos (orden secuencial acordado)
- Ajuste pendiente de Profile público (según regla de negocio): incluir datos completos esperados al exponer perfil.
- Retos (challenges) y su flujo.
- Resultado del reto + actualización de rango.
- Notificaciones.
- Ampliación de OpenAPI para módulos nuevos.
- Pruebas manuales del flujo completo en un ambiente corriendo.

---

## Actualización incremental (módulo Matchmaking)
- Se renombró el concepto de “Discovery” a **Matchmaking** (acuerdo de nombres).
- Se implementó el módulo de emparejamiento siguiendo la arquitectura hexagonal:
  - `domain/matchmaking/MatchmakingRepository.ts`
  - `application/matchmaking/ListMatchmakingPilotsUseCase.ts`
  - `infrastructure/matchmaking/PrismaMatchmakingRepository.ts`
  - `infrastructure/http/controllers/MatchmakingController.ts`
  - `infrastructure/http/routes/matchmaking.routes.ts`
  - `infrastructure/http/schemas/matchmaking/*`
- Ruta protegida:
  - `GET /api/matchmaking` (query con paginación y filtros por zona)
- Validación HTTP con Zod:
  - `listMatchmakingQuerySchema.ts` con `page`, `limit` (max 50) y filtros `zonaLocalidad`, `zonaCiudad`, `zonaEstado`, `zonaPais`.
- Comportamiento de matchmaking:
  - Filtra usuarios **PILOTO** y **ACTIVO**.
  - Misma `rango` que el usuario logueado.
  - Debe tener vehículo **activo** y se empareja por **tipo de vehículo activo**.
  - Respeta `matchmakingProfile.discoverable = true`.
  - Soporta paginación (page/limit) y devuelve total y páginas.
- Integración:
  - Se registró el controller y use case en `infrastructure/dependencies.ts`.
  - Se agregó `app.use('/api/matchmaking', matchmakingRoutes)` en `main.ts`.
- Documentación OpenAPI:
  - Se añadieron schemas y paths correspondientes para `GET /api/matchmaking`.

---

## Cambios Prisma / BD (Matchmaking)
- Se creó modelo `MatchmakingProfile` en `prisma/schema.prisma`.
- Se relacionó con `User` (uno a uno, `user_id` unique).
- Migración creada:
  - `prisma/migrations/20260507193000_add_matchmaking_profiles/migration.sql`
- Ajuste en registro de usuarios:
  - Al registrar, se crea `matchmakingProfile` por defecto (`discoverable: true`).

---

## Problemas detectados y correcciones aplicadas
- Error de TypeScript en repositorio de matchmaking:
  - Se corrigieron tipos y mapeo de resultados de Prisma con tipado explícito.
- Prisma no encontraba tabla de matchmaking:
  - Se corrigió agregando el schema y migración correspondiente.
- Windows EPERM en Prisma:
  - Se solucionó cerrando procesos `node.exe` que mantenían el engine bloqueado y regenerando Prisma client.

---

## Archivo de pruebas manuales (nuevo)
- Se creó `TESTING_STEP_BY_STEP.md` en la raíz del proyecto.
- Incluye el paso a paso para probar todos los endpoints:
  - Auth (register/login/refresh/logout)
  - Profile (me/public/update/deactivate)
  - Vehicles (create/list/update/activate/delete)
  - Matchmaking (list con filtros)

---

## Paso a paso super detallado de lo que falta (siguientes pasos)
1. **Ajuste de Profile público (revisar regla de negocio)**
   - Revisar qué campos exactos se deben exponer en `GET /api/profile/:userId`.
   - Confirmar si debe incluir:
     - estadísticas (retos ganados/perdidos)
     - vehículos (ordenar activo primero)
     - rango actual y estado
   - Ajustar use case y repositorio si hace falta.
   - Actualizar OpenAPI y validar con Zod si hay cambios en el output.

2. **Retos (Challenges) - flujo completo**
   - Revisar el schema actual de Prisma para `Challenge` (o definirlo si falta).
   - Definir estados del reto (ej: PENDIENTE, ACEPTADO, RECHAZADO, CANCELADO, FINALIZADO).
   - Crear:
     - `domain/challenge/ChallengeRepository.ts`
     - `application/challenge/*UseCase.ts` (crear reto, aceptar, rechazar, cancelar, finalizar)
     - `infrastructure/challenge/PrismaChallengeRepository.ts`
     - `infrastructure/http/controllers/ChallengeController.ts`
     - `infrastructure/http/routes/challenge.routes.ts`
     - `infrastructure/http/schemas/challenge/*` con Zod
   - Reglas mínimas:
     - Solo entre pilotos de mismo rango y tipo de vehículo.
     - Evitar duplicados activos entre los mismos usuarios.
     - Solo dueño puede cancelar; solo receptor puede aceptar/rechazar.
   - Conectar en `dependencies.ts` y `main.ts`.
   - Documentar en OpenAPI.

3. **Resultado del reto y actualización de rango**
   - Definir la lógica de resultado (ganador/perdedor).
   - Actualizar estadísticas del perfil.
   - Actualizar `rango` si aplica (reglas del negocio).
   - Documentar y exponer endpoint si corresponde.

4. **Notificaciones**
   - Definir tipo de notificaciones (reto recibido, aceptado, rechazado, finalizado).
   - Implementar entidad y endpoints básicos (listar, marcar leídas).
   - Mantener la misma arquitectura hexagonal.

5. **Pruebas manuales completas**
   - Ejecutar el archivo `TESTING_STEP_BY_STEP.md` de inicio a fin.
   - Confirmar que matchmaking retorna pilotos cuando:
     - hay al menos 2 usuarios con mismo rango
     - ambos tienen vehículo activo del mismo tipo
   - Verificar que refresh token rota y logout invalida.

---

## Recomendaciones y reglas de implementación (muy importante)
- **Arquitectura hexagonal estricta**:
  - `domain` define contratos (interfaces) y entidades.
  - `application` contiene la lógica (use cases).
  - `infrastructure` implementa persistencia y HTTP.
  - Nada de lógica de negocio en controllers.
- **Código simple y entendible**:
  - No sobre-ingeniería, evitar abstracciones innecesarias.
  - Claridad primero, aunque haya repetición controlada.
- **Validación con Zod**:
  - Usar `validateBody`, `validateParams`, `validateQuery`.
  - Schemas por endpoint en `infrastructure/http/schemas`.
- **Prisma siempre primero**:
  - Si se crea funcionalidad nueva, primero crear/ajustar schema de Prisma,
    luego migración, luego `prisma generate`.
- **Errores explícitos y mensajes claros**:
  - No exponer errores internos en responses.
  - Manejar errores de negocio con mensajes definidos.
- **Consistencia de rutas y DI**:
  - Registrar nuevos controllers en `dependencies.ts`.
  - Agregar rutas en `main.ts`.
- **Documentación OpenAPI siempre actualizada**:
  - Agregar schemas y paths para cualquier endpoint nuevo.
  - Mantener ejemplos de request/response.
