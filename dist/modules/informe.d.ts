import type { SorteoNavidad } from './sorteo.js';
import type { Numero } from '../types/Interfaces.js';
export type EstadisticasSorteo = {
    totalNumeros: number;
    numerosOcupados: number;
    numerosLibres: number;
    totalParticipantes: number;
};
export declare function getEstadisticas(sorteo: SorteoNavidad): EstadisticasSorteo;
export declare function listarNumerosPorParticipante(sorteo: SorteoNavidad, email: string): Numero[];
export declare function generarResumenGeneral(sorteo: SorteoNavidad): string;
//# sourceMappingURL=informe.d.ts.map