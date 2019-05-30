import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
// import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { mapservice } from "../../providers/map.service"
import { timeout } from 'rxjs/operator/timeout';
/*
  Generated class for the BookingConfitmation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-booking-confitmation',
  templateUrl: 'booking-confitmation.html'
})
export class BookingConfitmationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public _mapService: mapservice,public loadingCtrl:LoadingController) {
    let loader = this.loadingCtrl.create({
      content: "Por favor espere...",
    });
    _mapService.showbutton = true;
    loader.present();
    setTimeout(() => {
      console.log("timeout");
      loader.dismiss()
    }, 9000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingConfitmationPage');
  }
  //go to previous page
  goBack() {
    this.navCtrl.pop();
  }

}
