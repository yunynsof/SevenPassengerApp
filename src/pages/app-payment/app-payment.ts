import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
/*
  Generated class for the AppPayment page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-app-payment',
  templateUrl: 'app-payment.html'
})
export class AppPaymentPage {
  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppPaymentPage');
  }
  goBack() {
    this.navCtrl.pop();
  }
  //this function user for change slide
  next() {
    if (this.slides.isEnd()) {
      //if slide is last do nothing
    }
    else {
      //else change slide
      this.slides.slideNext();
    }
  }
}
