const ChristmasBasketRaffle = require('./raffle');

/**
 * Ejemplo de uso del sorteo de la Cesta de Navidad
 * Example usage of the Christmas Basket Raffle
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
