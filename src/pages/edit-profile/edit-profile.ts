import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {EditLocationPage} from "../edit-location/edit-location"
import { mapservice } from "../../providers/map.service"
/*
  Generated class for the EditProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
 

  country = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,public _mapsService: mapservice) {
    this.country = _mapsService.country;
  }

  ionViewDidLoad() {
    console.log(this.country);
    console.log('ionViewDidLoad EditProfilePage');
  }
  goBack(){
    this.navCtrl.pop();
  }
  // Go to edit Location Page
  gotoEdit(){
    console.log("Ediyt call");
    this.navCtrl.push(EditLocationPage);
  }

}
