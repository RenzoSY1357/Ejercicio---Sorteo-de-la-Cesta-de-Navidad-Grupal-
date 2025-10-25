/**
 * APLICACION PRINCIPAL - SORTEO CESTA DE NAVIDAD
 *
 */
import { SorteoNavidad } from './modules/sorteo.js';
import { TableroClass } from './modules/tablero.js';
import { ParticipanteError } from './modules/participantes.js';
import { getEstadisticas, listarNumerosPorParticipante } from './modules/informe.js';
class AppSorteoNavidad {
    sorteo;
    constructor() {
        console.log('Iniciando aplicacion...');
        const tablero = new TableroClass();
        this.sorteo = new SorteoNavidad(tablero);
        this.configurarEventListeners();
        this.inicializarUI();
        console.log('Aplicacion iniciada');
    }
    configurarEventListeners() {
        // Formulario de registro
        const formRegistro = document.getElementById('form-registro');
        formRegistro?.addEventListener('submit', (e) => this.registrarParticipante(e));
        // Botones
        document.getElementById('btn-reservar')?.addEventListener('click', () => this.reservarNumero());
        document.getElementById('btn-liberar')?.addEventListener('click', () => this.liberarNumero());
        document.getElementById('btn-sorteo-manual')?.addEventListener('click', () => this.realizarSorteoManual());
        document.getElementById('btn-sorteo-aleatorio')?.addEventListener('click', () => this.realizarSorteoAleatorio());
        document.getElementById('btn-consultar')?.addEventListener('click', () => this.consultarParticipante());
        document.getElementById('mensaje-cerrar')?.addEventListener('click', () => this.ocultarMensaje());
    }
    inicializarUI() {
        this.crearTableroNumeros();
        this.actualizarEstadisticas();
    }
    crearTableroNumeros() {
        const tableroContainer = document.getElementById('tablero-numeros');
        if (!tableroContainer)
            return;
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
    mostrarInfoNumero(numeroId) {
        const numero = this.sorteo.tablero.numeros[numeroId];
        if (numero?.disponible) {
            this.mostrarMensaje('Numero ' + numeroId.toString().padStart(2, '0') + ': LIBRE');
        }
        else if (numero?.participante) {
            this.mostrarMensaje('Numero ' + numeroId.toString().padStart(2, '0') + ': Ocupado por ' + numero.participante.nombre);
        }
    }
    registrarParticipante(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        try {
            const participante = this.sorteo.registrarParticipante(nombre, email, telefono);
            e.target.reset();
            this.actualizarSelectsParticipantes();
            this.actualizarEstadisticas();
            this.mostrarMensaje('Participante ' + participante.nombre + ' registrado correctamente', 'exito');
        }
        catch (error) {
            if (error instanceof ParticipanteError) {
                this.mostrarMensaje('Error: ' + error.message, 'error');
            }
            else {
                this.mostrarMensaje('Error al registrar participante', 'error');
            }
        }
    }
    actualizarSelectsParticipantes() {
        const selectReserva = document.getElementById('email-reserva');
        const selectConsulta = document.getElementById('consulta-email');
        if (!selectReserva || !selectConsulta)
            return;
        selectReserva.innerHTML = '<option value="">Selecciona un participante...</option>';
        selectConsulta.innerHTML = '<option value="">Selecciona un participante...</option>';
        const participantes = this.sorteo.gestorParticipantes.getTodos();
        participantes.forEach((participante) => {
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
    reservarNumero() {
        const emailSelect = document.getElementById('email-reserva');
        const numeroInput = document.getElementById('numero-reserva');
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
        }
        catch (error) {
            this.mostrarMensaje('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
        }
    }
    liberarNumero() {
        const numeroInput = document.getElementById('numero-reserva');
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
        }
        catch (error) {
            this.mostrarMensaje('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
        }
    }
    actualizarTableroVisual() {
        for (let i = 0; i < 100; i++) {
            const numeroDiv = document.querySelector('[data-numero="' + i + '"]');
            if (!numeroDiv)
                continue;
            const numero = this.sorteo.tablero.numeros[i];
            numeroDiv.classList.remove('libre', 'ocupado', 'ganador');
            if (numero?.disponible) {
                numeroDiv.classList.add('libre');
            }
            else {
                numeroDiv.classList.add('ocupado');
            }
        }
    }
    realizarSorteoManual() {
        const numeroInput = document.getElementById('numero-manual');
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
        }
        catch (error) {
            this.mostrarMensaje('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
        }
    }
    realizarSorteoAleatorio() {
        try {
            const resultado = this.sorteo.realizarSorteoAleatorio();
            this.mostrarResultadoSorteo(resultado.resultadoSorteo, resultado.resultadoSorteo.numero.id, resultado.numerosGenerados);
            this.marcarNumeroGanador(resultado.resultadoSorteo.numero.id);
        }
        catch (error) {
            this.mostrarMensaje('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
        }
    }
    mostrarResultadoSorteo(resultado, numeroPremiado, numerosGenerados) {
        const resultadoDiv = document.getElementById('resultado-sorteo');
        const tituloDiv = document.getElementById('resultado-titulo');
        const contentDiv = document.getElementById('resultado-content');
        if (!resultadoDiv || !tituloDiv || !contentDiv)
            return;
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
        }
        else {
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
    marcarNumeroGanador(numeroId) {
        const anteriorGanador = document.querySelector('.numero.ganador');
        if (anteriorGanador) {
            anteriorGanador.classList.remove('ganador');
        }
        const numeroDiv = document.querySelector('[data-numero="' + numeroId + '"]');
        if (numeroDiv) {
            numeroDiv.classList.add('ganador');
        }
    }
    consultarParticipante() {
        const selectConsulta = document.getElementById('consulta-email');
        const email = selectConsulta.value;
        if (!email) {
            this.mostrarMensaje('Selecciona un participante', 'error');
            return;
        }
        try {
            const numeros = listarNumerosPorParticipante(this.sorteo, email);
            const resultadoDiv = document.getElementById('resultado-consulta');
            if (!resultadoDiv)
                return;
            let html = '';
            if (numeros.length === 0) {
                html = '<p>Este participante no tiene numeros reservados</p>';
            }
            else {
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
        }
        catch (error) {
            this.mostrarMensaje('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
        }
    }
    actualizarEstadisticas() {
        const stats = getEstadisticas(this.sorteo);
        const participantesSpan = document.getElementById('stat-participantes');
        const ocupadosSpan = document.getElementById('stat-ocupados');
        const libresSpan = document.getElementById('stat-libres');
        const porcentajeSpan = document.getElementById('stat-porcentaje');
        if (participantesSpan)
            participantesSpan.textContent = stats.totalParticipantes.toString();
        if (ocupadosSpan)
            ocupadosSpan.textContent = stats.numerosOcupados.toString();
        if (libresSpan)
            libresSpan.textContent = stats.numerosLibres.toString();
        if (porcentajeSpan) {
            const porcentaje = ((stats.numerosOcupados / stats.totalNumeros) * 100).toFixed(1);
            porcentajeSpan.textContent = porcentaje + '%';
        }
    }
    mostrarMensaje(texto, tipo = 'info') {
        const mensajeDiv = document.getElementById('mensaje');
        const mensajeTexto = document.getElementById('mensaje-texto');
        if (!mensajeDiv || !mensajeTexto)
            return;
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
    ocultarMensaje() {
        const mensajeDiv = document.getElementById('mensaje');
        if (mensajeDiv) {
            mensajeDiv.style.display = 'none';
        }
    }
}
function inicializarApp() {
    console.log('Iniciando aplicacion...');
    try {
        new AppSorteoNavidad();
        console.log('Aplicacion lista!');
    }
    catch (error) {
        console.error('Error al inicializar:', error);
        alert('Error al inicializar la aplicacion.');
    }
}
document.addEventListener('DOMContentLoaded', inicializarApp);
export { AppSorteoNavidad };
//# sourceMappingURL=app.js.map