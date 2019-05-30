import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import {HomePage} from "../home/home";

import { Network } from '@ionic-native/network';
/*
  Generated class for the Landing page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html'
})
export class LandingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private network: Network) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
    // this.checkWalkThroughFlag();
    // this.checkConnection();
    this.navCtrl.setRoot(HomePage);
  }
  // Check for connection is available or not
  checkConnection() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
    });
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      // setTimeout(() => {
      //   if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
          this.checkWalkThroughFlag();

      //   }
      // }, 3000);
    });
  }
  checkWalkThroughFlag(){
     console.log("Check Walk Through");
    setTimeout(() => {
      this.navCtrl.setRoot(HomePage);
    }, 3000);
  }

}
