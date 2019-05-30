import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {mapservice} from "../../providers/map.service"
/*
  Generated class for the FareEstimate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-fare-estimate',
  templateUrl: 'fare-estimate.html'
})
export class FareEstimatePage {

  constructor(public _mapService:mapservice,public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FareEstimatePage');
  }
  goBack(){
    this.navCtrl.pop();
  }

}
