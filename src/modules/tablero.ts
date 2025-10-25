import type { Tablero, Numero, Participante, NumeroID } from '../types/Interfaces';

/**
 * Clase que implementa el Tablero, gestionando la colección de los 100 números del sorteo
 * y sus estados de disponibilidad/reserva
 *
 * @implements {Tablero}
 */
export class TableroClass implements Tablero {

    /**
     * El array que contiene los 100 objetos {@link Numero} del sorteo (del índice 0 al 99)
     * @type {Numero[]}
     */
    numeros: Numero[] = [];

    //*CONSTRUCTOR: CREA EL TABLERO
    /*
        En el constructor, se le añade un parametro numero, que cojera los numeros del tablero
        del 1...100 (Array length: 100),  cada elemento es un objeto, con su respectivo id y 
        su disponibilidad, para generar el array, se pasara la funcion (_,i), del cual no se utilizara
        el primer argumento (seran los participantes), con el segundo argumento, el array llamara al callback 100 veces,
        de acuerdo al indice del array y se le añadira a cada elemento del array un objeto 100(i) veces
    */
    /**
     * Crea una instancia de TableroClass
     * Inicializa el array `numeros` con 100 objetos, cada uno con un ID (0-99)
     * y establecido como disponible por defecto
     * @example
     * const tablero = new TableroClass();
     * // tablero.numeros.length // 100
     * // tablero.numeros[0].id // 0
     * // tablero.numeros[99].disponible // true
     */
    constructor() {
        this.numeros = Array.from({ length: 100 }, (_, i) => ({
            id: i, //cada vez que se itera con el indice del array, el indice se retorna como un elemento del array
            // en este caso como un el id, dentro del objeto
            disponible: true,
        }));
    }

    /**
     * Muestra el estado de disponibilidad de un número. Si está disponible, lo marca como no disponible
     * **Nota:** Esta implementación parece reservarlo implícitamente si está libre, lo cual es inusual para un método 'MostrarEstado'
     *
     * @param {NumeroID} id - El ID del número (0 a 99)
     * @returns {boolean} `false` si el número estaba disponible y se marcó como no disponible, `true` si ya estaba no disponible
     */
    MostrarEstadoNumero(id: NumeroID): boolean {

        const numero = this.numeros[id];

        // El numero esta disponible?
        if (numero!.disponible) {
            numero!.disponible = false;
            return false;
        }

        return true;
    }

    /**
     * Intenta reservar un número para un participante
     *
     * @param {NumeroID} id - El ID del número a reservar (0 a 99)
     * @param {Participante} participante - El objeto participante que realiza la reserva
     * @returns {boolean} `true` si la reserva fue exitosa (el número estaba libre), `false` si ya estaba ocupado
     * @example
     * // Se asume que 'p1' es un objeto Participante
     * tablero.reservarNumero(5, p1); // true
     * tablero.numeros[5].participante // p1
     */
    reservarNumero(id: NumeroID, participante: Participante): boolean {

        // el const numero, se ingresa al parametro "_" de los paramatros (_,i)
        // del cual, numero se volvera el objeto cuyo numeroID se ingreso
        const numero = this.numeros[id];

        //El numero ESTA, disponible?
        // Verifica que del objeto, su disponibilidad sea verdadera
        // para luego asignarle el participante (basicamente reserva el objeto)
        if (numero!.disponible) {
            numero!.disponible = false;
            numero!.participante = participante;
            return true; // si lo reserva, retorna true,
        }

        // Si no, retorna...
        return false;
    }

    /**
     * Libera un número que estaba reservado, marcándolo como disponible
     *
     * @param {NumeroID} id - El ID del número a liberar (0 a 99)
     * @returns {boolean} `true` si el número fue liberado (estaba ocupado), `false` si ya estaba disponible
     * @example
     * tablero.liberarNumero(5); // true
     * tablero.numeros[5].disponible // true
     */
    liberarNumero(id: NumeroID): boolean {

        const numero = this.numeros[id];

        // Quiero saber si el numero ingresado NO esta disponible (Esta ocupado?)
        if (!numero!.disponible) {

            // Si el numero esta ocupado (NO esta disponible), lo libera
            numero!.disponible = true;
            numero!.participante = undefined;

            // Y retorna true, ya que, NO estaba disponible...
            return true;
        }

        // Si esta disponible...
        return false;
    }
    
    /**
     * Busca y devuelve el objeto {@link Numero} correspondiente a un ID
     *
     * @param {NumeroID} id - El ID del número a consultar (0 a 99)
     * @returns {Numero | undefined} El objeto Numero, o `undefined` si el ID está fuera del rango
     * @example
     * tablero.ConsultarNumero(15); // { id: 15, disponible: true, ... }
     */
    ConsultarNumero(id: NumeroID): Numero | undefined {

        const numero = this.numeros[id];
        return numero;
    }

}