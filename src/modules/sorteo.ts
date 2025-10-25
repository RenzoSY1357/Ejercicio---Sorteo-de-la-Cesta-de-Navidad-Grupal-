import type { 
NumeroID, 
Sorteo as ISorteo,
Tablero,
Numero,  
Participante as IParticipante
} from '../types/Interfaces.js';

import { GestorParticipantes, Participante, ParticipanteError } from './participantes.js';

/**
 * Clase de error utilizada para problemas específicos relacionados con la manipulación de números
 * (ejemplo: intentar reservar un número ocupado o liberar un número libre)
 *
 * @extends {Error}
 */
export class NumeroError extends Error {
    /**
     * Crea una instancia de NumeroError
     * @param {string} message - El mensaje de error
     */
    constructor(message: string) {
        super(message);
        this.name = 'NumeroError';
    }
}
/**
 * Clase de error utilizada para problemas durante el proceso de sorteo
 * (ejemplo: usar un número premiado fuera del rango válido)
 *
 * @extends {Error}
 */
export class SorteoError extends Error {
    /**
     * Crea una instancia de SorteoError
     * @param {string} message - El mensaje de error
     */
    constructor(message: string) {
        super(message);
        this.name = 'SorteoError';
    }
}

//La clase "madre" por así decirlo
/**
 * La clase principal que gestiona toda la lógica del Sorteo de Navidad,
 * incluyendo participantes, tablero, reservas y el sorteo final
 *
 * @implements {ISorteo}
 */
export class SorteoNavidad implements ISorteo {
    /**
     * El gestor de participantes para registrar, buscar y listar personas
     * @type {GestorParticipantes}
     * @readonly
     */
    public readonly gestorParticipantes: GestorParticipantes;

    /**
     * El tablero de números (del 0 al 99) que contiene el estado de cada número
     * @type {Tablero}
     * @readonly
     */
    public readonly tablero: Tablero;

    /**
     * El ID del número que ha resultado ganador del sorteo. Es `undefined` si el sorteo no se ha realizado
     * @type {NumeroID | undefined}
     */
    public numeroGanador?: NumeroID;
    /**
     * El objeto participante que ganó el sorteo. Es `undefined` si el sorteo no se ha realizado
     * o si el número ganador estaba libre (desierto)
     * @type {IParticipante | undefined}
     */
    public ganador?: IParticipante;

      // Pide un objeto tablero, le metemos una inyección de dependencias
    /**
     * Crea una instancia del Sorteo de Navidad
     * Inicializa el gestor de participantes y establece el tablero de números
     *
     * @param {Tablero} tableroDelCompañero - Una instancia del tablero con todos los números
     */
    constructor(tableroDelCompañero: Tablero) {
        this.gestorParticipantes = new GestorParticipantes();
        this.tablero = tableroDelCompañero;
    }

    /**
     * Registra un nuevo participante utilizando el gestor interno
     *
     * @param {string} nombre - Nombre del participante
     * @param {string} email - Email del participante (debe ser único)
     * @param {string} telefono - Teléfono del participante
     * @returns {Participante} El objeto Participante recién creado
     * @throws {ParticipanteError} Si el email ya existe
     * @example
     * const p = sorteo.registrarParticipante("Laura Marín", "laura@mail.com", "666777888");
     */
    registrarParticipante(nombre: string, email: string, telefono: string): Participante {
        return this.gestorParticipantes.registrarParticipante(nombre, email, telefono);
    }

      // Esta parte de código ahora trabaja sobre las interfaces

      // Busca un número en el array del tablero
    /**
     * Busca y devuelve un objeto `Numero` del tablero por su ID (valor)
     *
     * @param {NumeroID} id - El valor del número a buscar (0 a 99)
     * @returns {Numero} El objeto Numero correspondiente
     * @throws {NumeroError} Si el ID del número no es válido (ejemplo:, fuera del rango 0-99)
     * @private
     */
    private getNumero(id: NumeroID): Numero {
        // Busca en el array de la interfaz
        const numero = this.tablero.numeros.find(n => n.id === id);
        if (numero === undefined) {
            throw new NumeroError(`El número ${id} no es válido. Debe ser entre 0 y 99`);
        }
        return numero;
    }

       //Reserva un número para un participante ya registrado
    /**
     * Reserva un número específico del tablero para un participante
     *
     * @param {NumeroID} numeroId - El ID del número a reservar (0 a 99)
     * @param {string} emailParticipante - El email del participante que hace la reserva
     * @returns {void}
     * @throws {ParticipanteError} Si no se encuentra el participante
     * @throws {NumeroError} Si el número ya está ocupado
     * @example
     * sorteo.registrarParticipante("Laura", "laura@mail.com", "666777888");
     * sorteo.reservarNumero(50, "laura@mail.com"); // Reserva el número 50
     * // sorteo.reservarNumero(50, "otro@mail.com"); // Lanza NumeroError (ya ocupado)
     */
    reservarNumero(numeroId: NumeroID, emailParticipante: string): void {
        const participante = this.gestorParticipantes.buscarPorEmail(emailParticipante);
        if (!participante) {
            throw new ParticipanteError(`No se encontró ningún participante con el email "${emailParticipante}"`);
        }

        const numero = this.getNumero(numeroId);
        
        // Hacemos la validación aquí
        if (!numero.disponible) {
            throw new NumeroError(
                `El número ${numero.id} ya está ocupado por ${numero.participante?.nombre}`
            );
        }
        
        // Actualizamos los datos de la interfaz
        numero.disponible = false;
        numero.participante = participante;
    }

