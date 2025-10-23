import { Sorteo } from '../models/Sorteo';
import { Tablero } from '../models/Tablero';
import { GestorParticipantes } from '../models/GestorParticipantes';
import { Participante } from '../models/Participante';

describe('Sorteo', () => {
  let sorteo: Sorteo;
  let tablero: Tablero;
  let gestorParticipantes: GestorParticipantes;

  beforeEach(() => {
    tablero = new Tablero();
    gestorParticipantes = new GestorParticipantes();
    sorteo = new Sorteo(tablero, gestorParticipantes);
  });

  describe('Realizar sorteo', () => {
    it('debería realizar un sorteo con número ganador ocupado', () => {
      // Arrange
      const participante = new Participante('Juan Pérez', 'juan.perez@example.com');
      gestorParticipantes.registrarParticipante(participante);
      tablero.reservarNumero(42, 'juan.perez@example.com');

      // Act
      const resultado = sorteo.realizarSorteo(42);

      // Assert
      expect(resultado.numeroGanador).toBe(42);
      expect(resultado.desierto).toBe(false);
      expect(resultado.ganador).toBeDefined();
      expect(resultado.ganador?.nombre).toBe('Juan Pérez');
      expect(resultado.ganador?.email).toBe('juan.perez@example.com');
    });

    it('debería realizar un sorteo con número ganador libre (desierto)', () => {
      // Act
      const resultado = sorteo.realizarSorteo(42);

      // Assert
      expect(resultado.numeroGanador).toBe(42);
      expect(resultado.desierto).toBe(true);
      expect(resultado.ganador).toBeUndefined();
    });

    it('debería devolver correctamente la información del ganador', () => {
      // Arrange
      const participante = new Participante('María García', 'maria.garcia@example.com');
      gestorParticipantes.registrarParticipante(participante);
      tablero.reservarNumero(15, 'maria.garcia@example.com');

      // Act
      const resultado = sorteo.realizarSorteo(15);

      // Assert
      expect(resultado.numeroGanador).toBe(15);
      expect(resultado.desierto).toBe(false);
      expect(resultado.ganador).toBeDefined();
      expect(resultado.ganador?.nombre).toBe('María García');
      expect(resultado.ganador?.email).toBe('maria.garcia@example.com');
    });
  });

  describe('Validación de número ganador', () => {
    it('debería lanzar error si el número ganador es menor a 0', () => {
      // Act & Assert
      expect(() => {
        sorteo.realizarSorteo(-1);
      }).toThrow('El número ganador debe estar entre 00 y 99');
    });

    it('debería lanzar error si el número ganador es mayor a 99', () => {
      // Act & Assert
      expect(() => {
        sorteo.realizarSorteo(100);
      }).toThrow('El número ganador debe estar entre 00 y 99');
    });

    it('debería aceptar el número 0 como ganador', () => {
      // Arrange
      const participante = new Participante('Juan Pérez', 'juan.perez@example.com');
      gestorParticipantes.registrarParticipante(participante);
      tablero.reservarNumero(0, 'juan.perez@example.com');

      // Act
      const resultado = sorteo.realizarSorteo(0);

      // Assert
      expect(resultado.numeroGanador).toBe(0);
      expect(resultado.desierto).toBe(false);
    });

    it('debería aceptar el número 99 como ganador', () => {
      // Arrange
      const participante = new Participante('Juan Pérez', 'juan.perez@example.com');
      gestorParticipantes.registrarParticipante(participante);
      tablero.reservarNumero(99, 'juan.perez@example.com');

      // Act
      const resultado = sorteo.realizarSorteo(99);

      // Assert
      expect(resultado.numeroGanador).toBe(99);
      expect(resultado.desierto).toBe(false);
    });
  });

  describe('Casos especiales', () => {
    it('debería manejar correctamente cuando un participante tiene múltiples números', () => {
      // Arrange
      const participante = new Participante('Pedro López', 'pedro.lopez@example.com');
      gestorParticipantes.registrarParticipante(participante);
      tablero.reservarNumero(10, 'pedro.lopez@example.com');
      tablero.reservarNumero(20, 'pedro.lopez@example.com');
      tablero.reservarNumero(30, 'pedro.lopez@example.com');

      // Act
      const resultado = sorteo.realizarSorteo(20);

      // Assert
      expect(resultado.numeroGanador).toBe(20);
      expect(resultado.desierto).toBe(false);
      expect(resultado.ganador?.email).toBe('pedro.lopez@example.com');
    });

    it('debería funcionar correctamente con múltiples participantes', () => {
      // Arrange
      const participante1 = new Participante('Juan Pérez', 'juan.perez@example.com');
      const participante2 = new Participante('María García', 'maria.garcia@example.com');
      const participante3 = new Participante('Pedro López', 'pedro.lopez@example.com');
      
      gestorParticipantes.registrarParticipante(participante1);
      gestorParticipantes.registrarParticipante(participante2);
      gestorParticipantes.registrarParticipante(participante3);
      
      tablero.reservarNumero(10, 'juan.perez@example.com');
      tablero.reservarNumero(20, 'maria.garcia@example.com');
      tablero.reservarNumero(30, 'pedro.lopez@example.com');

      // Act
      const resultado = sorteo.realizarSorteo(20);

      // Assert
      expect(resultado.ganador?.nombre).toBe('María García');
    });

    it('debería devolver desierto cuando el tablero está vacío', () => {
      // Act
      const resultado = sorteo.realizarSorteo(50);

      // Assert
      expect(resultado.desierto).toBe(true);
      expect(resultado.ganador).toBeUndefined();
    });
  });
});
