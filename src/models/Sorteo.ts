import { Tablero } from './Tablero';
import { Participante } from './Participante';
import { GestorParticipantes } from './GestorParticipantes';

export interface ResultadoSorteo {
  numeroGanador: number;
  ganador?: Participante;
  desierto: boolean;
}

export class Sorteo {
  constructor(
    private tablero: Tablero,
    private gestorParticipantes: GestorParticipantes
  ) {}

  realizarSorteo(numeroGanador: number): ResultadoSorteo {
    if (numeroGanador < 0 || numeroGanador > 99) {
      throw new Error('El número ganador debe estar entre 00 y 99');
    }

    const estadoNumero = this.tablero.obtenerEstadoNumero(numeroGanador);

    if (!estadoNumero.ocupada) {
      return {
        numeroGanador,
        desierto: true
      };
    }

    const ganador = this.gestorParticipantes.obtenerParticipantePorEmail(
      estadoNumero.emailParticipante!
    );

    return {
      numeroGanador,
      ganador,
      desierto: false
    };
  }
}
