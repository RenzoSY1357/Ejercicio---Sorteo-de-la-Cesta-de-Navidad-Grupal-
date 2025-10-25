import { TableroClass } from '../modules/tablero';
import { Participante } from '../modules/participantes';

describe('Gestión del Tablero', () => {
  let tablero: TableroClass;
  let participante1: Participante;
  let participante2: Participante;

  beforeEach(() => {
    tablero = new TableroClass();
    participante1 = new Participante(1, 'Juan Pérez', 'juan@example.com', '111111111');
    participante2 = new Participante(2, 'María López', 'maria@example.com', '222222222');
  });

  describe('Inicializar el tablero correctamente con 100 números', () => {
    it('debe crear un tablero con exactamente 100 números', () => {
      expect(tablero.numeros.length).toBe(100);
    });

    it('debe inicializar todos los números del 0 al 99', () => {
      for (let i = 0; i < 100; i++) {
        const numero = tablero.numeros[i];
        expect(numero).toBeDefined();
        expect(numero?.id).toBe(i);
      }
    });

    it('debe inicializar todos los números como disponibles', () => {
      tablero.numeros.forEach(numero => {
        expect(numero.disponible).toBe(true);
        expect(numero.participante).toBeUndefined();
      });
    });
  });

  describe('Reservar un número libre exitosamente', () => {
    it('debe reservar un número disponible correctamente', () => {
      const resultado = tablero.reservarNumero(25, participante1);
      
      expect(resultado).toBe(true);
      expect(tablero.numeros[25]?.disponible).toBe(false);
      expect(tablero.numeros[25]?.participante).toBe(participante1);
    });

    it('debe reservar el primer número (0) correctamente', () => {
      const resultado = tablero.reservarNumero(0, participante1);
      
      expect(resultado).toBe(true);
      expect(tablero.numeros[0]?.disponible).toBe(false);
      expect(tablero.numeros[0]?.participante).toBe(participante1);
    });

    it('debe reservar el último número (99) correctamente', () => {
      const resultado = tablero.reservarNumero(99, participante1);
      
      expect(resultado).toBe(true);
      expect(tablero.numeros[99]?.disponible).toBe(false);
      expect(tablero.numeros[99]?.participante).toBe(participante1);
    });
  });

  describe('Intentar reservar un número ya ocupado (debe fallar)', () => {
    it('debe retornar false al intentar reservar un número ocupado', () => {
      tablero.reservarNumero(42, participante1);
      const resultado = tablero.reservarNumero(42, participante2);
      
      expect(resultado).toBe(false);
      expect(tablero.numeros[42]?.participante).toBe(participante1);
    });

    it('no debe cambiar el participante original al intentar reservar ocupado', () => {
      tablero.reservarNumero(10, participante1);
      tablero.reservarNumero(10, participante2);
      
      expect(tablero.numeros[10]?.participante?.nombre).toBe('Juan Pérez');
      expect(tablero.numeros[10]?.participante).not.toBe(participante2);
    });
  });

  describe('Permitir que un participante reserve múltiples números', () => {
    it('debe permitir a un participante reservar varios números', () => {
      const r1 = tablero.reservarNumero(5, participante1);
      const r2 = tablero.reservarNumero(15, participante1);
      const r3 = tablero.reservarNumero(25, participante1);
      
      expect(r1).toBe(true);
      expect(r2).toBe(true);
      expect(r3).toBe(true);
      
      expect(tablero.numeros[5]?.participante).toBe(participante1);
      expect(tablero.numeros[15]?.participante).toBe(participante1);
      expect(tablero.numeros[25]?.participante).toBe(participante1);
    });

    it('debe contar correctamente los números de un participante', () => {
      tablero.reservarNumero(1, participante1);
      tablero.reservarNumero(2, participante1);
      tablero.reservarNumero(3, participante1);
      tablero.reservarNumero(50, participante2);
      
      const numerosP1 = tablero.numeros.filter(n => n.participante === participante1);
      const numerosP2 = tablero.numeros.filter(n => n.participante === participante2);
      
      expect(numerosP1.length).toBe(3);
      expect(numerosP2.length).toBe(1);
    });
  });

  describe('Liberar un número correctamente', () => {
    it('debe liberar un número ocupado correctamente', () => {
      tablero.reservarNumero(30, participante1);
      const resultado = tablero.liberarNumero(30);
      
      expect(resultado).toBe(true);
      expect(tablero.numeros[30]?.disponible).toBe(true);
      expect(tablero.numeros[30]?.participante).toBeUndefined();
    });

    it('debe poder reservar de nuevo un número después de liberarlo', () => {
      tablero.reservarNumero(40, participante1);
      tablero.liberarNumero(40);
      const resultado = tablero.reservarNumero(40, participante2);
      
      expect(resultado).toBe(true);
      expect(tablero.numeros[40]?.participante).toBe(participante2);
    });
  });

  describe('Intentar liberar un número que no está ocupado', () => {
    it('debe retornar false al intentar liberar un número disponible', () => {
      const resultado = tablero.liberarNumero(50);
      
      expect(resultado).toBe(false);
      expect(tablero.numeros[50]?.disponible).toBe(true);
    });

    it('debe mantener el estado disponible después de intentar liberar', () => {
      tablero.liberarNumero(60);
      
      expect(tablero.numeros[60]?.disponible).toBe(true);
      expect(tablero.numeros[60]?.participante).toBeUndefined();
    });
  });

  describe('Verificar el estado de números (libre/ocupado)', () => {
    it('debe identificar correctamente un número libre', () => {
      const numero = tablero.ConsultarNumero(20);
      
      expect(numero).toBeDefined();
      expect(numero?.disponible).toBe(true);
      expect(numero?.participante).toBeUndefined();
    });

    it('debe identificar correctamente un número ocupado', () => {
      tablero.reservarNumero(35, participante1);
      const numero = tablero.ConsultarNumero(35);
      
      expect(numero).toBeDefined();
      expect(numero?.disponible).toBe(false);
      expect(numero?.participante).toBe(participante1);
    });

    it('debe retornar información completa del número', () => {
      tablero.reservarNumero(77, participante1);
      const numero = tablero.ConsultarNumero(77);
      
      expect(numero?.id).toBe(77);
      expect(numero?.disponible).toBe(false);
      expect(numero?.participante?.nombre).toBe('Juan Pérez');
      expect(numero?.participante?.email).toBe('juan@example.com');
    });
  });

  describe('Consultar qué números tiene asignados un participante', () => {
    it('debe retornar todos los números de un participante específico', () => {
      tablero.reservarNumero(10, participante1);
      tablero.reservarNumero(20, participante1);
      tablero.reservarNumero(30, participante2);
      tablero.reservarNumero(40, participante1);
      
      const numerosParticipante1 = tablero.numeros.filter(
        n => n.participante?.email === participante1.email && !n.disponible
      );
      
      expect(numerosParticipante1.length).toBe(3);
      expect(numerosParticipante1.map(n => n.id)).toEqual([10, 20, 40]);
    });

    it('debe retornar array vacío si el participante no tiene números', () => {
      const numerosParticipante = tablero.numeros.filter(
        n => n.participante?.email === participante1.email && !n.disponible
      );
      
      expect(numerosParticipante).toEqual([]);
    });
  });
});
