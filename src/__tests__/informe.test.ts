import { SorteoNavidad } from '../modules/sorteo';
import { TableroClass } from '../modules/tablero';
import { getEstadisticas, listarNumerosPorParticipante, generarResumenGeneral } from '../modules/informe';
import { ParticipanteError } from '../modules/participantes';

describe('Estadísticas del Sorteo', () => {
  let sorteo: SorteoNavidad;
  let tablero: TableroClass;

  beforeEach(() => {
    tablero = new TableroClass();
    sorteo = new SorteoNavidad(tablero);
  });

  describe('Calcular correctamente el número de casillas ocupadas/libres', () => {
    it('debe calcular correctamente con tablero vacío', () => {
      const stats = getEstadisticas(sorteo);

      expect(stats.totalNumeros).toBe(100);
      expect(stats.numerosOcupados).toBe(0);
      expect(stats.numerosLibres).toBe(100);
    });

    it('debe calcular correctamente con algunos números ocupados', () => {
      const p1 = sorteo.registrarParticipante('Juan', 'juan@example.com', '111');
      sorteo.reservarNumero(10, 'juan@example.com');
      sorteo.reservarNumero(20, 'juan@example.com');
      sorteo.reservarNumero(30, 'juan@example.com');

      const stats = getEstadisticas(sorteo);

      expect(stats.numerosOcupados).toBe(3);
      expect(stats.numerosLibres).toBe(97);
      expect(stats.totalNumeros).toBe(100);
    });

    it('debe calcular correctamente con la mitad del tablero ocupado', () => {
      const p1 = sorteo.registrarParticipante('María', 'maria@example.com', '222');
      
      for (let i = 0; i < 50; i++) {
        sorteo.reservarNumero(i, 'maria@example.com');
      }

      const stats = getEstadisticas(sorteo);

      expect(stats.numerosOcupados).toBe(50);
      expect(stats.numerosLibres).toBe(50);
    });

    it('debe calcular correctamente con todos los números ocupados', () => {
      const p1 = sorteo.registrarParticipante('Pedro', 'pedro@example.com', '333');
      
      for (let i = 0; i < 100; i++) {
        sorteo.reservarNumero(i, 'pedro@example.com');
      }

      const stats = getEstadisticas(sorteo);

      expect(stats.numerosOcupados).toBe(100);
      expect(stats.numerosLibres).toBe(0);
    });

    it('debe actualizar estadísticas después de liberar números', () => {
      const p1 = sorteo.registrarParticipante('Ana', 'ana@example.com', '444');
      
      sorteo.reservarNumero(15, 'ana@example.com');
      sorteo.reservarNumero(25, 'ana@example.com');
      sorteo.reservarNumero(35, 'ana@example.com');

      let stats = getEstadisticas(sorteo);
      expect(stats.numerosOcupados).toBe(3);

      sorteo.liberarNumero(25);

      stats = getEstadisticas(sorteo);
      expect(stats.numerosOcupados).toBe(2);
      expect(stats.numerosLibres).toBe(98);
    });
  });

  describe('Contar correctamente el número de participantes únicos', () => {
    it('debe retornar 0 cuando no hay participantes', () => {
      const stats = getEstadisticas(sorteo);

      expect(stats.totalParticipantes).toBe(0);
    });

    it('debe contar correctamente un participante', () => {
      sorteo.registrarParticipante('Juan', 'juan@example.com', '111');

      const stats = getEstadisticas(sorteo);

      expect(stats.totalParticipantes).toBe(1);
    });

    it('debe contar correctamente múltiples participantes', () => {
      sorteo.registrarParticipante('Juan', 'juan@example.com', '111');
      sorteo.registrarParticipante('María', 'maria@example.com', '222');
      sorteo.registrarParticipante('Pedro', 'pedro@example.com', '333');
      sorteo.registrarParticipante('Ana', 'ana@example.com', '444');

      const stats = getEstadisticas(sorteo);

      expect(stats.totalParticipantes).toBe(4);
    });

    it('debe contar participantes aunque no tengan números reservados', () => {
      sorteo.registrarParticipante('Juan', 'juan@example.com', '111');
      sorteo.registrarParticipante('María', 'maria@example.com', '222');
      sorteo.registrarParticipante('Pedro', 'pedro@example.com', '333');

      // Solo Juan reserva números
      sorteo.reservarNumero(10, 'juan@example.com');

      const stats = getEstadisticas(sorteo);

      expect(stats.totalParticipantes).toBe(3);
    });
  });

  describe('Calcular el porcentaje de ocupación', () => {
    it('debe calcular 0% con tablero vacío', () => {
      const stats = getEstadisticas(sorteo);
      const porcentaje = (stats.numerosOcupados / stats.totalNumeros) * 100;

      expect(porcentaje).toBe(0);
    });

    it('debe calcular 50% con mitad del tablero ocupado', () => {
      const p1 = sorteo.registrarParticipante('Juan', 'juan@example.com', '111');
      
      for (let i = 0; i < 50; i++) {
        sorteo.reservarNumero(i, 'juan@example.com');
      }

      const stats = getEstadisticas(sorteo);
      const porcentaje = (stats.numerosOcupados / stats.totalNumeros) * 100;

      expect(porcentaje).toBe(50);
    });

    it('debe calcular 100% con tablero completo', () => {
      const p1 = sorteo.registrarParticipante('María', 'maria@example.com', '222');
      
      for (let i = 0; i < 100; i++) {
        sorteo.reservarNumero(i, 'maria@example.com');
      }

      const stats = getEstadisticas(sorteo);
      const porcentaje = (stats.numerosOcupados / stats.totalNumeros) * 100;

      expect(porcentaje).toBe(100);
    });

    it('debe calcular 25% con un cuarto del tablero ocupado', () => {
      const p1 = sorteo.registrarParticipante('Pedro', 'pedro@example.com', '333');
      
      for (let i = 0; i < 25; i++) {
        sorteo.reservarNumero(i, 'pedro@example.com');
      }

      const stats = getEstadisticas(sorteo);
      const porcentaje = (stats.numerosOcupados / stats.totalNumeros) * 100;

      expect(porcentaje).toBe(25);
    });
  });

  describe('Listar números por participante', () => {
    it('debe retornar array vacío cuando el participante no tiene números', () => {
      sorteo.registrarParticipante('Juan', 'juan@example.com', '111');

      const numeros = listarNumerosPorParticipante(sorteo, 'juan@example.com');

      expect(numeros).toEqual([]);
    });

    it('debe retornar todos los números de un participante', () => {
      sorteo.registrarParticipante('María', 'maria@example.com', '222');
      sorteo.reservarNumero(10, 'maria@example.com');
      sorteo.reservarNumero(20, 'maria@example.com');
      sorteo.reservarNumero(30, 'maria@example.com');

      const numeros = listarNumerosPorParticipante(sorteo, 'maria@example.com');

      expect(numeros.length).toBe(3);
      expect(numeros.map(n => n.id)).toEqual([10, 20, 30]);
    });

    it('debe filtrar correctamente números entre múltiples participantes', () => {
      sorteo.registrarParticipante('Juan', 'juan@example.com', '111');
      sorteo.registrarParticipante('María', 'maria@example.com', '222');
      
      sorteo.reservarNumero(5, 'juan@example.com');
      sorteo.reservarNumero(10, 'maria@example.com');
      sorteo.reservarNumero(15, 'juan@example.com');
      sorteo.reservarNumero(20, 'maria@example.com');

      const numerosJuan = listarNumerosPorParticipante(sorteo, 'juan@example.com');
      const numerosMaria = listarNumerosPorParticipante(sorteo, 'maria@example.com');

      expect(numerosJuan.length).toBe(2);
      expect(numerosJuan.map(n => n.id)).toEqual([5, 15]);
      
      expect(numerosMaria.length).toBe(2);
      expect(numerosMaria.map(n => n.id)).toEqual([10, 20]);
    });

    it('debe lanzar error si el participante no existe', () => {
      expect(() => {
        listarNumerosPorParticipante(sorteo, 'noexiste@example.com');
      }).toThrow(ParticipanteError);
    });

    it('debe actualizar correctamente después de liberar un número', () => {
      sorteo.registrarParticipante('Pedro', 'pedro@example.com', '333');
      sorteo.reservarNumero(40, 'pedro@example.com');
      sorteo.reservarNumero(50, 'pedro@example.com');
      sorteo.reservarNumero(60, 'pedro@example.com');

      let numeros = listarNumerosPorParticipante(sorteo, 'pedro@example.com');
      expect(numeros.length).toBe(3);

      sorteo.liberarNumero(50);

      numeros = listarNumerosPorParticipante(sorteo, 'pedro@example.com');
      expect(numeros.length).toBe(2);
      expect(numeros.map(n => n.id)).toEqual([40, 60]);
    });
  });

  describe('Generar resumen general', () => {
    it('debe generar resumen con tablero vacío y sin sorteo', () => {
      const resumen = generarResumenGeneral(sorteo);

      expect(resumen).toContain('Participantes Registrados: 0');
      expect(resumen).toContain('Números Ocupados: 0');
      expect(resumen).toContain('Números Libres: 100');
      expect(resumen).toContain('Sorteo pendiente de celebración');
    });

    it('debe generar resumen con participantes pero sin sorteo', () => {
      sorteo.registrarParticipante('Juan', 'juan@example.com', '111');
      sorteo.registrarParticipante('María', 'maria@example.com', '222');
      sorteo.reservarNumero(25, 'juan@example.com');

      const resumen = generarResumenGeneral(sorteo);

      expect(resumen).toContain('Participantes Registrados: 2');
      expect(resumen).toContain('Números Ocupados: 1');
      expect(resumen).toContain('Números Libres: 99');
      expect(resumen).toContain('Sorteo pendiente de celebración');
    });

    it('debe generar resumen con sorteo ganador', () => {
      sorteo.registrarParticipante('Ana García', 'ana@example.com', '555');
      sorteo.reservarNumero(42, 'ana@example.com');
      sorteo.realizarSorteo(42);

      const resumen = generarResumenGeneral(sorteo);

      expect(resumen).toContain('¡SORTEO REALIZADO!');
      expect(resumen).toContain('Número Premiado: 42');
      expect(resumen).toContain('Ganador: Ana García');
      expect(resumen).toContain('Email: ana@example.com');
      expect(resumen).toContain('Teléfono: 555');
    });

    it('debe generar resumen con sorteo desierto', () => {
      sorteo.registrarParticipante('Pedro', 'pedro@example.com', '777');
      sorteo.reservarNumero(10, 'pedro@example.com');
      sorteo.realizarSorteo(88);

      const resumen = generarResumenGeneral(sorteo);

      expect(resumen).toContain('¡SORTEO REALIZADO!');
      expect(resumen).toContain('Número Premiado: 88 (DESIERTO)');
      expect(resumen).not.toContain('Ganador:');
    });

    it('debe formatear correctamente números menores a 10', () => {
      sorteo.registrarParticipante('Carlos', 'carlos@example.com', '999');
      sorteo.reservarNumero(5, 'carlos@example.com');
      sorteo.realizarSorteo(5);

      const resumen = generarResumenGeneral(sorteo);

      expect(resumen).toContain('Número Premiado: 05');
    });
  });
});
