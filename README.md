# Requisitos previos

- Node.js >= 18
- npm >= 8
- make (opcional, recomendado para automatizar)

Si usas Windows y no tienes make, puedes instalarlo con [GnuWin](http://gnuwin32.sourceforge.net/packages/make.htm) o usar los pasos manuales.


# roberto-node-challenge

API REST para gestión de tareas usando Node.js, TypeScript y WebSockets.

## ¿Qué hace?
- Permite crear, listar, actualizar y eliminar tareas (CRUD)
- Notifica cambios en tiempo real vía WebSocket
- Valida datos y maneja errores de forma robusta


## ¿Cómo lo uso?


### Opción 1: Quick Start (recomendado)

```sh
git clone https://github.com/RobertoShee/roberto-node-challenge.git
cd roberto-node-challenge
make quick-start
```
El comando `make quick-start` instalará automáticamente todos los módulos necesarios (dependencias) usando `npm install`, configurará el entorno y levantará el servidor.


### Opción 2: Manual (sin make)

```sh
git clone https://github.com/RobertoShee/roberto-node-challenge.git
cd roberto-node-challenge
# Instala los módulos necesarios:
npm install
# (Opcional) Copia .env.example a .env y ajusta si es necesario
npm run dev
```

### Prueba la API
- Visita `http://localhost:3000` o usa herramientas como Postman.

---
Repositorio oficial: https://github.com/RobertoShee/roberto-node-challenge.git
