# 📝 API de Gestión de Tareas

Una API REST moderna con WebSockets en tiempo real para gestión de tareas, construida con Node.js, Express, TypeORM y Socket.IO.

## 🚀 Características

- ✅ **CRUD completo** de tareas
- 🔄 **WebSockets en tiempo real** para actualizaciones instantáneas
- 🗄️ **Base de datos SQLite** con TypeORM
- 🛡️ **Validación robusta** con class-validator
- 🏗️ **Arquitectura limpia** con separación de responsabilidades
- 📊 **Códigos de estado HTTP** estándar
- 🔒 **Seguridad** - DTOs separados de entidades de BD
- 🎨 **Decoradores modernos** para validación y transformación
- ⚡ **TypeScript** con tipos estrictos
- 🛑 **Graceful Shutdown** - Cierre controlado del servidor
- ❌ **Error Handling Enterprise** - Manejo profesional de errores (RFC 7807)
- 📝 **Logging Estructurado** - Sistema de logs contextual y multinivel
- 🧪 **Testing Infrastructure** - Jest con 90% de cobertura objetivo
- 🤖 **Automatización Completa** - Scripts PowerShell y Makefile
- 🐳 **Docker Ready** - Containerización optimizada para producción

## 📋 Requisitos Previos

- **Node.js** 22+ 
- **Yarn** (recomendado) o npm
- **Git**

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <https://github.com/RobertoShee/roberto-node-challenge.git>
cd prueba-node
```

### 2. Instalar dependencias
```bash
yarn install
# o
npm install
```

### 3. Configurar variables de entorno
El proyecto incluye configuración por defecto, pero puedes crear un archivo `.env`:

```env
PORT=3000
DB_PATH=database.sqlite
DB_LOGGING=false
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 4. Ejecutar migraciones de base de datos
```bash
yarn typeorm:run
```

## 🚀 Ejecución

### 🪟 Para Windows (PowerShell - Recomendado)
```powershell
# � Ver todos los comandos disponibles
.\build.ps1 help

# 🚀 Inicio rápido
.\build.ps1 quick-start    # Instala dependencias, migra BD y arranca servidor

# 🔧 Desarrollo
.\build.ps1 dev           # Modo desarrollo con hot-reload
.\build.ps1 build         # Compilar TypeScript
.\build.ps1 start         # Ejecutar versión compilada

# 🧪 Testing
.\build.ps1 test          # Ejecutar todos los tests
.\build.ps1 test-coverage # Test con cobertura (90% mínimo)
.\build.ps1 test-dates    # Test de timestamps automáticos
.\build.ps1 test-shutdown # Test de graceful shutdown

# 🗄️ Base de datos
.\build.ps1 db-migrate    # Ejecutar migraciones
.\build.ps1 db-reset      # Resetear base de datos
.\build.ps1 db-backup     # Backup de base de datos

# 🔍 Calidad de código
.\build.ps1 lint          # Verificar código con ESLint
.\build.ps1 format        # Formatear código con Prettier
.\build.ps1 type-check    # Verificar tipos TypeScript

# 🛠️ Utilidades
.\build.ps1 health        # Verificar salud del proyecto
.\build.ps1 stats         # Estadísticas del proyecto
```

### 🐧 Para Linux/MacOS/Windows (Makefile)
```bash
# 📋 Ver todos los comandos disponibles
make help          # Ahora compatible con Windows (sin emojis problemáticos)

# 🚀 Inicio rápido
make quick-start      # Instala dependencias, migra BD y arranca servidor

# 🔧 Desarrollo
make dev             # Modo desarrollo con hot-reload
make build           # Compilar TypeScript
make start           # Ejecutar versión compilada

# 🧪 Testing
make test            # Ejecutar todos los tests
make test-coverage   # Test con cobertura (90% mínimo)
make test-dates      # Test de timestamps automáticos
make test-shutdown   # Test de graceful shutdown

# 🗄️ Base de datos
make db-migrate      # Ejecutar migraciones
make db-reset        # Resetear base de datos
make db-backup       # Backup de base de datos

# 🔍 Calidad de código
make lint            # Verificar código con ESLint
make format          # Formatear código con Prettier
make type-check      # Verificar tipos TypeScript

# 🛠️ Utilidades
make health          # Verificar salud del proyecto
make stats           # Estadísticas del proyecto

# 📦 Producción
make prod-build      # Build optimizado para producción
make docker-build    # Construir imagen Docker
make docker-run      # Ejecutar en Docker
```

