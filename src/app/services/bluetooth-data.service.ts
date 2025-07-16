import { Injectable, NgZone } from '@angular/core';
import { LectorDispositivo } from '../Interface/lector-dispositivo.model';
import { BehaviorSubject /*, Observable*/ } from 'rxjs';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';


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
  private datosSubject = new BehaviorSubject<LectorDispositivo>({
    ritmoCardiaco: '0',
    temperatura: '0',
    satOxi: '0'
  });

  datos$ = this.datosSubject.asObservable();

  constructor(private bluetoothSerial: BluetoothSerial,
    private zone: NgZone
  ) {}

  iniciarLecturaBluetooth() {
    this.bluetoothSerial.subscribeRawData().subscribe(() => {
      this.bluetoothSerial.readUntil('\n').then(received => {
        try {
          const json = JSON.parse(received.trim());
          const data: LectorDispositivo = {
            ritmoCardiaco: json.ritmoCardiaco.toString(),
            temperatura: json.temperatura.toString(),
            satOxi: json.satOxi.toString()
          };
          console.log('Datos recibidos:', data);

          // Esto fuerza a Angular a refrescar la vista
          this.zone.run(() => {
            this.datosSubject.next(data);
          });
        } catch (error) {
          console.error('Error al parsear datos Bluetooth:', received);
        }
      });
    });
  }
}