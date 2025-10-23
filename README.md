# Ejercicio - Sorteo de la Cesta de Navidad (Grupal) 🎄

Aplicación de sorteo para la Cesta de Navidad con pruebas completas usando Jest.

## 📋 Descripción

Este proyecto implementa un sistema de sorteo para la Cesta de Navidad. Permite gestionar participantes, realizar sorteos aleatorios y obtener ganadores de forma justa y transparente.

El sistema es fácil de usar, está completamente probado y documentado. Perfecto para realizar sorteos en empresas, escuelas u organizaciones durante las fiestas navideñas.

## 📚 Documentación Completa

Para información detallada sobre el diseño del proyecto, interfaces, decisiones de diseño y ejemplos avanzados, consulta:

📖 **[DOCUMENTACION.md](./DOCUMENTACION.md)** - Documentación técnica completa

## 🚀 Instalación

### Requisitos Previos

- **Node.js** versión 14 o superior
- **npm** (viene incluido con Node.js)

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <repository-url>

# 2. Entrar al directorio del proyecto
cd Ejercicio---Sorteo-de-la-Cesta-de-Navidad-Grupal-

# 3. Instalar dependencias
npm install
```

## 🎯 Uso

### Opción 1: Ejecutar el Ejemplo Incluido

La forma más rápida de ver el sistema en acción:

```bash
node src/index.js
```

**Salida esperada:**
```
🎄 Sorteo de la Cesta de Navidad 🎄
=====================================

Participantes iniciales: 4
Lista de participantes:
  1. María García
  2. Juan Pérez
  3. Ana López
  4. Carlos Rodríguez

📝 Añadiendo más participantes...

Total de participantes: 6

🎲 Realizando sorteo...

🎉 ¡GANADOR DE LA CESTA DE NAVIDAD! 🎉
   ⭐ María García ⭐

=====================================
```

### Opción 2: Usar la Clase en Tu Propio Código

Crea un archivo JavaScript y usa la clase:

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

### Opción 3: Crear Sorteo con Participantes Iniciales

```javascript
const ChristmasBasketRaffle = require('./src/raffle');

// Crear sorteo directamente con participantes
const raffle = new ChristmasBasketRaffle([
  'Pedro Sánchez',
  'Laura Martínez',
  'Carlos Rodríguez',
  'Ana Fernández'
]);

// Realizar sorteo
const winner = raffle.performRaffle();
console.log(`El ganador es: ${winner}`);
```

## 🧪 Pruebas (Testing)

Este proyecto incluye pruebas completas con Jest para garantizar que todo funciona correctamente.

### Ejecutar Todas las Pruebas

```bash
npm test
```

**Salida esperada:**
```
PASS  __tests__/raffle.test.js
  ChristmasBasketRaffle
    Constructor
      ✓ debe crear una instancia vacía sin parámetros
      ✓ debe crear una instancia con participantes iniciales
      ✓ debe manejar correctamente parámetros no válidos
    addParticipant
      ✓ debe añadir un participante correctamente
      ...

Test Suites: 1 passed, 1 total
Tests:       27 passed, 27 total
```

### Ejecutar Pruebas en Modo Watch (Desarrollo)

Útil cuando estás modificando código. Las pruebas se ejecutan automáticamente cada vez que guardas un archivo:

```bash
npm run test:watch
```

### Ejecutar Pruebas con Cobertura

Para ver qué porcentaje del código está cubierto por las pruebas:

```bash
npm run test:coverage
```

**Ejemplo de salida:**
```
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files             |     100 |      100 |     100 |     100 |
 raffle.js            |     100 |      100 |     100 |     100 |
----------------------|---------|----------|---------|---------|-------------------
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

## 🔧 Características y Funcionalidades

### Clase ChristmasBasketRaffle

La clase principal que gestiona todo el sorteo.

#### Constructor

```javascript
new ChristmasBasketRaffle(participants?)
```
- **`participants`** *(opcional)*: Array de strings con los nombres de participantes iniciales
- Crea una nueva instancia del sorteo

**Ejemplos:**
```javascript
// Sorteo vacío
const sorteo1 = new ChristmasBasketRaffle();

// Sorteo con participantes
const sorteo2 = new ChristmasBasketRaffle(['Ana', 'Luis', 'Carmen']);
```

