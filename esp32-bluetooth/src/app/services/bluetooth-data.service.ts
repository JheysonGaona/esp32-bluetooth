import { Injectable } from '@angular/core';
import { LectorDispositivo } from '../Interface/lector-dispositivo.model';

@Injectable({
  providedIn: 'root'
})
export class BluetoothDataService {

  // Modo numero 1 para leer datos
  /*
  public messages: string[] = [];

  constructor() { }

  setMessages(data: string[]){
    this.messages = data;
  }

  getMessages(){
    return this.messages;
  }
  */

  // Modo numero 2 para leer datos
  public lectura: LectorDispositivo | null = null;

  constructor() { }

  setLectura(data: LectorDispositivo){
    this.lectura = data;
  }

  getLectura(){
    return this.lectura;
  }
}
