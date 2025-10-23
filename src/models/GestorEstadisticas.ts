import { Tablero } from './Tablero';
import { GestorParticipantes } from './GestorParticipantes';

export interface Estadisticas {
  casillasOcupadas: number;
  casillasLibres: number;
  participantesUnicos: number;
  porcentajeOcupacion: number;
}

export class GestorEstadisticas {
  constructor(
    private tablero: Tablero,
    private gestorParticipantes: GestorParticipantes
  ) {}

  obtenerEstadisticas(): Estadisticas {
    const casillasOcupadas = this.tablero.obtenerNumerosOcupados();
    const casillasLibres = this.tablero.obtenerNumerosLibres();
    const participantesUnicos = this.gestorParticipantes.cantidadParticipantes();
    const porcentajeOcupacion = (casillasOcupadas / 100) * 100;

    return {
      casillasOcupadas,
      casillasLibres,
      participantesUnicos,
      porcentajeOcupacion
    };
  }
}
