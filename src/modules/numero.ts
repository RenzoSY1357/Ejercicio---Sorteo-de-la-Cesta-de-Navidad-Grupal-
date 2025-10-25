import type { Numero, Participante, NumeroID } from '../types/Interfaces';

export class NumeroTablero implements Numero {

    id: NumeroID;
    disponible: boolean;
    participante?: Participante;

    //Construye el numero
    constructor(id: NumeroID){
        this.id = id;
        this.disponible = true;
        this.participante = undefined;
    }

    // Si el numero, esta disponible retorna verdadero,
    // y lo reserva con el participante
    reservar(Participante: Participante): boolean{
        if(this.disponible) {
            this.disponible = false;
            this.participante = this.participante;
            return true;
        }
        return false;
    }

    // El numero esta disponible?, sino, returna falso
    liberar():boolean {
        if(!this.disponible){
            this.disponible = true;
            this.participante = undefined;
            return true;
        }
        return false;
    }

    // Verifica si el numero esta disponible
    estaDisponible(): boolean {
        return this.disponible;
    }
}


// ConsultarNumeroParticipante(ParticiapnteId: number): number {

//         const participante = this.Participante.id[number];

//         if(numero.disponible){

//             const numero = this.numeros[participante];

//             numero!.disponible = false;
//             const participante: Participante = numero?.participante;


//             return number;
//         }

//         return void;
// }
