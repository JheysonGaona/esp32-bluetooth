import { Component, OnInit } from '@angular/core';
import { Platform, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BluetoothDataService } from '../services/bluetooth-data.service';
import { AnalisisSuenio } from '../Interface/analisis-suenio.model';
import { BleClient, ScanResult } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  devices: ScanResult[] = [];
  receivedMessages: string[] = [];
  connectedDeviceId: string | null = null;
  private bleBuffer: string = ''; // acumulador para manejar fragmentación

private serviceUuid: string = '';
private characteristicUuid: string = '';


  constructor(
    private platform: Platform,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private bluetoothDataService: BluetoothDataService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    await this.initBLE();
  }

  async initBLE() {
    try {
      await BleClient.initialize();
      this.showToast('Bluetooth BLE inicializado', 'success');
    } catch (err) {
      console.error('BLE init error:', err);
      this.showToast('Error al iniciar BLE', 'danger');
    }
  }

  async scanAllDevices() {
    this.devices = [];

    try {
      await BleClient.requestLEScan({}, (result: ScanResult) => {
        if (
          result.device &&
          result.device.name &&
          !this.devices.find(d => d.device.deviceId === result.device.deviceId)
        ) {
          this.devices.push(result);
        }
      });

      this.showToast('Escaneando dispositivos BLE...', 'primary');

      setTimeout(async () => {
        await BleClient.stopLEScan();
        this.showToast(`Encontrados ${this.devices.length} dispositivos`, 'success');
      }, 5000);
    } catch (error) {
      console.error('Error al escanear:', error);
      this.showToast('Error al buscar dispositivos BLE', 'danger');
    }
  }

  
async connect(deviceId: string) {
  const loading = await this.loadingController.create({
    message: `Conectando a ${deviceId}...`,
    spinner: 'lines',
  });
  await loading.present();

  try {
    await BleClient.connect(deviceId, async (disconnectedDeviceId) => {
      console.log(`Dispositivo desconectado: ${disconnectedDeviceId}`);
      this.connectedDeviceId = null;
    });

    this.connectedDeviceId = deviceId;
    this.showToast('Conectado con éxito', 'success');

    // ✅ Descubre servicios y características
    const services = await BleClient.getServices(deviceId); // services: BleService[]

    const primaryService = services.find(s => s.characteristics?.some(c => c.properties?.notify));
    console.log('Servicios descubiertos:', services);

    if (!primaryService) {
      this.showToast('No se encontró un servicio con características notificables', 'danger');
      loading.dismiss();
      return;
    }

    const characteristic = primaryService.characteristics.find(c => c.properties?.notify);
    if (!characteristic) {
      this.showToast('No se encontró una característica notificable', 'danger');
      loading.dismiss();
      return;
    }

    // ✅ Asigna dinámicamente los UUIDs
    this.serviceUuid = primaryService.uuid;
    this.characteristicUuid = characteristic.uuid;

    console.log('UUIDs usados:', this.serviceUuid, this.characteristicUuid);

    loading.dismiss();

    // ✅ Inicia la suscripción
    await this.subscribeToNotifications(deviceId, this.serviceUuid, this.characteristicUuid);

  } catch (error) {
    console.error('Error al conectar:', error);
    this.showToast('Error al conectar o descubrir servicios', 'danger');
    loading.dismiss();
  }
}



  async subscribeToNotifications(deviceId: string, serviceUuid: string, characteristicUuid: string) {
  try {
    await BleClient.startNotifications(deviceId, serviceUuid, characteristicUuid, (result) => {
      const value = new TextDecoder().decode(result);
      console.log('Notificación recibida:', value);

      try {
        const datosAnalizados: AnalisisSuenio = JSON.parse(value);
        this.bluetoothDataService.setDatos(datosAnalizados);

        // Navegar solo si aún no hemos navegado
        if (!this.connectedDeviceId) {
          this.connectedDeviceId = deviceId;
          this.router.navigate(['/lector']);
        }
      } catch (error) {
        console.error('Error al analizar datos BLE:', error);
      }
    });

    this.showToast('Suscrito a notificaciones BLE', 'primary');
  } catch (error) {
    console.error('Error al suscribirse:', error);
    this.showToast('Error al recibir datos', 'danger');
  }
}


  processJsonBuffer(text: string) {
    try {
      const parsed: AnalisisSuenio = JSON.parse(text);
      console.log('JSON válido recibido:', parsed);
      this.bluetoothDataService.setDatos(parsed);
    } catch (error) {
      console.warn('No se pudo parsear JSON:', text);
      this.showToast('Datos recibidos en formato incorrecto', 'warning');
    }
  }

  goToLector() {
    this.router.navigate(['/lector']);
  }

  async showToast(
    message: string,
    color: 'success' | 'danger' | 'primary' | 'warning' = 'primary'
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
      color,
    });
    toast.present();
  }
}
