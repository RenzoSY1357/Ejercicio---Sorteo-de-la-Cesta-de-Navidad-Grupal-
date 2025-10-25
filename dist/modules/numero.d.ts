import type { Numero, Participante, NumeroID } from '../types/Interfaces';
export declare class NumeroTablero implements Numero {
    id: NumeroID;
    disponible: boolean;
    participante?: Participante;
    constructor(id: NumeroID);
    reservar(Participante: Participante): boolean;
    liberar(): boolean;
    estaDisponible(): boolean;
}
//# sourceMappingURL=numero.d.ts.map