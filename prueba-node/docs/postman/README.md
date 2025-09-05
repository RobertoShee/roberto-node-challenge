# 📋 Documentación de Postman - API de Gestión de Tareas

## 🚀 Importar la Colección

### Opción 1: Importar archivo JSON
1. Abrir Postman
2. Clic en **Import** (esquina superior izquierda)
3. Seleccionar **Upload Files**
4. Seleccionar el archivo `API-Tareas.postman_collection.json`
5. Clic en **Import**

### Opción 2: Importar desde Git (si está en repositorio)
1. Abrir Postman
2. Clic en **Import**
3. Seleccionar **Link** o **Code repository**
4. Pegar la URL del archivo JSON

## 🔧 Configuración de Variables

### Variables de Colección
La colección incluye las siguientes variables predefinidas:

| Variable | Valor por Defecto | Descripción |
|----------|-------------------|-------------|
| `baseUrl` | `http://localhost:3000` | URL base del API |
| `lastCreatedTaskId` | (vacío) | ID de la última tarea creada |

### Cambiar URL Base
Para probar contra un servidor diferente:

1. Clic derecho en la colección **📝 API de Gestión de Tareas**
2. Seleccionar **Edit**
3. Ir a la pestaña **Variables**
4. Cambiar el valor de `baseUrl`:
   - **Desarrollo local**: `http://localhost:3000`
   - **Producción**: `https://tu-dominio.com`
   - **Docker**: `http://localhost:3000` (por defecto)

## 📡 Endpoints Incluidos

### 🔍 Health Check
- **GET** `/health` - Verificar que el servidor esté funcionando

### 📝 Gestión de Tareas
- **GET** `/tasks` - Listar todas las tareas
- **GET** `/tasks/:id` - Obtener tarea por ID
- **POST** `/tasks` - Crear nueva tarea
- **PUT** `/tasks/:id` - Actualizar estado de tarea
- **DELETE** `/tasks/:id` - Eliminar tarea

### ❌ Casos de Error
- Ejemplos de errores 400, 404, 500
- Validación de datos incorrectos
- Manejo de errores según RFC 7807

## 🧪 Tests Automáticos

### Tests Globales (En cada request)
- ✅ Verificación de headers de respuesta
- ⏱️ Tiempo de respuesta aceptable (< 2 segundos)
- 📊 Logging automático de status y tiempo

### Tests Específicos por Endpoint

#### Health Check
- Status code 200
- Propiedad `ok: true` en respuesta
- Tiempo de respuesta < 200ms

#### Listar Tareas
- Status code 200
- Respuesta es un array
- Cada tarea tiene propiedades requeridas

#### Crear Tarea
- Status code 201
- Tarea creada con propiedades requeridas
- Status por defecto "pendiente"
- **Guarda automáticamente** el ID en `lastCreatedTaskId`

#### Actualizar Tarea
- Status code 200
- Status actualizado correctamente
- `fechaActualizacion` es posterior a `fechaCreacion`

#### Eliminar Tarea
- Status code 204
- Respuesta vacía
- Tiempo de respuesta aceptable

## 🔄 Flujo de Pruebas Recomendado

### 1. Verificación Inicial
```
1. Health Check → Verificar que el servidor esté funcionando
2. Listar Tareas → Ver estado inicial
```

### 2. Flujo Completo CRUD
```
1. Crear nueva tarea → Status 201, guardar ID automáticamente
2. Listar todas las tareas → Verificar que aparece la nueva tarea
3. Obtener tarea por ID → Usar el ID guardado
4. Actualizar estado → Cambiar a "completada"
5. Verificar actualización → Obtener tarea por ID nuevamente
6. Eliminar tarea → Usar el ID guardado automáticamente
7. Verificar eliminación → Intentar obtener tarea eliminada (404)
```

### 3. Casos de Error
```
1. Crear tarea con datos inválidos → Error 400
2. Obtener tarea inexistente → Error 404
3. Actualizar con status inválido → Error 400
```

## 📊 Formatos de Respuesta

### Respuesta Exitosa
```json
{
  "id": 1,
  "titulo": "Completar proyecto",
  "descripcion": "Descripción de la tarea",
  "status": "pendiente",
  "fechaCreacion": "2025-09-03T04:00:00.000Z",
  "fechaActualizacion": "2025-09-03T04:00:00.000Z"
}
```

### Error RFC 7807
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

## 🎯 Casos de Uso Específicos

### Testing de Validaciones
Para probar todas las validaciones:

1. **Título vacío:**
   ```json
   {"titulo": "", "descripcion": "Descripción válida"}
   ```

2. **Título muy largo:**
   ```json
   {"titulo": "a".repeat(101), "descripcion": "Descripción válida"}
   ```

3. **Descripción muy larga:**
   ```json
   {"titulo": "Título válido", "descripcion": "a".repeat(501)}
   ```

4. **Status inválido:**
   ```json
   {"status": "estado_inexistente"}
   ```

### Testing de Estados
Estados válidos para actualización:
- `pendiente` (por defecto)
- `completada`
- `cancelada`

### Variables Automáticas
La colección guarda automáticamente:
- `lastCreatedTaskId`: ID de la última tarea creada
- Úsala en requests posteriores como `{{lastCreatedTaskId}}`

## 🔗 WebSockets (Información)

**Nota:** Los WebSockets no se pueden probar directamente en Postman, pero la API emite eventos:
- `newTask` - Nueva tarea creada
- `taskUpdated` - Tarea actualizada  
- `taskDeleted` - Tarea eliminada

Para probar WebSockets, usar herramientas como:
- Socket.IO Client
- WebSocket King
- Navegador con JavaScript

## 🐛 Debugging

### Headers Automáticos
Cada request incluye automáticamente:
- `X-Request-Timestamp`: Timestamp del request
- `Content-Type`: application/json (para POST/PUT)

### Console Logs
La colección incluye logs automáticos:
- 🚀 URL del request antes de enviarlo
- ✅ Status y código de respuesta
- ⏱️ Tiempo de respuesta

### Variables de Debug
Para ver variables actuales:
1. Clic en el ícono del ojo (👁️) en la esquina superior derecha
2. Ver sección **Collection Variables**

## 📝 Notas Importantes

1. **Servidor Local**: Asegúrate de que el servidor esté corriendo en `http://localhost:3000`
2. **Base de Datos**: Los IDs son auto-incrementales, pueden variar entre ejecuciones
3. **Variables Globales**: `lastCreatedTaskId` se guarda automáticamente al crear tareas
4. **Tests Automáticos**: Se ejecutan en cada request, revisar la pestaña **Test Results**
5. **Tiempo de Respuesta**: Los tests fallan si el servidor tarda más de 2 segundos

¡Disfruta probando la API! 🚀
