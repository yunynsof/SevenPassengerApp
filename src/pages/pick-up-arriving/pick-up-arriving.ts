import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { App, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { mapservice } from "../../providers/map.service"
declare var google;

import { RideServiceProvider } from '../../providers/ride-service/ride-service';

import { Ride } from '../../models/ride.model';

import { Observable } from 'rxjs';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import 'rxjs/add/operator/map';

import { CityCabPage } from "../city-cab/city-cab";

import { Storage } from '@ionic/storage';


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
  showbutton = true;

  public ride: Observable<Ride>;

  public rideId;

  public status;

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
    public storage: Storage) {
    console.log("cnstrctr");
    // this.loadMap();
    this.showbutton = _mapsService.showbutton

  }

  subscription;
  ionViewWillEnter() {
    console.log('ionViewDidLoad PickUpArrivingPage');


    this.storage.get('user_id').then((user_id) => {
      console.log(user_id);
      const devicesRef = this.firestore.collection('rides', ref => ref.where('passengerId', '==', user_id).where('status', '>', 0).where('status', '<', 5));
      console.log("Collection ref: " + devicesRef);
      var docId = devicesRef.snapshotChanges().map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Ride;
          const id = a.payload.doc.id;
          console.log("Doc Id: " + id);
          console.log("Status: " + data.status);
          this.translateStatus(data.status);
          this.loadMap(data.startLatitude, data.startLongitude, data.endLatitude, data.endLongitude);
          return { id };
        });
      });

      this.subscription = docId.subscribe(docs => {
        if (docs.length > 0) {
          docs.forEach(doc => {
            console.log(doc.id);
            this.ride = this.rideServiceProvider.getRide(doc.id).valueChanges();
            this.rideId = doc.id;
            //console.log(doc.status);           
          })
        } else {
          alert("Usted no tiene ninguna carrera activa");
          this.appCtrl.getRootNav().push(CityCabPage);
        }
      });
    });

    
      

      //this.loadMap()
    


  }


  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }

  cancelRide(id) {
    if (id) {
      console.log("Ride to cancel: " + id);
      var ride = this.rideServiceProvider.getRide(id);
      ride.update({ status: 0 });
    } else {
      alert("No tiene ninguna solicitud para cancelar");
    }
  }

  translateStatus(status) {
    if (status == 1) {
      this.status = "Localizando Conductor";
    } else if(status == 2){
      this.status = "Conductor en Camino";
    } else if(status == 3){
      this.status = "Esperando pasajero";
    }else if(status == 4){
      this.status = "Carrera en Camino";
    }else if(status == 5){
      this.status = "Carrera Finalizada";
    }else {
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
      url = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    } else {
      content = "<h4>Destino</h4>";
      url = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
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

}
