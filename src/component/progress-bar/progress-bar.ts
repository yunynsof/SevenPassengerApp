
/**
 * Created by Bunny on 19-04-2017.
 */

import { Component, Input } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { PickUpArrivingPage } from "../../pages/pick-up-arriving/pick-up-arriving"
@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'

})
export class ProgressBarComponent {

  @Input('progress') progress = 20;


  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {
    let loader = this.loadingCtrl.create({
      content: "Por Favor Espere...",
    });
    this.progress = 0;
    loader.present();
    setTimeout(() => {
      console.log("timeout");
      this.progress = 0;
    }, 1);
    setTimeout(() => {
      console.log("timeout");
      this.progress = 10;
    }, 1000);
    setTimeout(() => {
      console.log("timeout");
      this.progress = 20;
    }, 2000);
    setTimeout(() => {
      console.log("timeout");
      this.progress = 30;
    }, 3000);
    setTimeout(() => {
      console.log("timeout");
      this.progress = 40;
    }, 4000);
    setTimeout(() => {
      console.log("timeout");
      this.progress = 50;
    }, 5000);
    setTimeout(() => {
      console.log("timeout");
      this.progress = 60;
    }, 6000);
    setTimeout(() => {
      console.log("timeout");
      this.progress = 100;
      loader.dismiss();
      this.navCtrl.push(PickUpArrivingPage);
    }, 10000);


  }

}