#### Métodos Disponibles

##### `addParticipant(name)`
Añade un nuevo participante al sorteo.

- **Parámetros**: 
  - `name` (string): Nombre del participante
- **Retorna**: `true` si se añadió, `false` si ya existe
- **Lanza error**: Si el nombre no es string o está vacío

```javascript
sorteo.addParticipant('María García');  // true
sorteo.addParticipant('María García');  // false (duplicado)
```

##### `removeParticipant(name)`
Elimina un participante del sorteo.

- **Parámetros**: 
  - `name` (string): Nombre del participante
- **Retorna**: `true` si se eliminó, `false` si no existe

```javascript
sorteo.removeParticipant('María García');  // true
sorteo.removeParticipant('No Existe');     // false
```

##### `getParticipants()`
Obtiene la lista completa de participantes.

- **Retorna**: Array con los nombres (copia, no modifica el original)

```javascript
const lista = sorteo.getParticipants();
console.log(lista); // ['Ana', 'Luis', 'Carmen']
```

##### `getParticipantCount()`
Cuenta cuántos participantes hay en el sorteo.

- **Retorna**: Número de participantes

```javascript
console.log(sorteo.getParticipantCount()); // 3
```

##### `performRaffle()`
Realiza el sorteo y selecciona un ganador aleatorio.

- **Retorna**: Nombre del ganador
- **Lanza error**: Si no hay participantes

```javascript
const ganador = sorteo.performRaffle();
console.log(ganador); // 'Ana', 'Luis' o 'Carmen'
```

##### `getWinner()`
Obtiene el ganador del último sorteo realizado.

- **Retorna**: Nombre del ganador o `null` si no hay sorteo

```javascript
console.log(sorteo.getWinner()); // 'Ana' (o null)
```

##### `reset()`
Reinicia el ganador pero mantiene los participantes.

Útil para realizar múltiples sorteos con las mismas personas.

```javascript
sorteo.reset();
console.log(sorteo.getWinner());          // null
console.log(sorteo.getParticipantCount()); // 3 (se mantienen)
```

##### `clear()`
Limpia todo: participantes y ganador.

Vuelve el sorteo al estado inicial.

```javascript
sorteo.clear();
console.log(sorteo.getWinner());          // null
console.log(sorteo.getParticipantCount()); // 0
```

---

### Ejemplo Completo de Uso

```javascript
const ChristmasBasketRaffle = require('./src/raffle');

// 1. Crear sorteo
const sorteo = new ChristmasBasketRaffle();

// 2. Añadir participantes
sorteo.addParticipant('María García');
sorteo.addParticipant('Juan Pérez');
sorteo.addParticipant('Ana López');
sorteo.addParticipant('Carlos Rodríguez');

// 3. Ver participantes
console.log(`Total: ${sorteo.getParticipantCount()}`);
sorteo.getParticipants().forEach((nombre, i) => {
  console.log(`${i + 1}. ${nombre}`);
});

// 4. Realizar sorteo
const ganador = sorteo.performRaffle();
console.log(`\n🎉 Ganador: ${ganador}`);

// 5. Hacer otro sorteo con los mismos participantes
sorteo.reset();
const ganador2 = sorteo.performRaffle();
console.log(`🎉 Segundo ganador: ${ganador2}`);
```

## 📝 Estructura del Proyecto

```
.
├── src/
│   ├── raffle.js       # Clase principal ChristmasBasketRaffle
│   └── index.js        # Aplicación de ejemplo
├── __tests__/
│   └── raffle.test.js  # Suite completa de pruebas Jest
├── package.json        # Configuración del proyecto y dependencias
├── package-lock.json   # Versiones exactas de dependencias
├── .gitignore          # Archivos ignorados por git
├── README.md           # Este archivo (guía rápida)
└── DOCUMENTACION.md    # Documentación técnica detallada
```

### Descripción de Archivos Principales

- **`src/raffle.js`**: Contiene la clase `ChristmasBasketRaffle` con toda la lógica del sorteo
- **`src/index.js`**: Ejemplo funcional que muestra cómo usar la clase
- **`__tests__/raffle.test.js`**: 27 pruebas automatizadas que verifican todas las funcionalidades
- **`DOCUMENTACION.md`**: Explicación detallada del diseño, decisiones técnicas y ejemplos avanzados

