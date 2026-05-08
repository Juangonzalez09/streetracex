# TESTING_STEP_BY_STEP — StreetRaceX API

> Usa Postman, Thunder Client o cualquier cliente HTTP.  
> **Base URL local:** `http://localhost:3000`  
> **Swagger UI:** `http://localhost:3000/api/docs`

---

## Prerequisitos

```bash
# Desde api/
npm install
npx prisma migrate dev --name add_result_reports_to_challenges
npm run prisma:generate
npm run build
npm start
```

`.env` mínimo en `api/`:
```
DATABASE_URL=postgresql://usuario:password@localhost:5432/streetracex
JWT_SECRET=mi_secreto_super_seguro
```

---

## Variables a guardar durante las pruebas

| Variable       | Cómo obtenerla                          |
|----------------|-----------------------------------------|
| `tokenA`       | Login Piloto A → `data.accessToken`     |
| `tokenB`       | Login Piloto B → `data.accessToken`     |
| `tokenAdmin`   | Login Admin → `data.accessToken`        |
| `userIdA`      | Register Piloto A → `data.id`           |
| `userIdB`      | Register Piloto B → `data.id`           |
| `vehicleIdA`   | Crear vehículo Piloto A → `data.id`     |
| `vehicleIdB`   | Crear vehículo Piloto B → `data.id`     |
| `challengeId`  | Enviar reto → `data.id`                 |

---

## MÓDULO 0 — Servidor y Docs

### 0.1 Verificar que el servidor está corriendo
```
GET http://localhost:3000/api/docs
```
Esperado: Swagger UI carga correctamente.

---

## MÓDULO 1 — Auth

### 1.1 Registrar Piloto A
```
POST /api/auth/register
Content-Type: application/json
```
```json
{
  "username": "piloto_alpha",
  "email": "alpha@streetracex.dev",
  "password": "StreetRace2026!",
  "zonaLocalidad": "Centro",
  "zonaCiudad": "Bogota",
  "zonaEstado": "Cundinamarca",
  "zonaPais": "Colombia"
}
```
Esperado: `201` — guarda `data.id` como `userIdA`.

---

### 1.2 Registrar Piloto B
```
POST /api/auth/register
Content-Type: application/json
```
```json
{
  "username": "piloto_beta",
  "email": "beta@streetracex.dev",
  "password": "StreetRace2026!",
  "zonaLocalidad": "Usaquén",
  "zonaCiudad": "Bogota",
  "zonaEstado": "Cundinamarca",
  "zonaPais": "Colombia"
}
```
Esperado: `201` — guarda `data.id` como `userIdB`.

---

### 1.3 Login Piloto A
```
POST /api/auth/login
Content-Type: application/json
```
```json
{
  "email": "alpha@streetracex.dev",
  "password": "StreetRace2026!"
}
```
Esperado: `200` — guarda `data.data.accessToken` como `tokenA`.  
La cookie `refreshToken` se guarda automáticamente.

---

### 1.4 Login Piloto B
```
POST /api/auth/login
Content-Type: application/json
```
```json
{
  "email": "beta@streetracex.dev",
  "password": "StreetRace2026!"
}
```
Esperado: `200` — guarda `data.data.accessToken` como `tokenB`.

---

### 1.5 Refresh de sesión (Piloto A)
```
POST /api/auth/refresh
```
Sin body si la cookie `refreshToken` está activa.  
Alternativa body:
```json
{ "refreshToken": "{{refreshToken}}" }
```
Esperado: `200` — nuevo `accessToken`.

---

### 1.6 Logout (Piloto A)
```
POST /api/auth/logout
```
Sin body. Requiere cookie `refreshToken`.  
Esperado: `200` — cookie limpiada. Vuelve a hacer login si necesitas el token.

---

## MÓDULO 2 — Profile

