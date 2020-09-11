import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from "../pages/home/home";
import { CityCabPage } from "../pages/city-cab/city-cab";
import { LandingPage } from "../pages/landing/landing"
import { EditProfilePage } from "../pages/edit-profile/edit-profile"
import { AppPaymentPage } from "../pages/app-payment/app-payment"
import { TripReviewPage } from "../pages/trip-review/trip-review"
import { BookingConfitmationPage } from "../pages/booking-confitmation/booking-confitmation"
import { PickUpArrivingPage } from "../pages/pick-up-arriving/pick-up-arriving"
import { mapservice } from "../providers/map.service"
import { HstoryPagePage } from '../pages/hstory/hstory';
import { help } from '../pages/help/help';

import { Storage } from '@ionic/storage';

import { Events } from 'ionic-angular';

import { AlertService } from '../providers/util/alert.service';

import { AuthService } from '../providers/auth-service/auth-service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LandingPage;

  pages: Array<{ title: string, component: any, icon: any }>;

  idToken: string;
  user = {
    user_id: '',
    name: '',
    email: '',
    imageUrl: '../assets/img/avatar/user.png'
  };

  constructor(
    public mapservice: mapservice,
    public _mapsService: mapservice,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    public events: Events,
    public alertService: AlertService,
    public authService: AuthService,
    public app: App) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Carrera Activa', component: PickUpArrivingPage, icon: '<ion-icon ios="ios-car" md="md-car"></ion-icon>' },
      { title: 'Solicitar Carrera', component: CityCabPage, icon: '<ion-icon ios="ios-car" md="md-car"></ion-icon>' },
      { title: 'Agregar Tarjeta', component: AppPaymentPage, icon: '<ion-icon ios="ios-home" md="md-home"></ion-icon>' },
      { title: 'Historial', component: HstoryPagePage, icon: '<ion-icon ios="ios-home" md="md-home"></ion-icon>' },
      { title: 'Notificaciones', component: '', icon: '<ion-icon ios="ios-home" md="md-home"></ion-icon>' },
      { title: '', component: '', icon: '' },
      { title: 'Ayuda', component: help, icon: '<ion-icon ios="ios-home" md="md-home"></ion-icon>' },
      { title: 'Cerrar Sesión', component: HomePage, icon: '<ion-icon ios="ios-home" md="md-home"></ion-icon>' },

    ];

  }
  gotoEdit() {

    //this.nav.push(EditProfilePage);
  }


  initializeApp() {
    this.platform.ready().then(() => {
      console.log("initializeApp");
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.storage.get("user_id").then((val) => {
        if (val != null) {
          console.log("User Exists");
          this.getUserInfo();
          this._mapsService.pickup = "";
          this.mapservice.logIn = true;
  
          this.events.subscribe('user:created', () => {
            // user and time are the same arguments passed in `events.publish(user, time)`
            //console.log('Welcome', user, 'at', time);
            console.log('Getting event on subscription');
            this.getUserInfo();          
            this.nav.push(CityCabPage);
          });
  
          
         this.nav.push(CityCabPage);
          
        } else {
          console.log("User Doesn't Exists");
          this.app.getActiveNav().setRoot(HomePage);
        }
      });
      


    });
  }

  openPage(page) {
    console.log('Page', page.component.name)
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component != '') {
      if (page.component.name == 'HomePage') {
        console.log('home Page')
        console.log('Map Services', this._mapsService);
        this._mapsService.pickup = "";
        this.nav.push(page.component);
        this.mapservice.logIn = true;

      } else if (page.component.name == 'CityCabPage') {
        console.log('City Cab Page')
        console.log('Map Services', this._mapsService);
        this._mapsService.pickup = "";
        this.nav.push(page.component);
        this.mapservice.logIn = true;

      }
      else {
        this.nav.push(page.component);
      }

    }
  }

  getUserInfo() {
    console.log("Getting User Information");
    
    Promise.all([
      this.storage.get("user_id"), 
      this.storage.get("firstName"), 
      this.storage.get("lastName"), 
      this.storage.get("email"), 
      this.storage.get("id_token")
    ]).then(values => {
      console.log("User ID", values[0]);
      console.log("First Name", values[1]);
      this.user.user_id = values[0];
      this.user.name = values[1] + ' ' + values[2];
      this.user.email = values[3];
      this.idToken = values[4];
      
      //this.getDriverInfo();       
    });
    
  }

  logOut() {

    this.alertService.presentAlertWithCallback('Cerrar Sesión',
      'Esta Seguro que desea cerrar su sesión?').then((yes) => {
        if (yes) {
          //this.toastCtrl.create('Logged out of the application');

          this.authService.logout();
          this.app.getActiveNav().setRoot(HomePage);
        }
      });
  }
}
