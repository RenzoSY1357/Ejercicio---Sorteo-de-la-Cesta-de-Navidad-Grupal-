
// Importaciones de los módulos y tipos necesarios para la aplicación.
import type { NumeroID, Participante as IParticipante } from './types/Interfaces.js';
import { SorteoNavidad } from './modules/sorteo.js';
import { TableroClass } from './modules/tablero.js';
import { ParticipanteError } from './modules/participantes.js';
import { getEstadisticas, listarNumerosPorParticipante } from './modules/informe.js';

/**
 * Clase principal de la aplicación que gestiona la lógica de la interfaz de usuario (UI)
 * y la interacción con la lógica del sorteo de Navidad
 */
// Clase principal que orquesta toda la aplicación del sorteo.
class AppSorteoNavidad {
    /**
     * Instancia central de la lógica del sorteo
     * @type {SorteoNavidad}
     * @private
     */
    private sorteo: SorteoNavidad;
    
    /**
     * Inicializa la aplicación, el sorteo y configura la UI
     */
    //* CONSTRUCTOR: Se encarga de inicializar la aplicación.
    /*
        Cuando se crea una instancia de AppSorteoNavidad, esto es lo primero que se ejecuta.
        1. Crea un nuevo tablero.
        2. Crea una nueva instancia del sorteo, pasándole el tablero.
        3. Llama a configurarEventListeners() para que los botones y formularios hagan cosas.
        4. Llama a inicializarUI() para dejar la página lista y bonita.
    */
    constructor() {
        console.log('Iniciando aplicacion...');
        
        const tablero = new TableroClass();
        this.sorteo = new SorteoNavidad(tablero);
        
        this.configurarEventListeners();
        this.inicializarUI();
        
        console.log('Aplicacion iniciada');
    }

    /**
     * Configura los oyentes de eventos para todos los elementos interactivos de la UI
     * @private
     */
    //* configurarEventListeners: Asigna los manejadores de eventos a los elementos de la UI.
    /*
        Aquí es donde le decimos a cada botón qué función debe ejecutar cuando se le hace click.
        Es como conectar los cables de un aparato a los botones correctos.
        Asociamos las acciones del usuario (clicks, envíos de formulario) con los métodos de esta clase.
    */
    private configurarEventListeners(): void {
        // Formulario de registro
        const formRegistro = document.getElementById('form-registro') as HTMLFormElement;
        formRegistro?.addEventListener('submit', (e) => this.registrarParticipante(e));

        // Botones
        document.getElementById('btn-reservar')?.addEventListener('click', () => this.reservarNumero());
        document.getElementById('btn-liberar')?.addEventListener('click', () => this.liberarNumero());
        document.getElementById('btn-sorteo-manual')?.addEventListener('click', () => this.realizarSorteoManual());
        document.getElementById('btn-sorteo-aleatorio')?.addEventListener('click', () => this.realizarSorteoAleatorio());
        document.getElementById('btn-consultar')?.addEventListener('click', () => this.consultarParticipante());
        document.getElementById('mensaje-cerrar')?.addEventListener('click', () => this.ocultarMensaje());
    }

    /**
     * Configura el estado inicial de la interfaz de usuario
     * @private
     */
    //* inicializarUI: Prepara la interfaz de usuario al cargar la aplicación.
    // Esto se ejecuta al principio para que el usuario vea todo en orden.
    private inicializarUI(): void {
        this.crearTableroNumeros(); // Dibuja el tablero de números.
        this.actualizarEstadisticas();  // Muestra las estadísticas iniciales (todo a cero).
    }

