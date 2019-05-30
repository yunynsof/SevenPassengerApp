import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {LogInPage} from '../log-in/log-in'
import {SignUpPage} from "../sign-up/sign-up"
/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare const facebookConnectPlugin: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  // Go to login Page
  gotoLogin(){
    this.navCtrl.push(LogInPage,{});
  }
  // Go to signUp Page
  gotoSignup(){
    this.navCtrl.push(SignUpPage,{});
  }
  login() {
    var email:any;
    // console.log("fn called");
    // facebookConnectPlugin.login([email],function (response) {
    //   alert('logedin');
    //   alert(JSON.stringify(response.authResponse));


    // },function (error){
    //   alert(error);
    // })
  }
}
