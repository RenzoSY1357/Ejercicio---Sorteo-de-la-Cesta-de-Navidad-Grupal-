import type { Tablero, Numero, Participante, NumeroID } from '../types/Interfaces';

export class TableroClass implements Tablero {

    numeros: Numero[] = [];

    //*CONSTRUCTOR: CREA EL TABLERO
    /*
        En el constructor, se le añade un parametro numero, que cojera los numeros del tablero
        del 1...100 (Array length: 100),  cada elemento es un objeto, con su respectivo id y 
        su disponibilidad, para generar el array, se pasara la funcion (_,i), del cual no se utilizara
        el primer argumento (seran los participantes), con el segundo argumento, el array llamara al callback 100 veces,
        de acuerdo al indice del array y se le añadira a cada elemento del array un objeto 100(i) veces
    */
    constructor() {
        this.numeros = Array.from({ length: 100 }, (_, i) => ({
            id: i, //cada vez que se itera con el indice del array, el indice se retorna como un elemento del array
            // en este caso como un el id, dentro del objeto
            disponible: true,
        }));
    }

    MostrarEstadoNumero(id: NumeroID): boolean{

        const numero = this.numeros[id];

        // El numero esta disponible?
        if(numero!.disponible){
            numero!.disponible = false;
            return false;
        }

        return true;
    }

    reservarNumero(id: NumeroID, participante: Participante): boolean {
        
        // el const numero, se ingresa al parametro "_" de los paramatros (_,i)
        // del cual, numero se volvera el objeto cuyo numeroID se ingreso
        const numero = this.numeros[id];

        //El numero ESTA, disponible?
        // Verifica que del objeto, su disponibilidad sea verdadera
        // para luego asignarle el participante (basicamente reserva el objeto)
        if (numero!.disponible){
            numero!.disponible = false;
            numero!.participante = participante;
            return true; // si lo reserva, retorna true,
        }

        // Si no, retorna...
        return false;
    }

    liberarNumero(id: NumeroID): boolean {

        const numero = this.numeros[id];

        // Quiero saber si el numero ingresado NO esta disponible (Esta ocupado?)
        if(!numero!.disponible){

            // Si el numero esta ocupado (NO esta disponible), lo libera
            numero!.disponible = true;
            numero!.participante = undefined;

            // Y retorna true, ya que, NO estaba disponible...
            return true;
        }

        // Si esta disponible...
        return false;
    }
    
    ConsultarNumero(id: NumeroID): Numero | undefined {

        const numero = this.numeros[id];
        return numero;
    }

}


