import type { 
NumeroID, 
Sorteo as ISorteo,
Tablero,
Numero,  
Participante as IParticipante
} from '../types/Interfaces.js';

import { GestorParticipantes, Participante, ParticipanteError } from './participantes.js';
export class NumeroError extends Error {
constructor(message: string) {
    super(message);
    this.name = 'NumeroError';
}
}
export class SorteoError extends Error {
constructor(message: string) {
    super(message);
    this.name = 'SorteoError';
}
}

//La clase "madre" por así decirlo
export class SorteoNavidad implements ISorteo {
public readonly gestorParticipantes: GestorParticipantes;

public readonly tablero: Tablero; 

public numeroGanador?: NumeroID;
public ganador?: IParticipante;

  // Pide un objeto tablero, le metemos una inyección de dependencias
constructor(tableroDelCompañero: Tablero) {
    this.gestorParticipantes = new GestorParticipantes();
    this.tablero = tableroDelCompañero;
}

registrarParticipante(nombre: string, email: string, telefono: string): Participante {
    return this.gestorParticipantes.registrarParticipante(nombre, email, telefono);
}

  // Esta parte de código ahora trabaja sobre las interfaces

  // Busca un número en el array del tablero
private getNumero(id: NumeroID): Numero {
    // Busca en el array de la interfaz
    const numero = this.tablero.numeros.find(n => n.id === id);
    if (numero === undefined) {
        throw new NumeroError(`El número ${id} no es válido. Debe ser entre 0 y 99`);
    }
    return numero;
}

   //Reserva un número para un participante ya registrado
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
liberarNumero(numeroId: NumeroID): void {
    const numero = this.getNumero(numeroId);

    if (numero.disponible) {
        throw new NumeroError(`El número ${numero.id} ya está libre`);
    }

    numero.disponible = true;
    numero.participante = undefined;
}

// Comienza el sorteo
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

getInfoGanador(): { ganador?: IParticipante; numeroGanador?: NumeroID } {
    return {
        ganador: this.ganador,
        numeroGanador: this.numeroGanador,
    };
}

  // Helpers para Informes

getNumerosOcupados(): Numero[] {
    return this.tablero.numeros.filter(n => !n.disponible);
}

getNumerosDisponibles(): Numero[] {
    return this.tablero.numeros.filter(n => n.disponible);
    }
}