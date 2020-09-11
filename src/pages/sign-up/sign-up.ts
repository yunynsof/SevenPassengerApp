import { Component } from '@angular/core';
import { NavController, NavParams ,LoadingController} from 'ionic-angular';
import { VerifymobilePage} from "../verifymobile/verifymobile";

import { LogInPage} from "../log-in/log-in";

import { mapservice } from "../../providers/map.service"
import { CityCabPage } from '../city-cab/city-cab';

import { AuthService } from '../../providers/auth-service/auth-service';

import { PassengerModel } from '../../models/passenger.model';



@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html'
})
export class SignUpPage {
  imageCode=[];
  invalidUserName=false;
  invalidEmail=false;
  invalidPassword=false;
  invalidPasswordConfirm=false;
  InvalidMobile=false;
  InvalidId=false;
  invalidPasswordLength=false;
  
  country=[{
    "name": "Honduras",
    "dial_code": "+504",
    "code": "HN"
  }];
  //Newuser={firstname:"",lastname:"",username:"",password:"",email:"",code:+91};
  Newuser = { phone:"", identifier:"", email:"", first_name: "", last_name: "", password: "", passwordConfirm:""}
  imagebase="../assets/image/svg-country-flags/png250px/";

  public passenger: PassengerModel;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public _mapsService: mapservice,
    public authService: AuthService) 
    {
      for(var i=0;i<this.country.length;i++){
        this.imageCode[i]=this.country[i].code.toLowerCase();
    }
    //this.country = _mapsService.country;
    // console.log(this.imageCode);
  }
  // Ionic native Sign up function
  signUp(){

    this.invalidUserName=false;
    if(this.Newuser.first_name==""||this.Newuser.last_name==""){
      this.invalidUserName=true;
      console.log("user name error");
    
    }

    this.invalidEmail=false;
    if(this.Newuser.email==""){
      this.invalidEmail=true;
      console.log("user email error");
     
    }
    
    this.invalidPassword=false;
    if(this.Newuser.password==""){
      this.invalidPassword=true;
      console.log("user password error");
     
    }

    this.invalidPasswordLength=false;
    if(this.Newuser.password.length <6){
      this.invalidPasswordLength=true;
      console.log("user password length error");
     
    }
    
    this.invalidPasswordConfirm=false;
    if(this.Newuser.passwordConfirm!=this.Newuser.password){
      this.invalidPasswordConfirm=true;
      console.log("user confirm password error");
     return;
    }

    this.InvalidMobile=false;
    if(this.Newuser.phone==""){
      this.InvalidMobile=true;
      console.log("user phone error");
      
    }

    this.InvalidId=false;
    if(this.Newuser.identifier==""){
      this.InvalidId=true;
      console.log("user id error");
      return;
    }

    let loader = this.loadingCtrl.create({
      content: "Por Favor Espere...",
      // duration: 3000
    });
    
    loader.present();
    
    this.passenger = new PassengerModel(this.Newuser.phone, this.Newuser.identifier ,this.Newuser.email, this.Newuser.first_name, this.Newuser.last_name, this.Newuser.password);
    this.authService.register(this.passenger).then(
      (response) => {
        //console.log(response);
        loader.dismiss();
        if (response.status == 201){
          alert("Usuario Registrado. Por Favor Verifique su Correo y Valide su cuenta para poder ingresar.");
          this.navCtrl.push(LogInPage,{});
        } else {
          let body = JSON.parse(response._body);
          console.log(body.identifier[0]);
          if(body.identifier[0]){
            alert(body.identifier[0]);
          }else if(body){
            alert(body);
          }else{
            alert("No se ha podido registrar el usuario, por favor intentelo mas tarde.")
          }          
        }          
      },
      (err) => {
        //console.log(err);
        //console.log(err.json()._body);
        //console.log(err.status);
        loader.dismiss();
        }
      );

    //this.navCtrl.push(VerifymobilePage,{});
    
   
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }
  gotoVerify(){
    this.navCtrl.push(VerifymobilePage,{});
  }

  goBack(){
    console.log("hey");
    this.navCtrl.pop();
  }
  socialLogin(){
    this.navCtrl.push(CityCabPage)
  }

}
