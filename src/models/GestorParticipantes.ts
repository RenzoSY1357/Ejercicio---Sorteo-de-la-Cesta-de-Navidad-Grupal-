import { Participante } from './Participante';

export class GestorParticipantes {
  private participantes: Map<string, Participante>;

  constructor() {
    this.participantes = new Map();
  }

  registrarParticipante(participante: Participante): void {
    const emailNormalizado = participante.email.toLowerCase();
    
    if (this.participantes.has(emailNormalizado)) {
      throw new Error('Ya existe un participante con ese email');
    }

    this.participantes.set(emailNormalizado, participante);
  }

  obtenerParticipantes(): Participante[] {
    return Array.from(this.participantes.values());
  }

  obtenerParticipantePorEmail(email: string): Participante | undefined {
    return this.participantes.get(email.toLowerCase());
  }

  existeParticipante(email: string): boolean {
    return this.participantes.has(email.toLowerCase());
  }

  cantidadParticipantes(): number {
    return this.participantes.size;
  }
}
