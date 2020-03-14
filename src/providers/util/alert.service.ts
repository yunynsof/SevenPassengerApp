import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertService {
  constructor(public alertCtrl: AlertController) { }

  presentAlert(title: string, message: string) {
    const alert = this.alertCtrl.create(
      {
        title,
        subTitle: message,
        buttons: [
          {
            text: 'Aceptar'
          }
        ]
      });

    return alert.present();
  }

  presentErrorAlert(message: string) {
    return this.presentAlert('Ha ocurrido un error.', message);
  }

  presentAlertWithCallback(title: string, message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const confirm = this.alertCtrl.create({
        title,
        message,
        buttons: [{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            confirm.dismiss().then(() => resolve(false));
            return false;
          }
        }, {
          text: 'Si',
          handler: () => {
            confirm.dismiss().then(() => resolve(true));
            return false;
          }
        }]
      });

      return confirm.present();
    });
  }

  presentAlertCallback(title: string, message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const confirm = this.alertCtrl.create({
        title,
        message,
        buttons: [{
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            confirm.dismiss().then(() => resolve(false));
            return false;
          }
        }]
      });

      return confirm.present();
    });
  }

  presentAddressReferencePrompt() {
    return new Promise((resolve, reject) => {
      const addressReferencePrompt = this.alertCtrl.create({
        title: 'Bríndanos más detalles de tu dirección.',
        inputs: [
          {
            name: 'reference',
            placeholder: 'Ej: Bloque, Calle, Avenida, Color y Número de Casa'
          }
        ],
        buttons: [{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            addressReferencePrompt.dismiss().then(() => resolve(false));
            return false;
          }
        }, {
          text: 'Siguiente',
          handler: data => {
            addressReferencePrompt.dismiss().then(() => resolve(data));
            return false;
          }
        }]
      });
      return addressReferencePrompt.present();
    });
  }
}
