# 📋 PowerShell Build Script para Windows
# Equivalente al Makefile para sistemas Windows

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Colores para output en PowerShell
function Write-ColorText($text, $color = "White") {
    Write-Host $text -ForegroundColor $color
}

function Write-Blue($text) { Write-ColorText $text "Blue" }
function Write-Green($text) { Write-ColorText $text "Green" }
function Write-Yellow($text) { Write-ColorText $text "Yellow" }
function Write-Red($text) { Write-ColorText $text "Red" }

# Función de ayuda
function Show-Help {
    Write-Blue "📋 API de Gestión de Tareas - Build Script"
    Write-Host ""
    Write-Green "🚀 Comandos de Desarrollo:"
    Write-Host "  .\build.ps1 install     - 📦 Instalar dependencias"
    Write-Host "  .\build.ps1 dev         - 🔧 Ejecutar en modo desarrollo"
    Write-Host "  .\build.ps1 build       - 🏗️  Compilar TypeScript"
    Write-Host "  .\build.ps1 start       - ▶️  Ejecutar versión compilada"
    Write-Host "  .\build.ps1 clean       - 🧹 Limpiar archivos compilados"
    Write-Host ""
    Write-Green "🗄️ Base de Datos:"
    Write-Host "  .\build.ps1 db-migrate  - 🔄 Ejecutar migraciones"
    Write-Host "  .\build.ps1 db-revert   - ⏪ Revertir última migración"
    Write-Host "  .\build.ps1 db-reset    - 🗑️  Resetear base de datos"
    Write-Host "  .\build.ps1 db-backup   - 💾 Backup de base de datos"
    Write-Host ""
    Write-Green "🧪 Testing:"
    Write-Host "  .\build.ps1 test        - 🧪 Ejecutar todos los tests"
    Write-Host "  .\build.ps1 test-unit   - 🔬 Tests unitarios"
    Write-Host "  .\build.ps1 test-coverage - 📊 Cobertura de código"
    Write-Host "  .\build.ps1 test-dates  - 📅 Test de timestamps automáticos"
    Write-Host "  .\build.ps1 test-shutdown - 🛑 Test de graceful shutdown"
    Write-Host ""
    Write-Green "🔍 Calidad de Código:"
    Write-Host "  .\build.ps1 lint        - 🕵️  Verificar código con ESLint"
    Write-Host "  .\build.ps1 lint-fix    - 🔧 Corregir errores automáticamente"
    Write-Host "  .\build.ps1 format      - 🎨 Formatear código con Prettier"
    Write-Host "  .\build.ps1 type-check  - ✅ Verificar tipos TypeScript"
    Write-Host ""
    Write-Green "🛠️ Utilidades:"
    Write-Host "  .\build.ps1 health      - 💓 Verificar salud del proyecto"
    Write-Host "  .\build.ps1 stats       - 📊 Estadísticas del proyecto"
    Write-Host "  .\build.ps1 quick-start - 🚀 Configuración completa"
}

# Funciones de comando
function Install-Dependencies {
    Write-Blue "📦 Instalando dependencias..."
    yarn install
    if ($LASTEXITCODE -eq 0) {
        Write-Green "✅ Dependencias instaladas"
    } else {
        Write-Red "❌ Error instalando dependencias"
        exit 1
    }
}

function Start-Development {
    Install-Dependencies
    Invoke-DbMigrate
    Write-Blue "🔧 Iniciando servidor en modo desarrollo..."
    yarn dev
}

function Build-Project {
    Write-Blue "🏗️ Compilando TypeScript..."
    yarn build
    if ($LASTEXITCODE -eq 0) {
        Write-Green "✅ Compilación completada"
    } else {
        Write-Red "❌ Error en compilación"
        exit 1
    }
}

function Start-Production {
    Build-Project
    Write-Blue "▶️ Iniciando servidor..."
    yarn start
}

function Clean-Project {
    Write-Blue "🧹 Limpiando archivos compilados..."
    if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
    if (Test-Path "coverage") { Remove-Item -Recurse -Force "coverage" }
    if (Test-Path ".nyc_output") { Remove-Item -Recurse -Force ".nyc_output" }
    Write-Green "✅ Limpieza completada"
}

function Invoke-DbMigrate {
    Write-Blue "🔄 Ejecutando migraciones..."
    yarn typeorm:run
    if ($LASTEXITCODE -eq 0) {
        Write-Green "✅ Migraciones completadas"
    } else {
        Write-Red "❌ Error en migraciones"
        exit 1
    }
}

function Invoke-DbRevert {
    Write-Blue "⏪ Revirtiendo migración..."
    yarn typeorm:revert
    if ($LASTEXITCODE -eq 0) {
        Write-Green "✅ Migración revertida"
    } else {
        Write-Red "❌ Error revirtiendo migración"
        exit 1
    }
}

function Reset-Database {
    Write-Blue "🗑️ Reseteando base de datos..."
    if (Test-Path "database.sqlite") { Remove-Item "database.sqlite" }
    Invoke-DbMigrate
    Write-Green "✅ Base de datos reseteada"
}

function Backup-Database {
    Write-Blue "💾 Creando backup de base de datos..."
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    Copy-Item "database.sqlite" "database.sqlite.backup.$timestamp"
    Write-Green "✅ Backup creado: database.sqlite.backup.$timestamp"
}

function Run-Tests {
    Build-Project
    Write-Blue "🧪 Ejecutando todos los tests..."
    yarn test
    if ($LASTEXITCODE -eq 0) {
        Write-Green "✅ Tests completados"
    } else {
        Write-Red "❌ Tests fallaron"
        exit 1
    }
}