### 2.1 Ver mi perfil (Piloto A)
```
GET /api/profile/me
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — perfil con `rango: "D"`, `victorias: 0`, `vehicles: []`.

---

### 2.2 Actualizar mi perfil (Piloto A)
```
PATCH /api/profile/me
Authorization: Bearer {{tokenA}}
Content-Type: application/json
```
```json
{
  "username": "piloto_alpha_x",
  "zonaCiudad": "Medellin",
  "zonaEstado": "Antioquia"
}
```
Esperado: `200` — perfil actualizado con nuevo username y zona.

---

### 2.3 Ver perfil público de Piloto B (desde Piloto A)
```
GET /api/profile/{{userIdB}}
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — perfil público sin email ni datos sensibles.

---

## MÓDULO 3 — Vehicles

> Ambos pilotos necesitan un vehículo activo **del mismo tipo** para poder retarse.

### 3.1 Crear vehículo Piloto A
```
POST /api/vehicles
Authorization: Bearer {{tokenA}}
Content-Type: application/json
```
```json
{
  "tipoVehiculo": "AUTO",
  "marca": "Nissan",
  "modelo": "Silvia S15",
  "anio": 2000,
  "color": "Negro mate",
  "placa": "ALPHA-01",
  "modificaciones": "Turbo SR20DET"
}
```
Esperado: `201` — guarda `data.id` como `vehicleIdA`.

---

### 3.2 Activar vehículo Piloto A
```
PATCH /api/vehicles/{{vehicleIdA}}/activate
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — `data.activo: true`.

---

### 3.3 Crear vehículo Piloto B
```
POST /api/vehicles
Authorization: Bearer {{tokenB}}
Content-Type: application/json
```
```json
{
  "tipoVehiculo": "AUTO",
  "marca": "Toyota",
  "modelo": "Supra MK4",
  "anio": 1998,
  "color": "Blanco perla",
  "placa": "BETA-01",
  "modificaciones": "2JZ-GTE twin turbo"
}
```
Esperado: `201` — guarda `data.id` como `vehicleIdB`.

---

### 3.4 Activar vehículo Piloto B
```
PATCH /api/vehicles/{{vehicleIdB}}/activate
Authorization: Bearer {{tokenB}}
```
Esperado: `200` — `data.activo: true`.

---

### 3.5 Listar mis vehículos (Piloto A)
```
GET /api/vehicles
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — lista con el vehículo activo primero.

---

### 3.6 Editar vehículo (Piloto A)
```
PATCH /api/vehicles/{{vehicleIdA}}
Authorization: Bearer {{tokenA}}
Content-Type: application/json
```
```json
{
  "color": "Gris titanio",
  "modificaciones": "Turbo SR20DET + suspensión coilover"
}
```
Esperado: `200` — vehículo actualizado.

---

## MÓDULO 4 — Matchmaking

> Requiere al menos dos pilotos con el **mismo rango** y **mismo tipo de vehículo activo**.  
> Por defecto ambos están en rango `D` y ambos tienen `AUTO` activo — debe funcionar.

### 4.1 Buscar pilotos (Piloto A ve a Piloto B)
```
GET /api/matchmaking?page=1&limit=10
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — Piloto B aparece en `data.pilots`.

---

### 4.2 Con filtros de zona
```
GET /api/matchmaking?page=1&limit=10&zonaCiudad=Bogota
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — resultado filtrado por ciudad.

---

## MÓDULO 5 — Challenges

> El flujo completo requiere Piloto A y Piloto B con:
> - Mismo rango (`D`)
> - Mismo tipo de vehículo activo (`AUTO`)
> - Sin reto activo entre ellos

---

### FLUJO A — Reto normal (send → accept → start → resultado por consenso)

#### 5.1 Piloto A envía reto a Piloto B
```
POST /api/challenges
Authorization: Bearer {{tokenA}}
Content-Type: application/json
```
```json
{
  "retadoId": "{{userIdB}}",
  "tipoCarrera": "CUARTO_MILLA",
  "notas": "Este fin de semana en la vía principal",
  "fechaAcordada": "2026-06-01T18:00:00.000Z"
}
```
Esperado: `201` — guarda `data.id` como `challengeId`.  
Piloto B recibe notificación `RETO_RECIBIDO`.

---

