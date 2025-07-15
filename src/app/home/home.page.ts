import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { Platform, ToastController, LoadingController } from '@ionic/angular';

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
    private loadingController: LoadingController
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
      this.unpairedDevices = await this.bluetoothSerial.discoverUnpaired();

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

  readData() {
    this.bluetoothSerial.subscribe('\n').subscribe(data => {
      const trimmed = data.trim();
      this.receivedMessages.push(trimmed);
      console.log('Dato recibido:', trimmed);
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
}