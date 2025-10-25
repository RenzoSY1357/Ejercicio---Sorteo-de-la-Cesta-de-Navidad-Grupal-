import type { SorteoNavidad } from './sorteo.js';
import { ParticipanteError } from './participantes.js';
import type { Numero } from '../types/Interfaces.js';

/**
 * @typedef {Object} EstadisticasSorteo
 * @property {number} totalNumeros - El número total de números disponibles en el sorteo (siempre 100, del 00 al 99)
 * @property {number} numerosOcupados - El número de boletos que han sido elegidos por participantes
 * @property {number} numerosLibres - El número de boletos que aún no han sido elegidos
 * @property {number} totalParticipantes - El número total de participantes registrados en el sorteo
 */
export type EstadisticasSorteo = {
totalNumeros: number;
numerosOcupados: number;
numerosLibres: number;
totalParticipantes: number;
};

// Funciones de Informe
/**
 * Obtiene las estadísticas clave del estado actual del sorteo
 *
 * @param {SorteoNavidad} sorteo - La instancia del sorteo de Navidad
 * @returns {EstadisticasSorteo} Un objeto con el resumen estadístico del sorteo
 * @example
 * // Suponiendo que 'miSorteo' tiene 2 participantes y 5 números ocupados.
 * const stats = getEstadisticas(miSorteo);
 * // stats.totalNumeros // 100
 * // stats.numerosOcupados // 5
 * // stats.totalParticipantes // 2
 */
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
/**
 * Lista todos los números que un participante específico ha elegido
 *
 * @param {SorteoNavidad} sorteo - La instancia del sorteo de Navidad
 * @param {string} email - El email del participante cuyos números se desean listar
 * @returns {Numero[]} Un array de objetos Numero que el participante ha elegido
 * @throws {ParticipanteError} Si no se encontró ningún participante con el email proporcionado
 * @example
 * // Obtener los números del participante con email "juan@email.com"
 * const numerosJuan = listarNumerosPorParticipante(miSorteo, "juan@email.com");
 * // numerosJuan // [{ id: 10, disponible: false, participante: {...} }, ...]
 */
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

/**
 * Genera un string con un resumen informativo completo sobre el estado del sorteo
 * Incluye estadísticas generales y, si se ha realizado, la información del número ganador
 *
 * @param {SorteoNavidad} sorteo - La instancia del sorteo de Navidad
 * @returns {string} Un string de texto formateado con el resumen general
 * @example
 * const resumen = generarResumenGeneral(miSorteo);
 * // resumen contendrá: "--- Resumen del Sorteo de Navidad ---\nParticipantes Registrados: 2\n..."
 */
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