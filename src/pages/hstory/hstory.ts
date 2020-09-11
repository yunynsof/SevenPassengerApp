import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PickUpArrivingPage } from '../pick-up-arriving/pick-up-arriving';
import { mapservice } from "../../providers/map.service";
import { Storage } from '@ionic/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { Ride } from '../../models/ride.model';
/*
  Generated class for the HstoryPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-hstory',
  templateUrl: 'hstory.html'
})
export class HstoryPagePage {

  public subscription;

  public rides = new Array<Ride>();

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public _mapsService: mapservice,
    public firestore: AngularFirestore,
    public storage: Storage) {
      console.log(this.rides)
    }

  ionViewWillEnter() {
    console.log('ionViewWillEnter HstoryPagePage');

    this.storage.get('user_id').then((user_id) => {
      console.log(user_id);
      const devicesRef = this.firestore.collection('rides', ref => ref.where('passengerId', '==', user_id).limit(10).orderBy('updatedAt'));
      console.log("Collection ref: " + devicesRef);
      var docId = devicesRef.snapshotChanges().map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Ride;
          const id = a.payload.doc.id;
          console.log("Doc Id: " + id);
          console.log("Status: " + data.status);
          this.translateStatus(data.status);
          //this.loadMap(data.startLatitude, data.startLongitude, data.endLatitude, data.endLongitude);

          //Add Sync Marker if status is 2
         /* if (data.status == 2 && !this.vehicleMarkerAdded) {
            this.addVehicleMarker(data.vehicleId);
            this.vehicleMarkerAdded = true;
          }*/

          //return { id };
          return { id, data };
        });
      });

      this.subscription = docId.subscribe(docs => {
        console.log("Rides Count: " + docs.length);
        if (docs.length > 0) {
          docs.forEach(doc => {
            console.log(doc.id);
            this.rides.unshift(doc.data);
            /*
            this.ride = this.rideServiceProvider.getRide(doc.id).valueChanges();
            this.rideId = doc.id;
            //console.log(doc.data.);  
            this.hasRide = true; 
            this.loadMap(doc.data.startLatitude, doc.data.startLongitude, doc.data.endLatitude, doc.data.endLongitude);  
            */      
          })
        } else {
          //this.hasRide = false;
          //alert("Usted no tiene ninguna carrera activa");
          /*
          this.alertService.presentAlertCallback("Aviso", "Usted no tiene ninguna carrera activa").then(() => {
             this.appCtrl.getRootNav().push(CityCabPage);
          });
          */
        }
      });

    });

  }

  ionViewWillLeave() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  translateStatus(status) {
    if (status == 1) {
      return "Localizando Conductor Seven";
    } else if (status == 2) {
      return "Conductor en Camino";
    } else if (status == 3) {
      return "Esperando pasajero";
    } else if (status == 4) {
      return "Carrera iniciada";
    } else if (status == 5) {
      return "Carrera Finalizada";
    } else {
      return "Pendiente";
    }
  }

  next() { 
    this._mapsService.showbutton = false;
    this.navCtrl.push(PickUpArrivingPage);
  }
  goBack() {
    this.navCtrl.pop();
  }
}
