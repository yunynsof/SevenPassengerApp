import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AppPaymentPage} from "../app-payment/app-payment"

/*
  Generated class for the Promocode page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-promocode',
  templateUrl: 'promocode.html'
})
export class PromocodePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromocodePage');
  }
  goBack(){
    this.navCtrl.pop();
  }
  gotoPayment(){
    this.navCtrl.push(AppPaymentPage)
  }

}
