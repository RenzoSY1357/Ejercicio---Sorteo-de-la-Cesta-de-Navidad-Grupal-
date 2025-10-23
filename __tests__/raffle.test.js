const ChristmasBasketRaffle = require('../src/raffle');

describe('ChristmasBasketRaffle', () => {
  describe('Constructor', () => {
    test('debe crear una instancia vacía sin parámetros', () => {
      const raffle = new ChristmasBasketRaffle();
      expect(raffle.getParticipantCount()).toBe(0);
      expect(raffle.getParticipants()).toEqual([]);
      expect(raffle.getWinner()).toBeNull();
    });

    test('debe crear una instancia con participantes iniciales', () => {
      const participants = ['Juan', 'María', 'Pedro'];
      const raffle = new ChristmasBasketRaffle(participants);
      expect(raffle.getParticipantCount()).toBe(3);
      expect(raffle.getParticipants()).toEqual(participants);
    });

    test('debe manejar correctamente parámetros no válidos', () => {
      const raffle = new ChristmasBasketRaffle('no es un array');
      expect(raffle.getParticipantCount()).toBe(0);
    });
  });

  describe('addParticipant', () => {
    let raffle;

    beforeEach(() => {
      raffle = new ChristmasBasketRaffle();
    });

    test('debe añadir un participante correctamente', () => {
      const result = raffle.addParticipant('Juan Pérez');
      expect(result).toBe(true);
      expect(raffle.getParticipantCount()).toBe(1);
      expect(raffle.getParticipants()).toContain('Juan Pérez');
    });

    test('debe eliminar espacios en blanco al inicio y final', () => {
      raffle.addParticipant('  María García  ');
      expect(raffle.getParticipants()).toContain('María García');
    });

    test('no debe añadir participantes duplicados', () => {
      raffle.addParticipant('Juan Pérez');
      const result = raffle.addParticipant('Juan Pérez');
      expect(result).toBe(false);
      expect(raffle.getParticipantCount()).toBe(1);
    });

    test('debe lanzar error si el nombre no es una cadena', () => {
      expect(() => raffle.addParticipant(123)).toThrow('El nombre del participante debe ser una cadena válida');
      expect(() => raffle.addParticipant(null)).toThrow('El nombre del participante debe ser una cadena válida');
      expect(() => raffle.addParticipant(undefined)).toThrow('El nombre del participante debe ser una cadena válida');
    });

    test('debe lanzar error si el nombre está vacío', () => {
      expect(() => raffle.addParticipant('')).toThrow('El nombre del participante no puede estar vacío');
      expect(() => raffle.addParticipant('   ')).toThrow('El nombre del participante no puede estar vacío');
    });

    test('debe añadir múltiples participantes diferentes', () => {
      raffle.addParticipant('Juan');
      raffle.addParticipant('María');
      raffle.addParticipant('Pedro');
      expect(raffle.getParticipantCount()).toBe(3);
    });
  });

  describe('removeParticipant', () => {
    let raffle;

    beforeEach(() => {
      raffle = new ChristmasBasketRaffle(['Juan', 'María', 'Pedro']);
    });

    test('debe eliminar un participante existente', () => {
      const result = raffle.removeParticipant('María');
      expect(result).toBe(true);
      expect(raffle.getParticipantCount()).toBe(2);
      expect(raffle.getParticipants()).not.toContain('María');
    });

    test('debe retornar false si el participante no existe', () => {
      const result = raffle.removeParticipant('Carlos');
      expect(result).toBe(false);
      expect(raffle.getParticipantCount()).toBe(3);
    });

    test('debe mantener el orden de los participantes restantes', () => {
      raffle.removeParticipant('María');
      expect(raffle.getParticipants()).toEqual(['Juan', 'Pedro']);
    });
  });

  describe('getParticipants', () => {
    test('debe retornar una copia de la lista de participantes', () => {
      const raffle = new ChristmasBasketRaffle(['Juan', 'María']);
      const participants = raffle.getParticipants();
      participants.push('Pedro');
      
      // La lista original no debe modificarse
      expect(raffle.getParticipantCount()).toBe(2);
    });
  });

  describe('getParticipantCount', () => {
    test('debe retornar 0 para un sorteo vacío', () => {
      const raffle = new ChristmasBasketRaffle();
      expect(raffle.getParticipantCount()).toBe(0);
    });

    test('debe retornar el número correcto de participantes', () => {
      const raffle = new ChristmasBasketRaffle(['Juan', 'María', 'Pedro']);
      expect(raffle.getParticipantCount()).toBe(3);
    });
  });

  describe('performRaffle', () => {
    test('debe lanzar error si no hay participantes', () => {
      const raffle = new ChristmasBasketRaffle();
      expect(() => raffle.performRaffle()).toThrow('No hay participantes en el sorteo');
    });

    test('debe seleccionar un ganador de la lista de participantes', () => {
      const participants = ['Juan', 'María', 'Pedro'];
      const raffle = new ChristmasBasketRaffle(participants);
      const winner = raffle.performRaffle();
      
      expect(winner).toBeDefined();
      expect(participants).toContain(winner);
    });

    test('debe retornar el único participante si solo hay uno', () => {
      const raffle = new ChristmasBasketRaffle(['Juan']);
      const winner = raffle.performRaffle();
      expect(winner).toBe('Juan');
    });

    test('debe establecer el ganador accesible mediante getWinner', () => {
      const raffle = new ChristmasBasketRaffle(['Juan', 'María']);
      raffle.performRaffle();
      const winner = raffle.getWinner();
      
      expect(winner).toBeDefined();
      expect(['Juan', 'María']).toContain(winner);
    });

    test('debe seleccionar ganadores diferentes en múltiples ejecuciones (probabilístico)', () => {
      const participants = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const winners = new Set();
      
      // Realizar 100 sorteos para verificar aleatoriedad
      for (let i = 0; i < 100; i++) {
        const raffle = new ChristmasBasketRaffle(participants);
        const winner = raffle.performRaffle();
        winners.add(winner);
      }
      
      // Debería haber al menos 3 ganadores diferentes en 100 sorteos
      expect(winners.size).toBeGreaterThan(3);
    });
  });

  describe('getWinner', () => {
    test('debe retornar null si no se ha realizado sorteo', () => {
      const raffle = new ChristmasBasketRaffle(['Juan', 'María']);
      expect(raffle.getWinner()).toBeNull();
    });

    test('debe retornar el ganador después del sorteo', () => {
      const raffle = new ChristmasBasketRaffle(['Juan', 'María']);
      const winner = raffle.performRaffle();
      expect(raffle.getWinner()).toBe(winner);
    });
  });

  describe('reset', () => {
    test('debe reiniciar el ganador pero mantener los participantes', () => {
      const raffle = new ChristmasBasketRaffle(['Juan', 'María', 'Pedro']);
      raffle.performRaffle();
      
      expect(raffle.getWinner()).not.toBeNull();
      
      raffle.reset();
      
      expect(raffle.getWinner()).toBeNull();
      expect(raffle.getParticipantCount()).toBe(3);
    });
  });

  describe('clear', () => {
    test('debe eliminar todos los participantes y el ganador', () => {
      const raffle = new ChristmasBasketRaffle(['Juan', 'María', 'Pedro']);
      raffle.performRaffle();
      
      raffle.clear();
      
      expect(raffle.getParticipantCount()).toBe(0);
      expect(raffle.getWinner()).toBeNull();
      expect(raffle.getParticipants()).toEqual([]);
    });
  });

  describe('Integración - Flujo completo', () => {
    test('debe permitir un flujo completo de sorteo', () => {
      // Crear sorteo
      const raffle = new ChristmasBasketRaffle();
      
      // Añadir participantes
      raffle.addParticipant('Juan Pérez');
      raffle.addParticipant('María García');
      raffle.addParticipant('Pedro López');
      raffle.addParticipant('Ana Martínez');
      
      expect(raffle.getParticipantCount()).toBe(4);
      
      // Realizar sorteo
      const winner = raffle.performRaffle();
      expect(winner).toBeDefined();
      
      // Verificar ganador
      expect(raffle.getWinner()).toBe(winner);
      
      // Reiniciar para otro sorteo
      raffle.reset();
      expect(raffle.getWinner()).toBeNull();
      
      // Realizar otro sorteo
      const newWinner = raffle.performRaffle();
      expect(newWinner).toBeDefined();
    });
  });
});
