import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PickUpArrivingPage } from '../pick-up-arriving/pick-up-arriving'
import { mapservice } from "../../providers/map.service"
/*
  Generated class for the HstoryPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-hstory',
  templateUrl: 'hstory.html'
})
export class HstoryPagePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public _mapsService: mapservice) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HstoryPagePage');
  }
  next() { 
    this._mapsService.showbutton = false;
    this.navCtrl.push(PickUpArrivingPage);
  }
  goBack() {
    this.navCtrl.pop();
  }
}
