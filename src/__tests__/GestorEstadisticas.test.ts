import { GestorEstadisticas } from '../models/GestorEstadisticas';
import { Tablero } from '../models/Tablero';
import { GestorParticipantes } from '../models/GestorParticipantes';
import { Participante } from '../models/Participante';

describe('GestorEstadisticas', () => {
  let gestorEstadisticas: GestorEstadisticas;
  let tablero: Tablero;
  let gestorParticipantes: GestorParticipantes;

  beforeEach(() => {
    tablero = new Tablero();
    gestorParticipantes = new GestorParticipantes();
    gestorEstadisticas = new GestorEstadisticas(tablero, gestorParticipantes);
  });

  describe('Cálculo de estadísticas', () => {
    it('debería calcular correctamente estadísticas con tablero vacío', () => {
      // Act
      const stats = gestorEstadisticas.obtenerEstadisticas();

      // Assert
      expect(stats.casillasOcupadas).toBe(0);
      expect(stats.casillasLibres).toBe(100);
      expect(stats.participantesUnicos).toBe(0);
      expect(stats.porcentajeOcupacion).toBe(0);
    });

    it('debería calcular correctamente el número de casillas ocupadas', () => {
      // Arrange
      const participante = new Participante('Juan Pérez', 'juan.perez@example.com');
      gestorParticipantes.registrarParticipante(participante);
      tablero.reservarNumero(10, 'juan.perez@example.com');
      tablero.reservarNumero(20, 'juan.perez@example.com');
      tablero.reservarNumero(30, 'juan.perez@example.com');

      // Act
      const stats = gestorEstadisticas.obtenerEstadisticas();

      // Assert
      expect(stats.casillasOcupadas).toBe(3);
    });

    it('debería calcular correctamente el número de casillas libres', () => {
      // Arrange
      const participante = new Participante('Juan Pérez', 'juan.perez@example.com');
      gestorParticipantes.registrarParticipante(participante);
      tablero.reservarNumero(10, 'juan.perez@example.com');
      tablero.reservarNumero(20, 'juan.perez@example.com');

      // Act
      const stats = gestorEstadisticas.obtenerEstadisticas();

      // Assert
      expect(stats.casillasLibres).toBe(98);
    });

    it('debería contar correctamente el número de participantes únicos', () => {
      // Arrange
      const participante1 = new Participante('Juan Pérez', 'juan.perez@example.com');
      const participante2 = new Participante('María García', 'maria.garcia@example.com');
      const participante3 = new Participante('Pedro López', 'pedro.lopez@example.com');
      
      gestorParticipantes.registrarParticipante(participante1);
      gestorParticipantes.registrarParticipante(participante2);
      gestorParticipantes.registrarParticipante(participante3);

      // Act
      const stats = gestorEstadisticas.obtenerEstadisticas();

      // Assert
      expect(stats.participantesUnicos).toBe(3);
    });

    it('debería calcular correctamente el porcentaje de ocupación', () => {
      // Arrange
      const participante = new Participante('Juan Pérez', 'juan.perez@example.com');
      gestorParticipantes.registrarParticipante(participante);
      
      // Ocupar 50 casillas
      for (let i = 0; i < 50; i++) {
        tablero.reservarNumero(i, 'juan.perez@example.com');
      }

      // Act
      const stats = gestorEstadisticas.obtenerEstadisticas();

      // Assert
      expect(stats.porcentajeOcupacion).toBe(50);
    });

    it('debería calcular porcentaje de ocupación con decimales correctamente', () => {
      // Arrange
      const participante = new Participante('Juan Pérez', 'juan.perez@example.com');
      gestorParticipantes.registrarParticipante(participante);
      
      tablero.reservarNumero(0, 'juan.perez@example.com');
      tablero.reservarNumero(1, 'juan.perez@example.com');
      tablero.reservarNumero(2, 'juan.perez@example.com');

      // Act
      const stats = gestorEstadisticas.obtenerEstadisticas();

      // Assert
      expect(stats.porcentajeOcupacion).toBe(3);
    });
  });

  describe('Casos especiales', () => {
    it('debería calcular estadísticas con un solo participante con múltiples números', () => {
      // Arrange
      const participante = new Participante('Juan Pérez', 'juan.perez@example.com');
      gestorParticipantes.registrarParticipante(participante);
      
      tablero.reservarNumero(10, 'juan.perez@example.com');
      tablero.reservarNumero(20, 'juan.perez@example.com');
      tablero.reservarNumero(30, 'juan.perez@example.com');

      // Act
      const stats = gestorEstadisticas.obtenerEstadisticas();

      // Assert
      expect(stats.casillasOcupadas).toBe(3);
      expect(stats.casillasLibres).toBe(97);
      expect(stats.participantesUnicos).toBe(1);
      expect(stats.porcentajeOcupacion).toBe(3);
    });

    it('debería calcular estadísticas con múltiples participantes', () => {
      // Arrange
      const participante1 = new Participante('Juan Pérez', 'juan.perez@example.com');
      const participante2 = new Participante('María García', 'maria.garcia@example.com');
      
      gestorParticipantes.registrarParticipante(participante1);
      gestorParticipantes.registrarParticipante(participante2);
      
      tablero.reservarNumero(10, 'juan.perez@example.com');
      tablero.reservarNumero(20, 'juan.perez@example.com');
      tablero.reservarNumero(30, 'maria.garcia@example.com');

      // Act
      const stats = gestorEstadisticas.obtenerEstadisticas();

      // Assert
      expect(stats.casillasOcupadas).toBe(3);
      expect(stats.casillasLibres).toBe(97);
      expect(stats.participantesUnicos).toBe(2);
      expect(stats.porcentajeOcupacion).toBe(3);
    });

    it('debería calcular estadísticas con tablero completamente lleno', () => {
      // Arrange
      const participante = new Participante('Juan Pérez', 'juan.perez@example.com');
      gestorParticipantes.registrarParticipante(participante);
      
      for (let i = 0; i < 100; i++) {
        tablero.reservarNumero(i, 'juan.perez@example.com');
      }

      // Act
      const stats = gestorEstadisticas.obtenerEstadisticas();

      // Assert
      expect(stats.casillasOcupadas).toBe(100);
      expect(stats.casillasLibres).toBe(0);
      expect(stats.participantesUnicos).toBe(1);
      expect(stats.porcentajeOcupacion).toBe(100);
    });

    it('debería manejar participantes registrados sin números asignados', () => {
      // Arrange
      const participante1 = new Participante('Juan Pérez', 'juan.perez@example.com');
      const participante2 = new Participante('María García', 'maria.garcia@example.com');
      
      gestorParticipantes.registrarParticipante(participante1);
      gestorParticipantes.registrarParticipante(participante2);

      // Act
      const stats = gestorEstadisticas.obtenerEstadisticas();

      // Assert
      expect(stats.casillasOcupadas).toBe(0);
      expect(stats.casillasLibres).toBe(100);
      expect(stats.participantesUnicos).toBe(2);
      expect(stats.porcentajeOcupacion).toBe(0);
    });
  });
});
