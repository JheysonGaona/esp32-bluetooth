import { Injectable } from '@angular/core';
import { LectorDispositivo } from '../Interface/lector-dispositivo.model';
import { BehaviorSubject, Observable } from 'rxjs';


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
  public lectura = new BehaviorSubject<LectorDispositivo | null> (null);

  constructor() { }

  setLectura(data: LectorDispositivo){
    this.lectura.next(data);
  }

  getLectura(): Observable<LectorDispositivo | null>{
    return this.lectura;
  }
}