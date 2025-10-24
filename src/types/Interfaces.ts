
export type NumeroID = number;

export interface Participante {

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