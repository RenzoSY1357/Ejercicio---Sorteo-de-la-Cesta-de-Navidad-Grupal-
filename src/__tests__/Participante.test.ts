import { Participante } from '../models/Participante';

describe('Participante', () => {
  describe('Creación de participante', () => {
    it('debería crear un participante con datos válidos', () => {
      // Arrange & Act
      const participante = new Participante('Juan Pérez', 'juan.perez@example.com');

      // Assert
      expect(participante.nombre).toBe('Juan Pérez');
      expect(participante.email).toBe('juan.perez@example.com');
    });

    it('debería lanzar error al crear participante con nombre vacío', () => {
      // Arrange, Act & Assert
      expect(() => {
        new Participante('', 'juan.perez@example.com');
      }).toThrow('El nombre no puede estar vacío');
    });

    it('debería lanzar error al crear participante con nombre solo espacios', () => {
      // Arrange, Act & Assert
      expect(() => {
        new Participante('   ', 'juan.perez@example.com');
      }).toThrow('El nombre no puede estar vacío');
    });

    it('debería lanzar error al crear participante con email vacío', () => {
      // Arrange, Act & Assert
      expect(() => {
        new Participante('Juan Pérez', '');
      }).toThrow('El email no puede estar vacío');
    });

    it('debería lanzar error al crear participante con email mal formado sin @', () => {
      // Arrange, Act & Assert
      expect(() => {
        new Participante('Juan Pérez', 'juanperezexample.com');
      }).toThrow('El email no tiene un formato válido');
    });

    it('debería lanzar error al crear participante con email mal formado sin dominio', () => {
      // Arrange, Act & Assert
      expect(() => {
        new Participante('Juan Pérez', 'juan.perez@');
      }).toThrow('El email no tiene un formato válido');
    });

    it('debería lanzar error al crear participante con email mal formado sin extensión', () => {
      // Arrange, Act & Assert
      expect(() => {
        new Participante('Juan Pérez', 'juan.perez@example');
      }).toThrow('El email no tiene un formato válido');
    });
  });

  describe('Comparación de participantes', () => {
    it('debería identificar dos participantes como iguales si tienen el mismo email', () => {
      // Arrange
      const participante1 = new Participante('Juan Pérez', 'juan.perez@example.com');
      const participante2 = new Participante('Juan P.', 'juan.perez@example.com');

      // Act
      const sonIguales = participante1.equals(participante2);

      // Assert
      expect(sonIguales).toBe(true);
    });

    it('debería identificar dos participantes como iguales ignorando mayúsculas/minúsculas en email', () => {
      // Arrange
      const participante1 = new Participante('Juan Pérez', 'juan.perez@example.com');
      const participante2 = new Participante('Juan P.', 'JUAN.PEREZ@EXAMPLE.COM');

      // Act
      const sonIguales = participante1.equals(participante2);

      // Assert
      expect(sonIguales).toBe(true);
    });

    it('debería identificar dos participantes como diferentes si tienen distinto email', () => {
      // Arrange
      const participante1 = new Participante('Juan Pérez', 'juan.perez@example.com');
      const participante2 = new Participante('María García', 'maria.garcia@example.com');

      // Act
      const sonIguales = participante1.equals(participante2);

      // Assert
      expect(sonIguales).toBe(false);
    });
  });
});
