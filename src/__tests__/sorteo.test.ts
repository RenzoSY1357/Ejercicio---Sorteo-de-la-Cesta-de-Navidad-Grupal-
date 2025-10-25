import { SorteoNavidad, SorteoError, NumeroError } from '../modules/sorteo';
import { TableroClass } from '../modules/tablero';
import { ParticipanteError } from '../modules/participantes';

describe('Gestión del Sorteo', () => {
  let sorteo: SorteoNavidad;
  let tablero: TableroClass;

  beforeEach(() => {
    tablero = new TableroClass();
    sorteo = new SorteoNavidad(tablero);
  });

  describe('Realizar un sorteo con número ganador ocupado', () => {
    it('debe retornar el ganador cuando el número está ocupado', () => {
      const participante = sorteo.registrarParticipante(
        'Juan Pérez',
        'juan@example.com',
        '123456789'
      );
      sorteo.reservarNumero(42, 'juan@example.com');

      const resultado = sorteo.realizarSorteo(42);

      expect(resultado.ganador).toBeDefined();
      expect(resultado.ganador?.nombre).toBe('Juan Pérez');
      expect(resultado.ganador?.email).toBe('juan@example.com');
      expect(resultado.numero.id).toBe(42);
      expect(resultado.numero.disponible).toBe(false);
    });

    it('debe actualizar la información del ganador en el sorteo', () => {
      sorteo.registrarParticipante('María López', 'maria@example.com', '987654321');
      sorteo.reservarNumero(77, 'maria@example.com');

      sorteo.realizarSorteo(77);
      const info = sorteo.getInfoGanador();

      expect(info.numeroGanador).toBe(77);
      expect(info.ganador).toBeDefined();
      expect(info.ganador?.nombre).toBe('María López');
    });

    it('debe permitir realizar múltiples sorteos con diferentes números ocupados', () => {
      const p1 = sorteo.registrarParticipante('Juan', 'juan@example.com', '111');
      const p2 = sorteo.registrarParticipante('María', 'maria@example.com', '222');
      
      sorteo.reservarNumero(10, 'juan@example.com');
      sorteo.reservarNumero(20, 'maria@example.com');

      const resultado1 = sorteo.realizarSorteo(10);
      expect(resultado1.ganador?.nombre).toBe('Juan');

      // Simular segundo sorteo (en la práctica, se usaría una nueva instancia)
      const resultado2 = sorteo.realizarSorteo(20);
      expect(resultado2.ganador?.nombre).toBe('María');
    });
  });

  describe('Realizar un sorteo con número ganador libre (desierto)', () => {
    it('debe retornar null como ganador cuando el número está libre', () => {
      const resultado = sorteo.realizarSorteo(50);

      expect(resultado.ganador).toBeNull();
      expect(resultado.numero.id).toBe(50);
      expect(resultado.numero.disponible).toBe(true);
    });

    it('debe indicar que no hay ganador en la información del sorteo', () => {
      sorteo.realizarSorteo(33);
      const info = sorteo.getInfoGanador();

      expect(info.numeroGanador).toBe(33);
      expect(info.ganador).toBeUndefined();
    });

    it('debe mantener el número como disponible después del sorteo desierto', () => {
      sorteo.realizarSorteo(88);

      const numero = tablero.ConsultarNumero(88);
      expect(numero?.disponible).toBe(true);
      expect(numero?.participante).toBeUndefined();
    });
  });

  describe('Validar que solo se aceptan números entre 00 y 99', () => {
    it('debe lanzar error con número menor a 0', () => {
      expect(() => {
        sorteo.realizarSorteo(-1);
      }).toThrow(SorteoError);
      expect(() => {
        sorteo.realizarSorteo(-1);
      }).toThrow('El número premiado debe ser un entero entre 0 y 99');
    });

    it('debe lanzar error con número mayor a 99', () => {
      expect(() => {
        sorteo.realizarSorteo(100);
      }).toThrow(SorteoError);
      expect(() => {
        sorteo.realizarSorteo(100);
      }).toThrow('El número premiado debe ser un entero entre 0 y 99');
    });

    it('debe lanzar error con número decimal', () => {
      expect(() => {
        sorteo.realizarSorteo(42.5);
      }).toThrow(SorteoError);
    });

    it('debe aceptar el número 0', () => {
      const resultado = sorteo.realizarSorteo(0);
      expect(resultado.numero.id).toBe(0);
    });

    it('debe aceptar el número 99', () => {
      const resultado = sorteo.realizarSorteo(99);
      expect(resultado.numero.id).toBe(99);
    });

    it('debe aceptar cualquier número válido entre 0 y 99', () => {
      const numerosValidos = [0, 1, 25, 50, 75, 99];
      
      numerosValidos.forEach(num => {
        const resultado = sorteo.realizarSorteo(num);
        expect(resultado.numero.id).toBe(num);
      });
    });
  });

  describe('Verificar que se devuelve correctamente la información del ganador', () => {
    it('debe retornar información completa del ganador', () => {
      sorteo.registrarParticipante('Ana García', 'ana@example.com', '555666777');
      sorteo.reservarNumero(15, 'ana@example.com');
      sorteo.realizarSorteo(15);

      const info = sorteo.getInfoGanador();

      expect(info.numeroGanador).toBe(15);
      expect(info.ganador).toBeDefined();
      expect(info.ganador?.nombre).toBe('Ana García');
      expect(info.ganador?.email).toBe('ana@example.com');
      expect(info.ganador?.telefono).toBe('555666777');
    });

    it('debe retornar información de sorteo desierto', () => {
      sorteo.realizarSorteo(60);

      const info = sorteo.getInfoGanador();

      expect(info.numeroGanador).toBe(60);
      expect(info.ganador).toBeUndefined();
    });

    it('debe retornar objeto vacío antes de realizar sorteo', () => {
      const info = sorteo.getInfoGanador();

      expect(info.numeroGanador).toBeUndefined();
      expect(info.ganador).toBeUndefined();
    });
  });

  describe('Integración: Sorteo aleatorio', () => {
    it('debe realizar sorteo aleatorio con números generados', () => {
      sorteo.registrarParticipante('Pedro', 'pedro@example.com', '333444555');
      
      // Reservamos varios números para aumentar probabilidad
      for (let i = 0; i < 50; i++) {
        sorteo.reservarNumero(i, 'pedro@example.com');
      }

      const resultado = sorteo.realizarSorteoAleatorio();

      expect(resultado.numerosGenerados).toHaveLength(5);
      expect(resultado.resultadoSorteo).toBeDefined();
      expect(resultado.resultadoSorteo.numero).toBeDefined();
      
      // Verificar que todos los números generados están en rango válido
      resultado.numerosGenerados.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(99);
      });
    });
  });

  describe('Integración: Reservar números', () => {
    it('debe lanzar error al reservar número para participante no registrado', () => {
      expect(() => {
        sorteo.reservarNumero(25, 'noexiste@example.com');
      }).toThrow(ParticipanteError);
    });

    it('debe lanzar error al reservar número ya ocupado', () => {
      sorteo.registrarParticipante('Juan', 'juan@example.com', '111');
      sorteo.registrarParticipante('María', 'maria@example.com', '222');
      
      sorteo.reservarNumero(30, 'juan@example.com');

      expect(() => {
        sorteo.reservarNumero(30, 'maria@example.com');
      }).toThrow(NumeroError);
    });

    it('debe liberar número correctamente', () => {
      sorteo.registrarParticipante('Carlos', 'carlos@example.com', '999');
      sorteo.reservarNumero(45, 'carlos@example.com');

      sorteo.liberarNumero(45);

      const numero = tablero.ConsultarNumero(45);
      expect(numero?.disponible).toBe(true);
      expect(numero?.participante).toBeUndefined();
    });

    it('debe lanzar error al liberar número ya libre', () => {
      expect(() => {
        sorteo.liberarNumero(70);
      }).toThrow(NumeroError);
    });
  });
});
