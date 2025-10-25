import { GestorParticipantes, Participante, ParticipanteError } from './participantes.js';
export class NumeroError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NumeroError';
    }
}
export class SorteoError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SorteoError';
    }
}
//La clase "madre" por así decirlo
export class SorteoNavidad {
    gestorParticipantes;
    tablero;
    numeroGanador;
    ganador;
    // Pide un objeto tablero, le metemos una inyección de dependencias
    constructor(tableroDelCompañero) {
        this.gestorParticipantes = new GestorParticipantes();
        this.tablero = tableroDelCompañero;
    }
    registrarParticipante(nombre, email, telefono) {
        return this.gestorParticipantes.registrarParticipante(nombre, email, telefono);
    }
    // Esta parte de código ahora trabaja sobre las interfaces
    // Busca un número en el array del tablero
    getNumero(id) {
        // Busca en el array de la interfaz
        const numero = this.tablero.numeros.find(n => n.id === id);
        if (numero === undefined) {
            throw new NumeroError(`El número ${id} no es válido. Debe ser entre 0 y 99`);
        }
        return numero;
    }
    //Reserva un número para un participante ya registrado
    reservarNumero(numeroId, emailParticipante) {
        const participante = this.gestorParticipantes.buscarPorEmail(emailParticipante);
        if (!participante) {
            throw new ParticipanteError(`No se encontró ningún participante con el email "${emailParticipante}"`);
        }
        const numero = this.getNumero(numeroId);
        // Hacemos la validación aquí
        if (!numero.disponible) {
            throw new NumeroError(`El número ${numero.id} ya está ocupado por ${numero.participante?.nombre}`);
        }
        // Actualizamos los datos de la interfaz
        numero.disponible = false;
        numero.participante = participante;
    }
    //Liberamos una reserva del número
    liberarNumero(numeroId) {
        const numero = this.getNumero(numeroId);
        if (numero.disponible) {
            throw new NumeroError(`El número ${numero.id} ya está libre`);
        }
        numero.disponible = true;
        numero.participante = undefined;
    }
    realizarSorteoAleatorio() {
        const numerosGenerados = [];
        // Generamos 5 números aleatorios en secuencia
        for (let i = 0; i < 5; i++) {
            const numAleatorio = Math.floor(Math.random() * 100); // Número entre 0 y 99
            numerosGenerados.push(numAleatorio);
        }
        // El último es el ganador
        const numeroGanador = numerosGenerados[numerosGenerados.length - 1];
        // Reutilizamos la lógica que ya teníamos para encontrar al ganador
        const resultadoSorteo = this.realizarSorteo(numeroGanador);
        return {
            numerosGenerados,
            resultadoSorteo,
        };
    }
    // Comienza el sorteo
    realizarSorteo(numeroPremiado) {
        if (numeroPremiado < 0 || numeroPremiado > 99 || !Number.isInteger(numeroPremiado)) {
            throw new SorteoError('El número premiado debe ser un entero entre 0 y 99');
        }
        const numeroObj = this.getNumero(numeroPremiado); // Usamos un helper
        this.numeroGanador = numeroPremiado;
        if (numeroObj.disponible) {
            // Caso DESIERTO
            this.ganador = undefined;
            return { ganador: null, numero: numeroObj };
        }
        else {
            // Sale el ganador
            this.ganador = numeroObj.participante; // El 'participante' ya es la interfaz correcta
            return { ganador: this.ganador, numero: numeroObj };
        }
    }
    getInfoGanador() {
        return {
            ganador: this.ganador,
            numeroGanador: this.numeroGanador,
        };
    }
    // Helpers para Informes
    getNumerosOcupados() {
        return this.tablero.numeros.filter(n => !n.disponible);
    }
    getNumerosDisponibles() {
        return this.tablero.numeros.filter(n => n.disponible);
    }
}
//# sourceMappingURL=sorteo.js.map