### 📱 Uso con Yarn/NPM (Multiplataforma)
```bash
# Desarrollo
yarn dev             # Desarrollo con hot-reload
yarn build           # Compilar TypeScript
yarn start           # Ejecutar versión compilada

# Base de datos
yarn typeorm:run     # Ejecutar migraciones
yarn typeorm:revert  # Revertir migración

# Testing
yarn test            # Tests unitarios
yarn test:unit       # Tests unitarios específicos
yarn test:integration # Tests de integración
yarn test:e2e        # Tests end-to-end
yarn test:coverage   # Test con cobertura
yarn test:watch      # Tests en modo watch
yarn test:dates      # Test de timestamps automáticos
yarn test:shutdown   # Test de graceful shutdown

# Calidad de código
yarn format          # Formatear código con Prettier
yarn lint            # Verificar código con ESLint
yarn lint:fix        # Corregir errores automáticamente
```

### 🐳 Docker
```bash
# Desarrollo
docker-compose --profile dev up

# Producción
docker-compose up

# Testing
docker-compose --profile test run test
```

## 📡 API Endpoints

### 🔍 Health Check
```http
GET /health
```
**Respuesta:**
```json
{ "ok": true }
```

### 📝 Gestión de Tareas

#### Listar todas las tareas
```http
GET /tasks
```
**Respuesta:**
```json
[
  {
    "id": 1,
    "titulo": "Completar proyecto",
    "status": "pendiente",
    "fechaCreacion": "2025-09-03T04:00:00.000Z",
    "fechaActualizacion": "2025-09-03T04:00:00.000Z"
  }
]
```

#### Crear nueva tarea
```http
POST /tasks
Content-Type: application/json

{
  "titulo": "Nueva tarea",
  "descripcion": "Descripción opcional"
}
```
**Respuesta:** `201 Created`
```json
{
  "id": 2,
  "titulo": "Nueva tarea",
  "descripcion": "Descripción opcional",
  "status": "pendiente",
  "fechaCreacion": "2025-09-03T04:00:00.000Z",
  "fechaActualizacion": "2025-09-03T04:00:00.000Z"
}
```

#### Actualizar estado de tarea
```http
PUT /tasks/:id
Content-Type: application/json

{
  "status": "completada"
}
```
**Estados válidos:** `pendiente`, `completada`, `cancelada`

**Respuesta:** `200 OK` con la tarea actualizada

#### Eliminar tarea
```http
DELETE /tasks/:id
```
**Respuesta:** `204 No Content`

### ❌ Manejo de Errores

- `400 Bad Request` - Datos de entrada inválidos
- `404 Not Found` - Tarea no encontrada
- `500 Internal Server Error` - Error del servidor

**Formato de error:**
```json
{
  "type": "https://httpstatuses.com/400",
  "title": "Solicitud inválida",
  "status": 400,
  "detail": "Los datos enviados no cumplen las validaciones",
  "errors": {
    "titulo": ["El título debe tener entre 1 y 100 caracteres"]
  }
}
```

## 🔄 WebSockets en Tiempo Real

La aplicación emite eventos WebSocket para actualizaciones en tiempo real:

### Eventos emitidos:
- `newTask` - Nueva tarea creada
- `taskUpdated` - Tarea actualizada
- `taskDeleted` - Tarea eliminada

### Conexión desde cliente:
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('newTask', (task) => {
  console.log('Nueva tarea:', task);
});

socket.on('taskUpdated', (id, status) => {
  console.log(`Tarea ${id} actualizada a:`, status);
});

socket.on('taskDeleted', (id) => {
  console.log(`Tarea ${id} eliminada`);
});
```

## 🧪 Testing

### 📊 Cobertura de Código
El proyecto mantiene una cobertura mínima del **90%** en:
- **Líneas de código**
- **Funciones**
- **Branches**
- **Statements**

### 🔬 Tipos de Tests

#### Tests Unitarios
```bash
make test-unit
# o
yarn test:unit
```
- Testean componentes individuales aisladamente
- Ubicación: `tests/unit/`
- Mocks y stubs para dependencias externas

#### Tests de Integración
```bash
make test-integration
# o
yarn test:integration
```
- Testean la interacción entre componentes
- Ubicación: `tests/integration/`
- Base de datos en memoria

#### Tests End-to-End
```bash
make test-e2e
# o
yarn test:e2e
```
- Testean flujos completos de usuario
- Ubicación: `tests/e2e/`
- Servidor completo en ambiente de testing

### 📋 Tests Específicos
```bash
# Test de timestamps automáticos
make test-dates

