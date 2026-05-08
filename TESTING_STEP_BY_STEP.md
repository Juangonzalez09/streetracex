# TESTING_STEP_BY_STEP — StreetRaceX API

> Usa Postman, Thunder Client o cualquier cliente HTTP.  
> **Base URL local:** `http://localhost:3000`  
> **Swagger UI:** `http://localhost:3000/api/docs`

---

## Prerequisitos

```bash
# Desde api/
npm install
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

| Variable         | Cómo obtenerla                          |
|------------------|-----------------------------------------|
| `tokenA`         | Login Piloto A → `data.accessToken`     |
| `tokenB`         | Login Piloto B → `data.accessToken`     |
| `tokenAdmin`     | Login Admin → `data.accessToken`        |
| `userIdA`        | Register Piloto A → `data.id`           |
| `userIdB`        | Register Piloto B → `data.id`           |
| `vehicleIdA`     | Crear vehículo Piloto A → `data.id`     |
| `vehicleIdB`     | Crear vehículo Piloto B → `data.id`     |
| `challengeId`    | Enviar reto → `data.id`                 |
| `trackId`        | Crear pista → `data.id`                 |
| `notificationId` | Listar notificaciones → `data[0].id`    |

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

### 1.5 Refresh de sesión
```
POST /api/auth/refresh
```
Sin body si la cookie `refreshToken` está activa.  
Esperado: `200` — nuevo `accessToken`.

---

### 1.6 Logout
```
POST /api/auth/logout
```
Sin body. Requiere cookie `refreshToken`.  
Esperado: `200` — cookie limpiada.

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
Esperado: `200` — perfil actualizado.

---

### 2.3 Ver perfil público de Piloto B
```
GET /api/profile/{{userIdB}}
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — perfil público sin datos sensibles.

---

## MÓDULO 3 — Vehicles

> Ambos pilotos necesitan un vehículo activo **del mismo tipo** para retarse.

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

### 3.5 Listar mis vehículos
```
GET /api/vehicles
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — lista con el vehículo activo.

---

## MÓDULO 4 — Matchmaking

### 4.1 Buscar pilotos (Piloto A ve a Piloto B)
```
GET /api/matchmaking?page=1&limit=10
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — Piloto B aparece en `data.pilots`.

---

## MÓDULO 5 — Tracks (Pistas)

> Requiere usuario con `rol: ADMINISTRADOR`.  
> Crea uno en Prisma Studio: `npx prisma studio` → tabla `users` → cambia `rol` a `ADMINISTRADOR`.

### 5.1 Login Admin
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

### 5.2 Crear pista (Admin)
```
POST /api/tracks
Authorization: Bearer {{tokenAdmin}}
Content-Type: application/json
```
```json
{
  "nombre": "Recta del Parque Norte",
  "tipoCarrera": "CUARTO_MILLA",
  "descripcion": "Tramo recto de 400m en el parque industrial norte",
  "dificultad": "Media",
  "coordenadas": "4.710989,-74.072092"
}
```
Esperado: `201` — guarda `data.id` como `trackId`.

---

### 5.3 Crear pista de derrape
```
POST /api/tracks
Authorization: Bearer {{tokenAdmin}}
Content-Type: application/json
```
```json
{
  "nombre": "Zona de Derrape El Codazo",
  "tipoCarrera": "DERRAPE",
  "dificultad": "Alta"
}
```
Esperado: `201`.

---

### 5.4 Listar pistas (Piloto A)
```
GET /api/tracks
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — lista de pistas activas.

---

### 5.5 Filtrar pistas por tipo
```
GET /api/tracks?tipoCarrera=CUARTO_MILLA
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — solo pistas de cuarto de milla.

---

