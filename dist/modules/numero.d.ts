import type { Numero, Participante, NumeroID } from '../types/Interfaces';
/**
 * Representa un número individual del tablero del sorteo (del 0 al 99)
 * Gestiona su estado de disponibilidad y el participante que lo tiene reservado
 *
 * @implements {Numero}
 */
export declare class NumeroTablero implements Numero {
    /**
     * El identificador del número, que es su valor (0 a 99)
     * @type {NumeroID}
     */
    id: NumeroID;
    /**
     * Indica si el número está disponible para ser elegido (true) o si ya está reservado (false)
     * @type {boolean}
     */
    disponible: boolean;
    /**
     * El participante que ha reservado el número, es `undefined` si el número está disponible
     * @type {Participante | undefined}
     */
    participante?: Participante;
    /**
     * Crea una instancia de NumeroTablero
     * @param {NumeroID} id - El valor numérico del número (0 a 99)
     */
    constructor(id: NumeroID);
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
    reservar(Participante: Participante): boolean;
    /**
     * Libera el número, poniéndolo de nuevo a disposición y eliminando el participante asociado
     *
     * @returns {boolean} `true` si el número fue liberado (estaba ocupado), `false` si ya estaba disponible
     * @example
     * // Suponiendo que num10 está reservado
     * const liberado = num10.liberar(); // true
     * const yaLibre = num10.liberar(); // false
     */
    liberar(): boolean;
    /**
     * Comprueba el estado de disponibilidad del número
     *
     * @returns {boolean} `true` si el número está libre, `false` si está reservado
     * @example
     * const numLibre = new NumeroTablero(5);
     * numLibre.estaDisponible(); // true
     */
    estaDisponible(): boolean;
}
//# sourceMappingURL=numero.d.ts.map