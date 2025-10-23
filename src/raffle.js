/**
 * Clase para gestionar el sorteo de la Cesta de Navidad
 * Class to manage the Christmas Basket Raffle
 */
class ChristmasBasketRaffle {
  /**
   * Constructor - inicializa el sorteo con una lista de participantes
   * @param {Array<string>} participants - Lista de nombres de participantes
   */
  constructor(participants = []) {
    this.participants = [];
    this.winner = null;
    
    if (Array.isArray(participants)) {
      this.participants = [...participants];
    }
  }

  /**
   * Añade un participante al sorteo
   * @param {string} name - Nombre del participante
   * @returns {boolean} - true si se añadió correctamente, false si ya existe
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
   * Elimina un participante del sorteo
   * @param {string} name - Nombre del participante a eliminar
   * @returns {boolean} - true si se eliminó correctamente, false si no se encontró
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
   * Obtiene la lista de participantes
   * @returns {Array<string>} - Lista de participantes
   */
  getParticipants() {
    return [...this.participants];
  }

  /**
   * Obtiene el número de participantes
   * @returns {number} - Cantidad de participantes
   */
  getParticipantCount() {
    return this.participants.length;
  }

  /**
   * Realiza el sorteo y selecciona un ganador aleatorio
   * @returns {string} - Nombre del ganador
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
   * Obtiene el ganador del último sorteo
   * @returns {string|null} - Nombre del ganador o null si no se ha realizado sorteo
   */
  getWinner() {
    return this.winner;
  }

  /**
   * Reinicia el sorteo eliminando el ganador
   */
  reset() {
    this.winner = null;
  }

  /**
   * Limpia todos los participantes y reinicia el sorteo
   */
  clear() {
    this.participants = [];
    this.winner = null;
  }
}

module.exports = ChristmasBasketRaffle;