    /**
     * Crea dinámicamente los 100 divs que representan los números del tablero
     * @private
     */
    //* crearTableroNumeros: Genera dinámicamente el tablero de 100 números.
    /*
        Básicamente, crea 100 divs, uno para cada número del 0 al 99.
        Cada div es un cuadradito en el tablero.
        - Le pone la clase 'numero' y 'libre'.
        - Le pone el número de dos cifras (ej: 01, 02, ...).
        - Le añade un data-attribute para saber qué número es.
        - Le añade un listener para que al hacer click, muestre la info de ese número.
    */
    private crearTableroNumeros(): void {
        const tableroContainer = document.getElementById('tablero-numeros');
        if (!tableroContainer) return; // Si no encuentra el contenedor, no hace nada.

        tableroContainer.innerHTML = ''; // Limpiamos por si había algo antes.

        for (let i = 0; i < 100; i++) {
            const numeroDiv = document.createElement('div');
            numeroDiv.className = 'numero libre';
            numeroDiv.textContent = i.toString().padStart(2, '0');
            numeroDiv.dataset.numero = i.toString();
            numeroDiv.addEventListener('click', () => this.mostrarInfoNumero(i));
            tableroContainer.appendChild(numeroDiv);
        }
    }

    /**
     * Muestra un mensaje emergente con la información de un número al hacer clic
     *
     * @param {NumeroID} numeroId - El ID del número (0 a 99)
     * @private
     * @example
     * app.mostrarInfoNumero(25);
     */
    //* mostrarInfoNumero: Muestra el estado de un número (libre u ocupado).
    // Cuando haces click en un número del tablero, esta función se activa.
    private mostrarInfoNumero(numeroId: NumeroID): void {
        const numero = this.sorteo.tablero.numeros[numeroId];
        // Comprueba si el número está disponible o si tiene un participante asignado.
        if (numero?.disponible) {
            this.mostrarMensaje('Numero ' + numeroId.toString().padStart(2, '0') + ': LIBRE');
        } else if (numero?.participante) {
            this.mostrarMensaje('Numero ' + numeroId.toString().padStart(2, '0') + ': Ocupado por ' + numero.participante.nombre);
        }
    }

    /**
     * Maneja el envío del formulario de registro para un nuevo participante
     *
     * @param {Event} e - El evento de formulario
     * @private
     * @example
     */
    //* registrarParticipante: Procesa el formulario de registro de un nuevo participante.
    private registrarParticipante(e: Event): void {
        e.preventDefault();  // Evita que la página se recargue al enviar el formulario.
        // Recogemos los datos del formulario y quitamos espacios en blanco.
        const nombre = (document.getElementById('nombre') as HTMLInputElement).value.trim();
        const email = (document.getElementById('email') as HTMLInputElement).value.trim();
        const telefono = (document.getElementById('telefono') as HTMLInputElement).value.trim();
        // Usamos un try-catch por si algo falla al registrar (ej: email duplicado).
        try {
            const participante = this.sorteo.registrarParticipante(nombre, email, telefono);
            
            (e.target as HTMLFormElement).reset();  // Limpiamos el formulario.
            this.actualizarSelectsParticipantes(); // Actualizamos los desplegables con el nuevo.
            this.actualizarEstadisticas(); // Refrescamos las estadísticas.
            
            this.mostrarMensaje('Participante ' + participante.nombre + ' registrado correctamente', 'exito');
            
        } catch (error) {
            // Si el error es uno de los que hemos definido (ParticipanteError), mostramos un mensaje específico.
            if (error instanceof ParticipanteError) {
                this.mostrarMensaje('Error: ' + error.message, 'error');
            } else {
                // Si es otro tipo de error, mostramos un mensaje genérico.
                this.mostrarMensaje('Error al registrar participante', 'error');
            }
        }
    }

