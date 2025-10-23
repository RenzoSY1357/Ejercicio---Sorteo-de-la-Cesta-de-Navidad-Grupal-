// Script para el Sorteo de la Cesta de Navidad

// Variables globales
let participants = [];

// Elementos del DOM
const participantNameInput = document.getElementById('participantName');
const addParticipantBtn = document.getElementById('addParticipant');
const participantsList = document.getElementById('participantsList');
const drawWinnerBtn = document.getElementById('drawWinner');
const winnerDisplay = document.getElementById('winner');

// Event Listeners
addParticipantBtn.addEventListener('click', addParticipant);
participantNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addParticipant();
    }
});
drawWinnerBtn.addEventListener('click', drawWinner);

// Funciones
function addParticipant() {
    const name = participantNameInput.value.trim();
    
    if (name === '') {
        alert('Por favor, ingresa un nombre válido.');
        return;
    }
    
    if (participants.includes(name)) {
        alert('Este participante ya ha sido agregado.');
        return;
    }
    
    participants.push(name);
    participantNameInput.value = '';
    participantNameInput.focus();
    renderParticipants();
}

function removeParticipant(name) {
    participants = participants.filter(p => p !== name);
    renderParticipants();
    
    // Limpiar ganador si se elimina
    if (winnerDisplay.textContent.includes(name)) {
        winnerDisplay.textContent = '';
    }
}

function renderParticipants() {
    participantsList.innerHTML = '';
    
    if (participants.length === 0) {
        participantsList.innerHTML = '<li style="border: none; justify-content: center; color: #999;">No hay participantes aún. ¡Agrega algunos!</li>';
        return;
    }
    
    participants.forEach(name => {
        const li = document.createElement('li');
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'participant-name';
        nameSpan.textContent = name;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-danger';
        removeBtn.textContent = 'Eliminar';
        removeBtn.onclick = () => removeParticipant(name);
        
        li.appendChild(nameSpan);
        li.appendChild(removeBtn);
        participantsList.appendChild(li);
    });
}

function drawWinner() {
    if (participants.length === 0) {
        alert('No hay participantes para sortear. ¡Agrega algunos primero!');
        return;
    }
    
    // Efecto de sorteo con animación
    winnerDisplay.textContent = 'Sorteando...';
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * participants.length);
        const winner = participants[randomIndex];
        winnerDisplay.textContent = `🎉 ¡Felicidades ${winner}! 🎉\nHas ganado la Cesta de Navidad`;
    }, 1000);
}

// Inicializar
renderParticipants();
