const ChristmasBasketRaffle = require('./raffle');

/**
 * Función principal que demuestra el uso completo del sistema de sorteo.
 * Esta función muestra cómo crear un sorteo, añadir participantes,
 * y realizar el sorteo para seleccionar un ganador.
 * 
 * @function main
 * @returns {void}
 * 
 * @example
 * // Ejecutar el ejemplo desde la línea de comandos
 * node src/index.js
 */
function main() {
  console.log('🎄 Sorteo de la Cesta de Navidad 🎄');
  console.log('=====================================\n');

  // Crear un sorteo con participantes iniciales
  const raffle = new ChristmasBasketRaffle([
    'María García',
    'Juan Pérez',
    'Ana López',
    'Carlos Rodríguez'
  ]);

  console.log(`Participantes iniciales: ${raffle.getParticipantCount()}`);
  console.log('Lista de participantes:');
  raffle.getParticipants().forEach((name, index) => {
    console.log(`  ${index + 1}. ${name}`);
  });

  // Añadir más participantes
  console.log('\n📝 Añadiendo más participantes...');
  raffle.addParticipant('Laura Martínez');
  raffle.addParticipant('Pedro Sánchez');
  
  console.log(`\nTotal de participantes: ${raffle.getParticipantCount()}`);

  // Realizar el sorteo
  console.log('\n🎲 Realizando sorteo...\n');
  const winner = raffle.performRaffle();
  
  console.log('🎉 ¡GANADOR DE LA CESTA DE NAVIDAD! 🎉');
  console.log(`   ⭐ ${winner} ⭐\n`);
  console.log('=====================================');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { main };