### 5.6 Ver detalle de pista
```
GET /api/tracks/{{trackId}}
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — detalle de la pista.

---

### 5.7 Actualizar pista (Admin)
```
PATCH /api/tracks/{{trackId}}
Authorization: Bearer {{tokenAdmin}}
Content-Type: application/json
```
```json
{
  "dificultad": "Alta",
  "coordenadas": "4.711000,-74.072100"
}
```
Esperado: `200` — pista actualizada.

---

### 5.8 Desactivar pista (Admin)
```
PATCH /api/tracks/{{trackId}}/deactivate
Authorization: Bearer {{tokenAdmin}}
```
Esperado: `200` — `data.activo: false`.

---

### 5.9 Verificar que desaparece del listado de pilotos
```
GET /api/tracks
Authorization: Bearer {{tokenA}}
```
Esperado: la pista desactivada ya no aparece.

---

### 5.10 Ver todas incluyendo inactivas (Admin)
```
GET /api/tracks?soloActivas=false
Authorization: Bearer {{tokenAdmin}}
```
Esperado: aparece la pista desactivada con `activo: false`.

---

### Errores esperados — Tracks

| Acción | HTTP | Mensaje |
|---|---|---|
| Piloto crea pista | 403 | `Acceso denegado` |
| trackId inválido | 422 | `trackId debe ser un UUID válido` |
| Pista no existe | 404 | `Pista no encontrada` |
| Desactivar ya inactiva | 409 | `La pista ya está desactivada` |

---

## MÓDULO 6 — Challenges (con pista opcional)

> Reactiva la pista del paso 5.2 si la desactivaste, o crea una nueva.

### FLUJO A — Reto con pista seleccionada

#### 6.1 Piloto A envía reto CON pista
```
POST /api/challenges
Authorization: Bearer {{tokenA}}
Content-Type: application/json
```
```json
{
  "retadoId": "{{userIdB}}",
  "tipoCarrera": "CUARTO_MILLA",
  "pistaId": "{{trackId}}",
  "notas": "Nos vemos en la recta norte este sábado",
  "fechaAcordada": "2026-06-01T18:00:00.000Z"
}
```
Esperado: `201` — `data.pistaId` tiene el UUID de la pista. Guarda `data.id` como `challengeId`.

---

#### 6.2 Piloto B acepta
```
PATCH /api/challenges/{{challengeId}}/accept
Authorization: Bearer {{tokenB}}
```
Esperado: `200` — estado `ACEPTADO`, `vehiculoRetadoId` asignado.

---

#### 6.3 Piloto A inicia
```
PATCH /api/challenges/{{challengeId}}/start
Authorization: Bearer {{tokenA}}
```
Esperado: `200` — estado `EN_CURSO`.

---

#### 6.4 Piloto A reporta (dice que ganó A)
```
PATCH /api/challenges/{{challengeId}}/result
Authorization: Bearer {{tokenA}}
Content-Type: application/json
```
```json
{ "ganadorId": "{{userIdA}}" }
```
Esperado: `200` — `"Resultado reportado. Esperando confirmación del otro piloto"`.

---

#### 6.5 Piloto B confirma (también dice que ganó A)
```
PATCH /api/challenges/{{challengeId}}/result
Authorization: Bearer {{tokenB}}
Content-Type: application/json
```
```json
{ "ganadorId": "{{userIdA}}" }
```
Esperado: `200` — `"Resultado confirmado"`. Reto `COMPLETADO`. Estadísticas actualizadas.

---

### FLUJO B — Reto sin pista (campo omitido)
```
POST /api/challenges
Authorization: Bearer {{tokenA}}
Content-Type: application/json
```
```json
{
  "retadoId": "{{userIdB}}",
  "tipoCarrera": "VUELTAS"
}
```
Esperado: `201` — `data.pistaId: null`.

---

### FLUJO C — Reto rechazado
```
POST /api/challenges → PATCH /:id/reject (Piloto B)
```
Esperado: estado `RECHAZADO`. Piloto A recibe notificación `RETO_RECHAZADO`.

---

### FLUJO D — Resolución por Admin (disputa)

Repite 6.1 → 6.3. Luego reportan ganadores distintos:

Piloto A dice que ganó A:
```json
{ "ganadorId": "{{userIdA}}" }
```
Piloto B dice que ganó B:
```json
{ "ganadorId": "{{userIdB}}" }
```
El reto se queda en `EN_CURSO`.

Admin resuelve:
```
PATCH /api/challenges/{{challengeId}}/admin-resolve
Authorization: Bearer {{tokenAdmin}}
Content-Type: application/json
```
```json
{ "ganadorId": "{{userIdA}}" }
```
Esperado: `200` — reto `COMPLETADO`, stats actualizadas.

---

### FLUJO E — Ascenso de rango

El piloto necesita **2 victorias consecutivas** para ascender (D→C→B→A→S).  
Repite el flujo A dos veces con Piloto A ganando ambas.  
En la segunda victoria: mensaje `"Resultado confirmado. ¡El ganador subió de rango!"`.

```
GET /api/profile/me
Authorization: Bearer {{tokenA}}
```
Esperado: `rango: "C"`, `retosConsecutivos: 0`.

---

### Errores esperados — Challenges

| Acción | HTTP | Mensaje |
|---|---|---|
| Retarse a sí mismo | 400 | `No puedes retarte a ti mismo` |
| Sin vehículo activo | 422 | `Necesitas un vehículo activo para enviar un reto` |
| Distinto rango | 422 | `Solo puedes retar a pilotos del mismo rango` |
| Reto duplicado activo | 409 | `Ya existe un reto activo entre estos pilotos` |
| pistaId inactiva | 422 | `La pista seleccionada no está activa` |
| pistaId tipo distinto | 422 | `La pista no corresponde al tipo de carrera seleccionado` |
| pistaId inexistente | 404 | `La pista seleccionada no existe` |
| Admin-resolve sin ser admin | 403 | `Acceso denegado` |

---

## MÓDULO 7 — Notifications

### 7.1 Listar todas mis notificaciones (Piloto B)
```
GET /api/notifications
Authorization: Bearer {{tokenB}}
```
Esperado: `200` — lista de notificaciones (`RETO_RECIBIDO`, `RETO_ACEPTADO`, etc.). Guarda `data[0].id` como `notificationId`.

---

### 7.2 Listar solo no leídas
```
GET /api/notifications?soloNoLeidas=true
Authorization: Bearer {{tokenB}}
```
Esperado: `200` — solo notificaciones con `leida: false`.

---

### 7.3 Marcar una notificación como leída
```
PATCH /api/notifications/{{notificationId}}/read
Authorization: Bearer {{tokenB}}
```
Esperado: `200` — `data.leida: true`.

---

### 7.4 Intentar marcar la misma otra vez
```
PATCH /api/notifications/{{notificationId}}/read
Authorization: Bearer {{tokenB}}
```
Esperado: `409` — `"La notificación ya está marcada como leída"`.

---

### 7.5 Marcar todas como leídas
```
PATCH /api/notifications/read-all
Authorization: Bearer {{tokenB}}
```
Esperado: `200` — `"Todas las notificaciones marcadas como leídas"`.

---

### 7.6 Verificar que no quedan no leídas
```
GET /api/notifications?soloNoLeidas=true
Authorization: Bearer {{tokenB}}
```
Esperado: `200` — `data: []`.

---

### Errores esperados — Notifications

| Acción | HTTP | Mensaje |
|---|---|---|
| Notificación no existe | 404 | `Notificación no encontrada` |
| Notificación de otro usuario | 403 | `No tienes acceso a esta notificación` |
| Ya estaba leída | 409 | `La notificación ya está marcada como leída` |
| notificationId inválido | 422 | `notificationId debe ser un UUID válido` |

---

## Estado de módulos

| Módulo        | Estado |
|---------------|--------|
| Auth          | ✅     |
| Profile       | ✅     |
| Vehicles      | ✅     |
| Matchmaking   | ✅     |
| Tracks        | ✅     |
| Challenges    | ✅     |
| Notifications | ✅     |
