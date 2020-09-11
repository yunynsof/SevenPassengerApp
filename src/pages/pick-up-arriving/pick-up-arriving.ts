import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { App, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { mapservice } from "../../providers/map.service"
declare var google;

import { RideServiceProvider } from '../../providers/ride-service/ride-service';

import { Ride } from '../../models/ride.model';

import { Observable } from 'rxjs';

import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import 'rxjs/add/operator/map';

import { CityCabPage } from "../city-cab/city-cab";

import { Storage } from '@ionic/storage';
import { AlertService } from '../../providers/util/alert.service';

import { CallNumber } from '@ionic-native/call-number';

import *  as AppConfig from '../../app/config';

import { Http } from '@angular/http';
import { ModalController } from 'ionic-angular';
import { RatingPage } from '../rating/rating';
import { AuthService } from '../../providers/auth-service/auth-service';

/*
  Generated class for the PickUpArriving page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-pick-up-arriving',
  templateUrl: 'pick-up-arriving.html'
})
export class PickUpArrivingPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  showbutton = false;

  public rideExists: boolean = false;

  public ride: Observable<Ride>;

  public rideId;
  public driverId;
  public driverRating;

  public status;

  public vehicleMarkerAdded: boolean = false;
  public vehicleMarker;

  public vehicleLocationRef;
  public onValueChange;

  private cfg: any;

  idToken: string;
  user = {
    user_id: '',
    name: '',
    email: '',
    imageUrl: '../assets/img/avatar/user.png'
  };


  constructor(
    public appCtrl: App,
    public __zone: NgZone,
    public loadingCtrl: LoadingController,
    public _mapsService: mapservice,
    public navCtrl: NavController,
    public navParams: NavParams,
    public geolocation: Geolocation,
    public rideServiceProvider: RideServiceProvider,
    public firestore: AngularFirestore,
    public angularFireDatabase: AngularFireDatabase,
    public storage: Storage,
    public alertService: AlertService,
    private callNumber: CallNumber,
    private http: Http,
    public modalCtrl: ModalController,
    public authService: AuthService) {
    console.log("cnstrctr");
    // this.loadMap();
    this.cfg = AppConfig.cfg;
    this.showbutton = _mapsService.showbutton;

  }

  subscription;
  ionViewWillEnter() {
    console.log('ionViewDidLoad PickUpArrivingPage');


    this.storage.get('user_id').then((user_id) => {
      console.log(user_id);
      const devicesRef = this.firestore.collection('rides', ref => ref.where('passengerId', '==', user_id).where('status', '>', 0).where('status', '<', 7));
      console.log("Collection ref: " + devicesRef);
      var docId = devicesRef.snapshotChanges().map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Ride;
          const id = a.payload.doc.id;
          console.log("Doc Id: " + id);
          console.log("Status: " + data.status);

          if (data.status == 5) {
            
            console.log("Ride finished: " + id);
            var ride = this.rideServiceProvider.getRide(id);
            ride.update({ status: 6});
            ride.get();
            console.log(data.status)
          }
 
          if(data.status == 6){
            this.presentProfileModal(id, data.driverId, data.driverName);
          }

          this.driverId = data.driverId;
          console.log(this.driverId);
          this.authService.getRating(this.driverId).then(data => {

            this.driverRating =  data.toFixed(2);
            console.log(this.driverRating);
        });
         
          this.translateStatus(data.status);
          this.loadMap(data.startLatitude, data.startLongitude, data.endLatitude, data.endLongitude);

          //Add Sync Marker if status is 2
          if (data.status == 2 && !this.vehicleMarkerAdded) {
            this.addVehicleMarker(data.vehicleId);
            this.vehicleMarkerAdded = true;
          }

          

          return { id };
        });
      });

      this.subscription = docId.subscribe(docs => {
        if (docs.length > 0) {
          docs.forEach(doc => {
            console.log(doc.id);
            this.rideExists = true;
            this.showbutton = true;
            this.ride = this.rideServiceProvider.getRide(doc.id).valueChanges();
            this.rideId = doc.id;
            //console.log(doc.status);           
          })
        } else {
          //alert("Usted no tiene ninguna carrera activa");
          /*
          this.alertService.presentAlertCallback("Aviso", "Usted no tiene ninguna carrera activa").then(() => {
            this.appCtrl.getRootNav().push(CityCabPage);
          });
          */
          this.rideExists = false;
          this.showbutton = false;
        }
      });      
    });

    //this.loadMap()

  }

  addVehicleMarker(vehicleId) {
    let vehicleMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(14.0789613, -87.197108),
      icon: {
        url: "./assets/icon/taxi-icon.png",
        scaledSize: new google.maps.Size(24, 24), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      }
    });

    this.addInfoWindow(vehicleMarker, "<h4>Su unidad</h4>");

    this.vehicleLocationRef = this.angularFireDatabase.database.ref('carsLocations/' + vehicleId);
    this.onValueChange =
      this.vehicleLocationRef.on('value', function (snapshot) {
        console.log("Live location: " + snapshot.val().l[0] + snapshot.val().l[1]);
        //document.getElementById("liveLocation").innerHTML = "<b>Latitud:</b>" + snapshot.val().l[0] + " <b>Longitud:</b>" + snapshot.val().l[1];
        //marker.setPosition(new google.maps.LatLng(snapshot.val().l[0], snapshot.val().l[1]));
        //map.panTo(new google.maps.LatLng(snapshot.val().l[0], snapshot.val().l[1]));

        vehicleMarker.setPosition(new google.maps.LatLng(snapshot.val().l[0], snapshot.val().l[1]));

      });
  }

  presentProfileModal( docId, driverId, driverName) {

    let user ={
      docId,
      driverId,
      driverName
    }
    let profileModal = this.modalCtrl.create(RatingPage, {user: user});
    profileModal.present();
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.vehicleLocationRef) {
      this.vehicleLocationRef.off('value', this.onValueChange);
    }
  }

  cancelRide(id) {
    this.alertService.presentAlertWithCallback('Cancelar Carrera',
      'Esta Seguro que desea cancelar su carrera?').then((yes) => {
        if (yes) {
          //this.toastCtrl.create('Logged out of the application');
          console.log("Ride to cancel: " + id);
          var ride = this.rideServiceProvider.getRide(id);
          ride.update({ status: 0, updatedAt: new Date });
        }
      });
  }
  /*
    cancelRide(id) {
      if (id) {
        console.log("Ride to cancel: " + id);
        var ride = this.rideServiceProvider.getRide(id);
        ride.update({ status: 0, updatedAt: new Date });
      } else {
        alert("No tiene ninguna solicitud para cancelar");
      }
    }
    */

  translateStatus(status) {
    if (status == 1) {
      this.status = "Localizando Conductor Seven";
    } else if (status == 2) {
      this.status = "Conductor en Camino";
    } else if (status == 3) {
      this.status = "Conductor Afuera";
    } else if (status == 4) {
      this.status = "Carrera en Camino";
    } else if (status == 5) {
      this.status = "Carrera Finalizada";
    } else if (status == 6) {
      this.status = "Calificación";
    }  else {
      this.status = "Pendiente";
    }
  }

  loadMap(startLatitude, startLongitude, endLatitude, endLongitude) {
    console.log("Loading map: " + startLatitude + startLongitude);
    var latlngbounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(startLatitude, startLongitude),
      new google.maps.LatLng(endLatitude, endLongitude)
    );
    let latLng = new google.maps.LatLng(endLatitude, endLongitude);
    // this.lat_lng.push(latLng);
    // console.log(this.lat_lng);
    let mapOptions = {
      //center: latlngbounds.getCenter(),
      center: new google.maps.LatLng(startLatitude, startLongitude),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker(new google.maps.LatLng(startLatitude, startLongitude), true);
    this.addMarker(new google.maps.LatLng(endLatitude, endLongitude), false);
  }


  // Used fr load map
  /*
  loadMap(){
    if (!this._mapsService.destination) { 
      this._mapsService.destination = 'India';   
    }
    this._mapsService.getLatLan(this._mapsService.destination)
      .subscribe(
        result => {
          // needs to run inside zone to update the map
          this.__zone.run(() => {
            var lat = result.lat();
            var lng = result.lng();
            console.log(lat);
            console.log(lng);
            var latlngbounds = new google.maps.LatLngBounds();
            let latLng = new google.maps.LatLng(lat, lng);
            // this.lat_lng.push(latLng);
            // console.log(this.lat_lng);
            let mapOptions = {
              center: latLng,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            this.addMarker();
          });
        },
        error => console.log(error),
        () => console.log('Geocoding completed!')
      );
  }*/

  // used for add marker
  addMarker(latLng, origin) {

    let content;
    let url;
    if (origin) {
      content = "<h4>Origen</h4>";
      url = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
    } else {
      content = "<h4>Destino</h4>";
      url = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";
    }

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon: {
        url: url
      }
    });

    this.addInfoWindow(marker, content);

  }
  goBack() {
    this.navCtrl.pop();
  }
  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  getUserInfo() {

  }

  call() {
    console.log('Calling');
    this.http.get('https://seven.hn/api/v1/drivers/' + this.driverId)
        .map(res => res.json())
        .subscribe(res => {
          console.log(JSON.stringify(res));
          console.log(res.status);
          // If the API returned a successful response, mark the user as logged in
          // this need to be fixed on Laravel project to retun the New Token ;
          this.callNumber.callNumber(res.phone, true)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => console.log('Error launching dialer', err));
        }, err => {
          console.error('ERROR', err);
        });
  }

}