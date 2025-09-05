
# API de Gestión de Tareas

API REST y WebSockets para gestionar tareas. Stack: Node.js, Express, TypeORM, Socket.IO, TypeScript.

## Características
- CRUD de tareas
- WebSockets en tiempo real
- SQLite + TypeORM
- Validación y manejo de errores
- Logging y testing
- Docker Ready

## Requisitos
- Node.js 22+
- Yarn o npm

## Instalación rápida
```bash
git clone <https://github.com/RobertoShee/roberto-node-challenge.git>
cd prueba-node
yarn install
make quick-start
```

## Ejecución
- Desarrollo: `yarn dev`
- Producción: `yarn build && yarn start`
- Tests: `yarn test` / `yarn test:coverage`
- Docker: `docker-compose up`

## Endpoints principales
- `GET /health` → Estado API
- `GET /tasks` → Listar tareas
- `POST /tasks` → Crear tarea
- `PUT /tasks/:id` → Actualizar estado
- `DELETE /tasks/:id` → Eliminar tarea

## WebSockets
Eventos: `newTask`, `taskUpdated`, `taskDeleted`

## Estructura
```
src/
 ├─ common/
 ├─ middlewares/
 ├─ modules/
 ├─ ws/
 └─ server.ts
```

## Licencia
MIT