#### 5.2 Ver mis retos (Piloto A — enviados)
```
GET /api/challenges?tipo=enviados
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — lista con el reto en estado `PENDIENTE`.

---

#### 5.3 Ver mis retos (Piloto B — recibidos)
```
GET /api/challenges?tipo=recibidos
Authorization: Bearer {{tokenB}}
```
Esperado: `200` — lista con el reto en estado `PENDIENTE`.

---

#### 5.4 Piloto B acepta el reto
```
PATCH /api/challenges/{{challengeId}}/accept
Authorization: Bearer {{tokenB}}
```
Esperado: `200` — reto en estado `ACEPTADO`.  
Piloto A recibe notificación `RETO_ACEPTADO`.

---

#### 5.5 Piloto A inicia el reto
```
PATCH /api/challenges/{{challengeId}}/start
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — reto en estado `EN_CURSO`.

---

#### 5.6 Piloto A reporta resultado (dice que ganó A)
```
PATCH /api/challenges/{{challengeId}}/result
Authorization: Bearer {{tokenA}}
Content-Type: application/json
```
```json
{
  "ganadorId": "{{userIdA}}"
}
```
Esperado: `200` — mensaje `"Resultado reportado. Esperando confirmación del otro piloto"`.  
Reto sigue en `EN_CURSO` con `reporteRetadorId` seteado.

---

#### 5.7 Piloto B confirma resultado (también dice que ganó A)
```
PATCH /api/challenges/{{challengeId}}/result
Authorization: Bearer {{tokenB}}
Content-Type: application/json
```
```json
{
  "ganadorId": "{{userIdA}}"
}
```
Esperado: `200` — mensaje `"Resultado confirmado"` o `"Resultado confirmado. ¡El ganador subió de rango!"`.  
- Reto pasa a `COMPLETADO`
- Piloto A: `victorias: 1`, `retosConsecutivos: 1`
- Piloto B: `derrotas: 1`, `retosConsecutivos: 0`
- Ambos reciben notificación `RESULTADO`

---

#### 5.8 Verificar estadísticas actualizadas (Piloto A)
```
GET /api/profile/me
Authorization: Bearer {{tokenA}}
```
Esperado: `victorias: 1`, `retosConsecutivos: 1`.

---

### FLUJO B — Reto rechazado

#### 5.9 Piloto A envía nuevo reto a Piloto B
```
POST /api/challenges
Authorization: Bearer {{tokenA}}
Content-Type: application/json
```
```json
{
  "retadoId": "{{userIdB}}",
  "tipoCarrera": "VUELTAS",
  "notas": "Circuito norte"
}
```
Guarda el nuevo `challengeId`.

---

#### 5.10 Piloto B rechaza el reto
```
PATCH /api/challenges/{{challengeId}}/reject
Authorization: Bearer {{tokenB}}
```
Esperado: `200` — reto en estado `RECHAZADO`.  
Piloto A recibe notificación `RETO_RECHAZADO`.

---

### FLUJO C — Reto cancelado

#### 5.11 Piloto A envía otro reto
```
POST /api/challenges
Authorization: Bearer {{tokenA}}
Content-Type: application/json
```
```json
{
  "retadoId": "{{userIdB}}",
  "tipoCarrera": "DERRAPE"
}
```
Guarda el nuevo `challengeId`.

---