    /**
     * Rellena los elementos `select` de la UI con la lista actualizada de participantes
     * @private
     * @example
     */
    //* actualizarSelectsParticipantes: Rellena los menús desplegables con los participantes registrados.
    // Cada vez que se añade un participante, hay que actualizar los <select> para que aparezca.
    private actualizarSelectsParticipantes(): void {
        const selectReserva = document.getElementById('email-reserva') as HTMLSelectElement;
        const selectConsulta = document.getElementById('consulta-email') as HTMLSelectElement;
        
        if (!selectReserva || !selectConsulta) return;
        // Limpiamos los selects y les ponemos la opción por defecto.
        selectReserva.innerHTML = '<option value="">Selecciona un participante...</option>';
        selectConsulta.innerHTML = '<option value="">Selecciona un participante...</option>';
        // Obtenemos la lista de todos los participantes.
        const participantes = this.sorteo.gestorParticipantes.getTodos();
        // Recorremos la lista y creamos un <option> para cada uno.
        participantes.forEach((participante: IParticipante) => {
            const optionReserva = document.createElement('option');
            optionReserva.value = participante.email;
            optionReserva.textContent = participante.nombre + ' (' + participante.email + ')';
            selectReserva.appendChild(optionReserva);
            // Hacemos lo mismo para el otro select.
            const optionConsulta = document.createElement('option');
            optionConsulta.value = participante.email;
            optionConsulta.textContent = participante.nombre + ' (' + participante.email + ')';
            selectConsulta.appendChild(optionConsulta);
        });
    }

