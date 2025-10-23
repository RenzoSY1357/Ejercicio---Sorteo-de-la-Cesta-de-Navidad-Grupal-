import { GestorParticipantes } from '../models/GestorParticipantes';
import { Participante } from '../models/Participante';

describe('GestorParticipantes', () => {
  let gestor: GestorParticipantes;

  beforeEach(() => {
    gestor = new GestorParticipantes();
  });

  describe('Registro de participantes', () => {
    it('debería registrar un participante con datos válidos', () => {
      // Arrange
      const participante = new Participante('Juan Pérez', 'juan.perez@example.com');

      // Act
      gestor.registrarParticipante(participante);

      // Assert
      expect(gestor.cantidadParticipantes()).toBe(1);
      expect(gestor.existeParticipante('juan.perez@example.com')).toBe(true);
    });

    it('debería lanzar error al intentar registrar participante con email duplicado', () => {
      // Arrange
      const participante1 = new Participante('Juan Pérez', 'juan.perez@example.com');
      const participante2 = new Participante('Juan P.', 'juan.perez@example.com');
      gestor.registrarParticipante(participante1);

      // Act & Assert
      expect(() => {
        gestor.registrarParticipante(participante2);
      }).toThrow('Ya existe un participante con ese email');
    });

    it('debería lanzar error al intentar registrar participante con email duplicado ignorando mayúsculas', () => {
      // Arrange
      const participante1 = new Participante('Juan Pérez', 'juan.perez@example.com');
      const participante2 = new Participante('Juan P.', 'JUAN.PEREZ@EXAMPLE.COM');
      gestor.registrarParticipante(participante1);

      // Act & Assert
      expect(() => {
        gestor.registrarParticipante(participante2);
      }).toThrow('Ya existe un participante con ese email');
    });

    it('debería permitir registrar múltiples participantes con emails diferentes', () => {
      // Arrange
      const participante1 = new Participante('Juan Pérez', 'juan.perez@example.com');
      const participante2 = new Participante('María García', 'maria.garcia@example.com');
      const participante3 = new Participante('Pedro López', 'pedro.lopez@example.com');

      // Act
      gestor.registrarParticipante(participante1);
      gestor.registrarParticipante(participante2);
      gestor.registrarParticipante(participante3);

      // Assert
      expect(gestor.cantidadParticipantes()).toBe(3);
    });
  });

  describe('Consulta de participantes', () => {
    beforeEach(() => {
      gestor.registrarParticipante(new Participante('Juan Pérez', 'juan.perez@example.com'));
      gestor.registrarParticipante(new Participante('María García', 'maria.garcia@example.com'));
    });

    it('debería obtener la lista de todos los participantes', () => {
      // Act
      const participantes = gestor.obtenerParticipantes();

      // Assert
      expect(participantes).toHaveLength(2);
      expect(participantes.some(p => p.email === 'juan.perez@example.com')).toBe(true);
      expect(participantes.some(p => p.email === 'maria.garcia@example.com')).toBe(true);
    });

    it('debería obtener un participante por email', () => {
      // Act
      const participante = gestor.obtenerParticipantePorEmail('juan.perez@example.com');

      // Assert
      expect(participante).toBeDefined();
      expect(participante?.nombre).toBe('Juan Pérez');
    });

    it('debería obtener un participante por email ignorando mayúsculas', () => {
      // Act
      const participante = gestor.obtenerParticipantePorEmail('JUAN.PEREZ@EXAMPLE.COM');

      // Assert
      expect(participante).toBeDefined();
      expect(participante?.nombre).toBe('Juan Pérez');
    });

    it('debería devolver undefined si el participante no existe', () => {
      // Act
      const participante = gestor.obtenerParticipantePorEmail('no.existe@example.com');

      // Assert
      expect(participante).toBeUndefined();
    });

    it('debería verificar correctamente si existe un participante', () => {
      // Act & Assert
      expect(gestor.existeParticipante('juan.perez@example.com')).toBe(true);
      expect(gestor.existeParticipante('no.existe@example.com')).toBe(false);
    });

    it('debería devolver cero participantes cuando no hay registrados', () => {
      // Arrange
      const gestorVacio = new GestorParticipantes();

      // Act & Assert
      expect(gestorVacio.cantidadParticipantes()).toBe(0);
      expect(gestorVacio.obtenerParticipantes()).toHaveLength(0);
    });
  });
});
