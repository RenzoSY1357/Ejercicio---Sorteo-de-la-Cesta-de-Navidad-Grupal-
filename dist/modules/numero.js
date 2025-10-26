/**
 * Representa un número individual del tablero del sorteo (del 0 al 99)
 * Gestiona su estado de disponibilidad y el participante que lo tiene reservado
 *
 * @implements {Numero}
 */
export class NumeroTablero {
    /**
     * El identificador del número, que es su valor (0 a 99)
     * @type {NumeroID}
     */
    id;
    /**
     * Indica si el número está disponible para ser elegido (true) o si ya está reservado (false)
     * @type {boolean}
     */
    disponible;
    /**
     * El participante que ha reservado el número, es `undefined` si el número está disponible
     * @type {Participante | undefined}
     */
    participante;
    //Construye el numero
    /**
     * Crea una instancia de NumeroTablero
     * @param {NumeroID} id - El valor numérico del número (0 a 99)
     */
    constructor(id) {
        this.id = id;
        this.disponible = true;
        this.participante = undefined;
    }
    // Si el numero, esta disponible retorna verdadero, y lo reserva con el participante
    /**
     * Intenta reservar el número para un participante
     * Solo tiene éxito si el número está actualmente disponible
     *
     * @param {Participante} Participante - El participante que desea reservar el número
     * @returns {boolean} `true` si la reserva fue exitosa, `false` si el número ya estaba ocupado
     * @example
     * const num10 = new NumeroTablero(10);
     * const exito = num10.reservar(participanteEjemplo); // true
     * const fracaso = num10.reservar(otroParticipante); // false
     */
    reservar(Participante) {
        if (this.disponible) {
            this.disponible = false;
            this.participante = Participante; // Corregido: usa el parámetro 'Participante'
            return true;
        }
        return false;
    }
    // El numero esta disponible?, sino, returna falso
    /**
     * Libera el número, poniéndolo de nuevo a disposición y eliminando el participante asociado
     *
     * @returns {boolean} `true` si el número fue liberado (estaba ocupado), `false` si ya estaba disponible
     * @example
     * // Suponiendo que num10 está reservado
     * const liberado = num10.liberar(); // true
     * const yaLibre = num10.liberar(); // false
     */
    liberar() {
        if (!this.disponible) {
            this.disponible = true;
            this.participante = undefined;
            return true;
        }
        return false;
    }
    // Verifica si el numero esta disponible
    /**
     * Comprueba el estado de disponibilidad del número
     *
     * @returns {boolean} `true` si el número está libre, `false` si está reservado
     * @example
     * const numLibre = new NumeroTablero(5);
     * numLibre.estaDisponible(); // true
     */
    estaDisponible() {
        return this.disponible;
    }
}
// ConsultarNumeroParticipante(ParticiapnteId: number): number {
//         const participante = this.Participante.id[number];
//         if(numero.disponible){
//             const numero = this.numeros[participante];
//             numero!.disponible = false;
//             const participante: Participante = numero?.participante;
//             return number;
//         }
//         return void;
// }
//# sourceMappingURL=numero.js.map