# Sorteo de la Cesta de Navidad

Sistema de gestión de participantes y sorteo para la Cesta de Navidad desarrollado con TypeScript y Jest.

## 📋 Descripción

Este proyecto implementa un sistema completo para gestionar participantes y realizar sorteos de una Cesta de Navidad. Incluye:

- Gestión de participantes con validación de datos
- Tablero de 100 números (00-99)
- Sistema de reserva y liberación de números
- Realización de sorteos
- Estadísticas del sistema

## 🚀 Tecnologías

- **TypeScript** - Lenguaje de programación
- **Jest** - Framework de testing
- **ts-jest** - Preset de Jest para TypeScript
- **Node.js** - Entorno de ejecución

## 📦 Instalación

```bash
npm install
```

## 🛠️ Scripts Disponibles

```bash
# Compilar el proyecto
npm run build

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage

# Limpiar archivos generados
npm run clean
```

## 🧪 Testing

El proyecto cuenta con **63 tests** distribuidos en 5 suites que cubren:

### Tests para Gestión de Participantes (10 tests)
- ✅ Crear participante con datos válidos
- ✅ Validación de campos vacíos
- ✅ Validación de formato de email
- ✅ Prevención de participantes duplicados
- ✅ Consulta de lista de participantes
- ✅ Búsqueda por email (case-insensitive)

### Tests para Gestión del Tablero (33 tests)
- ✅ Inicialización del tablero con 100 números
- ✅ Reserva de números libres
- ✅ Prevención de reserva de números ocupados
- ✅ Múltiples números por participante
- ✅ Liberación de números
- ✅ Validación de números (00-99)
- ✅ Estado de números (libre/ocupado)
- ✅ Consulta de números por participante
- ✅ Casos límite (tablero vacío/lleno)

### Tests para Sorteo (10 tests)
- ✅ Sorteo con número ganador ocupado
- ✅ Sorteo con número ganador libre (desierto)
- ✅ Validación de rango de números (00-99)
- ✅ Información completa del ganador
- ✅ Múltiples participantes

### Tests para Estadísticas (10 tests)
- ✅ Cálculo de casillas ocupadas/libres
- ✅ Conteo de participantes únicos
- ✅ Porcentaje de ocupación
- ✅ Casos especiales (tablero vacío/lleno)

## 📊 Cobertura de Código

El proyecto cumple con un **threshold mínimo del 80%** en todas las métricas:

```
------------------------|---------|----------|---------|---------|
File                    | % Stmts | % Branch | % Funcs | % Lines |
------------------------|---------|----------|---------|---------|
All files               |   96.55 |       90 |     100 |   96.42 |
 GestorEstadisticas.ts  |     100 |      100 |     100 |     100 |
 GestorParticipantes.ts |     100 |      100 |     100 |     100 |
 Participante.ts        |     100 |      100 |     100 |     100 |
 Sorteo.ts              |     100 |      100 |     100 |     100 |
 Tablero.ts             |   93.18 |    81.81 |     100 |   92.68 |
------------------------|---------|----------|---------|---------|
```

## 🏗️ Estructura del Proyecto

```
.
├── src/
│   ├── models/
│   │   ├── Participante.ts          # Modelo de participante
│   │   ├── GestorParticipantes.ts   # Gestión de participantes
│   │   ├── Tablero.ts               # Gestión del tablero de números
│   │   ├── Sorteo.ts                # Lógica del sorteo
│   │   ├── GestorEstadisticas.ts    # Cálculo de estadísticas
│   │   └── index.ts                 # Exports principales
│   ├── __tests__/
│   │   ├── Participante.test.ts
│   │   ├── GestorParticipantes.test.ts
│   │   ├── Tablero.test.ts
│   │   ├── Sorteo.test.ts
│   │   └── GestorEstadisticas.test.ts
│   └── index.ts
├── jest.config.js                    # Configuración de Jest
├── tsconfig.json                     # Configuración de TypeScript
└── package.json
```

## 🎯 Características Principales

### Participante
- Validación de nombre y email
- Formato de email correcto
- Prevención de duplicados (case-insensitive)

### Tablero
- 100 números disponibles (00-99)
- Reserva y liberación de números
- Múltiples números por participante
- Verificación de estado

### Sorteo
- Validación de número ganador (00-99)
- Detección de sorteo desierto
- Información completa del ganador

### Estadísticas
- Casillas ocupadas/libres
- Participantes únicos
- Porcentaje de ocupación

## 📝 Uso Básico

```typescript
import { 
  Participante, 
  GestorParticipantes, 
  Tablero, 
  Sorteo,
  GestorEstadisticas 
} from './models';

// Crear participantes
const participante = new Participante('Juan Pérez', 'juan@example.com');
const gestor = new GestorParticipantes();
gestor.registrarParticipante(participante);

// Gestionar tablero
const tablero = new Tablero();
tablero.reservarNumero(42, 'juan@example.com');

// Realizar sorteo
const sorteo = new Sorteo(tablero, gestor);
const resultado = sorteo.realizarSorteo(42);

// Obtener estadísticas
const estadisticas = new GestorEstadisticas(tablero, gestor);
const stats = estadisticas.obtenerEstadisticas();
```

## ✨ Buenas Prácticas Implementadas

- ✅ Patrón AAA (Arrange-Act-Assert) en todos los tests
- ✅ Tests descriptivos con patrón "debería..."
- ✅ Tests independientes sin dependencias de orden
- ✅ `beforeEach` para limpiar estado entre tests
- ✅ Matchers apropiados de Jest
- ✅ Agrupación lógica con `describe`
- ✅ Cobertura de casos de éxito, error y límite
- ✅ Validaciones robustas en todos los métodos públicos

## 📄 Licencia

ISC