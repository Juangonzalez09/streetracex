# StreetRaceX

Monorepo inicial para **StreetRaceX** con:
- `api/` → Backend (Node.js + TypeScript + Express + RxJS), orientado a arquitectura hexagonal.
- `web/` → Frontend monolítico (placeholder inicial).

---

## 1) Estructura validada (estado actual)

```text
StreetRaceX/
├─ api/
│  ├─ package.json
│  ├─ package-lock.json
│  ├─ tsconfig.json
│  ├─ .env.example
│  └─ src/
│     ├─ main.ts
│     ├─ domain/
│     │  └─ auth/
│     ├─ application/
│     ├─ infrastructure/
│     │  ├─ auth/
│     │  └─ http/
│     └─ shared/
└─ web/
   └─ .gitkeep
```

> Nota: en esta primera versión, el backend está en modo base (health check y configuración), y la separación hexagonal ya está planteada por carpetas.

---

## 2) ¿Qué significa “monorepo” aquí?

Un solo repositorio contiene varios módulos del sistema:
- **API** (backend)
- **WEB** (frontend)

Ventajas:
- Un solo punto de versionado.
- Coordinación más simple entre backend y frontend.
- Convenciones y documentación centralizadas.

---

## 3) Hexagonal (simple) para backend

La idea es separar responsabilidades:

- **domain/**: reglas de negocio puras (sin Express, sin DB).
- **application/**: casos de uso (orquesta reglas del dominio).
- **infrastructure/**: detalles técnicos (HTTP, DB, JWT, etc.).
- **shared/**: utilidades/configuración transversal.

### Flujo conceptual (hexagonal)

```text
HTTP Request
   ↓
Infrastructure (controllers/routes)
   ↓
Application (use case)
   ↓
Domain (reglas/contratos)
   ↓
Infrastructure (adaptadores concretos: DB/JWT/etc.)
   ↓
HTTP Response
```

---

## 4) Clonar y correr esta primera versión (paso a paso)

## Requisitos
- Node.js 20+ recomendado
- npm 10+ recomendado

## Pasos
1. Clonar repositorio
   ```bash
   git clone <URL_DEL_REPO>
   cd StreetRaceX
   ```

2. Entrar al backend
   ```bash
   cd api
   ```

3. Instalar dependencias
   ```bash
   npm install
   ```

4. Crear variables de entorno (desde ejemplo)
   - Copia `.env.example` a `.env`
   - Ajusta valores mínimos:
     - `PORT=3000`
     - `JWT_SECRET=...`
     - `DB_URI=...` (aunque todavía no se usa activamente en `main.ts`)

5. Ejecutar en desarrollo
   ```bash
   npm run dev
   ```

6. Probar health endpoint
   - `GET http://localhost:3000/api/health`

Respuesta esperada: JSON indicando que la API está funcionando.

---

## 5) Scripts disponibles (api/package.json)

- `npm run dev` → servidor en modo desarrollo con `tsx watch`
- `npm run build` → compila TypeScript a `dist/`
- `npm start` → ejecuta build compilado

---

## 6) Flujo actual de ejecución (versión inicial)

```text
main.ts
 ├─ carga variables de entorno
 ├─ crea app de Express
 ├─ registra middlewares globales (helmet, cors, json)
 ├─ expone GET /api/health
 └─ inicia servidor en PORT
```

---

## 7) Qué tener en cuenta

- Esta versión es **base**: estructura preparada, sin caso de uso completo de negocio aún.
- `DB_URI` está definida para siguiente etapa (integración real con PostgreSQL).
- Antes de subir cambios:
  - mantener separación por capas (hexagonal),
  - no mezclar lógica de negocio en controladores,
  - validar variables de entorno por ambiente.

