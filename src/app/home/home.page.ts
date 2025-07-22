import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { Platform, ToastController, LoadingController } from '@ionic/angular';

// Nuevo contenido para transferir datos del BL
import { BluetoothDataService } from '../services/bluetooth-data.service';
import { Router } from '@angular/router';
import { AnalisisSuenio } from '../Interface/analisis-suenio.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  devices: any[] = [];
  pairedDevices: any[] = [];
  unpairedDevices: any[] = [];
  receivedMessages: string[] = [];
  dataReceived: string = '';

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private platform: Platform,
    private toastController: ToastController,
    private loadingController: LoadingController,
    // Se agrego esta nueva seccion
    private bluetoothDataService: BluetoothDataService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    try {
      await this.bluetoothSerial.enable();
      this.showToast('Bluetooth activado correctamente', 'success');
      this.listDevices();
    } catch (err) {
      this.showToast('Activa Bluetooth para continuar', 'danger');
    }
  }

  async scanAllDevices() {
    const loading = await this.loadingController.create({
      message: 'Buscando dispositivos...',
      spinner: 'circles',
    });
    await loading.present();

    try {
      this.pairedDevices = await this.bluetoothSerial.list();

      // Se modifico
      const rawUnpaired = await this.bluetoothSerial.discoverUnpaired();
      this.unpairedDevices = this.removeDuplicates(rawUnpaired);

      console.log('Emparejados:', this.pairedDevices);
      console.log('No emparejados:', this.unpairedDevices);

      this.showToast(`Encontrados ${this.pairedDevices.length} emparejados y ${this.unpairedDevices.length} nuevos`, 'primary');
    } catch (error) {
      console.error('Error al escanear dispositivos:', error);
      this.showToast('Error al buscar dispositivos', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async listDevices() {
    try {
      this.devices = await this.bluetoothSerial.list();
      console.log('Dispositivos emparejados:', this.devices);
    } catch (error) {
      this.showToast('Error al listar dispositivos emparejados', 'danger');
    }
  }

  async connect(address: string) {
    const loading = await this.loadingController.create({
      message: `Conectando a ${address}...`,
      spinner: 'lines',
    });
    await loading.present();

    this.bluetoothSerial.connect(address).subscribe(
      () => {
        loading.dismiss();
        this.showToast('Conectado con éxito', 'success');
        this.readData();
      },
      error => {
        loading.dismiss();
        console.error('Error al conectar:', error);
        this.showToast('Error al conectar al dispositivo', 'danger');
      }
    );
  }

  // Modo numero 1 para leer datos
  /*
  readData() {
    this.bluetoothSerial.subscribe('\n').subscribe(data => {
      const trimmed = data.trim();
      this.receivedMessages.push(trimmed);
      console.log('Dato recibido:', trimmed);
    });
  }
  */

  // Modo numero 2 para leer datos
  readData() {
    this.bluetoothSerial.subscribe('\n').subscribe(data => {
      try{
        const parsed: AnalisisSuenio = JSON.parse(data.trim());
        console.log('Dato recibido:', parsed);
        this.bluetoothDataService.setLectura(parsed);
      }catch (error){
        console.error('Los datos recibidos no son en formato JSON:', data);
        this.showToast('Formato de dato inválido');
      }
    });
  }

  async showToast(message: string, color: 'success' | 'danger' | 'primary' | 'warning' = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
      color
    });
    toast.present();
  }

  removeDuplicates(devices: any[]): any[] {
    const seen = new Set();
    return devices.filter(device => {
      if (seen.has(device.address)) {
        return false;
      }
      seen.add(device.address);
      return true;
    });
  }

  // Se agrego este nuevo metodo
  goToLector() {
    // Modo numero 1 para lector de datos, tiens que activarlo
    // this.bluetoothDataService.setMessages(this.receivedMessages);
    this.router.navigate(['/lector']);
  }
}