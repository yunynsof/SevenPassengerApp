import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VerifymobilePage} from "../verifymobile/verifymobile"

/*
  Generated class for the Forgot page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html'
})
export class ForgotPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log("f c");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPage');
  }
  // go to verify mobile page
  gotoVerify(){
    this.navCtrl.push( VerifymobilePage,{});
  }
  goBack(){
    this.navCtrl.pop();
  }
}
