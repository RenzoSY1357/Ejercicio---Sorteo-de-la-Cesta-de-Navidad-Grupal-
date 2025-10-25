export class NumeroTablero {
    id;
    disponible;
    participante;
    //Construye el numero
    constructor(id) {
        this.id = id;
        this.disponible = true;
        this.participante = undefined;
    }
    // Si el numero, esta disponible retorna verdadero,
    // y lo reserva con el participante
    reservar(Participante) {
        if (this.disponible) {
            this.disponible = false;
            this.participante = this.participante;
            return true;
        }
        return false;
    }
    // El numero esta disponible?, sino, returna falso
    liberar() {
        if (!this.disponible) {
            this.disponible = true;
            this.participante = undefined;
            return true;
        }
        return false;
    }
    // Verifica si el numero esta disponible
    estaDisponible() {
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
//# sourceMappingURL=numero.js.map