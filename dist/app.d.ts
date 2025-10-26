/**
 * Clase principal de la aplicación que gestiona la lógica de la interfaz de usuario (UI)
 * y la interacción con la lógica del sorteo de Navidad
 */
declare class AppSorteoNavidad {
    /**
     * Instancia central de la lógica del sorteo
     * @type {SorteoNavidad}
     * @private
     */
    private sorteo;
    /**
     * Inicializa la aplicación, el sorteo y configura la UI
     */
    constructor();
    /**
     * Configura los oyentes de eventos para todos los elementos interactivos de la UI
     * @private
     */
    private configurarEventListeners;
    /**
     * Configura el estado inicial de la interfaz de usuario
     * @private
     */
    private inicializarUI;
    /**
     * Crea dinámicamente los 100 divs que representan los números del tablero
     * @private
     */
    private crearTableroNumeros;
    /**
     * Muestra un mensaje emergente con la información de un número al hacer clic
     *
     * @param {NumeroID} numeroId - El ID del número (0 a 99)
     * @private
     * @example
     * app.mostrarInfoNumero(25);
     */
    private mostrarInfoNumero;
    /**
     * Maneja el envío del formulario de registro para un nuevo participante
     *
     * @param {Event} e - El evento de formulario
     * @private
     * @example
     */
    private registrarParticipante;
    /**
     * Rellena los elementos `select` de la UI con la lista actualizada de participantes
     * @private
     * @example
     */
    private actualizarSelectsParticipantes;
    /**
     * Maneja la reserva de un número del tablero para un participante seleccionado
     * @private
     * @example
     */
    private reservarNumero;
    /**
     * Maneja la liberación de un número del tablero
     * @private
     * @example
     */
    private liberarNumero;
    /**
     * Actualiza las clases CSS de los divs del tablero para reflejar el estado actual
     * de los números (libre u ocupado)
     * @private
     * @example
     */
    private actualizarTableroVisual;
    /**
     * Ejecuta el sorteo utilizando un número introducido manualmente por el usuario
     * @private
     * @example
     */
    private realizarSorteoManual;
    /**
     * Ejecuta el sorteo generando un número ganador aleatorio
     * @private
     * @example
     */
    private realizarSorteoAleatorio;
    /**
     * Muestra el resultado del sorteo (ganador o desierto) en la interfaz
     *
     * @param {*} resultado - El resultado del sorteo, conteniendo el ganador (si lo hay) y el número
     * @param {NumeroID} numeroPremiado - El ID del número ganador
     * @param {NumeroID[]} [numerosGenerados] - Array de números generados durante un sorteo aleatorio (opcional)
     * @private
     * @example
     * app.mostrarResultadoSorteo({ ganador: p1, numero: num10 }, 10);
     */
    private mostrarResultadoSorteo;
    /**
     * Marca visualmente el número ganador en el tablero de la UI
     *
     * @param {NumeroID} numeroId - El ID del número ganador
     * @private
     * @example
     * app.marcarNumeroGanador(10);
     */
    private marcarNumeroGanador;
    /**
     * Consulta y muestra la lista de números reservados por un participante específico
     * @private
     * @example
     */
    private consultarParticipante;
    /**
     * Calcula y actualiza las estadísticas (participantes, números ocupados/libres) en la UI
     * @private
     * @example
     */
    private actualizarEstadisticas;
    /**
     * Muestra un mensaje de notificación en la interfaz de usuario
     *
     * @param {string} texto - El contenido del mensaje
     * @param {'exito' | 'error' | 'warning' | 'info'} [tipo='info'] - El tipo de mensaje para aplicar estilos
     * @private
     * @example
     * app.mostrarMensaje('Reserva exitosa', 'exito');
     * app.mostrarMensaje('Error al cargar datos', 'error');
     */
    private mostrarMensaje;
    /**
     * Oculta el mensaje de notificación
     * @private
     */
    private ocultarMensaje;
}
export { AppSorteoNavidad };
//# sourceMappingURL=app.d.ts.map