import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { RequestRidePage } from "../request-ride/request-ride"
import { Geolocation } from '@ionic-native/geolocation';
import { PaymentPage } from "../payment/payment";
import { mapservice } from "../../providers/map.service";
import { SetLocationpage } from "../set-location-modal/set-location";

import { FeeServiceProvider } from "../../providers/fee-service/fee-service";

import { AngularFirestore } from 'angularfire2/firestore';

import { Ride } from '../../models/ride.model';

import { RideServiceProvider } from '../../providers/ride-service/ride-service';

import { Storage } from '@ionic/storage';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http';


/*
  Generated class for the CityCab page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var google;

@Component({
  selector: 'page-city-cab',
  templateUrl: 'city-cab.html'
})
export class CityCabPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  pickup = true;
  item: any;
  locationError = false;
  load = false;
  street = "";
  poly;
  Setpath = false;
  showpickup = "";
  showdestination = "";
  autocompleteItems;
  autocomplete;
  // public window=window;
  building = "";
  markers = [];
  desdisable = true;
  title: string = 'My first angular2-google-maps project';
  lat: number = 51.678418;
  lng: number = 7.809007;
  address: any;
  color = ["black", "black", "black"];
  loader = this.loadingCtrl.create({
    content: "Obteniendo Ubicación..",
    // duration: 3000
  });

  fee = "0.00";
  baggage;
  passengers;

  constructor(
    public __zone: NgZone,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public _mapsService: mapservice,
    public _rideService: RideServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public modalCtrl: ModalController,
    private feeServiceProvider: FeeServiceProvider,
    public firestore: AngularFirestore,
    public storage: Storage,
    private http: HttpClient) {
    this.loader.present();
    if (this._mapsService.destination == "") {
      this.pickup = true;
    }
    this.item = [{
      color: '#f4f4f4',
      size: 1.2,
      margin: 0,
      hw: 40,
      icolor: 'black',
      ml: 35,
      marginpic: 5,
      flag: false
    }, {
      color: '#f4f4f4',
      size: 1.2,
      margin: 0,
      hw: 40,
      icolor: "black",
      ml: 35,
      marginpic: 5,
      flag: false
    }, { color: '#f4f4f4', size: 1.2, margin: 0, hw: 40, icolor: "black", ml: 35, marginpic: 5, flag: false }];
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    this.address = {
      place: ''
    };
  }
  //this function is used in change card for PICK-UP and DESTINATIOn location
  changeCard(card) {
    this.Setpath = true;
    if (card == "pickup") {
      this.pickup = true;
      this._mapsService.flag = true;
    }
    else {
      this._mapsService.flag = false;

      if (this._mapsService.destination == "") {
        let locationModal = this.modalCtrl.create(SetLocationpage);
        locationModal.onDidDismiss(data => {
          // this is called when we close modal
          console.log(data);
          console.log("success");
          if (this._mapsService.pickup == "") {
            this.loadMap("location");
          }
          else if (this._mapsService.flag == true) {
            this.loadMap(this._mapsService.pickup)
            this.Setpath = true;
          }
          else {
            this.pickup = false;
            this.Setpath = true;
            this.loadMap(this._mapsService.destination)
          }
          if (this._mapsService.lanarr.length < 2) {
            this.Setpath = false;
          }
        });

        this._mapsService.flag = false;
        locationModal.present();
      }
      this.pickup = false;
    }

  }

  //this function called when first view is loaded
  ionViewDidLoad() {
    console.log("City Cab View");
    // when pickup in balnkstring then it load map with current location
    if (this._mapsService.pickup == "") {
      this.loadMap("location");
    }
    // when pickup has address then map is loaded with pickup address
    else if (this._mapsService.flag == true) {
      this.loadMap(this._mapsService.pickup)
      this.Setpath = true;
    }
    // when destination is selected then map is loaded with destination address
    else {
      this.pickup = false;
      this.Setpath = true;
      this.loadMap(this._mapsService.destination)
    }
    if (this._mapsService.lanarr.length < 2) {
      this.Setpath = false;
    }// this.clickSearchAddress();
  }

  ionViewWillLeave() {
    //this.subscription.unsubscribe();
  }

  // this function used in Open modal for insert destination and pickup location
  showAddressModal() {
    let modal = this.modalCtrl.create('');
    let me = this;
    modal.onDidDismiss(data => {
      // called when modal is closed
      this.address.place = data;
    });
    modal.present();
  }
  // this function is used in add marker in map
  addMarker() {
    console.log("add marker called");
    // when pickup location is blank then is add marker in center of map
    if (this._mapsService.pickup == "") {
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter(),
        draggable: true,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        }
      });
      this.markers.push(marker);
      let content = "<h2> Origen </h2>";
      //let content = "<button onclick='myFunction()'> 'Marker' </button>";
      this.addInfoWindow(marker, content);
      var self = this;
      marker.addListener('dragend', function (e) {
        self.setOriginLocation(e.latLng.lat(), e.latLng.lng());
      });
    }

    if (this._mapsService.pickup != "") {
      // when pickup location has same address then is add marker in to pickup location
      if (this._mapsService.lanarr.length > 0) {
        var mylatlng = { lat: this._mapsService.latarr[0], lng: this._mapsService.lanarr[0] };
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: mylatlng,
          draggable: true,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          }
        });
        this.markers.push(marker);
        let content = "<p> " + this._mapsService.pickup + " </p>";
        //let content = "<button onclick='myFunction()'> " + this._mapsService.pickup + " </button>";
        this.addInfoWindow(marker, content);
        var self = this;
        marker.addListener('dragend', function (e) {
          self.setOriginLocation(e.latLng.lat(), e.latLng.lng());
        });
      }
      else {
        var mylatlng = { lat: this._mapsService.latarr[0], lng: this._mapsService.lanarr[0] };
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: this.map.getCenter(),
          draggable: true,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          }
        });
        this.markers.push(marker);
        let content = "<p> " + this._mapsService.pickup + " </p>";
        //let content = "<button onclick='myFunction()'> " + this._mapsService.pickup + " </button>";
        this.addInfoWindow(marker, content);
        var self = this;
        marker.addListener('dragend', function (e) {
          self.setOriginLocation(e.latLng.lat(), e.latLng.lng());
        });
      }
    }
    if (this._mapsService.destination != "") {
      // when destination location has same address then is add marker in to destination location
      var mylatlng = { lat: this._mapsService.latarr[1], lng: this._mapsService.lanarr[1] };
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: mylatlng,
        draggable: true,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        }
      });
      this.markers.push(marker);
      let content = "<p> " + this._mapsService.destination + " </p>";
      //let content = "<button onclick='myFunction()'> " + this._mapsService.destination + " </button>";
      this.addInfoWindow(marker, content);
      var self = this;
      marker.addListener('dragend', function (e) {
        self.setDestinationLocation(e.latLng.lat(), e.latLng.lng());
      });
    }
  }

  handleMarkerDragEnd(event) {
    console.log("handleMarkerDragEnd")
    event.getGeoLocation(event.latLng.lat(), event.latLng.lng());
  }

  setOriginLocation(lat, lng) {
    console.log("setOriginLocation")
    this._mapsService.flag = true;
    this._mapsService.pickup = "";
    var latLng1 = new google.maps.LatLng(lat, lng);

    this._mapsService.lat_lng[0] = latLng1;
    this._mapsService.latarr[0] = lat;
    this._mapsService.lanarr[0] = lng;

    this.getGeoLocation(lat, lng);

    //this._mapsService.showpickup = lat + " " + lng;
  }

  setDestinationLocation(lat, lng) {
    this._mapsService.flag = false;
    //this._mapsService.destination = "";
    var latLng1 = new google.maps.LatLng(lat, lng);

    this._mapsService.lat_lng[1] = latLng1;
    this._mapsService.latarr[1] = lat;
    this._mapsService.lanarr[1] = lng;

    this.getGeoLocation(lat, lng);

    //this._mapsService.showdestination = lat + " " + lng;
  }

  presentToast() {
    // toast is appear when network is not able to detect user current location
    let toast = this.toastCtrl.create({
      message: 'No se ha podido obtener su ubicación, debe hacerlo manualmente.',
      duration: 3000
    });
    toast.present();
  }
  // Toast is appear when user try to select Destion Location First
  presentToastOriginFirst() {
    let toast = this.toastCtrl.create({
      message: 'Debe seleccionar su origen.',
      duration: 3000
    });
    toast.present();
  }

  presentToastDestinationFirst() {
    let toast = this.toastCtrl.create({
      message: 'Debe seleccionar su destino.',
      duration: 3000
    });
    toast.present();
  }
  // Open Modal For Fare estimation
  openImageCtrl(name, path) {
    this._mapsService.carname = name;
    this._mapsService.path = path;
    let profileModal = this.modalCtrl.create(PaymentPage, { fee: this.fee, baggage: this.baggage, passengers: this.passengers });
    profileModal.present();
    profileModal.onDidDismiss(data => {
      // this is called when we close modal
      console.log(data);
      if (!data) {
        return;
      }
      console.log("success");
      if (this._mapsService.destination == "") {
        // this.presentToast();
        let toast = this.toastCtrl.create({
          message: 'Debe seleccionar una ubicación de destino',
          duration: 3000
        });
        toast.present();
      }
      else {
        //this._rideService.baggage = this.baggage;
        //this._rideService.numberOfPassengers = this.passengers;
        this.navCtrl.push(RequestRidePage);
        /*
        this.navCtrl.push(RequestRidePage, {
          baggage: this.baggage,
          passengers: this.passengers,
          fee: this.fee
          });
          */
      }
    });
  }
  // Open Modal for select Address for pickup and destination location
  openLocationModal(val) {
    console.log("open location ctrl");
    if (val == 0) {
      this._mapsService.flag = true;
    }
    else {
      this._mapsService.flag = false;

    }
    let locationModal = this.modalCtrl.create(SetLocationpage);

    locationModal.onDidDismiss(data => {
      console.log(data);
      console.log("success");
      // called when close modal
      if (data) {
        if (this._mapsService.pickup == "") {
          this.loadMap("location");
        }
        else if (this._mapsService.flag == true) {
          this.loadMap(this._mapsService.pickup)
          this.Setpath = true;
        }
        else {
          this.pickup = false;
          this.Setpath = true;
          this.loadMap(this._mapsService.destination)
        }
        if (this._mapsService.lanarr.length < 2) {
          this.Setpath = false;
        }
      }
    });
    locationModal.present();
  }
  ionViewWillEnter() {
    console.log("Veiw Load");
  }
  // function is used to add Info Modal in marker infowindwo is appear when we click on marker
  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }
  // Used For Set Map to user Current Location
  setLocationCurrent() {
    this._mapsService.pickup = "";
    this.loadMap("query");
  }
  // calculate distance detween two lat , lan
  distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.909344 }
    if (unit == "N") { dist = dist * 0.8684 }
    this._mapsService.distance = dist;
    console.log(this._mapsService.distance);
    if (this._mapsService.distance > 50) {
      this._mapsService.zoom = 11
      this.map.setZoom(10);
    }
    if (this._mapsService.distance > 100) {
      this._mapsService.zoom = 9;
      this.map.setZoom(9);
    }
    if (this._mapsService.distance > 200) {
      this._mapsService.zoom = 7;
      this.map.setZoom(7);
    }
    if (this._mapsService.distance > 300) {
      this._mapsService.zoom = 5;
      this.map.setZoom(5);
    }
    if (this._mapsService.distance > 1000) {
      this._mapsService.zoom = 4;
      this.map.setZoom(4);
    }
    // return dist
  }
  //  Used for load Map
  loadMap(query) {
    // This is Just take random lay Lan for Put a car icon we can change it according to requirment
    var beaches = [
      ['Bondi Beach', 26.6722947, 75.0248712, 4],
      ['Coogee Beach', 26.7722947, 73.0248712, 5],
      ['Cronulla Beach', 26.8722947, 73.0248712, 3],
      ['Manly Beach', 26.9722947, 75.0248712, 2],
      ['Maroubra Beach', 26.6722947, 75.0248712, 1]
    ];
    // Object For Car Image in marker
    var image = {
      url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32)
    };
    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };
    if (this._mapsService.destination == "" && this._mapsService.flag == false) {
      return;
    }
    if (this._mapsService.pickup == "") {
      this.geolocation.getCurrentPosition().then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          draggable: true
        }
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.load = false;

        this.addMarker();
        // for (var i = 0; i < beaches.length; i++) {
        //   var beach = beaches[i];
        //   console.log("deaches");
        //   var marker = new google.maps.Marker({
        //     position: {lat: beach[1], lng: beach[2]},
        //     map: this.map,
        //     icon: image,
        //     shape: shape,
        //     title: beach[0],
        //     zIndex: beach[3]
        //   });
        // }
        this.getGeoLocation(position.coords.latitude, position.coords.longitude);
      }, (err) => {
        this.locationError = true;
        this.loader.dismiss();
        if (this._mapsService.pickup == "") {
          this._mapsService.pickup = "Honduras";
        }
        this.loadMap(this._mapsService.pickup);
        this.presentToast();
      });
    }
    else {
      this._mapsService.getLatLan(query)
        .subscribe(
          result => {
            console.log(query);

            this.__zone.run(() => {
              if (result.err) {
                return;
              }
              console.log(result);
              var lat = result.lat();
              var lng = result.lng();
              var latlngbounds = new google.maps.LatLngBounds();
              let latLng = new google.maps.LatLng(lat, lng);
              let mapOptions = {
                center: latLng,
                zoom: 4,
                mapTypeId: google.maps.MapTypeId.ROADMAP
              }
              // var center = new google.maps.LatLng(10.23,123.45);
              console.log(latLng);
              if (this.locationError) {
                this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
                this.locationError = false;

              }
              else {
                if (this.map == undefined) {
                  this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
                }
                this.map.panTo(latLng);
                this._mapsService.zoom = 15;
                this.map.setZoom(15);
                //this.drawPath();
                this.distance(this._mapsService.latarr[0], this._mapsService.lanarr[0], this._mapsService.latarr[1], this._mapsService.lanarr[1], "K");
              }
              // code is used for insert car in maps
              // if(this._mapsService.flag==true){
              //   for (var i = 0; i < beaches.length; i++) {
              //     var beach = beaches[i];
              //     var marker = new google.maps.Marker({
              //       position: {lat: beach[1], lng: beach[2]},
              //       map: this.map,
              //       icon: image,
              //       shape: shape,
              //       title: beach[0],
              //       zIndex: beach[3]
              //     });
              //   }
              // }
              this.setMapOnAll(null);
              this.addMarker();
              this.getGeoLocation(lat, lng);
            });
          },
          error => console.log(error),
          () => {
            console.log('Geocoding completed!');
            this.loader.dismiss();
          }
        );
    }
  }
  // Used To Put all markers of car in maps
  setMapOnAll(map) {
    console.log(this.markers);
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
    this.markers = [];
  }
  // this function retrive geolocation from latitude and longitude
  getGeoLocation(lat: number, lng: number) {
    console.log("Getting Geolocation");
    if (navigator.geolocation) {
      let geocoder = new google.maps.Geocoder();
      let latlng = new google.maps.LatLng(lat, lng);
      let request = { latLng: latlng };

      geocoder.geocode(request, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let result = results[0];
          let rsltAdrComponent = result.address_components;
          let resultLength = rsltAdrComponent.length;
          if (result != null) {
            if (rsltAdrComponent[0] != null) {
              this.street = rsltAdrComponent[0].short_name;
              if (resultLength > 1) {
                this.building = rsltAdrComponent[1].short_name;
              } else {
                this.building = "";
              }
            }
            if (this._mapsService.pickup == "") {
              this._mapsService.pickup = result.formatted_address;
              this._mapsService.getLatLan(this._mapsService.pickup)
                .subscribe(
                  result => {
                    this.__zone.run(() => {
                      if (result.err) {
                        this.presentToast();
                        this.loader.dismiss();
                        return;
                      }
                      var lat1 = result.lat();
                      var lng1 = result.lng();
                      var latlngbounds1 = new google.maps.LatLngBounds();
                      var latLng1 = new google.maps.LatLng(lat, lng);

                      if (this._mapsService.lat_lng.length == 0) {
                        this._mapsService.lat_lng.push(latLng1);
                        this._mapsService.latarr.push(lat1);
                        this._mapsService.lanarr.push(lng1);
                      }
                      else {
                        this._mapsService.lat_lng[0] = latLng1;
                        this._mapsService.latarr[0] = lat1;
                        this._mapsService.lanarr[0] = lng1;
                      }
                      //this.loader.dismiss();
                    });
                  },
                  error => console.log(error),
                  () => {
                    console.log('Geocoding completed!')
                    this.loader.dismiss();
                  }
                );
            }
            if (this._mapsService.flag == true && this._mapsService.pickup != "Honduras") {
              this._mapsService.showpickup = this.street + " " + this.building;
            }
            else if (this._mapsService.pickup != "Honduras") {
              this._mapsService.showdestination = this.street + this.building;
            }
          } else {
            alert("No address available!");
          }
        }
      });
    }
  }
  // function is used for change style when we click on car icon in footer
  changeStyle(j) {
    for (var i = 0; i < 3; i++) {
      this.item[i].ml = 35;
      this.item[i].color = '#f4f4f4';
      this.item[i].size = 1.2;
      this.item[i].margin = 0;
      this.item[i].marginpic = 5;
      this.item[i].icolor = "black";
      this.item[i].hw = 40;
      this.color[i] = 'black';
      this.item[i].flag = false;
    }
    this.item[j].flag = true;
    this.color[j] = 'orange';
    this.item[j].hw = 50;
    this.item[j].margin = 5;
    this.item[j].color = 'orange';
    this.item[j].size = 2;
    this.item[j].ml = 28;
    this.item[j].marginpic = 0;
    this.item[j].icolor = "white"
  }
  // go to previous page
  goBack() {
    this.navCtrl.pop();
  }
  // Navigate to Request Ride page
  setLocation() {
    this.navCtrl.push(RequestRidePage);
  }
  // Used in booking confirmation Prompt
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: ' Mini',
      message: ' Your booking is confirm your driver will pick you up in 7 minutes  <ion-icon ios="ios-car" md="md-car"></ion-icon> ',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Done',
          handler: data => {
          }
        }
      ]
    });
    prompt.present();
  }
  // Function is used for Draw Path between two latitude and longitude
  drawPath() {
    var path = new google.maps.MVCArray();
    var service = new google.maps.DirectionsService();
    if (this.poly) {
      console.log('hs poly');
      this.poly.setMap(null);
    }
    this.poly = new google.maps.Polyline({ map: this.map, strokeColor: '#4986E7' });
    for (var i = 0; i < this._mapsService.lat_lng.length; i++) {
      if ((i + 1) < this._mapsService.lat_lng.length) {
        var src = this._mapsService.lat_lng[i];
        var des = this._mapsService.lat_lng[i + 1];
        path.push(src);
        this.poly.setPath(path);
        service.route({
          origin: src,
          destination: des,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        }, function (result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
              path.push(result.routes[0].overview_path[i]);
            }
          }
        });
      }
    }
  }

  subscription;
  validateExistingRide() {    


    this.storage.get('user_id').then((user_id) => {
      const devicesRef = this.firestore.collection('rides', ref => ref.where('passengerId', '==', user_id).where('status', '>', 0).where('status', '<', 5));
      console.log("Collection ref to remove: " + devicesRef);
      var docId = devicesRef.snapshotChanges().map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Ride;
          const id = a.payload.doc.id;
          console.log("Doc Id: " + id);
          console.log("Status: " + data.status);
          return { id };
        });
      });

      this.subscription = docId.subscribe(docs => {
        if (docs.length < 1) {
          this.validateOrigin();
        } else {
          alert("Usted tiene una carrera activa, debe finalizarla para poder generar una nueva.");
        }
      });
    });


  }

  validateOrigin() {
    console.log("Validating");
    this.subscription.unsubscribe();
    console.log(this._mapsService.pickup);
    console.log(this._mapsService.lanarr[0]);
    console.log(this._mapsService.latarr[0]);

    if (this._mapsService.lanarr[0] == undefined || this._mapsService.latarr[0] == undefined) {
      this.presentToastOriginFirst();
    } else {
      this.validateDestination();
      this._rideService.startLatitude = this._mapsService.latarr[0];
      this._rideService.startLongitude = this._mapsService.lanarr[0];
      this._rideService.startAddress = this._mapsService.pickup;
    }
  }

  validateDestination() {
    console.log("Validating");
    console.log(this._mapsService.pickup);
    console.log(this._mapsService.lanarr[1]);
    console.log(this._mapsService.latarr[1]);

    if (this._mapsService.lanarr[1] == undefined || this._mapsService.latarr[1] == undefined) {
      this.presentToastDestinationFirst();
    } else {
      this.promptBaggage();
      this._rideService.endLatitude = this._mapsService.latarr[1];
      this._rideService.endLongitude = this._mapsService.lanarr[1];
      this._rideService.endAddress = this._mapsService.destination;
    }
  }

  getFee() {
    this._mapsService.getFee()
      .then(price => {
        console.log("success fee: " + price);
        this.fee = price;
        this._rideService.fee = this.fee;
        this.openImageCtrl('sedan', 'assets/image/sedan.png');
      })
      .catch((error: any) => {
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

  promptBaggage() {
    let alert = this.alertCtrl.create({
      title: 'Lleva equipaje?',
      inputs: [
        {
          type: 'radio', label: 'Si', value: 'Si'
        },
        {
          type: 'radio', label: 'No', value: 'No', checked: true
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            console.log(data);
            this.baggage = data;
            this._rideService.baggage = this.baggage;
            this.promptPassengers();
          }
        }
      ]
    });
    alert.present();
  }

  promptPassengers() {
    let alert = this.alertCtrl.create({
      title: 'Cuantos Pasajeros son?',
      inputs: [
        {
          type: 'radio', label: '1', value: '1', checked: true
        },
        {
          type: 'radio', label: '2', value: '2'
        },
        {
          type: 'radio', label: '3', value: '3'
        },
        {
          type: 'radio', label: '4', value: '4'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            console.log(data);
            this.passengers = data;
            this._rideService.numberOfPassengers = this.passengers;
            this.getFee();
          }
        }
      ]
    });
    alert.present();
  }
}
