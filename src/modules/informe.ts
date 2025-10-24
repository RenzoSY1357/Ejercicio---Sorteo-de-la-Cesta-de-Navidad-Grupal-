import type { SorteoNavidad } from './sorteo.js';
import { ParticipanteError } from './participantes.js';
import type { Numero } from '../types/Interfaces.js';

//Este .ts no tiene clases, solo funciones "helpers" para sacar informes

export type EstadisticasSorteo = {
totalNumeros: number;
numerosOcupados: number;
numerosLibres: number;
totalParticipantes: number;
};

// Funciones de Informe
export function getEstadisticas(sorteo: SorteoNavidad): EstadisticasSorteo {
const ocupados = sorteo.getNumerosOcupados().length; 
const libres = 100 - ocupados;
const totalParticipantes = sorteo.gestorParticipantes.totalParticipantes;

return {
    totalNumeros: 100,
    numerosOcupados: ocupados,
    numerosLibres: libres,
    totalParticipantes: totalParticipantes,
};
}

// Esta funcion para todos los números que ha elejido una persona
export function listarNumerosPorParticipante(sorteo: SorteoNavidad, email: string): Numero[] {
  // Comprobamos que el participante existe con su debido email
const participante = sorteo.gestorParticipantes.buscarPorEmail(email);
    if (!participante) {
        throw new ParticipanteError(`No se encontró ningún participante con el email "${email}"`);
    }

  // Filtramos usando el helper de SorteoNavidad
return sorteo
    .getNumerosOcupados()
    .filter(
        (numero: Numero) => numero.participante?.email === email
    );
}

// Genera un string con todo el resumen del sorteo
export function generarResumenGeneral(sorteo: SorteoNavidad): string {
const stats = getEstadisticas(sorteo);
const infoGanador = sorteo.getInfoGanador();

let resumen = `--- Resumen del Sorteo de Navidad ---\n`;
resumen += `Participantes Registrados: ${stats.totalParticipantes}\n`;
resumen += `Números Ocupados: ${stats.numerosOcupados}\n`;
resumen += `Números Libres: ${stats.numerosLibres}\n`;
resumen += `--------------------------------------\n`;

if (infoGanador.numeroGanador !== undefined) {
    resumen += `¡SORTEO REALIZADO!\n`;
    // Se formatea el número aquí, ya que la interfaz 'Numero' no tiene un getter
    const numFormateado = infoGanador.numeroGanador.toString().padStart(2, '0'); 
    
    if (infoGanador.ganador) {
        resumen += `Número Premiado: ${numFormateado}\n`;
        resumen += `Ganador: ${infoGanador.ganador.nombre}\n`;
        resumen += `Email: ${infoGanador.ganador.email}\n`;
        resumen += `Teléfono: ${infoGanador.ganador.telefono}\n`;
    } else {
        resumen += `Número Premiado: ${numFormateado} (DESIERTO)\n`;
    }
    } else {
    resumen += `Sorteo pendiente de celebración.\n`;
    }

    return resumen;
}