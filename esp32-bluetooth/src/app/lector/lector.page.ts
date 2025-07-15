import { Component, OnInit } from '@angular/core';
import { BluetoothDataService } from '../services/bluetooth-data.service';
import { LectorDispositivo } from '../Interface/lector-dispositivo.model';


@Component({
  selector: 'app-lector',
  templateUrl: './lector.page.html',
  styleUrls: ['./lector.page.scss'],
  standalone: false,
})
export class LectorPage implements OnInit {

  // Modo numero 1 para lector de datos
  /*
  ritmoCardiaco: string = '';
  temperatura: string = '';
  satOxi: string = '';
  messages: string[] = [];
  */

  // Modo numero 2 para lector de datos
  datos: LectorDispositivo | null = null;


  constructor(
    // Se agrego esta nueva seccion
    private bluetoothDataService: BluetoothDataService,
  ) { }

  // Modo numero 1 para lector de datos
  /*
  ngOnInit() {
    this.messages = this.bluetoothDataService.getMessages();
    // Unicamente funciona si desde el otro dispositivo se envian en el orden correcto
    if(this.messages.length >= 3){
      this.ritmoCardiaco = this.messages[this.messages.length - 3];
      this.temperatura = this.messages[this.messages.length - 2];
      this.satOxi = this.messages[this.messages.length - 1];
    }
  }
  */

  // Modo numero 2 para lector de datos
  ngOnInit() {
    this.datos = this.bluetoothDataService.getLectura();
    console.log('Datos del lector: ', this.datos);
  }
}
