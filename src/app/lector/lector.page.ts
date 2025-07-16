import { Component, OnDestroy, OnInit } from '@angular/core';
import { BluetoothDataService } from '../services/bluetooth-data.service';
import { LectorDispositivo } from '../Interface/lector-dispositivo.model';
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-lector',
  templateUrl: './lector.page.html',
  styleUrls: ['./lector.page.scss'],
  standalone: false,
})
export class LectorPage implements OnInit, OnDestroy {



  // Modo numero 1 para lector de datos
  /*
  ritmoCardiaco: string = '';
  temperatura: string = '';
  satOxi: string = '';
  messages: string[] = [];
  */

  // Modo numero 2 para lector de datos
  datos: LectorDispositivo = {
    ritmoCardiaco: '0',
    temperatura: '0',
    satOxi: '0'
  };
  subscription: Subscription | null = null;


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
    this.subscription = this.bluetoothDataService.datos$.subscribe(data => {
      console.log('📡 Datos en lector:', data);
      this.datos = data;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
