import { GestorParticipantes, Participante, ParticipanteError } from '../modules/participantes';

describe('Gestión de Participantes', () => {
  let gestor: GestorParticipantes;

  beforeEach(() => {
    gestor = new GestorParticipantes();
  });

  describe('Crear participante con datos válidos', () => {
    it('debe crear un participante con todos los datos correctos', () => {
      const participante = gestor.registrarParticipante(
        'Juan Pérez',
        'juan@example.com',
        '123456789'
      );

      expect(participante).toBeDefined();
      expect(participante.nombre).toBe('Juan Pérez');
      expect(participante.email).toBe('juan@example.com');
      expect(participante.telefono).toBe('123456789');
      expect(participante.id).toBe(1);
    });

    it('debe asignar IDs incrementales a los participantes', () => {
      const p1 = gestor.registrarParticipante('Juan', 'juan@example.com', '111');
      const p2 = gestor.registrarParticipante('María', 'maria@example.com', '222');
      const p3 = gestor.registrarParticipante('Pedro', 'pedro@example.com', '333');

      expect(p1.id).toBe(1);
      expect(p2.id).toBe(2);
      expect(p3.id).toBe(3);
    });
  });

  describe('Crear participante con datos inválidos', () => {
    it('debe lanzar error cuando el nombre está vacío', () => {
      expect(() => {
        gestor.registrarParticipante('', 'email@example.com', '123456789');
      }).toThrow(ParticipanteError);
      expect(() => {
        gestor.registrarParticipante('', 'email@example.com', '123456789');
      }).toThrow('Nombre, email y teléfono son obligatorios');
    });

    it('debe lanzar error cuando el email está vacío', () => {
      expect(() => {
        gestor.registrarParticipante('Juan Pérez', '', '123456789');
      }).toThrow(ParticipanteError);
      expect(() => {
        gestor.registrarParticipante('Juan Pérez', '', '123456789');
      }).toThrow('Nombre, email y teléfono son obligatorios');
    });

    it('debe lanzar error cuando el teléfono está vacío', () => {
      expect(() => {
        gestor.registrarParticipante('Juan Pérez', 'juan@example.com', '');
      }).toThrow(ParticipanteError);
      expect(() => {
        gestor.registrarParticipante('Juan Pérez', 'juan@example.com', '');
      }).toThrow('Nombre, email y teléfono son obligatorios');
    });

    it('debe lanzar error cuando todos los campos están vacíos', () => {
      expect(() => {
        gestor.registrarParticipante('', '', '');
      }).toThrow(ParticipanteError);
    });
  });

  describe('No se pueden registrar participantes duplicados', () => {
    it('debe lanzar error al intentar registrar un email duplicado', () => {
      gestor.registrarParticipante('Juan Pérez', 'juan@example.com', '123456789');

      expect(() => {
        gestor.registrarParticipante('Juan Diferente', 'juan@example.com', '987654321');
      }).toThrow(ParticipanteError);
      expect(() => {
        gestor.registrarParticipante('Juan Diferente', 'juan@example.com', '987654321');
      }).toThrow('El email "juan@example.com" ya está registrado');
    });

    it('debe permitir registrar participantes con emails diferentes', () => {
      const p1 = gestor.registrarParticipante('Juan', 'juan@example.com', '111');
      const p2 = gestor.registrarParticipante('María', 'maria@example.com', '222');

      expect(p1.email).toBe('juan@example.com');
      expect(p2.email).toBe('maria@example.com');
      expect(gestor.totalParticipantes).toBe(2);
    });
  });

  describe('Consultar la lista de participantes', () => {
    it('debe retornar una lista vacía cuando no hay participantes', () => {
      const lista = gestor.getTodos();
      expect(lista).toEqual([]);
      expect(lista.length).toBe(0);
    });

    it('debe retornar todos los participantes registrados', () => {
      gestor.registrarParticipante('Juan', 'juan@example.com', '111');
      gestor.registrarParticipante('María', 'maria@example.com', '222');
      gestor.registrarParticipante('Pedro', 'pedro@example.com', '333');

      const lista = gestor.getTodos();
      expect(lista.length).toBe(3);
      expect(lista[0]?.nombre).toBe('Juan');
      expect(lista[1]?.nombre).toBe('María');
      expect(lista[2]?.nombre).toBe('Pedro');
    });

    it('debe permitir buscar participante por email', () => {
      gestor.registrarParticipante('Juan', 'juan@example.com', '111');
      gestor.registrarParticipante('María', 'maria@example.com', '222');

      const participante = gestor.buscarPorEmail('juan@example.com');
      expect(participante).toBeDefined();
      expect(participante?.nombre).toBe('Juan');
      expect(participante?.telefono).toBe('111');
    });

    it('debe retornar undefined al buscar un email que no existe', () => {
      gestor.registrarParticipante('Juan', 'juan@example.com', '111');

      const participante = gestor.buscarPorEmail('noexiste@example.com');
      expect(participante).toBeUndefined();
    });

    it('debe retornar el total de participantes correctamente', () => {
      expect(gestor.totalParticipantes).toBe(0);

      gestor.registrarParticipante('Juan', 'juan@example.com', '111');
      expect(gestor.totalParticipantes).toBe(1);

      gestor.registrarParticipante('María', 'maria@example.com', '222');
      expect(gestor.totalParticipantes).toBe(2);
    });
  });
});
