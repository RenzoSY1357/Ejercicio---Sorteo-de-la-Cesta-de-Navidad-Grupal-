/**
 * Clase para gestionar el sorteo de la Cesta de Navidad.
 * Esta clase permite agregar participantes, realizar sorteos aleatorios 
 * y gestionar ganadores de manera segura y confiable.
 * 
 * @class ChristmasBasketRaffle
 * @example
 * // Crear un sorteo vacío
 * const sorteo = new ChristmasBasketRaffle();
 * 
 * @example
 * // Crear un sorteo con participantes iniciales
 * const sorteo = new ChristmasBasketRaffle(['Juan', 'María', 'Pedro']);
 */
class ChristmasBasketRaffle {
  /**
   * Crea una nueva instancia del sorteo de la Cesta de Navidad.
   * Si se proporciona un array de participantes, se añaden automáticamente.
   * Si el parámetro no es un array válido, se crea un sorteo vacío.
   * 
   * @constructor
   * @param {Array<string>} [participants=[]] - Array opcional con los nombres de los participantes iniciales
   * 
   * @example
   * // Crear sorteo vacío
   * const sorteo = new ChristmasBasketRaffle();
   * 
   * @example
   * // Crear sorteo con participantes
   * const sorteo = new ChristmasBasketRaffle(['Ana', 'Luis', 'Carmen']);
   */
  constructor(participants = []) {
    this.participants = [];
    this.winner = null;
    
    if (Array.isArray(participants)) {
      this.participants = [...participants];
    }
  }

  /**
   * Añade un nuevo participante al sorteo.
   * El nombre se limpia automáticamente eliminando espacios al inicio y final.
   * No se permiten nombres duplicados.
   * 
   * @param {string} name - Nombre del participante a añadir
   * @returns {boolean} Retorna `true` si el participante se añadió correctamente,
   *                    `false` si el participante ya existe en el sorteo
   * 
   * @throws {Error} Si el nombre no es una cadena de texto (string)
   * @throws {Error} Si el nombre está vacío o solo contiene espacios en blanco
   * 
   * @example
   * const sorteo = new ChristmasBasketRaffle();
   * sorteo.addParticipant('María García');  // Retorna true
   * sorteo.addParticipant('María García');  // Retorna false (ya existe)
   * sorteo.addParticipant('  Pedro  ');     // Añade 'Pedro' (sin espacios)
   * 
   * @example
   * // Casos que lanzan error
   * sorteo.addParticipant(123);    // Error: debe ser una cadena
   * sorteo.addParticipant('');     // Error: no puede estar vacío
   * sorteo.addParticipant('   ');  // Error: no puede estar vacío
   */
  addParticipant(name) {
    if (typeof name !== 'string') {
      throw new Error('El nombre del participante debe ser una cadena válida');
    }
    
    const trimmedName = name.trim();
    if (trimmedName === '') {
      throw new Error('El nombre del participante no puede estar vacío');
    }
    
    if (this.participants.includes(trimmedName)) {
      return false;
    }
    
    this.participants.push(trimmedName);
    return true;
  }

  /**
   * Elimina un participante del sorteo por su nombre.
   * El nombre se limpia automáticamente eliminando espacios al inicio y final.
   * 
   * @param {string} name - Nombre del participante a eliminar
   * @returns {boolean} Retorna `true` si el participante se eliminó correctamente,
   *                    `false` si el participante no existe o el nombre no es válido
   * 
   * @example
   * const sorteo = new ChristmasBasketRaffle(['Juan', 'María']);
   * sorteo.removeParticipant('María');     // Retorna true
   * sorteo.removeParticipant('Pedro');     // Retorna false (no existe)
   * sorteo.removeParticipant('  Juan  '); // Retorna true (elimina 'Juan')
   * 
   * @example
   * // Casos que retornan false sin lanzar error
   * sorteo.removeParticipant(123);    // Retorna false (no es string)
   * sorteo.removeParticipant(null);   // Retorna false (no es string)
   */
  removeParticipant(name) {
    if (typeof name !== 'string') {
      return false;
    }
    
    const trimmedName = name.trim();
    const index = this.participants.indexOf(trimmedName);
    if (index === -1) {
      return false;
    }
    
    this.participants.splice(index, 1);
    return true;
  }

