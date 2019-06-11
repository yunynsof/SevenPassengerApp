import { Component } from '@angular/core';

import { NavController, NavParams, LoadingController, ToastController, MenuController, Events } from 'ionic-angular';
import { ForgotPage } from "../forgot/forgot"
import { CityCabPage } from "../city-cab/city-cab";
import { mapservice } from "../../providers/map.service"
import { isSuccess } from "@angular/http/src/http_utils";

import { AuthService } from '../../providers/auth-service/auth-service';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';



declare var facebookConnectPlugin;

@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html'
})
export class LogInPage {

  Newuser = { email: "", password: "" };

  private loginData: FormGroup;

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public mapservice: mapservice,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public menuCtrl: MenuController,
    public events: Events ) {

    this.loginData = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });


  }

  loader = this.loadingCtrl.create({
    content: "Por Favor Espere...",
    // duration: 3000
  });

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogInPage');
  }

  // Go To Forgot Password page
  gotoForgot() {
    console.log("forgot")
    this.navCtrl.push(ForgotPage);
    console.log("gya");
  }

  goBack() {
    console.log("Go back");
    this.navCtrl.pop();
  }

  //  Used For Google login
  googleLogIn() {
    this.mapservice.logIn = true;
    this.navCtrl.push(CityCabPage);

  }
  // LOgout function
  LogOut() {
    this.mapservice.logIn = false;

  }
  // Used for facebook login
  fbLogin() {
    this.mapservice.logIn = true;
    this.navCtrl.push(CityCabPage);

  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'You Must select pick-up Location First',
      duration: 3000
    });
    toast.present();
  }
  // Login with Ionic Native Auth
  LogIn() {

    this.mapservice.logIn = true;
    this.navCtrl.push(CityCabPage);

  }


  login() {
    //use this.loginData.value to authenticate the user
    this.authService.login(this.loginData.value)
      .then(() => {
        this.events.publish('user:created');
        this.redirectToHome();
      })
      .catch((error: any) => {
        alert("No se ha podido iniciar sesión, por favor verifique su usuario y contraseña.");
        if (error.status === 500) {
          console.log("Error 500");;
        }
        else if (error.status === 400) {
          console.log("Error 400");
        }
        else if (error.status === 409) {
          console.log("Error 409");
        }
        else if (error.status === 406) {
          console.log("Error 406");
        }
      });
  }

  redirectToHome() {
    this.mapservice.logIn = true;
    this.navCtrl.setRoot(CityCabPage);
    this.menuCtrl.enable(true);
  }

}
