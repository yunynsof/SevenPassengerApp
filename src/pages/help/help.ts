import { Component } from '@angular/core';
import { PolicyPrivacyPage } from '../policy-privacy/policy-privacy';
import {  IonicPage, NavController, NavParams, ModalController, AlertController  } from 'ionic-angular';

@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})
export class help {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;
  items2: any = [];
  test;
  loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.items2 = [
      {
        question: 'Reportar un conductor',
        answers: [
          {
            answer: 'Si tiene problemas con uno de nuestros conductores puedes llamar al +504 2226-7776 o escribirnos al correo soporte@seven.hn',
          }
        ],
        expanded: false
      },
      {
        question: 'Problemas con la carrera',
        answers: [
          {
            answer: 'Si tienes problemas con la carrera, llama al +504 2226-7776 y nosotros lo resolveremos',
          }
        ],
        expanded: false
      },
      {
        question: 'Cuenta y formas de pago',
        answers: [
          {}
        ],
        expanded: false
      },
      {
        question: 'Guida de uso',
        answers: [
          {
            answer: 'Solo tienes que seleccionar el punto donde te diriges y tienes que colocar el detalle donde te encuentras par que el conductor tenga el conocimiento donde encontrarte'
          },
          {
            answer: 'Estar pendiente del telefono por llamada del conductor.'
          },
          {
            answer: 'Disfruta tu viaje'
          }
        ],
        expanded: false
      },
      {
        question: 'Accesibilidad',
        answers: [
          {}
        ],
        expanded: false
      }
    ];
  }

  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.items2.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  addPolicy() {
    let profileModal = this.modalCtrl.create(PolicyPrivacyPage, {});
    profileModal.onDidDismiss(() => {
     
    });
    profileModal.present();
  }

  goBack() {
    this.navCtrl.pop();
  }
}