# Test de graceful shutdown
make test-shutdown

# Todos los tests con cobertura
make test-coverage
```

### 🎯 Configuración Jest
- **Configuración:** `jest.config.json`
- **Setup:** `tests/setup.ts`
- **Ambiente:** Variables en `.env.test`
- **Timeout:** 30 segundos por test

---

## 🏗️ Arquitectura y Decisiones de Diseño

### 🚀 Características Enterprise Implementadas

#### 🛑 Graceful Shutdown
- **ServerManager Class**: Manejo profesional del ciclo de vida del servidor
- **Signal Handling**: SIGTERM, SIGINT, SIGQUIT con cleanup automático
- **Resource Cleanup**: Cierre ordenado de BD, WebSockets y HTTP server
- **Timeout Control**: Shutdown forzado si el graceful falla
- **Logging Detallado**: Trazabilidad completa del proceso de cierre

#### ❌ Error Handling Enterprise
- **RFC 7807 Compliance**: Respuestas de error estructuradas estándar
- **Jerarquía Custom**: AppError, ValidationError, NotFoundError, DatabaseError
- **Context Enrichment**: Errores con información contextual completa
- **Centralized Handling**: Middleware único para todo el manejo de errores
- **Automatic Logging**: Log automático de errores con stack traces

#### 📝 Sistema de Logging Estructurado
- **Multi-Level Logging**: ERROR, WARN, INFO, DEBUG
- **Contextual Information**: Logs con metadata relevante
- **Specialized Methods**: httpRequest(), database(), websocket()
- **Pretty Development**: Formato bonito para desarrollo
- **Production Ready**: Formato JSON para producción

#### 🧪 Testing Infrastructure
- **Jest Configuration**: Setup completo con thresholds de calidad
- **90% Coverage**: Objetivo mínimo para branches, functions, lines, statements
- **Organized Structure**: unit/, integration/, e2e/
- **Specialized Tests**: Graceful shutdown, timestamps automáticos
- **CI/CD Ready**: Configuración lista para integración continua

#### 🤖 Automatización Completa
- **PowerShell Script**: 40+ comandos para Windows con colores y emojis
- **Makefile Compatible**: Versión limpia sin caracteres problemáticos
- **Cross-Platform**: Funciona en Windows, Linux y MacOS
- **Health Checks**: Verificación automática de salud del proyecto
- **Statistics**: Métricas detalladas del proyecto

### 📁 Estructura del Proyecto
```
src/
├── common/                 # Utilidades compartidas
│   ├── errors/            # Errores customizados (AppError, ValidationError, etc.)
│   ├── logger/            # Sistema de logging estructurado
│   └── types/             # PickType, OmitType, utility types
├── config/                # Configuración de BD y entorno
├── middlewares/           # Middlewares de Express
│   ├── error-handler.ts   # Manejo centralizado de errores (RFC 7807)
│   └── validate-dto.ts    # Validación de DTOs
├── modules/               # Módulos de negocio
│   └── tasks/
│       ├── dto/          # Data Transfer Objects
│       ├── handlers/     # Lógica de peticiones HTTP
│       ├── controllers/  # Definición de rutas
│       ├── mappers/      # Conversión BD ↔ DTOs
│       ├── task.entity.ts # Entidad de base de datos
│       └── task.service.ts # Lógica de negocio
├── ws/                   # WebSockets
└── server.ts            # Punto de entrada con ServerManager y graceful shutdown
```

### 🎯 Decisiones Clave

#### 1. **Separación de DTOs y Entidades**
- **Problema:** Exponer entidades de BD directamente es inseguro
- **Solución:** DTOs públicos + Mappers para conversión segura
- **Beneficio:** Seguridad, flexibilidad de versionado

#### 2. **Decoradores para Validación**
- **Tecnología:** class-validator + class-transformer
- **Ventaja:** Validación declarativa, type-safe, reutilizable
- **Beneficio:** Mejora en la calidad del código y reducción de errores

#### 3. **Utility Types Custom**
- **Implementación:** PickType, OmitType
- **Beneficio:** Reutilización de tipos, consistencia

#### 4. **Arquitectura por Capas**
```
Controllers → Handlers → Services → Repositories → Database
     ↕           ↕          ↕           ↕           ↕
   Routes    HTTP Logic  Business   Data Access  SQLite
