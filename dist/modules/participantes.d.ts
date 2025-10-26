import type { Participante as IParticipante } from '../types/Interfaces.ts';
/**
 * Clase de error personalizada utilizada para señalar problemas relacionados con la gestión de participantes,
 * como intentos de registrar emails duplicados o datos incompletos
 *
 * @extends {Error}
 */
export declare class ParticipanteError extends Error {
    /**
     * Crea una instancia de ParticipanteError
     * @param {string} message - El mensaje de error
     */
    constructor(message: string);
}
/**
 * Representa a un participante registrado en el sorteo
 *
 * @implements {IParticipante}
 */
export declare class Participante implements IParticipante {
    /**
     * Identificador único autoincremental del participante
     * @type {number}
     */
    id: number;
    /**
     * Nombre completo del participante
     * @type {string}
     */
    nombre: string;
    /**
     * Email único del participante, usado como clave principal en el gestor
     * @type {string}
     */
    email: string;
    /**
     * Número de teléfono de contacto del participante
     * @type {string}
     */
    telefono: string;
    /**
     * Crea una instancia de Participante
     *
     * @param {number} id - El ID único del participante
     * @param {string} nombre - El nombre del participante
     * @param {string} email - El email del participante
     * @param {string} telefono - El teléfono del participante
     * @throws {ParticipanteError} Si alguno de los campos obligatorios (nombre, email, teléfono) está vacío
     */
    constructor(id: number, nombre: string, email: string, telefono: string);
}
/**
 * Clase responsable de la gestión centralizada de todos los participantes del sorteo
 * Utiliza un Map para asegurar la unicidad del email y optimizar las búsquedas
 */
export declare class GestorParticipantes {
    /**
     * Almacena los participantes, usando el email como clave para búsquedas rápidas
     * @type {Map<string, Participante>}
     * @private
     */
    private participantes;
    /**
     * Contador autoincremental para asignar un ID único a cada nuevo participante
     * empieza en 1
     * @type {number}
     * @private
     */
    private IdPt;
    /**
     * Registra un nuevo participante en el sistema
     *
     * @param {string} nombre - El nombre del nuevo participante
     * @param {string} email - El email único del nuevo participante
     * @param {string} telefono - El teléfono del nuevo participante
     * @returns {Participante} El objeto Participante creado
     * @throws {ParticipanteError} Si el email ya está registrado en el gestor
     * @example
     * const gestor = new GestorParticipantes();
     * const p1 = gestor.registrarParticipante("Ana García", "ana@test.com", "600123456");
     * // p1.id // 1
     * gestor.registrarParticipante("Luis Pérez", "luis@test.com", "600654321");
     * // gestor.registrarParticipante("Otro Luis", "ana@test.com", "600..."); // Lanza ParticipanteError
     */
    registrarParticipante(nombre: string, email: string, telefono: string): Participante;
    /**
     * Busca un participante por su dirección de email
     *
     * @param {string} email - El email del participante a buscar
     * @returns {Participante | undefined} El participante encontrado o `undefined` si no existe
     * @example
     * const p = gestor.buscarPorEmail("luis@test.com"); // Retorna el objeto Participante
     * const inexistente = gestor.buscarPorEmail("noexiste@test.com"); // Retorna undefined
     */
    buscarPorEmail(email: string): Participante | undefined;
    /**
     * Devuelve una lista (array) de todos los participantes registrados
     *
     * @returns {Participante[]} Un array que contiene todos los objetos Participante
     * @example
     * const lista = gestor.getTodos();
     * // lista.length // 2
     */
    getTodos(): Participante[];
    /**
     * Obtiene el número total de participantes registrados actualmente
     *
     * @type {number}
     * @example
     * gestor.totalParticipantes; // 2
     */
    get totalParticipantes(): number;
}
//# sourceMappingURL=participantes.d.ts.map