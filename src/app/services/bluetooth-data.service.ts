import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnalisisSuenio } from '../Interface/analisis-suenio.model';

@Injectable({
  providedIn: 'root',
})
export class BluetoothDataService {
  private datosSubject = new BehaviorSubject<AnalisisSuenio | null>(null);
  public datos$ = this.datosSubject.asObservable();

  constructor() {}

  setDatos(datos: AnalisisSuenio) {
    this.datosSubject.next({ ...datos });
  }

  getDatos(): AnalisisSuenio | null {
    return this.datosSubject.value;
  }
}
