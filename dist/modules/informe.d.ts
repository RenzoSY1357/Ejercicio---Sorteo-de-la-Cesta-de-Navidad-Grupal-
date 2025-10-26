import type { SorteoNavidad } from './sorteo.js';
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
export declare function getEstadisticas(sorteo: SorteoNavidad): EstadisticasSorteo;
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
export declare function listarNumerosPorParticipante(sorteo: SorteoNavidad, email: string): Numero[];
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
export declare function generarResumenGeneral(sorteo: SorteoNavidad): string;
//# sourceMappingURL=informe.d.ts.map