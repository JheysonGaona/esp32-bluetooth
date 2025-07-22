import { Injectable } from '@angular/core';
import { AnalisisSuenio } from '../Interface/analisis-suenio.model';
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
  public lectura = new BehaviorSubject<AnalisisSuenio | null> (null);

  constructor() { }

  setLectura(data: AnalisisSuenio){
    this.lectura.next(data);
  }

  getLectura(): Observable<AnalisisSuenio | null>{
    return this.lectura;
  }
}