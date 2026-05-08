# Street Race X — Guía de prueba de endpoints

Base URL: `http://localhost:3000`  
Todas las rutas usan el prefijo `/api/v1/`.  
Los endpoints marcados con 🔒 requieren `Authorization: Bearer <accessToken>`.  
Los endpoints marcados con 👑 requieren rol `ADMINISTRADOR`.

---

## Variables reutilizables

Reemplaza estos valores en cada request:

| Variable | Descripción |
|---|---|
| `{{accessToken}}` | JWT obtenido en Login |
| `{{userId}}` | UUID de tu usuario |
| `{{targetUserId}}` | UUID del otro piloto |
| `{{vehicleId}}` | UUID de un vehículo |
| `{{challengeId}}` | UUID de un reto |
| `{{trackId}}` | UUID de una pista |
| `{{notificationId}}` | UUID de una notificación |

---

## REGISTRAR USUARIO
### POST `/api/v1/auth/register`
Registra un nuevo piloto.

## USUARIO 1
```json
{
  "username": "BrayanOconer",
  "email": "brayan_oconer@fastandfurious.nitro",
  "password": "StreetRace2026!",
  "fotoPerfil": null,
  "zonaLocalidad": "12 de octubre",
  "zonaCiudad": "Medellin",
  "zonaEstado": "Antioquia",
  "zonaPais": "Colombia"
}

```
## USUARIO 2
```json
{
  "username": "Toretto",
  "email": "Toretto@fastandfurious.nitro",
  "password": "StreetRace2026!",
  "fotoPerfil": null,
  "zonaLocalidad": "Manrique",
  "zonaCiudad": "Medellin",
  "zonaEstado": "Antioquia",
  "zonaPais": "Colombia"
}
```

# INICIAR SESION
### POST `/api/v1/auth/login`
Inicia sesión. Devuelve `accessToken` (15 min) y setea cookie `refreshToken` (httpOnly, 7 días).

## LOGIN USUARIO 1
```json
{
  "email": "brayan_oconer@fastandfurious.nitro",
  "password": "StreetRace2026!"
}
```
TOKEN=

## LOGIN USUARIO 2
```json
{
  "email": "Toretto@fastandfurious.nitro",
  "password": "StreetRace2026!"
}
```
TOKEN=

# REFRESCAR TOKEN
### POST `/api/v1/auth/refresh`
Rota el refresh token y emite un nuevo access token.  
No requiere body. El refresh token se envía automáticamente via cookie httpOnly.

**Headers:**
```
Cookie: refreshToken=<valor_de_la_cookie>
```

**Body:** ninguno

**Respuesta 200:**
```json
{
  "success": true,
  "message": "Sesión refrescada",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...(nuevo)",
    "tokenType": "Bearer",
    "expiresIn": "15m",
    "user": {
      "id": "f4f0e722-8aa9-4c7b-833f-56e378f79ef9",
      "username": "pilot_alpha",
      "email": "pilot.alpha@sx.dev",
      "rol": "PILOTO",
      "rango": "D"
    }
  }
}
```

---
# CERRAR SESION
### POST `/api/v1/auth/logout` 🔒
Revoca el refresh token activo y limpia la cookie de sesión.

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Body:** ninguno

**Respuesta 200:**
```json
{
  "success": true,
  "message": "Sesión cerrada"
}
```

---

## 2. OBTENER MI PERFIL
### GET `/api/v1/profile/me` 🔒
Retorna el perfil completo del piloto autenticado con estadísticas y vehículos.

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Body:** ninguno

---

# ACTUALIZAR DATOS DEL PERFIL
### PATCH `/api/v1/profile/me` 🔒
Actualiza datos del perfil. Todos los campos son opcionales.

```json
{
  "username": "ghost_rider_x",
  "fotoPerfil": "https://cdn.example.com/avatar.jpg",
  "zonaLocalidad": "Usaquén",
  "zonaCiudad": "Bogota",
  "zonaEstado": "Cundinamarca",
  "zonaPais": "Colombia"
}
```

# DESACTIVAR USUARIO
### PATCH `/api/v1/profile/me/deactivate` 🔒
Marca la cuenta como `INACTIVA`. Soft delete — el registro no se elimina de la BD.  
Revoca todos los refresh tokens activos.

**Body:** ninguno

---

# OBTENER PERFIL PUBLICO
### GET `/api/v1/profile/:userId` 🔒
Retorna el perfil público de otro piloto (solo si está `ACTIVO`).

