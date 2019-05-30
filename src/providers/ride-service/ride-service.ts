import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from 'angularfire2/firestore';
import { Ride } from '../../models/ride.model';

import { Storage } from '@ionic/storage';


/*
  Generated class for the RideServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RideServiceProvider{

  rides;

  id: string;
  passengerId: string;
  passengerName: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehicleName: string;
  startLatitude: string;
  startLongitude: string;
  startAddress: string;
  endLatitude: string;
  endLongitude: string;
  endAddress: string;
  baggage: string;
  status: number;
  fee: string;
  cancelationReason: string;
  numberOfPassengers: number;
  requestedAt: string;
  updatedAt: string;

  user = {
    user_id: '',
    name: '',
    email: '',
    imageUrl: '../assets/img/avatar/user.png'    
  };

  constructor(
    public http: HttpClient, 
    public firestore: AngularFirestore,
    public storage: Storage) {
    console.log('Hello RideServiceProvider Provider');
    this.rides = firestore.collection<Ride>(`rides`);
  }

  getRide(docId: string): AngularFirestoreDocument<Ride> {
    console.log("Getting Ride of user");
    return this.firestore.collection(`rides`).doc(docId);
  }

  addRide(){

    Promise.all([this.storage.get("user_id"), this.storage.get("firstName"), this.storage.get("lastName"), this.storage.get("email"), this.storage.get("id_token")]).then(values => {
          console.log("User ID", values[0]);
          console.log("First Name", values[1]);
          this.user.user_id = values[0];
          this.user.name = values[1] + ' ' + values[2];
          this.user.email = values[3];
         
          let ride = {
            passengerId: this.user.user_id,
            passengerName: this.user.name,
            driverId: "",
            driverName: "",
            vehicleId: "",
            vehicleName: "",
            vehicleRegister: "",
            startLatitude: this.startLatitude.toString(),
            startLongitude: this.startLongitude.toString(),
            endLatitude: this.endLatitude.toString(),
            endLongitude: this.endLongitude.toString(),
            baggage: this.baggage,
            status: 1,
            fee: this.fee,
            cancelationReason: "",
            numberOfPassengers: this.numberOfPassengers,
            requestedAt: "",
            updatedAt: "",
            startAddress: this.startAddress,
            endAddress: this.endAddress
          };
      
          this.rides.add(ride);
          
    });




    
    
    
  }

  getUserInfo() {
    console.log("Getting User Information");
    Promise.all([this.storage.get("user_id"), this.storage.get("firstName"), this.storage.get("lastName"), this.storage.get("email"), this.storage.get("id_token")]).then(values => {
          console.log("User ID", values[0]);
          console.log("First Name", values[1]);
          this.user.user_id = values[0];
          this.user.name = values[1] + ' ' + values[2];
          this.user.email = values[3];
          //this.idToken = values[4];   
          //this.getDriverInfo();       
    });
  }
}