```

#### 5. **WebSockets Desacoplados**
- **Diseño:** Emisión desde handlers, no desde services
- **Ventaja:** Separación de responsabilidades

#### 6. **SQLite con TypeORM**
- **Justificación:** Simplicidad para desarrollo, fácil migración
- **Características:** Triggers automáticos para fechas

## 🗄️ Base de Datos

### Estructura de la tabla `tasks`
```sql
CREATE TABLE "tasks" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "titulo" varchar(100) NOT NULL,
  "descripcion" varchar(500),
  "status" varchar NOT NULL DEFAULT 'pendiente',
  "fecha_creacion" datetime NOT NULL DEFAULT (datetime('now')),
  "fecha_actualizacion" datetime NOT NULL DEFAULT (datetime('now'))
);

-- Trigger para actualización automática de fecha
CREATE TRIGGER set_fecha_actualizacion
AFTER UPDATE ON "tasks"
FOR EACH ROW
BEGIN
  UPDATE "tasks" SET "fecha_actualizacion" = datetime('now') WHERE "id" = NEW."id";
END;
```

### 📊 Características de BD:
- ✅ **Auto-incremento** en ID
- ✅ **Índices** en campos frecuentemente consultados
- ✅ **Timestamps automáticos** (creación y actualización)
- ✅ **Validación de longitud** en aplicación
- ✅ **Valores por defecto** apropiados

## 📁 Archivos de Configuración

### 🛠️ Desarrollo y Build
- **`build.ps1`** - Script PowerShell completo para Windows (40+ comandos)
- **`Makefile`** - Automatización para Linux/MacOS/Windows (compatible)
- **`Makefile.original`** - Backup del Makefile con emojis (para referencia)
- **`package.json`** - Dependencias y scripts
- **`tsconfig.json`** - Configuración TypeScript
- **`jest.config.json`** - Configuración de testing con 90% cobertura objetivo

### 🐳 Docker y Despliegue
- **`Dockerfile`** - Imagen optimizada multi-stage
- **`docker-compose.yml`** - Orquestación de contenedores
- **`.dockerignore`** - Archivos excluidos del build

### 📂 Gestión de Archivos
- **`.gitignore`** - Archivos excluidos de Git
- **`.onedriveignore`** - Archivos excluidos de OneDrive (incluye node_modules)
- **`tests/setup.ts`** - Configuración global de tests
- **`.env.test`** - Variables de entorno para tests

### 🎯 Comandos Útiles de Automatización

#### 🪟 PowerShell (Windows - Recomendado)
```powershell
.\build.ps1 help           # Ver todos los comandos disponibles
.\build.ps1 quick-start    # Configuración completa en un comando
.\build.ps1 health         # Verificar salud del proyecto
.\build.ps1 stats          # Estadísticas del proyecto
.\build.ps1 test-coverage  # Tests con reporte de cobertura 90%
```

#### 📋 Makefile (Multiplataforma)
```bash
make help           # Ver todos los comandos disponibles
make quick-start    # Configuración completa en un comando
make health         # Verificar salud del proyecto
make stats          # Estadísticas del proyecto
make test-coverage  # Tests con reporte de cobertura 90%
```

## 🧪 Testing

### Test de Fechas Automáticas
```bash
yarn test:dates
```
Verifica que `fechaActualizacion` se actualice automáticamente.

## 🔧 Tecnologías Utilizadas

### Backend Core
- **Node.js** - Runtime
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **TypeORM** - ORM para base de datos

### Validación y Transformación
- **class-validator** - Validación con decoradores
- **class-transformer** - Transformación de objetos
- **lodash-decorators** - Decoradores utilitarios

### Base de Datos
- **SQLite** - Base de datos embebida
- **Migraciones** automáticas con TypeORM

### WebSockets
- **Socket.IO** - Comunicación en tiempo real

### Herramientas de Desarrollo
- **tsx** - Ejecución TypeScript
- **ESLint** - Linting
- **Prettier** - Formateo de código

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo `LICENSE` para detalles.

---

## � Documentación Adicional

- **`PROYECTO-COMPLETADO.md`** - Resumen completo de mejoras implementadas
- **`GUIA-MULTIPLATAFORMA.md`** - Guía de uso para Windows/Linux/MacOS
- **`SOLUCION-MAKEFILE.md`** - Solución al problema de caracteres en Makefile
- **`EVALUACION.md`** - Evaluación técnica del proyecto (si existe)

## �🔗 Enlaces Útiles

- [TypeORM Documentation](https://typeorm.io/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [class-validator Documentation](https://github.com/typestack/class-validator)
- [Express.js Documentation](https://expressjs.com/)
