import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CityCabPage } from '../city-cab/city-cab';

/*
  Generated class for the Verifymobile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-verifymobile',
  templateUrl: 'verifymobile.html'
})
export class VerifymobilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifymobilePage');
  }

  goBack() {
    console.log("pop");
    this.navCtrl.pop();
  }

  submit() {
    this.navCtrl.push(CityCabPage);

  }
}
