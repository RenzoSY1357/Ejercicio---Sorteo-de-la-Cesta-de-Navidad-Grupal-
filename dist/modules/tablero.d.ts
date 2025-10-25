import type { Tablero, Numero, Participante, NumeroID } from '../types/Interfaces';
export declare class TableroClass implements Tablero {
    numeros: Numero[];
    constructor();
    MostrarEstadoNumero(id: NumeroID): boolean;
    reservarNumero(id: NumeroID, participante: Participante): boolean;
    liberarNumero(id: NumeroID): boolean;
    ConsultarNumero(id: NumeroID): Numero | undefined;
}
//# sourceMappingURL=tablero.d.ts.map