  /**
   * Obtiene una copia de la lista completa de participantes.
   * Retorna una copia para evitar modificaciones externas del array interno.
   * 
   * @returns {Array<string>} Array con los nombres de todos los participantes
   * 
   * @example
   * const sorteo = new ChristmasBasketRaffle(['Ana', 'Luis']);
   * const participantes = sorteo.getParticipants();
   * console.log(participantes); // ['Ana', 'Luis']
   * 
   * // Los cambios externos no afectan al sorteo
   * participantes.push('Carlos');
   * console.log(sorteo.getParticipantCount()); // Sigue siendo 2
   */
  getParticipants() {
    return [...this.participants];
  }

  /**
   * Obtiene el número total de participantes en el sorteo.
   * 
   * @returns {number} Cantidad de participantes registrados
   * 
   * @example
   * const sorteo = new ChristmasBasketRaffle();
   * console.log(sorteo.getParticipantCount()); // 0
   * 
   * sorteo.addParticipant('María');
   * sorteo.addParticipant('Juan');
   * console.log(sorteo.getParticipantCount()); // 2
   */
  getParticipantCount() {
    return this.participants.length;
  }

  /**
   * Realiza el sorteo y selecciona un ganador de forma aleatoria.
   * Utiliza Math.random() para garantizar que todos los participantes 
   * tienen la misma probabilidad de ganar.
   * El ganador se guarda internamente y puede ser consultado con getWinner().
   * 
   * @returns {string} Nombre del participante ganador
   * 
   * @throws {Error} Si no hay participantes en el sorteo (lista vacía)
   * 
   * @example
   * const sorteo = new ChristmasBasketRaffle(['Ana', 'Luis', 'Carmen']);
   * const ganador = sorteo.performRaffle();
   * console.log(`El ganador es: ${ganador}`);
   * 
   * @example
   * // Error si no hay participantes
   * const sorteoVacio = new ChristmasBasketRaffle();
   * sorteoVacio.performRaffle(); // Error: No hay participantes en el sorteo
   */
  performRaffle() {
    if (this.participants.length === 0) {
      throw new Error('No hay participantes en el sorteo');
    }
    
    const randomIndex = Math.floor(Math.random() * this.participants.length);
    this.winner = this.participants[randomIndex];
    return this.winner;
  }

  /**
   * Obtiene el nombre del ganador del último sorteo realizado.
   * 
   * @returns {string|null} Nombre del ganador, o `null` si aún no se ha realizado ningún sorteo
   * 
   * @example
   * const sorteo = new ChristmasBasketRaffle(['Ana', 'Luis']);
   * console.log(sorteo.getWinner()); // null (aún no hay sorteo)
   * 
   * sorteo.performRaffle();
   * console.log(sorteo.getWinner()); // 'Ana' o 'Luis'
   */
  getWinner() {
    return this.winner;
  }

  /**
   * Reinicia el sorteo eliminando únicamente el ganador.
   * Los participantes se mantienen en la lista para poder realizar un nuevo sorteo.
   * 
   * @example
   * const sorteo = new ChristmasBasketRaffle(['Ana', 'Luis']);
   * sorteo.performRaffle();
   * console.log(sorteo.getWinner());          // 'Ana' o 'Luis'
   * console.log(sorteo.getParticipantCount()); // 2
   * 
   * sorteo.reset();
   * console.log(sorteo.getWinner());          // null
   * console.log(sorteo.getParticipantCount()); // 2 (participantes conservados)
   */
  reset() {
    this.winner = null;
  }

  /**
   * Limpia completamente el sorteo eliminando todos los participantes y el ganador.
   * Después de llamar a este método, el sorteo vuelve al estado inicial (vacío).
   * 
   * @example
   * const sorteo = new ChristmasBasketRaffle(['Ana', 'Luis']);
   * sorteo.performRaffle();
   * console.log(sorteo.getParticipantCount()); // 2
   * 
   * sorteo.clear();
   * console.log(sorteo.getParticipantCount()); // 0
   * console.log(sorteo.getWinner());           // null
   */
  clear() {
    this.participants = [];
    this.winner = null;
  }
}

module.exports = ChristmasBasketRaffle;
