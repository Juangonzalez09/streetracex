# StreetRaceX 🏁

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-20%2B-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.6.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Una plataforma digital para conectar pilotos de calle, retarse y competir en diferentes modalidades. Los pilotos ascienden en un sistema de rangos competitivo basado en victorias consecutivas.

**Tabla de Contenidos:**
- [Visión del Producto](#visión-del-producto)
- [Estructura del Monorepo](#estructura-del-monorepo)
- [Cómo Clonar y Correr](#cómo-clonar-y-correr)
---

## Visión del Producto

**StreetRaceX** es la plataforma de referencia para la comunidad de pilotos, donde la rivalidad sana, el respeto y la emoción de la velocidad convergen en una experiencia digital en tiempo real.

### Características Principales

✅ **Emparejamiento Inteligente**: Conecta pilotos del mismo rango y tipo de vehículo  
✅ **Sistema de Retos**: Múltiples modalidades de carrera (cuarto de milla, vueltas, derrape)  
✅ **Evolución por Rangos**: Asciende competitivamente (D → C → B → A → S)  
✅ **Perfil de Piloto**: Estadísticas detalladas, vehículos y historial  
✅ **Notificaciones en Tiempo Real**: WebSockets para eventos instantáneos  

### Actores

- **Piloto**: Gestiona su perfil, vehículos, envía/recibe retos y escala en rangos
- **Administrador**: Supervisa usuarios, resuelve disputas y gestiona categorías

---

## Estructura del Monorepo

StreetRaceX es un **monorepo** que centraliza el control de versiones, la coordinación y la documentación de toda la plataforma.

```
StreetRaceX/
├── api/                           # Backend (Node.js + TypeScript + Express)
│   ├── src/
│   │   ├── main.ts               # Punto de entrada (inicialización del servidor)
│   │   ├── domain/               # Capa de dominio (reglas de negocio puras)
│   │   │   └── auth/
│   │   │       ├── User.ts       # Entidad Usuario
│   │   │       └── UserRepository.ts  # Contrato (interfaz) para persistencia
│   │   ├── application/          # Capa de aplicación (orquestación de casos de uso)
│   │   │   └── auth/
│   │   │       └── RegisterUserUseCase.ts  # Lógica de registro
│   │   ├── infrastructure/       # Capa de infraestructura (detalles técnicos)
│   │   │   ├── auth/
│   │   │   │   └── PostgresUserRepository.ts  # Implementación con DB
│   │   │   ├── http/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── AuthController.ts  # Manejo HTTP
│   │   │   │   └── routes/
│   │   │   │       └── auth.routes.ts   # Definición de endpoints
│   │   │   └── dependencies.ts   # Inyección de dependencias
│   │   └── shared/               # Utilidades transversales
│   ├── package.json              # Dependencias y scripts
│   ├── tsconfig.json             # Configuración TypeScript
│   ├── .env.example              # Template de variables de entorno
│   └── dist/                     # Código compilado (generado)
│
├── web/                          # Frontend (próximamente)
│
├── README.md                     # Documentación principal
└── StreetRaceX_Proyecto E2.docx  # Especificación completa del proyecto
```

### ¿Por qué Monorepo?

1. **Versionado Único**: Un solo punto de control de versiones para API y Frontend
2. **Coordinación Simplificada**: Cambios en API y Frontend se sincronizan fácilmente
3. **Documentación Centralizada**: Guías y convenciones en un solo lugar
4. **Escalabilidad**: Fácil agregar nuevos servicios al monorepo

---

## Cómo Clonar y Correr

### Requisitos Previos

Antes de empezar, asegúrate de tener:

- **Node.js 20+**: [Descargar](https://nodejs.org/)
- **npm 10+**: Viene con Node.js
- **Git**: [Descargar](https://git-scm.com/)
- **(Opcional) PostgreSQL 13+**: Si planeas usar BD

#### Verificar Instalación

```bash
node --version    # v20.X.X o superior
npm --version     # 10.X.X o superior
git --version     # 2.X.X o superior
```

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/StreetRaceX.git
cd StreetRaceX
```

### Paso 2: Entrar a la Carpeta del Backend

```bash
cd api
```

### Paso 3: Instalar Dependencias

```bash
npm install
```

Crea `node_modules/` con todas las librerías necesarias.

### Paso 4: Configurar Variables de Entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Edita `.env`:

```env
PORT=3000
JWT_SECRET=tu_super_secreto_para_desarrollo_aqui_minimo_32_caracteres
DB_URI=postgresql://usuario:password@localhost:5432/streetracex
NODE_ENV=development
```

⚠️ **IMPORTANTE**: Nunca commits `.env` a Git. Usa `.env.example` como template.

### Paso 5: Ejecutar en Modo Desarrollo

```bash
npm run dev
```

Esperado:

```
Server is running on http://localhost:3000 🚀
```

### Paso 6: Probar el Servidor

En otra terminal:

**Opción A: Con curl**

```bash
curl http://localhost:3000/api/health
```

**Opción B: Con Postman**

1. GET `http://localhost:3000/api/health`
2. Click Send

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-04-08T01:47:49.454Z"
}
```

✅ **¡Servidor funcionando!**

---

### Flujo de Trabajo

1. Crea rama: `git checkout -b feature/nuevo-endpoint`
2. Desarrolla siguiendo arquitectura hexagonal (Domain → App → Infra)
3. Prueba: `npm run dev` + curl/Postman
4. Compila: `npm run build`
5. Commit: `git commit -m "feat: descripción"`
6. Push: `git push origin feature/nuevo-endpoint`
7. Abre Pull Request


## Próximas Etapas

- [ ] Implementar registro e login (JWT)
- [ ] Integración PostgreSQL completa
- [ ] Validación con Zod
- [ ] Tests unitarios (Jest)
- [ ] WebSockets (Socket.io)
- [ ] Frontend web (React/Vue)
- [ ] API docs (Swagger/OpenAPI)

---

## Contribuir

1. Fork repositorio
2. Rama: `git checkout -b feature/mi-feature`
3. Commit: `git commit -m "feat: descripción"`
4. Push: `git push origin feature/mi-feature`
5. Pull Request

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