---

## ⚠️ Manejo de Errores

El sistema incluye validaciones para evitar errores comunes:

### Errores que Lanza el Sistema

#### 1. Nombre de participante inválido
```javascript
sorteo.addParticipant(123);        // ❌ Error: debe ser string
sorteo.addParticipant('');         // ❌ Error: no puede estar vacío
sorteo.addParticipant(null);       // ❌ Error: debe ser string
```

#### 2. Sorteo sin participantes
```javascript
const sorteo = new ChristmasBasketRaffle();
sorteo.performRaffle();  // ❌ Error: No hay participantes
```

### Ejemplo con Manejo de Errores

```javascript
const sorteo = new ChristmasBasketRaffle();

try {
  sorteo.addParticipant('María');
  sorteo.addParticipant('Juan');
  const ganador = sorteo.performRaffle();
  console.log(`Ganador: ${ganador}`);
} catch (error) {
  console.error('Error:', error.message);
}
```

Para más información sobre errores, consulta [DOCUMENTACION.md](./DOCUMENTACION.md#manejo-de-errores).

---

## 🛠️ Compilación y Ejecución

### Modo de Desarrollo

No requiere compilación. JavaScript se ejecuta directamente con Node.js:

```bash
node src/index.js
```

### Ejecutar Pruebas Durante el Desarrollo

```bash
# Ejecutar pruebas una vez
npm test

# Ejecutar en modo watch (recomendado para desarrollo)
npm run test:watch
```

### Verificar Calidad del Código

```bash
# Ver cobertura de pruebas
npm run test:coverage

# Verificar que todas las pruebas pasen
npm test
```

---

## 🛠️ Tecnologías Utilizadas

- **[Node.js](https://nodejs.org/)** - Entorno de ejecución JavaScript
- **[Jest](https://jestjs.io/)** - Framework de testing
- **JavaScript (ES6+)** - Lenguaje de programación
- **NPM** - Gestor de paquetes

## 🤝 Contribuir

Las contribuciones son bienvenidas. Sigue estos pasos:

1. **Fork** el repositorio
2. Crea una **rama** para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. **Añade pruebas** para tu código nuevo
4. Asegúrate de que **todas las pruebas pasen** (`npm test`)
5. **Commit** tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
6. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
7. Abre un **Pull Request**

### Reglas para Contribuir

- ✅ Todo código nuevo debe tener pruebas
- ✅ Las pruebas deben pasar al 100%
- ✅ Mantener la cobertura de código en 100%
- ✅ Documentar con JSDoc los nuevos métodos
- ✅ Actualizar DOCUMENTACION.md si es necesario

---

## 📖 Recursos Adicionales

- **[DOCUMENTACION.md](./DOCUMENTACION.md)** - Documentación técnica completa
- **[Código fuente de raffle.js](./src/raffle.js)** - Clase principal (con JSDoc completo)
- **[Pruebas](./__tests__/raffle.test.js)** - 27 pruebas que sirven como ejemplos

---

## ❓ Preguntas Frecuentes

### ¿Cómo puedo usar esto en mi proyecto?

Simplemente copia el archivo `src/raffle.js` a tu proyecto y úsalo:

```javascript
const ChristmasBasketRaffle = require('./raffle');
const sorteo = new ChristmasBasketRaffle(['Ana', 'Luis']);
console.log(sorteo.performRaffle());
```

### ¿El sorteo es realmente aleatorio?

Sí. Utiliza `Math.random()` de JavaScript, que genera números pseudoaleatorios. Cada participante tiene exactamente la misma probabilidad de ganar.

### ¿Puedo realizar múltiples sorteos?

Sí. Usa el método `reset()` para mantener los participantes pero permitir un nuevo sorteo:

```javascript
sorteo.performRaffle(); // Primer sorteo
sorteo.reset();
sorteo.performRaffle(); // Segundo sorteo
```

### ¿Cómo sé que el código funciona correctamente?

El proyecto incluye 27 pruebas automatizadas con 100% de cobertura. Ejecuta `npm test` para verificarlo.

---

## 📄 Licencia

ISC

---

## 👥 Autores

Proyecto desarrollado como ejercicio grupal de programación.

---

**¡Felices fiestas y buena suerte en el sorteo! 🎄🎁**