**Params:** `userId` = UUID del piloto a consultar -- UUID USUARIO 2

**Body:** ninguno

---

## 3. OBTENER VEHICULOS REGISTRADOS
### GET `/api/v1/vehicles` 🔒
Lista todos los vehículos del piloto autenticado.

**Body:** ninguno

---

# CREAR UN VEHICULO
### POST `/api/v1/vehicles` 🔒
Crea un nuevo vehículo. Máximo 3 por piloto.  
`AUTO` y `MOTO` requieren `placa`. `MONOPATIN_ELECTRICO` no puede tenerla.

# AUTO USUARIO 1
**AUTO / MOTO:**
```json
{
  "tipoVehiculo": "AUTO",
  "marca": "Nissan",
  "modelo": "Skyline GTR R34",
  "anio": 2000,
  "color": "Azul",
  "placa": "FAF-000",
  "foto": null,
  "modificaciones": "Turbo SR20DET, suspensión coilover"
}
```

# AUTO USUARIO 2
**AUTO / MOTO:**
```json
{
  "tipoVehiculo": "AUTO",
  "marca": "Dodge",
  "modelo": "Charger",
  "anio": 1970,
  "color": "Negro mate",
  "placa": "FAF-111",
  "foto": null,
  "modificaciones": "Turbo SR20DET, Inyeccion de nitro"
}
```

# MONOPATIN EN CASO
**MONOPATIN_ELECTRICO:**
```json
{
  "tipoVehiculo": "MONOPATIN_ELECTRICO",
  "marca": "Xiaomi",
  "modelo": "Pro 4",
  "anio": 2024,
  "color": "Gris",
  "placa": null
}
```


---

# ACTUALIZAR CAMPOS DEL VEHICULO
### PATCH `/api/v1/vehicles/:vehicleId` 🔒
Actualiza campos del vehículo. Todos opcionales.

**Params:** `vehicleId` = UUID del vehículo

# MODIFICACIONES USUARIO 1
```json
{
  "color": "Blanco perla",
  "modificaciones": "Frenos Brembo + suspensión coilover"
}
```

# MODIFICACIONES USUARIO 2
```json
{
  "color": "Amarillo Pollito",
  "modificaciones": "Frenos Brembo + suspensión coilover"
}
```

# ELIMINAR VEHICULO
### DELETE `/api/v1/vehicles/:vehicleId` 🔒
Elimina permanentemente un vehículo (hard delete).

**Params:** `vehicleId` = UUID del vehículo  -- ID DEL VEHICULO A ELIMINAR
**Body:** ninguno

---

# ACTIVAR VEHICULO
### PATCH `/api/v1/vehicles/:vehicleId/activate` 🔒
Marca el vehículo como activo. Desactiva automáticamente el anterior.  
Solo puede haber un vehículo activo a la vez.

**Params:** `vehicleId` = UUID del vehículo  -- ID DEL VEHICULO A ACTIVAR
**Body:** ninguno


---

## 4. MATCHMAKING -- ENCONTRAR PILOTOS DISPONIBLES A RETAR
### GET `/api/v1/matchmaking` 🔒
Lista pilotos disponibles para retar. Filtra automáticamente por rango igual y tipo de vehículo activo igual al tuyo.

# LISTAS PILOTOS DISPONIBLES
### GET `/api/v1/matchmaking`

**Body:** ninguno

# LISTAS PILOTOS POR CIUDAD
### GET `/api/v1/matchmaking?zonaCiudad=Medellin`

**Body:** ninguno

# LISTAS PILOTOS POR CIUDAD + DEPARTAMENTO
### GET `/api/v1/matchmaking?zonaCiudad=Bogota&zonaEstado=Cundinamarca`

**Body:** ninguno

---


## 5. CHALLENGES -- CREAR RETO
### POST `/api/v1/challenges` 🔒
Envía un reto a otro piloto. El vehículo del retador se toma del vehículo activo automáticamente.  
Reglas: mismo rango, mismo tipo de vehículo, sin reto activo duplicado entre los dos pilotos.

# RETO CON PISTA
**Con pista (opcional):**
```json
{
  "retadoId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "tipoCarrera": "CUARTO_MILLA",
  "pistaId": "b1c2d3e4-f5a6-7890-bcde-f01234567890",
  "notas": "Pista norte, esta noche",
  "fechaAcordada": "2026-06-15T20:00:00.000Z"
}
```

> `tipoCarrera` valores: `CUARTO_MILLA` | `VUELTAS` | `DERRAPE`  
> Si se envía `pistaId`, la pista debe estar activa y su `tipoCarrera` debe coincidir.

