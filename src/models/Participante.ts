export class Participante {
  private _nombre: string;
  private _email: string;

  constructor(nombre: string, email: string) {
    this.validateNombre(nombre);
    this.validateEmail(email);
    this._nombre = nombre;
    this._email = email;
  }

  private validateNombre(nombre: string): void {
    if (!nombre || nombre.trim().length === 0) {
      throw new Error('El nombre no puede estar vacío');
    }
  }

  private validateEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error('El email no puede estar vacío');
    }
    
    // Simple but safe email validation - avoids ReDoS vulnerabilities
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error('El email no tiene un formato válido');
    }
  }

  get nombre(): string {
    return this._nombre;
  }

  get email(): string {
    return this._email;
  }

  equals(otro: Participante): boolean {
    return this._email.toLowerCase() === otro.email.toLowerCase();
  }
}
