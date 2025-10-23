# Documentación del Proyecto - Sorteo de la Cesta de Navidad 🎄

## Índice
1. [Introducción](#introducción)
2. [Interfaces y Tipos Principales](#interfaces-y-tipos-principales)
3. [Decisiones de Diseño](#decisiones-de-diseño)
4. [Ejemplos de Uso](#ejemplos-de-uso)
5. [Manejo de Errores](#manejo-de-errores)

---

## Introducción

Este proyecto es una aplicación simple para realizar sorteos de la Cesta de Navidad. Fue desarrollado con JavaScript y utiliza Node.js como entorno de ejecución. La aplicación permite gestionar participantes y realizar sorteos aleatorios de forma justa.

El código está organizado en dos archivos principales:
- **`src/raffle.js`**: Contiene la clase principal `ChristmasBasketRaffle`
- **`src/index.js`**: Ejemplo de uso de la aplicación

---

## Interfaces y Tipos Principales

### Clase ChristmasBasketRaffle

Esta es la clase principal del proyecto. Gestiona todo el proceso del sorteo.

#### Propiedades Internas

```javascript
{
  participants: Array<string>,  // Lista de nombres de participantes
  winner: string | null         // Ganador del sorteo (null si no se ha sorteado)
}
```

#### Métodos Públicos

| Método | Parámetros | Retorno | Descripción |
|--------|-----------|---------|-------------|
| `constructor` | `participants?: Array<string>` | - | Crea un nuevo sorteo |
| `addParticipant` | `name: string` | `boolean` | Añade un participante |
| `removeParticipant` | `name: string` | `boolean` | Elimina un participante |
| `getParticipants` | - | `Array<string>` | Obtiene lista de participantes |
| `getParticipantCount` | - | `number` | Cuenta los participantes |
| `performRaffle` | - | `string` | Realiza el sorteo |
| `getWinner` | - | `string \| null` | Obtiene el ganador |
| `reset` | - | `void` | Reinicia el ganador |
| `clear` | - | `void` | Limpia todo |

---

## Decisiones de Diseño

### 1. Uso de una Clase

Decidimos usar una clase (`ChristmasBasketRaffle`) en lugar de funciones sueltas porque:
- **Organización**: Todas las funcionalidades relacionadas con el sorteo están en un solo lugar
- **Estado**: La clase mantiene el estado del sorteo (participantes y ganador)
- **Reutilización**: Se pueden crear múltiples sorteos independientes
- **Encapsulación**: Los datos están protegidos dentro de la clase

```javascript
// Ejemplo: Múltiples sorteos independientes
const sorteoNavidad = new ChristmasBasketRaffle();
const sorteoAñoNuevo = new ChristmasBasketRaffle();
```

### 2. Validación de Datos

Implementamos validaciones estrictas para evitar errores:

**En `addParticipant`:**
- Verifica que el nombre sea un string
- No permite nombres vacíos
- Elimina espacios al inicio y final
- No permite participantes duplicados

**En `removeParticipant`:**
- Retorna `false` en lugar de lanzar error si el parámetro no es válido
- Esto permite manejar casos inválidos sin romper el programa

**En `performRaffle`:**
- Lanza error si no hay participantes
- Esto previene sorteos sin sentido

### 3. Inmutabilidad de la Lista de Participantes

El método `getParticipants()` retorna una **copia** del array:

```javascript
getParticipants() {
  return [...this.participants]; // Copia usando spread operator
}
```

**¿Por qué?** Para evitar que código externo modifique directamente la lista:

```javascript
const sorteo = new ChristmasBasketRaffle(['Ana', 'Luis']);
const lista = sorteo.getParticipants();
lista.push('Pedro'); // Esto NO afecta al sorteo original
console.log(sorteo.getParticipantCount()); // Sigue siendo 2
```

### 4. Separación entre `reset()` y `clear()`

Tenemos dos métodos diferentes para limpiar datos:

- **`reset()`**: Solo elimina el ganador, mantiene los participantes
  - Útil para hacer múltiples sorteos con los mismos participantes
- **`clear()`**: Elimina todo (participantes y ganador)
  - Útil para empezar un sorteo completamente nuevo

### 5. Aleatoriedad en el Sorteo

Usamos `Math.random()` para seleccionar el ganador:

```javascript
const randomIndex = Math.floor(Math.random() * this.participants.length);
this.winner = this.participants[randomIndex];
```

Cada participante tiene **la misma probabilidad** de ganar, sin importar su posición en la lista.

### 6. Trimming Automático

Los nombres se limpian automáticamente:

```javascript
const trimmedName = name.trim();
```

Esto significa que `'  Ana  '` se convierte en `'Ana'`, evitando duplicados accidentales.

---

## Ejemplos de Uso

### Ejemplo 1: Sorteo Básico

```javascript
const ChristmasBasketRaffle = require('./src/raffle');

// Crear sorteo
const sorteo = new ChristmasBasketRaffle();

// Añadir participantes
sorteo.addParticipant('María García');
sorteo.addParticipant('Juan Pérez');
sorteo.addParticipant('Ana López');

// Ver cuántos participantes hay
console.log(`Total: ${sorteo.getParticipantCount()}`); // Total: 3

// Realizar sorteo
const ganador = sorteo.performRaffle();
console.log(`¡El ganador es ${ganador}!`);
```

### Ejemplo 2: Sorteo con Participantes Iniciales

```javascript
// Crear sorteo directamente con participantes
const sorteo = new ChristmasBasketRaffle([
  'Pedro Sánchez',
  'Laura Martínez',
  'Carlos Rodríguez'
]);

// Realizar sorteo inmediatamente
const ganador = sorteo.performRaffle();
console.log(`Ganador: ${ganador}`);
```

### Ejemplo 3: Múltiples Sorteos con los Mismos Participantes

```javascript
const sorteo = new ChristmasBasketRaffle(['Ana', 'Luis', 'Carmen', 'Pedro']);

// Primer sorteo
const ganador1 = sorteo.performRaffle();
console.log(`Primera ronda: ${ganador1}`);

// Reiniciar y hacer otro sorteo
sorteo.reset();
const ganador2 = sorteo.performRaffle();
console.log(`Segunda ronda: ${ganador2}`);

// Los participantes siguen siendo los mismos
console.log(`Participantes: ${sorteo.getParticipantCount()}`); // 4
```

### Ejemplo 4: Gestión Dinámica de Participantes

```javascript
const sorteo = new ChristmasBasketRaffle();

// Añadir participantes uno por uno
sorteo.addParticipant('María');
sorteo.addParticipant('Juan');
sorteo.addParticipant('Pedro');

// Ver lista completa
const lista = sorteo.getParticipants();
lista.forEach((nombre, index) => {
  console.log(`${index + 1}. ${nombre}`);
});

// Eliminar un participante
sorteo.removeParticipant('Juan');
console.log(`Ahora hay ${sorteo.getParticipantCount()} participantes`);

// Realizar sorteo
const ganador = sorteo.performRaffle();
console.log(`Ganador: ${ganador}`);
```

### Ejemplo 5: Validación de Participantes Duplicados

```javascript
const sorteo = new ChristmasBasketRaffle();

// Intentar añadir el mismo participante dos veces
const añadido1 = sorteo.addParticipant('María');
console.log(añadido1); // true

const añadido2 = sorteo.addParticipant('María');
console.log(añadido2); // false (ya existe)

console.log(sorteo.getParticipantCount()); // 1
```

### Ejemplo 6: Uso Completo con Manejo de Errores

```javascript
const ChristmasBasketRaffle = require('./src/raffle');

function realizarSorteoSeguro() {
  const sorteo = new ChristmasBasketRaffle();

  try {
    // Añadir participantes
    sorteo.addParticipant('Ana');
    sorteo.addParticipant('Luis');
    
    // Intento de añadir nombre vacío
    sorteo.addParticipant('');  // ¡Esto lanzará un error!
    
  } catch (error) {
    console.error('Error al añadir participante:', error.message);
  }

  try {
    // Intentar sorteo
    if (sorteo.getParticipantCount() > 0) {
      const ganador = sorteo.performRaffle();
      console.log(`El ganador es: ${ganador}`);
    } else {
      console.log('No hay participantes para sortear');
    }
  } catch (error) {
    console.error('Error en el sorteo:', error.message);
  }
}

realizarSorteoSeguro();
```

### Ejemplo 7: Limpiar y Empezar de Nuevo

```javascript
const sorteo = new ChristmasBasketRaffle(['Ana', 'Luis', 'Carmen']);

// Primer sorteo
sorteo.performRaffle();
console.log(`Ganador: ${sorteo.getWinner()}`);
console.log(`Participantes: ${sorteo.getParticipantCount()}`); // 3

// Limpiar todo
sorteo.clear();
console.log(`Ganador: ${sorteo.getWinner()}`);          // null
console.log(`Participantes: ${sorteo.getParticipantCount()}`); // 0

// Empezar nuevo sorteo
sorteo.addParticipant('Pedro');
sorteo.addParticipant('María');
```

---

## Manejo de Errores

### Errores que Pueden Ocurrir

#### 1. En `addParticipant(name)`

**Error: El nombre del participante debe ser una cadena válida**
- **Cuándo ocurre**: Cuando el parámetro `name` no es un string
- **Ejemplos que lanzan este error**:
  ```javascript
  sorteo.addParticipant(123);        // Error
  sorteo.addParticipant(null);       // Error
  sorteo.addParticipant(undefined);  // Error
  sorteo.addParticipant({});         // Error
  ```

**Error: El nombre del participante no puede estar vacío**
- **Cuándo ocurre**: Cuando el nombre está vacío o solo tiene espacios
- **Ejemplos que lanzan este error**:
  ```javascript
  sorteo.addParticipant('');      // Error
  sorteo.addParticipant('   ');   // Error
  sorteo.addParticipant('\t');    // Error
  ```

#### 2. En `performRaffle()`

**Error: No hay participantes en el sorteo**
- **Cuándo ocurre**: Cuando se intenta hacer un sorteo sin participantes
- **Ejemplo que lanza este error**:
  ```javascript
  const sorteo = new ChristmasBasketRaffle();
  sorteo.performRaffle();  // Error: lista vacía
  ```

### Métodos que NO Lanzan Errores

Algunos métodos retornan `false` en lugar de lanzar errores:

#### `removeParticipant(name)`
```javascript
const sorteo = new ChristmasBasketRaffle(['Ana']);

// Estos retornan false sin lanzar error
sorteo.removeParticipant(123);      // false
sorteo.removeParticipant('Pedro');  // false (no existe)
```

### Ejemplo de Manejo Completo de Errores

```javascript
function sorteoConManejoDeErrores() {
  const sorteo = new ChristmasBasketRaffle();

  // 1. Añadir participantes con manejo de errores
  const participantes = ['Ana', '', 123, 'Luis', null, 'Carmen'];
  
  participantes.forEach(participante => {
    try {
      const añadido = sorteo.addParticipant(participante);
      if (añadido) {
        console.log(`✓ ${participante} añadido correctamente`);
      } else {
        console.log(`✗ ${participante} ya existe`);
      }
    } catch (error) {
      console.log(`✗ Error con "${participante}": ${error.message}`);
    }
  });

  // 2. Realizar sorteo con manejo de errores
  try {
    const ganador = sorteo.performRaffle();
    console.log(`\n🎉 Ganador: ${ganador}`);
  } catch (error) {
    console.log(`\n✗ No se pudo realizar el sorteo: ${error.message}`);
  }

  // 3. Mostrar resultado final
  console.log(`\nTotal de participantes válidos: ${sorteo.getParticipantCount()}`);
  console.log('Lista final:', sorteo.getParticipants());
}

sorteoConManejoDeErrores();
```

**Salida esperada:**
```
✓ Ana añadido correctamente
✗ Error con "": El nombre del participante no puede estar vacío
✗ Error con "123": El nombre del participante debe ser una cadena válida
✓ Luis añadido correctamente
✗ Error con "null": El nombre del participante debe ser una cadena válida
✓ Carmen añadido correctamente

🎉 Ganador: Luis

Total de participantes válidos: 3
Lista final: [ 'Ana', 'Luis', 'Carmen' ]
```

---

## Resumen de Buenas Prácticas

1. **Siempre validar** antes de añadir participantes
2. **Usar try-catch** al añadir participantes y realizar sorteos
3. **Verificar** que hay participantes antes de sortear
4. **Usar `reset()`** para hacer múltiples sorteos con los mismos participantes
5. **Usar `clear()`** solo cuando quieras empezar completamente de nuevo
6. **No modificar** directamente el array retornado por `getParticipants()`

---

¡Esto es todo! Si tienes dudas o encuentras algún problema, revisa los ejemplos o consulta los tests en `__tests__/raffle.test.js`.