#### 5.12 Piloto A cancela su propio reto (PENDIENTE)
```
PATCH /api/challenges/{{challengeId}}/cancel
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — reto en estado `CANCELADO`.

---

### FLUJO D — Resolución por Admin (disputa)

> Para este flujo necesitas un usuario con `rol: ADMINISTRADOR`.  
> Crea uno directamente en BD o con Prisma Studio:  
> `npx prisma studio` → tabla `users` → cambia `rol` a `ADMINISTRADOR`.

#### 5.13 Login Admin
```
POST /api/auth/login
Content-Type: application/json
```
```json
{
  "email": "admin@streetracex.dev",
  "password": "StreetRace2026!"
}
```
Guarda `data.data.accessToken` como `tokenAdmin`.

---

#### 5.14 Crear reto que llegue a EN_CURSO con disputa
Repite pasos 5.1 → 5.5. Luego ambos pilotos reportan ganadores distintos:

Piloto A dice que ganó A:
```
PATCH /api/challenges/{{challengeId}}/result
Authorization: Bearer {{tokenA}}
Content-Type: application/json
{ "ganadorId": "{{userIdA}}" }
```

Piloto B dice que ganó B:
```
PATCH /api/challenges/{{challengeId}}/result
Authorization: Bearer {{tokenB}}
Content-Type: application/json
{ "ganadorId": "{{userIdB}}" }
```
Esperado: el reto sigue en `EN_CURSO` (disputa activa, no hay acuerdo).

---

#### 5.15 Admin resuelve la disputa
```
PATCH /api/challenges/{{challengeId}}/admin-resolve
Authorization: Bearer {{tokenAdmin}}
Content-Type: application/json
```
```json
{
  "ganadorId": "{{userIdA}}"
}
```
Esperado: `200` — reto `COMPLETADO`, stats actualizadas, notificaciones enviadas.

---

### FLUJO E — Ascenso de rango

> El piloto necesita **2 victorias consecutivas** en rango `D` para ascender a `C`.  
> Si Piloto A ya tiene 1 victoria (paso 5.7), gana otro reto y sube.

#### 5.16 Segundo reto completo (Piloto A vs Piloto B)
Repite pasos 5.1 → 5.7 con un nuevo reto.  
En el paso 5.7 (Piloto B confirma que ganó A):

Esperado: `200` — mensaje `"Resultado confirmado. ¡El ganador subió de rango!"`.  
- Piloto A: `rango: "C"`, `retosConsecutivos: 0` (reset tras ascenso)
- Piloto A recibe notificación `RANGO_SUBIDO`

---

#### 5.17 Verificar rango actualizado
```
GET /api/profile/me
Authorization: Bearer {{tokenA}}
```
Esperado: `rango: "C"`.

---

## MÓDULO 6 — Casos de error esperados

### 6.1 Retarse a sí mismo
```
POST /api/challenges
Authorization: Bearer {{tokenA}}
{ "retadoId": "{{userIdA}}", "tipoCarrera": "CUARTO_MILLA" }
```
Esperado: `400` — `"No puedes retarte a ti mismo"`.

---

### 6.2 Retar sin vehículo activo
Desactiva/elimina el vehículo de Piloto A y luego intenta retar.  
Esperado: `422` — `"Necesitas un vehículo activo para enviar un reto"`.

---

### 6.3 Retar a piloto de otro rango
Requiere dos pilotos en rangos distintos (ej. uno en `D`, otro en `C`).  
Esperado: `422` — `"Solo puedes retar a pilotos del mismo rango"`.

---

### 6.4 Reto duplicado activo
Intenta enviar dos retos al mismo piloto mientras el primero sigue PENDIENTE.  
Esperado: `409` — `"Ya existe un reto activo entre estos pilotos"`.

---

### 6.5 Piloto A intenta aceptar su propio reto
```
PATCH /api/challenges/{{challengeId}}/accept
Authorization: Bearer {{tokenA}}
```
Esperado: `403` — `"Solo el retado puede aceptar el reto"`.

---

### 6.6 Admin-resolve sin ser admin
```
PATCH /api/challenges/{{challengeId}}/admin-resolve
Authorization: Bearer {{tokenA}}
{ "ganadorId": "{{userIdA}}" }
```
Esperado: `403` — `"Acceso denegado"`.

---

### 6.7 Token inválido
```
GET /api/profile/me
Authorization: Bearer token_falso
```
Esperado: `401`.

---

## Filtros disponibles en GET /api/challenges

| Query param | Valores posibles                                               |
|-------------|----------------------------------------------------------------|
| `tipo`      | `enviados`, `recibidos`, `todos` (default)                     |
| `estado`    | `PENDIENTE`, `ACEPTADO`, `RECHAZADO`, `EN_CURSO`, `COMPLETADO`, `CANCELADO` |

Ejemplo:
```
GET /api/challenges?tipo=enviados&estado=COMPLETADO
Authorization: Bearer {{tokenA}}
```

---

## Estado de módulos

| Módulo      | Estado |
|-------------|--------|
| Auth        | ✅     |
| Profile     | ✅     |
| Vehicles    | ✅     |
| Matchmaking | ✅     |
| Challenges  | ✅     |
| Notifications (endpoints) | Pendiente |