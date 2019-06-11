import { Component } from '@angular/core';
import { NavController, NavParams ,ViewController ,ToastController} from 'ionic-angular';
import {mapservice} from "../../providers/map.service"
import {RequestRidePage} from "../request-ride/request-ride"

import moment from 'moment';


/*
  Generated class for the Payment page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})
export class PaymentPage {

  fee = 0.00;
  baggage;
  passengers;
  time;

  constructor(public _mapService:mapservice,public toastCtrl:ToastController,public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
    this.fee = this.navParams.get("fee");
    this.baggage = this.navParams.get("baggage");
    this.passengers = this.navParams.get("passengers");

    var localLocale = moment(new Date());
    moment.locale('es');
    localLocale.locale(false);
    this.time = localLocale.format('LLLL');
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'You Must select Destination Location First For Estimate Fare',
      duration: 3000
    });
    toast.present();
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
  // Go to Request Ride page
  Fare(){
    this.viewCtrl.dismiss(true);
   

  }

}