function Run-TestsUnit {
    Write-Blue "🔬 Ejecutando tests unitarios..."
    yarn test:unit
    if ($LASTEXITCODE -eq 0) {
        Write-Green "✅ Tests unitarios completados"
    } else {
        Write-Red "❌ Tests unitarios fallaron"
        exit 1
    }
}

function Run-TestsCoverage {
    Write-Blue "📊 Generando reporte de cobertura..."
    yarn test:coverage
    if ($LASTEXITCODE -eq 0) {
        Write-Green "✅ Reporte de cobertura generado"
        Write-Yellow "📊 Verificando cobertura mínima del 90%"
    } else {
        Write-Red "❌ Error en reporte de cobertura"
        exit 1
    }
}

function Test-Dates {
    Write-Blue "📅 Ejecutando test de timestamps automáticos..."
    yarn test:dates
    if ($LASTEXITCODE -eq 0) {
        Write-Green "✅ Test de fechas completado"
    } else {
        Write-Red "❌ Test de fechas falló"
        exit 1
    }
}

function Test-Shutdown {
    Write-Blue "🛑 Ejecutando test de graceful shutdown..."
    yarn test:shutdown
    if ($LASTEXITCODE -eq 0) {
        Write-Green "✅ Test de shutdown completado"
    } else {
        Write-Red "❌ Test de shutdown falló"
        exit 1
    }
}

function Run-Lint {
    Write-Blue "🕵️ Verificando código con ESLint..."
    yarn lint
    if ($LASTEXITCODE -eq 0) {
        Write-Green "✅ Verificación completada"
    } else {
        Write-Red "❌ Errores de lint encontrados"
        exit 1
    }
}

function Fix-Lint {
    Write-Blue "🔧 Corrigiendo errores de ESLint..."
    yarn lint:fix
    if ($LASTEXITCODE -eq 0) {
        Write-Green "✅ Errores corregidos"
    } else {
        Write-Red "❌ Error corrigiendo lint"
        exit 1
    }
}

function Format-Code {
    Write-Blue "🎨 Formateando código con Prettier..."
    yarn format
    if ($LASTEXITCODE -eq 0) {
        Write-Green "✅ Código formateado"
    } else {
        Write-Red "❌ Error formateando código"
        exit 1
    }
}

function Check-Types {
    Write-Blue "✅ Verificando tipos TypeScript..."
    yarn tsc --noEmit
    if ($LASTEXITCODE -eq 0) {
        Write-Green "✅ Tipos verificados"
    } else {
        Write-Red "❌ Errores de tipos encontrados"
        exit 1
    }
}

function Check-Health {
    Write-Blue "💓 Verificando salud del proyecto..."
    Write-Yellow "📋 Verificando estructura..."
    
    if (Test-Path "package.json") { Write-Host "✅ package.json existe" } else { Write-Host "❌ package.json falta" }
    if (Test-Path "tsconfig.json") { Write-Host "✅ tsconfig.json existe" } else { Write-Host "❌ tsconfig.json falta" }
    if (Test-Path "src") { Write-Host "✅ Directorio src existe" } else { Write-Host "❌ Directorio src falta" }
    if (Test-Path "node_modules") { Write-Host "✅ node_modules existe" } else { Write-Host "❌ Ejecutar: .\build.ps1 install" }
    
    Write-Green "✅ Verificación de salud completada"
}

function Show-Stats {
    Write-Blue "📊 Estadísticas del proyecto..."
    Write-Yellow "📁 Archivos TypeScript:"
    $tsFiles = (Get-ChildItem -Recurse -Path "src" -Filter "*.ts").Count
    Write-Host "  Total: $tsFiles"
    
    Write-Yellow "📏 Líneas de código:"
    $lines = (Get-ChildItem -Recurse -Path "src" -Filter "*.ts" | Get-Content | Measure-Object -Line).Lines
    Write-Host "  Total: $lines"
    
    Write-Yellow "📦 Tamaño de node_modules:"
    if (Test-Path "node_modules") {
        $size = (Get-ChildItem -Recurse "node_modules" | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "  Total: $([math]::Round($size, 2)) MB"
    } else {
        Write-Host "  node_modules no encontrado"
    }
    
    Write-Yellow "🗄️ Tamaño de base de datos:"
    if (Test-Path "database.sqlite") {
        $dbSize = (Get-Item "database.sqlite").Length / 1KB
        Write-Host "  Total: $([math]::Round($dbSize, 2)) KB"
    } else {
        Write-Host "  Base de datos no encontrada"
    }
}

function Quick-Start {
    Write-Blue "🚀 Configuración completa..."
    Install-Dependencies
    Invoke-DbMigrate
    Start-Development
}

# Ejecutar comando basado en parámetro
switch ($Command.ToLower()) {
    "help" { Show-Help }
    "install" { Install-Dependencies }
    "dev" { Start-Development }
    "build" { Build-Project }
    "start" { Start-Production }
    "clean" { Clean-Project }
    "db-migrate" { Invoke-DbMigrate }
    "db-revert" { Invoke-DbRevert }
    "db-reset" { Reset-Database }
    "db-backup" { Backup-Database }
    "test" { Run-Tests }
    "test-unit" { Run-TestsUnit }
    "test-coverage" { Run-TestsCoverage }
    "test-dates" { Test-Dates }
    "test-shutdown" { Test-Shutdown }
    "lint" { Run-Lint }
    "lint-fix" { Fix-Lint }
    "format" { Format-Code }
    "type-check" { Check-Types }
    "health" { Check-Health }
    "stats" { Show-Stats }
    "quick-start" { Quick-Start }
    default {
        Write-Red "❌ Comando no reconocido: $Command"
        Write-Host ""
        Show-Help
        exit 1
    }
}
