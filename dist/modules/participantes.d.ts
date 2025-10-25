import type { Participante as IParticipante } from '../types/Interfaces.ts';
export declare class ParticipanteError extends Error {
    constructor(message: string);
}
export declare class Participante implements IParticipante {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    constructor(id: number, nombre: string, email: string, telefono: string);
}
export declare class GestorParticipantes {
    private participantes;
    private IdPt;
    registrarParticipante(nombre: string, email: string, telefono: string): Participante;
    buscarPorEmail(email: string): Participante | undefined;
    getTodos(): Participante[];
    get totalParticipantes(): number;
}
//# sourceMappingURL=participantes.d.ts.map