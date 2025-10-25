import type { NumeroID, Sorteo as ISorteo, Tablero, Numero, Participante as IParticipante } from '../types/Interfaces.js';
import { GestorParticipantes, Participante } from './participantes.js';
export declare class NumeroError extends Error {
    constructor(message: string);
}
export declare class SorteoError extends Error {
    constructor(message: string);
}
export declare class SorteoNavidad implements ISorteo {
    readonly gestorParticipantes: GestorParticipantes;
    readonly tablero: Tablero;
    numeroGanador?: NumeroID;
    ganador?: IParticipante;
    constructor(tableroDelCompañero: Tablero);
    registrarParticipante(nombre: string, email: string, telefono: string): Participante;
    private getNumero;
    reservarNumero(numeroId: NumeroID, emailParticipante: string): void;
    liberarNumero(numeroId: NumeroID): void;
    realizarSorteoAleatorio(): {
        numerosGenerados: NumeroID[];
        resultadoSorteo: {
            ganador: IParticipante | null;
            numero: Numero;
        };
    };
    realizarSorteo(numeroPremiado: NumeroID): {
        ganador: IParticipante | null;
        numero: Numero;
    };
    getInfoGanador(): {
        ganador?: IParticipante;
        numeroGanador?: NumeroID;
    };
    getNumerosOcupados(): Numero[];
    getNumerosDisponibles(): Numero[];
}
//# sourceMappingURL=sorteo.d.ts.map