    //Liberamos una reserva del número
    /**
     * Libera un número que estaba reservado, devolviéndolo al estado 'disponible'
     *
     * @param {NumeroID} numeroId - El ID del número a liberar (0 a 99)
     * @returns {void}
     * @throws {NumeroError} Si el número ya estaba libre
     * @example
     * sorteo.reservarNumero(51, "laura@mail.com");
     * sorteo.liberarNumero(51); // Libera el número 51
     * // sorteo.liberarNumero(51); // Lanza NumeroError (ya estaba libre)
     */
    liberarNumero(numeroId: NumeroID): void {
        const numero = this.getNumero(numeroId);

        if (numero.disponible) {
            throw new NumeroError(`El número ${numero.id} ya está libre`);
        }

        numero.disponible = true;
        numero.participante = undefined;
    }

    /**
     * Realiza una simulación completa de sorteo generando 5 números aleatorios,
     * siendo el último el número premiado
     *
     * @returns {{ numerosGenerados: NumeroID[], resultadoSorteo: { ganador: IParticipante | null; numero: Numero; } }}
     * Un objeto que contiene la lista de todos los números generados y el resultado final
     * @throws {SorteoError} Si hay un error al determinar el ganador
     * @example
     * // Se asume que se han reservado números previamente.
     * const { numerosGenerados, resultadoSorteo } = sorteo.realizarSorteoAleatorio();
     * // resultadoSorteo.ganador // Podría ser un Participante o null
     * // numerosGenerados // [85, 12, 44, 9, 32] (ejemplo)
     */
    realizarSorteoAleatorio(): { 
        numerosGenerados: NumeroID[]; 
        resultadoSorteo: { ganador: IParticipante | null; numero: Numero };
    } {
        
        const numerosGenerados: NumeroID[] = [];
        
        // Generamos 5 números aleatorios en secuencia
        for (let i = 0; i < 5; i++) {
            const numAleatorio = Math.floor(Math.random() * 100); // Número entre 0 y 99
            numerosGenerados.push(numAleatorio);
        }

        // El último es el ganador
        const numeroGanador = numerosGenerados[numerosGenerados.length - 1]!;

        // Reutilizamos la lógica que ya teníamos para encontrar al ganador
        const resultadoSorteo = this.realizarSorteo(numeroGanador);

    return {
        numerosGenerados,
        resultadoSorteo,
        };
    }

    // Comienza el sorteo
    /**
     * Procesa un número premiado específico para determinar si hay un ganador
     * Almacena el resultado internamente (`numeroGanador` y `ganador`)
     *
     * @param {NumeroID} numeroPremiado - El ID del número que ha sido premiado (0 a 99)
     * @returns {{ ganador: IParticipante | null; numero: Numero }} El objeto `Numero` y el `Participante` ganador (o `null` si es desierto)
     * @throws {SorteoError} Si el `numeroPremiado` no es un entero válido entre 0 y 99
     * @example
     * // Se asume que el número 10 está reservado por 'ParticipanteA'
     * const resGanador = sorteo.realizarSorteo(10); 
     * // resGanador.ganador // Retorna 'ParticipanteA'
     * const resDesierto = sorteo.realizarSorteo(11); 
     * // resDesierto.ganador // Retorna null
     */
    realizarSorteo(numeroPremiado: NumeroID): { ganador: IParticipante | null; numero: Numero } {
        
        if (numeroPremiado < 0 || numeroPremiado > 99 || !Number.isInteger(numeroPremiado)) {
            throw new SorteoError('El número premiado debe ser un entero entre 0 y 99');
        }

        const numeroObj = this.getNumero(numeroPremiado); // Usamos un helper
        this.numeroGanador = numeroPremiado;

        if (numeroObj.disponible) {
            // Caso DESIERTO
            this.ganador = undefined;
            return { ganador: null, numero: numeroObj };
        } else {
            // Sale el ganador
            this.ganador = numeroObj.participante; // El 'participante' ya es la interfaz correcta
            return { ganador: this.ganador!, numero: numeroObj }; 
        }
    }

    /**
     * Obtiene la información del resultado del sorteo, si se ha realizado
     *
     * @returns {{ ganador?: IParticipante; numeroGanador?: NumeroID }} Objeto con el ganador y el número premiado, o `undefined` si el sorteo no ha terminado
     * @example
     * sorteo.getInfoGanador(); 
     * // { ganador: {nombre: 'Laura', ...}, numeroGanador: 10 }
     */
    getInfoGanador(): { ganador?: IParticipante; numeroGanador?: NumeroID } {
        return {
            ganador: this.ganador,
            numeroGanador: this.numeroGanador,
        };
    }

      // Helpers para Informes

    /**
     * Obtiene una lista de todos los objetos `Numero` que están actualmente reservados
     *
     * @returns {Numero[]} Un array de números ocupados
     * @example
     * const ocupados = sorteo.getNumerosOcupados();
     * // ocupados.length // 2 (si 2 números están reservados)
     */
    getNumerosOcupados(): Numero[] {
        return this.tablero.numeros.filter(n => !n.disponible);
    }

    /**
     * Obtiene una lista de todos los objetos `Numero` que están actualmente disponibles
     *
     * @returns {Numero[]} Un array de números libres
     * @example
     * const disponibles = sorteo.getNumerosDisponibles();
     * // disponibles.length // 98 (si 2 números están reservados)
     */
    getNumerosDisponibles(): Numero[] {
        return this.tablero.numeros.filter(n => n.disponible);
    }
}