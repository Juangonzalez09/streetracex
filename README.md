# StreetRaceX 🏁

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-22%2B-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.6.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Una plataforma digital para conectar pilotos de calle, retarse y competir en diferentes modalidades. Los pilotos ascienden en un sistema de rangos competitivo basado en victorias consecutivas.

**Tabla de Contenidos:**
- [Visión del Producto](#visión-del-producto)
- [Estructura del Monorepo](#estructura-del-monorepo)
- [Requisitos Previos](#requisitos-previos)
- [Cómo Correr el Proyecto](#cómo-correr-el-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Próximas Etapas](#próximas-etapas)

---

## Visión del Producto

**StreetRaceX** es la plataforma de referencia para la comunidad de pilotos, donde la rivalidad sana, el respeto y la emoción de la velocidad convergen en una experiencia digital en tiempo real.

### Características Principales

- **Emparejamiento Inteligente**: Conecta pilotos del mismo rango y tipo de vehículo
- **Sistema de Retos**: Múltiples modalidades de carrera (cuarto de milla, vueltas, derrape)
- **Evolución por Rangos**: Asciende competitivamente (D → C → B → A → S)
- **Perfil de Piloto**: Estadísticas detalladas, vehículos e historial
- **Notificaciones en Tiempo Real**: WebSockets para eventos instantáneos (próximamente)

### Actores

| Rol | Capacidades |
|---|---|
| **Piloto** | Gestiona su perfil, vehículos, envía/recibe retos y escala en rangos |
| **Administrador** | Supervisa usuarios, resuelve disputas y gestiona categorías |

---

## Estructura del Monorepo

```
streetracex/
├── api/                          # Backend (Node.js + TypeScript + Express)
│   ├── prisma/
│   │   ├── schema.prisma         # Definición del esquema de la BD
│   │   └── migrations/           # Historial de migraciones SQL
│   ├── src/
│   │   ├── main.ts               # Punto de entrada del servidor
│   │   ├── domain/               # Entidades e interfaces (sin dependencias externas)
│   │   │   └── auth/
│   │   │       ├── User.ts
│   │   │       └── UserRepository.ts
│   │   ├── application/          # Casos de uso (orquestación del dominio)
│   │   │   └── auth/
│   │   │       └── RegisterUserUseCase.ts
│   │   └── infrastructure/       # Adaptadores (Prisma, Express, controladores)
│   │       ├── auth/
│   │       │   └── PrismaUserRepository.ts
│   │       ├── http/
│   │       │   ├── controllers/
│   │       │   └── routes/
│   │       └── dependencies.ts   # Composition root (inyección de dependencias)
│   ├── prisma.config.ts          # Configuración del CLI de Prisma
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── web/                          # Frontend (próximamente)
└── README.md
```

---

## Requisitos Previos

- **Node.js 22+**: [Descargar](https://nodejs.org/)
- **npm 10+**: Incluido con Node.js
- **PostgreSQL 13+**: [Descargar](https://www.postgresql.org/download/)
- **Git**: [Descargar](https://git-scm.com/)

```bash
node --version    # v22.X.X o superior
npm --version     # 10.X.X o superior
psql --version    # 13.X o superior
```

---

## Cómo Correr el Proyecto

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/StreetRaceX.git
cd StreetRaceX
```

### Paso 2 — Instalar dependencias

```bash
cd api
npm install
```

### Paso 3 — Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `api/.env` con tus credenciales reales:

```env
PORT=3000
DATABASE_URL=postgresql://USUARIO:PASSWORD@localhost:5432/streetracex
JWT_SECRET=un_secreto_largo_y_seguro_aqui
```

> Si la base de datos aún no existe, créala en PostgreSQL:
> ```sql
> CREATE DATABASE streetracex;
> ```

> **Nunca subas `.env` a Git.** Usa `.env.example` como plantilla.

### Paso 4 — Generar el cliente de Prisma

```bash
npm run prisma:generate
```

Esto genera los tipos TypeScript de Prisma en `node_modules/@prisma/client` a partir del `schema.prisma`.

### Paso 5 — Aplicar migraciones a la base de datos

```bash
npm run prisma:migrate:deploy
```

Esto crea todas las tablas definidas en el esquema (`users`, `vehicles`, `challenges`, `notifications`, etc.).

### Paso 6 — Levantar el servidor

```bash
npm run dev
```

Salida esperada:

```
🏁 Motor encendido! Servidor de Street Race X corriendo en http://localhost:3000
```

### Paso 7 — Verificar que la documentación responde

```bash
curl http://localhost:3000/api/docs
```

Respuesta esperada:

```html
<!DOCTYPE html>
<html>
  ...
</html>
```

### Paso 8 — Abrir la documentación de API

Con el servidor levantado, abre:

- Swagger UI: `http://localhost:3000/api/docs`

> La documentación se define en `api/src/infrastructure/http/docs/` y se modulariza en:
> `openapi.ts`, `paths/` y `schemas/`.

---

## Scripts Disponibles

Todos los scripts se ejecutan desde `api/`:

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor en modo desarrollo con hot reload (`tsx watch`) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta el build compilado |
| `npm run prisma:generate` | Genera el cliente de Prisma desde el schema |
| `npm run prisma:migrate:dev` | Crea y aplica una nueva migración en desarrollo |
| `npm run prisma:migrate:deploy` | Aplica migraciones pendientes en producción |
| `npm run prisma:studio` | Abre el explorador visual de la base de datos |

---

## Próximas Etapas

- [x] Estructura hexagonal (Domain → Application → Infrastructure)
- [x] Esquema de base de datos con Prisma
- [x] Registro de usuarios con JWT y bcrypt
- [ ] Login y autenticación completa
- [ ] Gestión de vehículos
- [ ] Sistema de retos entre pilotos
- [ ] Sistema de rangos (D → C → B → A → S)
- [ ] Notificaciones en tiempo real (Socket.io)
- [ ] Frontend web (React / Next.js)
- [ ] Documentación de API (Swagger / OpenAPI)
- [ ] Tests unitarios e integración

---

## Contribuir

1. Fork del repositorio
2. Crea tu rama: `git checkout -b feature/mi-feature`
3. Sigue la arquitectura hexagonal: Domain → Application → Infrastructure
4. Commit: `git commit -m "feat: descripción"`
5. Push: `git push origin feature/mi-feature`
6. Abre un Pull Request
