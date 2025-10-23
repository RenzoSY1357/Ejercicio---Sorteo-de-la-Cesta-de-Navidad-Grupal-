import { Tablero } from '../models/Tablero';

describe('Tablero', () => {
  let tablero: Tablero;

  beforeEach(() => {
    tablero = new Tablero();
  });

  describe('Inicialización del tablero', () => {
    it('debería inicializar el tablero correctamente con 100 números', () => {
      // Act
      const numerosLibres = tablero.obtenerNumerosLibres();
      const numerosOcupados = tablero.obtenerNumerosOcupados();

      // Assert
      expect(numerosLibres).toBe(100);
      expect(numerosOcupados).toBe(0);
    });

    it('debería tener todos los números del 0 al 99 libres inicialmente', () => {
      // Act & Assert
      for (let i = 0; i < 100; i++) {
        expect(tablero.estaOcupado(i)).toBe(false);
      }
    });
  });

  describe('Reserva de números', () => {
    it('debería reservar un número libre exitosamente', () => {
      // Act
      tablero.reservarNumero(42, 'juan.perez@example.com');

      // Assert
      expect(tablero.estaOcupado(42)).toBe(true);
      expect(tablero.obtenerNumerosOcupados()).toBe(1);
      expect(tablero.obtenerNumerosLibres()).toBe(99);
    });

    it('debería lanzar error al intentar reservar un número ya ocupado', () => {
      // Arrange
      tablero.reservarNumero(42, 'juan.perez@example.com');

      // Act & Assert
      expect(() => {
        tablero.reservarNumero(42, 'maria.garcia@example.com');
      }).toThrow('El número 42 ya está ocupado');
    });

    it('debería permitir que un participante reserve múltiples números', () => {
      // Act
      tablero.reservarNumero(10, 'juan.perez@example.com');
      tablero.reservarNumero(20, 'juan.perez@example.com');
      tablero.reservarNumero(30, 'juan.perez@example.com');

      // Assert
      const numerosJuan = tablero.obtenerNumerosPorParticipante('juan.perez@example.com');
      expect(numerosJuan).toHaveLength(3);
      expect(numerosJuan).toEqual([10, 20, 30]);
    });

    it('debería lanzar error al intentar reservar número menor a 0', () => {
      // Act & Assert
      expect(() => {
        tablero.reservarNumero(-1, 'juan.perez@example.com');
      }).toThrow('El número debe estar entre 00 y 99');
    });

    it('debería lanzar error al intentar reservar número mayor a 99', () => {
      // Act & Assert
      expect(() => {
        tablero.reservarNumero(100, 'juan.perez@example.com');
      }).toThrow('El número debe estar entre 00 y 99');
    });
  });

  describe('Liberación de números', () => {
    beforeEach(() => {
      tablero.reservarNumero(42, 'juan.perez@example.com');
    });

    it('debería liberar un número correctamente', () => {
      // Act
      tablero.liberarNumero(42);

      // Assert
      expect(tablero.estaOcupado(42)).toBe(false);
      expect(tablero.obtenerNumerosOcupados()).toBe(0);
      expect(tablero.obtenerNumerosLibres()).toBe(100);
    });

    it('debería lanzar error al intentar liberar un número que no está ocupado', () => {
      // Act & Assert
      expect(() => {
        tablero.liberarNumero(50);
      }).toThrow('El número 50 no está ocupado');
    });

    it('debería lanzar error al intentar liberar número menor a 0', () => {
      // Act & Assert
      expect(() => {
        tablero.liberarNumero(-1);
      }).toThrow('El número debe estar entre 00 y 99');
    });

    it('debería lanzar error al intentar liberar número mayor a 99', () => {
      // Act & Assert
      expect(() => {
        tablero.liberarNumero(100);
      }).toThrow('El número debe estar entre 00 y 99');
    });
  });

  describe('Verificación del estado de números', () => {
    beforeEach(() => {
      tablero.reservarNumero(42, 'juan.perez@example.com');
    });

    it('debería verificar correctamente que un número está ocupado', () => {
      // Act
      const ocupado = tablero.estaOcupado(42);

      // Assert
      expect(ocupado).toBe(true);
    });

    it('debería verificar correctamente que un número está libre', () => {
      // Act
      const ocupado = tablero.estaOcupado(50);

      // Assert
      expect(ocupado).toBe(false);
    });

    it('debería obtener el estado completo de un número ocupado', () => {
      // Act
      const estado = tablero.obtenerEstadoNumero(42);

      // Assert
      expect(estado.numero).toBe(42);
      expect(estado.ocupada).toBe(true);
      expect(estado.emailParticipante).toBe('juan.perez@example.com');
    });

    it('debería obtener el estado completo de un número libre', () => {
      // Act
      const estado = tablero.obtenerEstadoNumero(50);

      // Assert
      expect(estado.numero).toBe(50);
      expect(estado.ocupada).toBe(false);
      expect(estado.emailParticipante).toBeUndefined();
    });

    it('debería lanzar error al consultar estado de número inválido', () => {
      // Act & Assert
      expect(() => {
        tablero.obtenerEstadoNumero(-1);
      }).toThrow('El número debe estar entre 00 y 99');
    });
  });

  describe('Consulta de números por participante', () => {
    beforeEach(() => {
      tablero.reservarNumero(10, 'juan.perez@example.com');
      tablero.reservarNumero(25, 'juan.perez@example.com');
      tablero.reservarNumero(50, 'juan.perez@example.com');
      tablero.reservarNumero(15, 'maria.garcia@example.com');
    });

    it('debería obtener todos los números asignados a un participante', () => {
      // Act
      const numerosJuan = tablero.obtenerNumerosPorParticipante('juan.perez@example.com');

      // Assert
      expect(numerosJuan).toHaveLength(3);
      expect(numerosJuan).toEqual([10, 25, 50]);
    });

    it('debería devolver números ordenados de menor a mayor', () => {
      // Arrange
      tablero.reservarNumero(99, 'pedro.lopez@example.com');
      tablero.reservarNumero(5, 'pedro.lopez@example.com');
      tablero.reservarNumero(42, 'pedro.lopez@example.com');

      // Act
      const numerosPedro = tablero.obtenerNumerosPorParticipante('pedro.lopez@example.com');

      // Assert
      expect(numerosPedro).toEqual([5, 42, 99]);
    });

    it('debería devolver array vacío si el participante no tiene números', () => {
      // Act
      const numeros = tablero.obtenerNumerosPorParticipante('no.existe@example.com');

      // Assert
      expect(numeros).toHaveLength(0);
      expect(numeros).toEqual([]);
    });
  });

  describe('Casos límite', () => {
    it('debería manejar tablero completamente lleno', () => {
      // Arrange
      for (let i = 0; i < 100; i++) {
        tablero.reservarNumero(i, `participante${i}@example.com`);
      }

      // Act & Assert
      expect(tablero.obtenerNumerosOcupados()).toBe(100);
      expect(tablero.obtenerNumerosLibres()).toBe(0);
      
      // Intentar reservar cualquier número debe fallar
      expect(() => {
        tablero.reservarNumero(0, 'otro@example.com');
      }).toThrow();
    });

    it('debería manejar tablero vacío correctamente', () => {
      // Act & Assert
      expect(tablero.obtenerNumerosOcupados()).toBe(0);
      expect(tablero.obtenerNumerosLibres()).toBe(100);
    });

    it('debería permitir reservar el número 0', () => {
      // Act
      tablero.reservarNumero(0, 'juan.perez@example.com');

      // Assert
      expect(tablero.estaOcupado(0)).toBe(true);
    });

    it('debería permitir reservar el número 99', () => {
      // Act
      tablero.reservarNumero(99, 'juan.perez@example.com');

      // Assert
      expect(tablero.estaOcupado(99)).toBe(true);
    });
  });
});
