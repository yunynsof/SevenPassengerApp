import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {GoogleMaps} from "@ionic-native/google-maps"
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LogInPage} from '../pages/log-in/log-in'
import {SignUpPage} from "../pages/sign-up/sign-up"
import {ForgotPage} from "../pages/forgot/forgot";
import { VerifymobilePage} from "../pages/verifymobile/verifymobile"
import {HomePage} from "../pages/home/home"
import {PaymentPage} from "../pages/payment/payment"
import {LandingPage} from "../pages/landing/landing"
import {EditProfilePage} from "../pages/edit-profile/edit-profile.ts";
import {EditLocationPage} from "../pages/edit-location/edit-location"
import {CityCabPage} from "../pages/city-cab/city-cab"
import {PickUpArrivingPage} from "../pages/pick-up-arriving/pick-up-arriving"
import {RequestRidePage} from "../pages/request-ride/request-ride"
import {PromocodePage} from "../pages/promocode/promocode"
import {FareEstimatePage} from "../pages/fare-estimate/fare-estimate";
import {ChangePage} from "../pages/change/change";
import {AppPaymentPage} from "../pages/app-payment/app-payment"
import {TripReviewPage} from "../pages/trip-review/trip-review"
import {BookingConfitmationPage} from "../pages/booking-confitmation/booking-confitmation"
import { AgmCoreModule } from 'angular2-google-maps/core';
import { Geolocation } from '@ionic-native/geolocation';
import {mapservice} from "../providers/map.service";
import { ProgressBarComponent } from '../component/progress-bar/progress-bar';
import { Network } from '@ionic-native/network';
import {SetLocationpage} from "../pages/set-location-modal/set-location"
import {HstoryPagePage} from '../pages/hstory/hstory';
import { BrowserModule } from '@angular/platform-browser';
import { help} from '../pages/help/help'
import { FeeServiceProvider } from '../providers/fee-service/fee-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RideServiceProvider } from '../providers/ride-service/ride-service';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../providers/auth-service/auth-service';

import {AuthHttp, AuthConfig,JwtHelper} from 'angular2-jwt';

import {IonicStorageModule} from '@ionic/storage';
import {Storage} from '@ionic/storage';

import { AlertService } from '../providers/util/alert.service';
import { FcmProvider } from '../providers/fcm/fcm';

import { Firebase } from '@ionic-native/firebase';

import { Device } from '@ionic-native/device';

import { CallNumber } from '@ionic-native/call-number';

let storage = new Storage({});

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('id_token')),
  }), http);
}

const firebase = {
  apiKey: "AIzaSyAI755venVr58C5F1wExAlItIbyYFv98TQ",
  authDomain: "taxiexpress-ceb3f.firebaseapp.com",
  databaseURL: "https://taxiexpress-ceb3f.firebaseio.com",
  projectId: "taxiexpress-ceb3f",
  storageBucket: "taxiexpress-ceb3f.appspot.com",
  messagingSenderId: "583631002658"
}

@NgModule({
  declarations: [
    MyApp,
    HstoryPagePage,
    LogInPage,
    help,
    SignUpPage,
    ForgotPage,
    VerifymobilePage,
    HomePage,
    LandingPage,
    EditProfilePage,
    EditLocationPage,
    CityCabPage,
    PickUpArrivingPage,
    RequestRidePage,
    PromocodePage,
    FareEstimatePage,
    ChangePage,
    AppPaymentPage,
    TripReviewPage,
    BookingConfitmationPage,
    PaymentPage,
    ProgressBarComponent,
    SetLocationpage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDvl13CWLTKXMFlEqjY0X1kWvaEeLpN12E'
    }),
    HttpClientModule,
    HttpModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebase), 
    AngularFirestoreModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LogInPage,
    SignUpPage,
    ForgotPage,
    HstoryPagePage,
    VerifymobilePage,
    help,
    HomePage,
    PaymentPage,
    LandingPage,
    EditProfilePage,
    EditLocationPage,
    CityCabPage,
    HstoryPagePage,
    PickUpArrivingPage,
    RequestRidePage,
    PromocodePage,
    ChangePage,
    FareEstimatePage,
    AppPaymentPage,
    TripReviewPage,
    BookingConfitmationPage,
    SetLocationpage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Geolocation,
    Firebase,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    mapservice,
    FeeServiceProvider,
    HttpClient,
    RideServiceProvider,
    AuthService,
    JwtHelper,
    AlertService,
    FcmProvider,
    Device,
    CallNumber
  ]
})
export class AppModule {}
