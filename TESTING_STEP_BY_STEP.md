# Guia paso a paso para probar todos los endpoints

Base URL local (por defecto):
```
http://localhost:3000
```

## Requisitos previos
1. Configura `.env` en `api/` con al menos:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - (Opcional) `ACCESS_TOKEN_EXPIRES_IN`, `REFRESH_TOKEN_TTL_DAYS`, `CORS_ORIGIN`
2. Instala dependencias y corre migraciones:
```
cd api
npm install
npm run prisma:migrate:dev
```
3. Levanta la API:
```
npm run dev
```

## Variables recomendadas (Postman/Thunder)
- `accessToken`
- `refreshToken` (cookie `refreshToken` que llega en login)
- `userId`
- `vehicleId`

## Endpoints de documentacion
1. **GET** `/api/docs`  
   Verifica Swagger y disponibilidad del servidor.

## Auth
2. **POST** `/api/auth/register`
```
{
  "username": "pilot_demo_01",
  "email": "pilot_demo_01@example.com",
  "password": "Secret12345",
  "fotoPerfil": null,
  "zonaLocalidad": "Centro",
  "zonaCiudad": "Bogota",
  "zonaEstado": "Cundinamarca",
  "zonaPais": "Colombia"
}
```
Guarda `data.id` como `userId`.

3. **POST** `/api/auth/login`
```
{
  "email": "pilot_demo_01@example.com",
  "password": "Secret12345"
}
```
Guarda `data.accessToken` como `accessToken`.  
Guarda el cookie `refreshToken` (Set-Cookie) como `refreshToken`.

4. **POST** `/api/auth/refresh`  
Envio recomendado: cookie `refreshToken`.  
Alternativa: body JSON con `refreshToken`.
```
{
  "refreshToken": "{{refreshToken}}"
}
```
Guarda el nuevo `accessToken`.

5. **POST** `/api/auth/logout`  
Requiere cookie `refreshToken`. Debe limpiar el cookie.

## Profile
6. **GET** `/api/profile/me`  
Header: `Authorization: Bearer {{accessToken}}`

7. **PATCH** `/api/profile/me`  
Header: `Authorization: Bearer {{accessToken}}`
```
{
  "username": "pilot_demo_01",
  "fotoPerfil": null,
  "zonaLocalidad": "Centro",
  "zonaCiudad": "Bogota",
  "zonaEstado": "Cundinamarca",
  "zonaPais": "Colombia"
}
```

8. **GET** `/api/profile/{{userId}}`  
Header: `Authorization: Bearer {{accessToken}}`

9. **DELETE** `/api/profile/me`  
Header: `Authorization: Bearer {{accessToken}}`  
Nota: deja el usuario inactivo. Ejecuta este paso al final.

## Vehicles
10. **POST** `/api/vehicles`  
Header: `Authorization: Bearer {{accessToken}}`
```
{
  "tipoVehiculo": "AUTO",
  "marca": "Mazda",
  "modelo": "3",
  "anio": 2020,
  "color": "Rojo",
  "placa": "TEST-123",
  "foto": null,
  "modificaciones": "Escape deportivo"
}
```
Guarda `data.id` como `vehicleId`.

11. **GET** `/api/vehicles`  
Header: `Authorization: Bearer {{accessToken}}`

12. **PATCH** `/api/vehicles/{{vehicleId}}`  
Header: `Authorization: Bearer {{accessToken}}`
```
{
  "color": "Negro",
  "modificaciones": "Suspension deportiva"
}
```

13. **PATCH** `/api/vehicles/{{vehicleId}}/activate`  
Header: `Authorization: Bearer {{accessToken}}`  
Nota: desactiva otros vehiculos del usuario.

14. **DELETE** `/api/vehicles/{{vehicleId}}`  
Header: `Authorization: Bearer {{accessToken}}`  
Nota: si borras el vehiculo activo, matchmaking no tendra tipo de vehiculo.

## Matchmaking
15. **GET** `/api/matchmaking?page=1&limit=10`  
Header: `Authorization: Bearer {{accessToken}}`  
Filtros opcionales:
```
zonaLocalidad=Centro
zonaCiudad=Bogota
zonaEstado=Cundinamarca
zonaPais=Colombia
```
Requiere usuario activo, con rango y vehiculo activo.