---

# LISTAR LOS RETOS CON FILTROS
### GET `/api/v1/challenges` 🔒
Lista los retos del piloto autenticado. Filtrable por participación y estado.

**Ejemplos:**
```
GET /api/v1/challenges
GET /api/v1/challenges?tipo=recibidos
GET /api/v1/challenges?tipo=enviados&estado=PENDIENTE
GET /api/v1/challenges?estado=COMPLETADO
```

---

# OBTENER EL DETALLE DE UN RETO
### GET `/api/v1/challenges/:challengeId` 🔒
Obtiene el detalle de un reto. Solo accesible para los dos participantes.

**Params:** `challengeId` = UUID del reto  -- ID DEL RETO A BUSCAR
**Body:** ninguno

---

# ACTUALIZAR ESTADO DEL RETO
### PATCH `/api/v1/challenges/:challengeId/status` 🔒
Cambia el estado del reto. Las transiciones permitidas dependen del rol:


| `ACEPTADO` | Solo el retado | `PENDIENTE` |
| `RECHAZADO` | Solo el retado | `PENDIENTE` |
| `CANCELADO` | Cualquier participante | `PENDIENTE` o `ACEPTADO` |
| `EN_CURSO` | Solo el retador | `ACEPTADO` |


**Aceptar (ejecutar con token del retado):**
```json
{
  "estado": "ACEPTADO"
}
```

**Rechazar (ejecutar con token del retado):**
```json
{
  "estado": "RECHAZADO"
}
```

**Cancelar (cualquier participante):**
```json
{
  "estado": "CANCELADO"
}
```

**Iniciar carrera (ejecutar con token del retador):**
```json
{
  "estado": "EN_CURSO"
}
```

# VEREDICTO O RESULTADO
### PATCH `/api/v1/challenges/:challengeId/result` 🔒
Cada participante declara al ganador del reto (debe estar `EN_CURSO`).

- Si **ambos declaran el mismo ganador** → estado pasa a `COMPLETADO` automáticamente y se actualizan las estadísticas.
- Si **difieren** → queda en disputa hasta que un administrador resuelva.

# SELECCIONAR GANADOR
**Ejecutar una vez con token del retador, una vez con token del retado:**
```json
{
  "ganadorId": "f4f0e722-8aa9-4c7b-833f-56e378f79ef9"
}
```

> `ganadorId` debe ser el `retadorId` o `retadoId` del reto, no un UUID externo.


## 6. LISTAR TRACKS
### GET `/api/v1/tracks` 🔒
Lista pistas activas. Admin puede ver todas con `soloActivas=false`.

**Query params opcionales:**

| `tipoCarrera` | `CUARTO_MILLA` \| `VUELTAS` \| `DERRAPE` | Filtrar por tipo |
| `soloActivas` | `true` \| `false` | Default `true`. `false` solo útil para admin |

**Ejemplos:**
```
GET /api/v1/tracks
GET /api/v1/tracks?tipoCarrera=CUARTO_MILLA
GET /api/v1/tracks?soloActivas=false
```

# OBTENER DETALLE DE UNA PISTA
### GET `/api/v1/tracks/:trackId` 🔒
Detalle de una pista específica.

**Params:** `trackId` = UUID de la pista  
**Body:** ninguno
---

## 7. Notifications

### GET `/api/v1/notifications` 🔒
Lista notificaciones del piloto autenticado, ordenadas por fecha descendente.

**Query params opcionales:**

| Param | Valores | Descripción |
|---|---|---|
| `soloNoLeidas` | `true` \| `false` | Default `false`. `true` = solo pendientes |

```
GET /api/v1/notifications
GET /api/v1/notifications?soloNoLeidas=true
```

**Respuesta 200:**
```json
{
  "success": true,
  "message": "Notificaciones obtenidas",
  "data": [
    {
      "id": "n1n2n3n4-a5b6-7890-cdef-123456789abc",
      "userId": "f4f0e722-...",
      "tipo": "RETO_RECIBIDO",
      "mensaje": "pilot_alpha te ha enviado un reto",
      "leida": false,
      "referenciaId": "c1d2e3f4-...",
      "createdAt": "2026-05-08T10:05:00.000Z"
    }
  ]
}
```

---

### PATCH `/api/v1/notifications/read-all` 🔒
Marca todas las notificaciones no leídas como leídas.

**Body:** ninguno

**Respuesta 200:**
```json
{
  "success": true,
  "message": "Todas las notificaciones marcadas como leídas"
}
```

