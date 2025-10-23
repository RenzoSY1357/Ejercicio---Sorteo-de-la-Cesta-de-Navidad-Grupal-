export interface CeldaTablero {
  numero: number;
  ocupada: boolean;
  emailParticipante?: string;
}

export class Tablero {
  private celdas: Map<number, CeldaTablero>;

  constructor() {
    this.celdas = new Map();
    this.inicializarTablero();
  }

  private inicializarTablero(): void {
    for (let i = 0; i <= 99; i++) {
      this.celdas.set(i, {
        numero: i,
        ocupada: false
      });
    }
  }

  reservarNumero(numero: number, emailParticipante: string): void {
    this.validarNumero(numero);

    const celda = this.celdas.get(numero);
    if (!celda) {
      throw new Error(`El número ${numero} no existe en el tablero`);
    }

    if (celda.ocupada) {
      throw new Error(`El número ${numero} ya está ocupado`);
    }

    celda.ocupada = true;
    celda.emailParticipante = emailParticipante;
  }

  liberarNumero(numero: number): void {
    this.validarNumero(numero);

    const celda = this.celdas.get(numero);
    if (!celda) {
      throw new Error(`El número ${numero} no existe en el tablero`);
    }

    if (!celda.ocupada) {
      throw new Error(`El número ${numero} no está ocupado`);
    }

    celda.ocupada = false;
    celda.emailParticipante = undefined;
  }

  estaOcupado(numero: number): boolean {
    this.validarNumero(numero);
    const celda = this.celdas.get(numero);
    return celda?.ocupada ?? false;
  }

  obtenerNumerosPorParticipante(emailParticipante: string): number[] {
    const numeros: number[] = [];
    
    this.celdas.forEach((celda) => {
      if (celda.ocupada && celda.emailParticipante === emailParticipante) {
        numeros.push(celda.numero);
      }
    });

    return numeros.sort((a, b) => a - b);
  }

  obtenerEstadoNumero(numero: number): CeldaTablero {
    this.validarNumero(numero);
    const celda = this.celdas.get(numero);
    if (!celda) {
      throw new Error(`El número ${numero} no existe en el tablero`);
    }
    return { ...celda };
  }

  obtenerNumerosOcupados(): number {
    let count = 0;
    this.celdas.forEach((celda) => {
      if (celda.ocupada) count++;
    });
    return count;
  }

  obtenerNumerosLibres(): number {
    return 100 - this.obtenerNumerosOcupados();
  }

  private validarNumero(numero: number): void {
    if (numero < 0 || numero > 99) {
      throw new Error('El número debe estar entre 00 y 99');
    }
  }
}
