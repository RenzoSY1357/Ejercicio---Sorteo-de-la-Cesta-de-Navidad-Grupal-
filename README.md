# Ejercicio - Sorteo de la Cesta de Navidad (Grupal) 🎄

Aplicación de sorteo para la Cesta de Navidad con pruebas completas usando Jest.

## 📋 Descripción

Este proyecto implementa un sistema de sorteo para la Cesta de Navidad. Permite gestionar participantes, realizar sorteos aleatorios y obtener ganadores de forma justa y transparente.

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install
```

## 🎯 Uso

### Ejecutar la aplicación

```bash
node src/index.js
```

### Usar la clase en tu código

```javascript
const ChristmasBasketRaffle = require('./src/raffle');

// Crear un sorteo
const raffle = new ChristmasBasketRaffle();

// Añadir participantes
raffle.addParticipant('María García');
raffle.addParticipant('Juan Pérez');
raffle.addParticipant('Ana López');

// Realizar el sorteo
const winner = raffle.performRaffle();
console.log(`Ganador: ${winner}`);
```

## 🧪 Testing con Jest

Este proyecto incluye pruebas completas con Jest.

### Ejecutar todas las pruebas

```bash
npm test
```

### Ejecutar pruebas en modo watch (desarrollo)

```bash
npm run test:watch
```

### Ejecutar pruebas con cobertura

```bash
npm run test:coverage
```

## 📊 Cobertura de Pruebas

El proyecto incluye 25 pruebas que cubren:

- ✅ Constructor y inicialización
- ✅ Añadir participantes
- ✅ Eliminar participantes
- ✅ Obtener lista de participantes
- ✅ Contar participantes
- ✅ Realizar sorteos
- ✅ Obtener ganadores
- ✅ Reiniciar sorteos
- ✅ Validación de datos
- ✅ Flujos de integración completos

**Cobertura actual: 100% en raffle.js**

## 🔧 Funcionalidades

### Clase ChristmasBasketRaffle

#### Constructor
- `new ChristmasBasketRaffle(participants)` - Crea una nueva instancia del sorteo

#### Métodos
- `addParticipant(name)` - Añade un participante al sorteo
- `removeParticipant(name)` - Elimina un participante del sorteo
- `getParticipants()` - Obtiene la lista de participantes
- `getParticipantCount()` - Obtiene el número de participantes
- `performRaffle()` - Realiza el sorteo y selecciona un ganador
- `getWinner()` - Obtiene el ganador del último sorteo
- `reset()` - Reinicia el sorteo (mantiene participantes)
- `clear()` - Limpia todos los datos del sorteo

## 🛠️ Tecnologías

- **Node.js** - Entorno de ejecución
- **Jest** - Framework de testing
- **JavaScript** - Lenguaje de programación

## 📝 Estructura del Proyecto

```
.
├── src/
│   ├── raffle.js       # Clase principal del sorteo
│   └── index.js        # Aplicación de ejemplo
├── __tests__/
│   └── raffle.test.js  # Pruebas Jest
├── package.json        # Configuración del proyecto
├── .gitignore         # Archivos ignorados por git
└── README.md          # Este archivo
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, asegúrate de que todas las pruebas pasen antes de enviar un pull request.

## 📄 Licencia

ISC
