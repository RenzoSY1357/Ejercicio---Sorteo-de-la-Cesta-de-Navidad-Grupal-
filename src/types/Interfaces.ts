
export type NumeroID = number;

export interface Participante {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
}

export interface Numero {
    id: NumeroID;
    disponible: boolean;
    participante?: Participante;
}

export interface Tablero {
    numeros: Numero[];
}

export interface Sorteo {
    numeroGanador?: NumeroID;
    ganador?: Participante;
}