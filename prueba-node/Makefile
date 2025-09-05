# Makefile simplificado para Windows (sin emojis)
# Para mejor experiencia en Windows, usar: .\build.ps1

.PHONY: help install dev build start clean
.PHONY: db-migrate db-revert db-reset db-backup
.PHONY: test test-unit test-integration test-e2e test-coverage test-watch test-dates test-shutdown
.PHONY: lint lint-fix format type-check audit
.PHONY: prod-build prod-start docker-build docker-run
.PHONY: deps-update deps-check health stats quick-start

# Configuración
NODE_MODULES = ./node_modules
DIST_DIR = ./dist
COVERAGE_DIR = ./coverage

help: ## Mostrar esta ayuda
	@echo "API de Gestion de Tareas - Makefile para Windows"
	@echo ""
	@echo "RECOMENDACION: Para mejor experiencia en Windows usar: .\build.ps1 help"
	@echo ""
	@echo "Comandos de Desarrollo:"
	@echo "  make install     - Instalar dependencias"
	@echo "  make dev         - Ejecutar en modo desarrollo"
	@echo "  make build       - Compilar TypeScript"
	@echo "  make start       - Ejecutar version compilada"
	@echo "  make clean       - Limpiar archivos compilados"
	@echo ""
	@echo "Base de Datos:"
	@echo "  make db-migrate  - Ejecutar migraciones"
	@echo "  make db-revert   - Revertir ultima migracion"
	@echo "  make db-reset    - Resetear base de datos"
	@echo "  make db-backup   - Backup de base de datos"
	@echo ""
	@echo "Testing:"
	@echo "  make test        - Ejecutar todos los tests"
	@echo "  make test-unit   - Tests unitarios"
	@echo "  make test-coverage - Cobertura de codigo"
	@echo "  make test-dates  - Test de timestamps automaticos"
	@echo "  make test-shutdown - Test de graceful shutdown"
	@echo ""
	@echo "Calidad de Codigo:"
	@echo "  make lint        - Verificar codigo con ESLint"
	@echo "  make lint-fix    - Corregir errores automaticamente"
	@echo "  make format      - Formatear codigo con Prettier"
	@echo "  make type-check  - Verificar tipos TypeScript"
	@echo ""
	@echo "Utilidades:"
	@echo "  make health      - Verificar salud del proyecto"
	@echo "  make stats       - Estadisticas del proyecto"
	@echo "  make quick-start - Configuracion completa"

# Desarrollo
install: ## Instalar dependencias
	@echo "Instalando dependencias..."
	yarn install

dev: install db-migrate ## Ejecutar en modo desarrollo
	@echo "Iniciando servidor en modo desarrollo..."
	yarn dev

build: ## Compilar TypeScript
	@echo "Compilando TypeScript..."
	yarn build

start: build ## Ejecutar version compilada
	@echo "Iniciando servidor..."
	yarn start

clean: ## Limpiar archivos compilados
	@echo "Limpiando archivos compilados..."
	@if exist $(DIST_DIR) rmdir /s /q $(DIST_DIR)
	@if exist $(COVERAGE_DIR) rmdir /s /q $(COVERAGE_DIR)
	@if exist .nyc_output rmdir /s /q .nyc_output

# Base de datos
db-migrate: ## Ejecutar migraciones
	@echo "Ejecutando migraciones..."
	yarn typeorm:run

db-revert: ## Revertir ultima migracion
	@echo "Revirtiendo migracion..."
	yarn typeorm:revert

db-reset: ## Resetear base de datos
	@echo "Reseteando base de datos..."
	@if exist database.sqlite del database.sqlite
	@$(MAKE) db-migrate

db-backup: ## Backup de base de datos
	@echo "Creando backup de base de datos..."
	@powershell -Command "Copy-Item 'database.sqlite' \"database.sqlite.backup.$$(Get-Date -Format 'yyyyMMdd-HHmmss')\""

# Testing
test: build ## Ejecutar todos los tests
	@echo "Ejecutando todos los tests..."
	yarn test

test-unit: ## Tests unitarios
	@echo "Ejecutando tests unitarios..."
	yarn test:unit

test-coverage: ## Test con cobertura
	@echo "Generando reporte de cobertura..."
	yarn test:coverage

test-dates: ## Test de timestamps automaticos
	@echo "Ejecutando test de timestamps automaticos..."
	yarn test:dates

test-shutdown: ## Test de graceful shutdown
	@echo "Ejecutando test de graceful shutdown..."
	yarn test:shutdown

# Calidad de codigo
lint: ## Verificar codigo con ESLint
	@echo "Verificando codigo con ESLint..."
	yarn lint

lint-fix: ## Corregir errores automaticamente
	@echo "Corrigiendo errores de ESLint..."
	yarn lint:fix

format: ## Formatear codigo con Prettier
	@echo "Formateando codigo con Prettier..."
	yarn format

type-check: ## Verificar tipos TypeScript
	@echo "Verificando tipos TypeScript..."
	yarn tsc --noEmit

# Utilidades
health: ## Verificar salud del proyecto
	@echo "Verificando salud del proyecto..."
	@echo "Verificando estructura..."
	@if exist package.json echo "- package.json existe"
	@if exist tsconfig.json echo "- tsconfig.json existe"
	@if exist src echo "- Directorio src existe"
	@if exist $(NODE_MODULES) echo "- node_modules existe"

stats: ## Estadisticas del proyecto
	@echo "Estadisticas del proyecto..."
	@echo "Archivos TypeScript:"
	@powershell -Command "(Get-ChildItem -Recurse -Path 'src' -Filter '*.ts').Count"
	@echo "Lineas de codigo:"
	@powershell -Command "(Get-ChildItem -Recurse -Path 'src' -Filter '*.ts' | Get-Content | Measure-Object -Line).Lines"

quick-start: install db-migrate dev ## Configuracion completa