    /**
     * Maneja la reserva de un número del tablero para un participante seleccionado
     * @private
     * @example
     */
    //* reservarNumero: Asigna un número a un participante seleccionado.
    private reservarNumero(): void {
        const emailSelect = document.getElementById('email-reserva') as HTMLSelectElement;
        const numeroInput = document.getElementById('numero-reserva') as HTMLInputElement;
        
        const email = emailSelect.value;
        const numeroStr = numeroInput.value;
        // Validaciones básicas antes de hacer nada.
        if (!email) {
            this.mostrarMensaje('Selecciona un participante', 'error');
            return;
        }
        
        if (!numeroStr) {
            this.mostrarMensaje('Ingresa un numero', 'error');
            return;
        }
        
        const numeroId = parseInt(numeroStr);
        
        if (numeroId < 0 || numeroId > 99) {
            this.mostrarMensaje('El numero debe estar entre 0 y 99', 'error');
            return;
        }
        // Intentamos reservar el número. Puede fallar si ya está ocupado.
        try {
            this.sorteo.reservarNumero(numeroId, email);
            numeroInput.value = ''; // Limpiamos el input del número.
            this.actualizarTableroVisual();  // Cambiamos el color del número en el tablero.
            this.actualizarEstadisticas(); // Refrescamos los contadores.
            this.mostrarMensaje('Numero ' + numeroId.toString().padStart(2, '0') + ' reservado', 'exito');
            
        } catch (error) {
            // Mostramos el mensaje de error que nos devuelva la lógica del sorteo.
            this.mostrarMensaje('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
        }
    }

    /**
     * Maneja la liberación de un número del tablero
     * @private
     * @example
     */
    //* liberarNumero: Pone un número como disponible.
    private liberarNumero(): void {
        const numeroInput = document.getElementById('numero-reserva') as HTMLInputElement;
        const numeroStr = numeroInput.value;
        // Validaciones
        if (!numeroStr) {
            this.mostrarMensaje('Ingresa un numero para liberar', 'error');
            return;
        }
        
        const numeroId = parseInt(numeroStr);
        
        if (numeroId < 0 || numeroId > 99) {
            this.mostrarMensaje('El numero debe estar entre 0 y 99', 'error');
            return;
        }
        // Intentamos liberar. Puede fallar si el número ya estaba libre.
        try {
            this.sorteo.liberarNumero(numeroId);
            numeroInput.value = ''; // Limpiamos el input.
            this.actualizarTableroVisual();  // El número volverá a color 'libre'.
            this.actualizarEstadisticas();
            this.mostrarMensaje('Numero ' + numeroId.toString().padStart(2, '0') + ' liberado', 'exito');
            
        } catch (error) {
            this.mostrarMensaje('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
        }
    }

    /**
     * Actualiza las clases CSS de los divs del tablero para reflejar el estado actual
     * de los números (libre u ocupado)
     * @private
     * @example
     */
    //* actualizarTableroVisual: Refresca la apariencia del tablero (colores de números).
    // Recorre los 100 números y les pone la clase CSS correcta según su estado.
    private actualizarTableroVisual(): void {
        for (let i = 0; i < 100; i++) {
            const numeroDiv = document.querySelector('[data-numero="' + i + '"]') as HTMLElement;
            if (!numeroDiv) continue;

            const numero = this.sorteo.tablero.numeros[i];
            // Quitamos todas las clases de estado y ponemos la que corresponde.
            numeroDiv.classList.remove('libre', 'ocupado', 'ganador');
            
            if (numero?.disponible) {
                numeroDiv.classList.add('libre');
            } else {
                numeroDiv.classList.add('ocupado');
            }
        }
    }

    /**
     * Ejecuta el sorteo utilizando un número introducido manualmente por el usuario
     * @private
     * @example
     */
    //* realizarSorteoManual: Ejecuta el sorteo con un número introducido manualmente.
    private realizarSorteoManual(): void {
        const numeroInput = document.getElementById('numero-manual') as HTMLInputElement;
        const numeroStr = numeroInput.value;
        
        if (!numeroStr) {
            this.mostrarMensaje('Ingresa un numero para el sorteo', 'error');
            return;
        }
        
        const numeroPremiado = parseInt(numeroStr);
        
        if (numeroPremiado < 0 || numeroPremiado > 99) {
            this.mostrarMensaje('El numero debe estar entre 0 y 99', 'error');
            return;
        }
        // Intentamos realizar el sorteo con el número dado.
        try {
            const resultado = this.sorteo.realizarSorteo(numeroPremiado); // Mostramos la tarjeta de ganador/desierto.
            this.mostrarResultadoSorteo(resultado, numeroPremiado); // Pintamos el número de verde en el tablero.
            this.marcarNumeroGanador(numeroPremiado);
            
        } catch (error) {
            this.mostrarMensaje('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
        }
    }

    /**
     * Ejecuta el sorteo generando un número ganador aleatorio
     * @private
     * @example
     */
    //* realizarSorteoAleatorio: Ejecuta el sorteo con un número generado aleatoriamente.
    private realizarSorteoAleatorio(): void {
        try {
            // La lógica del sorteo se encarga de generar el número hasta encontrar un ocupado.
            const resultado = this.sorteo.realizarSorteoAleatorio();
            // El resultado incluye el ganador, el número premiado y la lista de números que se generaron.
            this.mostrarResultadoSorteo(resultado.resultadoSorteo, resultado.resultadoSorteo.numero.id, resultado.numerosGenerados);
            this.marcarNumeroGanador(resultado.resultadoSorteo.numero.id);
            
        } catch (error) {
            // Esto podría pasar si, por ejemplo, no hay números ocupados para sortear.
            this.mostrarMensaje('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
        }
    }

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
    //* mostrarResultadoSorteo: Muestra una tarjeta con el resultado del sorteo (ganador o desierto).
    // Esta función es un poco larga porque construye el HTML de la tarjeta de resultados.
    private mostrarResultadoSorteo(resultado: any, numeroPremiado: NumeroID, numerosGenerados?: NumeroID[]): void {
        const resultadoDiv = document.getElementById('resultado-sorteo');
        const tituloDiv = document.getElementById('resultado-titulo');
        const contentDiv = document.getElementById('resultado-content');
        
        if (!resultadoDiv || !tituloDiv || !contentDiv) return;
        // Si hay un ganador, mostramos sus datos.
        let html = '';
        // Si el sorteo fue aleatorio, mostramos la lista de números que salieron.
        if (resultado.ganador) {
            tituloDiv.textContent = 'TENEMOS GANADOR!';
            
            html += '<div class="ganador-info">';
            html += '<h4>Ganador: ' + resultado.ganador.nombre + '</h4>';
            html += '<p><strong>Email:</strong> ' + resultado.ganador.email + '</p>';
            html += '<p><strong>Telefono:</strong> ' + resultado.ganador.telefono + '</p>';
            html += '</div>';
            html += '<div class="numero-ganador">' + numeroPremiado.toString().padStart(2, '0') + '</div>';
            
            if (numerosGenerados) {
                html += '<div class="numeros-generados">';
                html += '<p><strong>Numeros generados:</strong></p>';
                html += '<div class="lista-numeros">';
                numerosGenerados.forEach((num, index) => {
                    const esUltimo = index === numerosGenerados.length - 1;
                    html += '<span class="numero-generado ' + (esUltimo ? 'ganador' : '') + '">' + num.toString().padStart(2, '0') + '</span>';
                });
                html += '</div>';
                html += '</div>';
            }
            // Si no hay ganador, el sorteo queda desierto.
        } else {
            tituloDiv.textContent = 'SORTEO DESIERTO';
            
            html += '<div class="sorteo-desierto">';
            html += '<p>El numero premiado <strong>' + numeroPremiado.toString().padStart(2, '0') + '</strong> no tenia participante</p>';
            html += '<p>La cesta se acumula para el proximo sorteo</p>';
            html += '</div>';
            
            if (numerosGenerados) {
                html += '<div class="numeros-generados">';
                html += '<p><strong>Numeros generados:</strong></p>';
                html += '<div class="lista-numeros">';
                numerosGenerados.forEach((num, index) => {
                    const esUltimo = index === numerosGenerados.length - 1;
                    html += '<span class="numero-generado ' + (esUltimo ? 'ganador' : '') + '">' + num.toString().padStart(2, '0') + '</span>';
                });
                html += '</div>';
                html += '</div>';
            }
        }

        contentDiv.innerHTML = html;
        resultadoDiv.style.display = 'block';
    }

    /**
     * Marca visualmente el número ganador en el tablero de la UI
     *
     * @param {NumeroID} numeroId - El ID del número ganador
     * @private
     * @example
     * app.marcarNumeroGanador(10);
     */
    //* marcarNumeroGanador: Resalta el número ganador en el tablero.
    private marcarNumeroGanador(numeroId: NumeroID): void {
        // Primero, si ya había un ganador de un sorteo anterior, le quitamos el estilo.
        const anteriorGanador = document.querySelector('.numero.ganador');
        if (anteriorGanador) {
            anteriorGanador.classList.remove('ganador');
        }
        // Luego, buscamos el nuevo número ganador y le ponemos la clase 'ganador'.
        const numeroDiv = document.querySelector('[data-numero="' + numeroId + '"]') as HTMLElement;
        if (numeroDiv) {
            numeroDiv.classList.add('ganador');
        }
    }

    /**
     * Consulta y muestra la lista de números reservados por un participante específico
     * @private
     * @example
     */
    //* consultarParticipante: Muestra los números que ha reservado un participante.
    private consultarParticipante(): void {
        const selectConsulta = document.getElementById('consulta-email') as HTMLSelectElement;
        const email = selectConsulta.value;
        
        if (!email) {
            this.mostrarMensaje('Selecciona un participante', 'error');
            return;
        }
        // Usamos la función del módulo de informes para obtener los números.
        try {
            const numeros = listarNumerosPorParticipante(this.sorteo, email);
            const resultadoDiv = document.getElementById('resultado-consulta');
            if (!resultadoDiv) return;
            // Si el array de números está vacío, lo indicamos.
            let html = '';
            
            if (numeros.length === 0) {
                html = '<p>Este participante no tiene numeros reservados</p>';
            } else {
                // Si tiene números, los mostramos.
                const participante = this.sorteo.gestorParticipantes.buscarPorEmail(email);
                html = '<h4>Numeros de ' + (participante?.nombre || 'Participante') + ':</h4>';
                html += '<div class="numeros-participante">';
                
                numeros.forEach(numero => {
                    html += '<span class="numero-participante">' + numero.id.toString().padStart(2, '0') + '</span>';
                });
                
                html += '</div>';
                html += '<p><strong>Total:</strong> ' + numeros.length + ' numero(s) reservado(s)</p>';
            }
            
            resultadoDiv.innerHTML = html;
            resultadoDiv.style.display = 'block'; // Mostramos la sección de consulta.
            
        } catch (error) {
            this.mostrarMensaje('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
        }
    }

    /**
     * Calcula y actualiza las estadísticas (participantes, números ocupados/libres) en la UI
     * @private
     * @example
     */
    //* actualizarEstadisticas: Recalcula y muestra las estadísticas del sorteo.
    private actualizarEstadisticas(): void {
        // Llama a la función del módulo de informes que hace todos los cálculos.
        const stats = getEstadisticas(this.sorteo);
        const participantesSpan = document.getElementById('stat-participantes');
        const ocupadosSpan = document.getElementById('stat-ocupados');
        const libresSpan = document.getElementById('stat-libres');
        const porcentajeSpan = document.getElementById('stat-porcentaje');
        // Actualizamos cada elemento del DOM con los nuevos valores.
        if (participantesSpan) participantesSpan.textContent = stats.totalParticipantes.toString();
        if (ocupadosSpan) ocupadosSpan.textContent = stats.numerosOcupados.toString();
        if (libresSpan) libresSpan.textContent = stats.numerosLibres.toString();
        
        if (porcentajeSpan) {
            const porcentaje = ((stats.numerosOcupados / stats.totalNumeros) * 100).toFixed(1);
            porcentajeSpan.textContent = porcentaje + '%';
        }
    }

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
    //* mostrarMensaje: Muestra un mensaje temporal en la parte superior de la pantalla.
    // Es una utilidad para dar feedback al usuario.
    private mostrarMensaje(texto: string, tipo: 'exito' | 'error' | 'warning' | 'info' = 'info'): void {
        const mensajeDiv = document.getElementById('mensaje');
        const mensajeTexto = document.getElementById('mensaje-texto');
        
        if (!mensajeDiv || !mensajeTexto) return;

        mensajeTexto.textContent = texto;
        // Cambiamos el color del mensaje según el tipo (éxito, error, etc.).
        mensajeDiv.classList.remove('exito', 'error', 'warning');
        
        // El mensaje se oculta solo después de 4 segundos.

        if (tipo !== 'info') {
            mensajeDiv.classList.add(tipo);
        }
        
        mensajeDiv.style.display = 'flex';
        //* ocultarMensaje: Oculta el cuadro de mensaje.
        setTimeout(() => {
            this.ocultarMensaje();
        }, 4000);
    }

    /**
     * Oculta el mensaje de notificación
     * @private
     */
    //* ocultarMensaje: Oculta el cuadro de mensaje.
    private ocultarMensaje(): void {
        const mensajeDiv = document.getElementById('mensaje');
        if (mensajeDiv) {
            mensajeDiv.style.display = 'none';
        }
    }
}

/**
 * Función que se ejecuta al cargar completamente el DOM para inicializar la aplicación
 */
// Punto de entrada de la aplicación. Se ejecuta cuando el DOM está completamente cargado.
// Esto asegura que todos los elementos HTML existen antes de intentar manipularlos.
function inicializarApp(): void {
    console.log('Iniciando aplicacion...');
    
    try {
        new AppSorteoNavidad();
        console.log('Aplicacion lista!');
    } catch (error) {
        console.error('Error al inicializar:', error);
        alert('Error al inicializar la aplicacion.');
    }
}

document.addEventListener('DOMContentLoaded', inicializarApp);

export { AppSorteoNavidad };