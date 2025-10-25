// Este es el error que saltará si alguien intenta registrar un email duplicado
export class ParticipanteError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ParticipanteError';
    }
}
// Los datos del participante
export class Participante {
    id;
    nombre;
    email;
    telefono;
    // El constructor valida que no tenga nada vacio
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
export class GestorParticipantes {
    // La key tipo string y el valor es Participante
    participantes = new Map();
    IdPt = 1;
    // Método para añadir gente nueva y comprobar si el email ya existe antes de añadirlo
    registrarParticipante(nombre, email, telefono) {
        if (this.participantes.has(email)) {
            throw new ParticipanteError(`El email "${email}" ya está registrado`);
        }
        const nuevoParticipante = new Participante(this.IdPt++, nombre, email, telefono);
        this.participantes.set(email, nuevoParticipante);
        return nuevoParticipante;
    }
    // Un buscador para el email y si no lo encuentra sale undefined
    buscarPorEmail(email) {
        return this.participantes.get(email);
    }
    // Para sacar la lista de todos los que se han apuntado
    getTodos() {
        return Array.from(this.participantes.values());
    }
    // Esto para calcular el total de participantes
    get totalParticipantes() {
        return this.participantes.size;
    }
}
//# sourceMappingURL=participantes.js.map