---

### PATCH `/api/v1/notifications/:notificationId/read` 🔒
Marca una notificación específica como leída.

**Params:** `notificationId` = UUID de la notificación  
**Body:** ninguno

**Respuesta 200:**
```json
{
  "success": true,
  "message": "Notificación marcada como leída",
  "data": {
    "id": "n1n2n3n4-a5b6-7890-cdef-123456789abc",
    "leida": true,
    "...": "resto de campos"
  }
}
```

---

## 8. Admin 👑

> Todos los endpoints de esta sección requieren token de un usuario con rol `ADMINISTRADOR`.

# CREAR USUARIO ADMINISTRADOR
```json
{
  "username": "AdminX",
  "email": "adminx@fastandfurious.nitro",
  "password": "StreetRace2026!",
  "fotoPerfil": null
}
```

# INICIAR SESION CON ADMINISTRADOR
```json
{
  "email": "adminx@fastandfurious.nitro",
  "password": "StreetRace2026!"
}
```

# RESOLVER UNA DISPUTA O CHALLENGE
### PATCH `/api/v1/admin/challenges/:challengeId/resolve` 👑
Resuelve una disputa forzando al ganador. El reto debe estar `EN_CURSO` con reportes contradictorios.

```json
{
  "ganadorId": "f4f0e722-8aa9-4c7b-833f-56e378f79ef9"
}
```

# CREAR UNA NUEVA PISTA
### POST `/api/v1/admin/tracks` 👑
Crea una nueva pista de carrera.

```json
{
  "nombre": "Pista Norte",
  "descripcion": "Recta de 400m en la vía principal norte de la ciudad",
  "tipoCarrera": "CUARTO_MILLA",
  "dificultad": "MEDIA",
  "coordenadas": "4.7110,-74.0721"
}
```

```json
{
  "nombre": "Itagui",
  "descripcion": "Derrape al fallo a lo NEED FOR SPEED",
  "tipoCarrera": "DERRAPE",
  "dificultad": "ALTA",
  "coordenadas": "4.7110,-74.0721"
}
```

> `tipoCarrera`: `CUARTO_MILLA` | `VUELTAS` | `DERRAPE`  
> `dificultad`: `BAJA` | `MEDIA` | `ALTA`

---

# ACTUALIZAR DATOS DE UNA PISTA
### PATCH `/api/v1/admin/tracks/:trackId` 👑
Actualiza datos de una pista. No permite cambiar el `tipoCarrera`.

**Params:** `trackId` = UUID de la pista

```json
{
  "nombre": "Pista Norte Renovada",
  "descripcion": "Recta de 402m con nueva iluminación LED",
  "dificultad": "ALTA"
}
```

---
# DESACTIVAR UNA PISTA
### PATCH `/api/v1/admin/tracks/:trackId/deactivate` 👑
Desactiva una pista (soft delete). Los retos existentes con esa pista no se ven afectados.

**Params:** `trackId` = UUID de la pista  
**Body:** ninguno

---

## Flujo de prueba recomendado

```
1.  POST  /auth/register             → crear piloto 1
2.  POST  /auth/register             → crear piloto 2
3.  POST  /auth/login                → obtener accessToken piloto 1
4.  POST  /auth/login                → obtener accessToken piloto 2
5.  GET   /profile/me                → (P1) verificar perfil
6.  POST  /vehicles                  → (P1) crear vehículo AUTO
7.  PATCH /vehicles/:id/activate     → (P1) activar vehículo
8.  POST  /vehicles                  → (P2) crear vehículo AUTO
9.  PATCH /vehicles/:id/activate     → (P2) activar vehículo
10. GET   /matchmaking               → (P1) ver pilotos disponibles
11. POST  /challenges                → (P1) enviar reto a P2
12. GET   /challenges/:id            → (P2) ver reto recibido
13. PATCH /challenges/:id/status     → (P2) { "estado": "ACEPTADO" }
14. PATCH /challenges/:id/status     → (P1) { "estado": "EN_CURSO" }
15. PATCH /challenges/:id/result     → (P1) { "ganadorId": "uuid-p1" }
16. PATCH /challenges/:id/result     → (P2) { "ganadorId": "uuid-p1" } → COMPLETADO
17. GET   /notifications             → (P2) ver notificaciones del reto
18. PATCH /notifications/read-all    → (P2) marcar todo leído
19. POST  /auth/refresh              → (P1) renovar token
20. POST  /auth/logout               → (P1) cerrar sesión
```