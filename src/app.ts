/**
 * APLICACION PRINCIPAL - SORTEO CESTA DE NAVIDAD
 *
 */

import { SorteoNavidad } from './modules/sorteo.js';
import { TableroClass } from './modules/tablero.js';
import { ParticipanteError } from './modules/participantes.js';
import { getEstadisticas, listarNumerosPorParticipante } from './modules/informe.js';
import type { NumeroID, Participante as IParticipante } from './types/Interfaces.js';

/**
 * Clase principal de la aplicación que gestiona la lógica de la interfaz de usuario (UI)
 * y la interacción con la lógica del sorteo de Navidad
 */
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
    private inicializarUI(): void {
        this.crearTableroNumeros();
        this.actualizarEstadisticas();
    }

    /**
     * Crea dinámicamente los 100 divs que representan los números del tablero
     * @private
     */
    private crearTableroNumeros(): void {
        const tableroContainer = document.getElementById('tablero-numeros');
        if (!tableroContainer) return;

        tableroContainer.innerHTML = '';

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
     * // Muestra el estado del número 25 en la UI
     * app.mostrarInfoNumero(25);
     */
    private mostrarInfoNumero(numeroId: NumeroID): void {
        const numero = this.sorteo.tablero.numeros[numeroId];
        
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
     * // Esta función se ejecuta internamente al enviar el formulario con ID 'form-registro'.
     * // Intenta llamar a sorteo.registrarParticipante(...) y actualiza la UI.
     */
    private registrarParticipante(e: Event): void {
        e.preventDefault();
        
        const nombre = (document.getElementById('nombre') as HTMLInputElement).value.trim();
        const email = (document.getElementById('email') as HTMLInputElement).value.trim();
        const telefono = (document.getElementById('telefono') as HTMLInputElement).value.trim();

        try {
            const participante = this.sorteo.registrarParticipante(nombre, email, telefono);
            
            (e.target as HTMLFormElement).reset();
            this.actualizarSelectsParticipantes();
            this.actualizarEstadisticas();
            
            this.mostrarMensaje('Participante ' + participante.nombre + ' registrado correctamente', 'exito');
            
        } catch (error) {
            if (error instanceof ParticipanteError) {
                this.mostrarMensaje('Error: ' + error.message, 'error');
            } else {
                this.mostrarMensaje('Error al registrar participante', 'error');
            }
        }
    }

    /**
     * Rellena los elementos `select` de la UI con la lista actualizada de participantes
     * @private
     * @example
     * // Se llama internamente después de registrar un nuevo participante.
     * // Rellena los dropdowns de reserva y consulta con los emails disponibles.
     */
    private actualizarSelectsParticipantes(): void {
        const selectReserva = document.getElementById('email-reserva') as HTMLSelectElement;
        const selectConsulta = document.getElementById('consulta-email') as HTMLSelectElement;
        
        if (!selectReserva || !selectConsulta) return;

        selectReserva.innerHTML = '<option value="">Selecciona un participante...</option>';
        selectConsulta.innerHTML = '<option value="">Selecciona un participante...</option>';

        const participantes = this.sorteo.gestorParticipantes.getTodos();
        
        participantes.forEach((participante: IParticipante) => {
            const optionReserva = document.createElement('option');
            optionReserva.value = participante.email;
            optionReserva.textContent = participante.nombre + ' (' + participante.email + ')';
            selectReserva.appendChild(optionReserva);
            
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
     * // Se ejecuta al hacer clic en 'btn-reservar'.
     * // Llama a sorteo.reservarNumero(numeroId, email).
     */
    private reservarNumero(): void {
        const emailSelect = document.getElementById('email-reserva') as HTMLSelectElement;
        const numeroInput = document.getElementById('numero-reserva') as HTMLInputElement;
        
        const email = emailSelect.value;
        const numeroStr = numeroInput.value;
        
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

        try {
            this.sorteo.reservarNumero(numeroId, email);
            numeroInput.value = '';
            this.actualizarTableroVisual();
            this.actualizarEstadisticas();
            this.mostrarMensaje('Numero ' + numeroId.toString().padStart(2, '0') + ' reservado', 'exito');
            
        } catch (error) {
            this.mostrarMensaje('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
        }
    }

    /**
     * Maneja la liberación de un número del tablero
     * @private
     * @example
     * // Se ejecuta al hacer clic en 'btn-liberar'.
     * // Llama a sorteo.liberarNumero(numeroId).
     */
    private liberarNumero(): void {
        const numeroInput = document.getElementById('numero-reserva') as HTMLInputElement;
        const numeroStr = numeroInput.value;
        
        if (!numeroStr) {
            this.mostrarMensaje('Ingresa un numero para liberar', 'error');
            return;
        }
        
        const numeroId = parseInt(numeroStr);
        
        if (numeroId < 0 || numeroId > 99) {
            this.mostrarMensaje('El numero debe estar entre 0 y 99', 'error');
            return;
        }

        try {
            this.sorteo.liberarNumero(numeroId);
            numeroInput.value = '';
            this.actualizarTableroVisual();
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
     * // Recorre los 100 números y actualiza su clase a 'libre' o 'ocupado'.
     */
    private actualizarTableroVisual(): void {
        for (let i = 0; i < 100; i++) {
            const numeroDiv = document.querySelector('[data-numero="' + i + '"]') as HTMLElement;
            if (!numeroDiv) continue;

            const numero = this.sorteo.tablero.numeros[i];
            
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
     * // Se ejecuta al hacer clic en 'btn-sorteo-manual'
     * // Llama a sorteo.realizarSorteo(numeroPremiado) con el valor del input
     */
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

        try {
            const resultado = this.sorteo.realizarSorteo(numeroPremiado);
            this.mostrarResultadoSorteo(resultado, numeroPremiado);
            this.marcarNumeroGanador(numeroPremiado);
            
        } catch (error) {
            this.mostrarMensaje('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
        }
    }

    /**
     * Ejecuta el sorteo generando un número ganador aleatorio
     * @private
     * @example
     * // Se ejecuta al hacer clic en 'btn-sorteo-aleatorio'
     * // Llama a sorteo.realizarSorteoAleatorio()
     */
    private realizarSorteoAleatorio(): void {
        try {
            const resultado = this.sorteo.realizarSorteoAleatorio();
            this.mostrarResultadoSorteo(resultado.resultadoSorteo, resultado.resultadoSorteo.numero.id, resultado.numerosGenerados);
            this.marcarNumeroGanador(resultado.resultadoSorteo.numero.id);
            
        } catch (error) {
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
     * // Muestra un modal con los datos del ganador o el mensaje de desierto
     * app.mostrarResultadoSorteo({ ganador: p1, numero: num10 }, 10);
     */
    private mostrarResultadoSorteo(resultado: any, numeroPremiado: NumeroID, numerosGenerados?: NumeroID[]): void {
        const resultadoDiv = document.getElementById('resultado-sorteo');
        const tituloDiv = document.getElementById('resultado-titulo');
        const contentDiv = document.getElementById('resultado-content');
        
        if (!resultadoDiv || !tituloDiv || !contentDiv) return;

        let html = '';

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
     * // Añade la clase 'ganador' al div del número 10
     * app.marcarNumeroGanador(10);
     */
    private marcarNumeroGanador(numeroId: NumeroID): void {
        const anteriorGanador = document.querySelector('.numero.ganador');
        if (anteriorGanador) {
            anteriorGanador.classList.remove('ganador');
        }

        const numeroDiv = document.querySelector('[data-numero="' + numeroId + '"]') as HTMLElement;
        if (numeroDiv) {
            numeroDiv.classList.add('ganador');
        }
    }

    /**
     * Consulta y muestra la lista de números reservados por un participante específico
     * @private
     * @example
     * // Se ejecuta al hacer clic en 'btn-consultar'
     * // Muestra la lista de números reservados por el email seleccionado
     */
    private consultarParticipante(): void {
        const selectConsulta = document.getElementById('consulta-email') as HTMLSelectElement;
        const email = selectConsulta.value;
        
        if (!email) {
            this.mostrarMensaje('Selecciona un participante', 'error');
            return;
        }

        try {
            const numeros = listarNumerosPorParticipante(this.sorteo, email);
            const resultadoDiv = document.getElementById('resultado-consulta');
            if (!resultadoDiv) return;

            let html = '';
            
            if (numeros.length === 0) {
                html = '<p>Este participante no tiene numeros reservados</p>';
            } else {
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
            resultadoDiv.style.display = 'block';
            
        } catch (error) {
            this.mostrarMensaje('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
        }
    }

    /**
     * Calcula y actualiza las estadísticas (participantes, números ocupados/libres) en la UI
     * @private
     * @example
     * // Actualiza los spans de estadísticas con datos de getEstadisticas(this.sorteo).
     */
    private actualizarEstadisticas(): void {
        const stats = getEstadisticas(this.sorteo);
        
        const participantesSpan = document.getElementById('stat-participantes');
        const ocupadosSpan = document.getElementById('stat-ocupados');
        const libresSpan = document.getElementById('stat-libres');
        const porcentajeSpan = document.getElementById('stat-porcentaje');
        
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
    private mostrarMensaje(texto: string, tipo: 'exito' | 'error' | 'warning' | 'info' = 'info'): void {
        const mensajeDiv = document.getElementById('mensaje');
        const mensajeTexto = document.getElementById('mensaje-texto');
        
        if (!mensajeDiv || !mensajeTexto) return;

        mensajeTexto.textContent = texto;
        
        mensajeDiv.classList.remove('exito', 'error', 'warning');
        
        if (tipo !== 'info') {
            mensajeDiv.classList.add(tipo);
        }
        
        mensajeDiv.style.display = 'flex';
        
        setTimeout(() => {
            this.ocultarMensaje();
        }, 4000);
    }

    /**
     * Oculta el mensaje de notificación
     * @private
     */
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