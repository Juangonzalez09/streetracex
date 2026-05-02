# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `api/`:

```bash
npm run dev                      # tsx watch — hot reload during development
npm run build                    # tsc -p tsconfig.json — compiles to dist/
npm start                        # node dist/main.js — runs compiled output
npm run prisma:generate          # Regenerate the Prisma client from schema
npm run prisma:migrate:dev       # Create and apply a new migration (development)
npm run prisma:migrate:deploy    # Apply pending migrations (production)
npm run prisma:studio            # Open visual DB browser
```

## Environment

Copy `api/.env.example` to `api/.env`. A single `.env` file inside `api/` holds all variables — there is no root-level `.env`.

```env
PORT=3000
DATABASE_URL=postgresql://USUARIO:PASSWORD@localhost:5432/streetracex
JWT_SECRET=secreto_largo_aqui
```

Node.js **v22+** required.

## Architecture: Hexagonal (Ports & Adapters)

The API under `api/src/` enforces strict layer boundaries:

```
domain/          ← Entities + Repository interfaces (no external deps, never imports Prisma)
application/     ← Use cases — orchestrate domain, call repository ports (never imports Prisma)
infrastructure/  ← Adapters: PrismaRepository, Express controllers, routes (only layer that imports PrismaClient)
main.ts          ← Bootstraps Express, registers middleware, mounts routes
```

**Dependency rule**: dependencies point inward only. Domain knows nothing about infrastructure; application calls repository interfaces, never concrete DB classes.

**Dependency injection** is manual and centralized in `infrastructure/dependencies.ts` (composition root):
- `PrismaClient` is instantiated once here and injected into repository adapters via constructor.
- Repository → injected into use case → injected into controller → exported as singleton.
- All new features must follow this wiring pattern.

## Prisma Setup

Schema and migrations live at `api/prisma/` (co-located with the API that owns the DB).

```
api/
├── prisma/
│   ├── schema.prisma    ← model definitions
│   └── migrations/      ← SQL migration history
└── prisma.config.ts     ← CLI config (schema path, engine)
```

The Prisma client outputs to `node_modules/@prisma/client` (default — no custom output path).  
Import it as: `import { PrismaClient } from '@prisma/client'`

## Adding a New Feature

Follow the existing `auth` feature as the reference implementation:

1. **`domain/<feature>/`** — define the entity and repository interface (port). No external imports.
2. **`application/<feature>/`** — implement one use case per file; inject the repository interface via constructor.
3. **`infrastructure/<feature>/Prisma<Feature>Repository.ts`** — implement the repository interface using the injected `PrismaClient`.
4. **`infrastructure/http/controllers/<Feature>Controller.ts`** — thin controller, calls use case, returns JSON. No business logic here.
5. **`infrastructure/http/routes/<feature>.routes.ts`** — Express router, mount on controller.
6. **`infrastructure/dependencies.ts`** — inject `prisma` into the new repository, wire and export the new controller.
7. **`main.ts`** — register the new router.

## Database Schema (Prisma)

Schema lives at `api/prisma/schema.prisma`. Key design decisions:

- `User.rango` defaults to `D` (lowest rank). Promotion logic (2 consecutive wins) lives in the application layer, not the DB.
- `User.retos_consecutivos` tracks consecutive wins for rank promotion. Resets on loss or promotion.
- `Vehicle.placa` is nullable — electric skateboards (`MONOPATIN_ELECTRICO`) have no license plate.
- `Vehicle.activo` defaults to `false`. The application layer enforces the max-3-vehicles and single-active-vehicle rules.
- `Challenge` uses three separate User relations (`Retador`, `Retado`, `Ganador`) with named relation strings — required because Prisma cannot infer ambiguous self-referencing relations.
- `onDelete` cascade chain: User→Notification (Cascade), User→Vehicle (Cascade), Vehicle→Challenge vehicle refs (SetNull), Challenge→ganador (SetNull). Challenge retador/retado are Restrict to preserve race history.
- `Notification.referencia_id` is a generic UUID for challenge references; `pista_id` and `categoria_id` are typed FK references for track/category notifications.

## Business Rules (Domain Layer)

Estas reglas deben implementarse en la capa `application/`, nunca en controllers ni en la BD.

### Sistema de Rangos

- Todos los usuarios inician en rango `D`.
- Progresión: `D → C → B → A → S` (S es el máximo, no hay descenso).
- Para **ascender**: 2 victorias consecutivas en el rango actual (`retos_consecutivos >= 2`).
- Una **derrota** reinicia `retos_consecutivos` a 0 (no descuenta rango).
- Al ascender, `retos_consecutivos` se reinicia a 0.

### Reglas de Retos

- Solo se pueden retar pilotos del **mismo rango** y con el **mismo tipo de vehículo** activo.
- No se permiten retos duplicados activos entre los mismos dos usuarios (`EstadoReto.PENDIENTE` o `EN_CURSO`).
- El resultado debe ser confirmado por ambas partes o por un administrador.
- Flujo de estados: `PENDIENTE → ACEPTADO → EN_CURSO → COMPLETADO` (o `RECHAZADO` / `CANCELADO`).

### Reglas de Vehículos y Perfil

- Máximo **3 vehículos** por usuario (validar en `RegisterVehicleUseCase`).
- Solo **un vehículo activo** a la vez; activar uno desactiva los demás.
- Un usuario necesita al menos un vehículo activo para poder enviar o aceptar retos.
- `Vehicle.placa` es nullable exclusivamente para `MONOPATIN_ELECTRICO`.

### Roles

| Rol | Capacidades |
|---|---|
| `PILOTO` | Gestiona su perfil, vehículos, retos. Descubre otros pilotos. |
| `ADMINISTRADOR` | Gestiona usuarios, supervisa retos, resuelve disputas, administra categorías y zonas. |

### Tipos de Carrera

| Tipo | Descripción |
|---|---|
| `CUARTO_MILLA` | Carrera en línea recta de 402 metros. |
| `VUELTAS` | Circuito con número de vueltas definido. |
| `DERRAPE` | Evaluación técnica subjetiva (no hay ganador automático). |

## Tech Stack

| Layer | Library |
|---|---|
| HTTP | Express 4 |
| Validation | Zod 4 |
| Auth | jsonwebtoken + bcryptjs |
| Database | PostgreSQL via PrismaClient |
| ORM/Migrations | Prisma 6 (`prisma-client-js`, classic engine) |
| Security | helmet, cors |
| Real-time (planned) | Socket.io |
| Runtime types | TypeScript 5.6 strict mode |
