// Este es el error que saltará si alguien intenta registrar un email duplicado
/**
 * Clase de error personalizada utilizada para señalar problemas relacionados con la gestión de participantes,
 * como intentos de registrar emails duplicados o datos incompletos
 *
 * @extends {Error}
 */
export class ParticipanteError extends Error {
    /**
     * Crea una instancia de ParticipanteError
     * @param {string} message - El mensaje de error
     */
    constructor(message) {
        super(message);
        this.name = 'ParticipanteError';
    }
}
// Los datos del participante
/**
 * Representa a un participante registrado en el sorteo
 *
 * @implements {IParticipante}
 */
export class Participante {
    /**
     * Identificador único autoincremental del participante
     * @type {number}
     */
    id;
    /**
     * Nombre completo del participante
     * @type {string}
     */
    nombre;
    /**
     * Email único del participante, usado como clave principal en el gestor
     * @type {string}
     */
    email;
    /**
     * Número de teléfono de contacto del participante
     * @type {string}
     */
    telefono;
    // El constructor valida que no tenga nada vacio
    /**
     * Crea una instancia de Participante
     *
     * @param {number} id - El ID único del participante
     * @param {string} nombre - El nombre del participante
     * @param {string} email - El email del participante
     * @param {string} telefono - El teléfono del participante
     * @throws {ParticipanteError} Si alguno de los campos obligatorios (nombre, email, teléfono) está vacío
     */
    constructor(id, nombre, email, telefono) {
        if (!nombre || !email || !telefono) {
            throw new ParticipanteError('Nombre, email y teléfono son obligatorios');
        }
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
    }
}
// Esta clase es la que controla toda la lista de gente, puse un Map para que sea más rápido buscarlo y para que no se metan emails repetidos
/**
 * Clase responsable de la gestión centralizada de todos los participantes del sorteo
 * Utiliza un Map para asegurar la unicidad del email y optimizar las búsquedas
 */
export class GestorParticipantes {
    // La key tipo string y el valor es Participante
    /**
     * Almacena los participantes, usando el email como clave para búsquedas rápidas
     * @type {Map<string, Participante>}
     * @private
     */
    participantes = new Map();
    /**
     * Contador autoincremental para asignar un ID único a cada nuevo participante
     * empieza en 1
     * @type {number}
     * @private
     */
    IdPt = 1;
    // Método para añadir gente nueva y comprobar si el email ya existe antes de añadirlo
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
    registrarParticipante(nombre, email, telefono) {
        if (this.participantes.has(email)) {
            throw new ParticipanteError(`El email "${email}" ya está registrado`);
        }
        const nuevoParticipante = new Participante(this.IdPt++, nombre, email, telefono);
        this.participantes.set(email, nuevoParticipante);
        return nuevoParticipante;
    }
    // Un buscador para el email y si no lo encuentra sale undefined
    /**
     * Busca un participante por su dirección de email
     *
     * @param {string} email - El email del participante a buscar
     * @returns {Participante | undefined} El participante encontrado o `undefined` si no existe
     * @example
     * const p = gestor.buscarPorEmail("luis@test.com"); // Retorna el objeto Participante
     * const inexistente = gestor.buscarPorEmail("noexiste@test.com"); // Retorna undefined
     */
    buscarPorEmail(email) {
        return this.participantes.get(email);
    }
    // Para sacar la lista de todos los que se han apuntado
    /**
     * Devuelve una lista (array) de todos los participantes registrados
     *
     * @returns {Participante[]} Un array que contiene todos los objetos Participante
     * @example
     * const lista = gestor.getTodos();
     * // lista.length // 2
     */
    getTodos() {
        return Array.from(this.participantes.values());
    }
    // Esto para calcular el total de participantes
    /**
     * Obtiene el número total de participantes registrados actualmente
     *
     * @type {number}
     * @example
     * gestor.totalParticipantes; // 2
     */
    get totalParticipantes() {
        return this.participantes.size;
    }
}
//# sourceMappingURL=participantes.js.map