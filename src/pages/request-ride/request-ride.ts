import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController, Platform, ModalController } from 'ionic-angular';
import { PickUpArrivingPage } from "../pick-up-arriving/pick-up-arriving";
import { PromocodePage } from "../promocode/promocode"
import { FareEstimatePage } from "../fare-estimate/fare-estimate";
import { ChangePage } from "../change/change";
import { AgmCoreModule } from 'angular2-google-maps/core';
import { Geolocation } from '@ionic-native/geolocation';
import { mapservice } from "../../providers/map.service"
import { BookingConfitmationPage } from "../booking-confitmation/booking-confitmation"
import { PaymentGatewayPage } from '../payment-gateway/payment-gateway';
import { RideServiceProvider } from '../../providers/ride-service/ride-service';


/*
  Generated class for the RequestRide page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var google;
@Component({
  selector: 'page-request-ride',
  templateUrl: 'request-ride.html'
})
export class RequestRidePage {
  marker: { buildingNum: 'hii', streetName: 'hhi' };
  street = "";
  building = "";
  toast = true;
  flag: any;
  latarr = [];
  lanarr = [];
  mylatlng;
  up = false;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  pickUp = "";
  autocompleteItems;
  autocomplete;
  searckquery = "";
  lat_lng = [];
  address: any;
  cities: any;
  desdisable = true;
  lineCoordinatesPath: any;
  buttonWidth;
  loader = this.loadingCtrl.create({
    content: "Por Favor Espere...",
    // duration: 3000
  });

  fee = 0.00;
  baggage;
  passengers;

  constructor(public modalCtrl: ModalController, public Platform: Platform, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public __zone: NgZone, public _mapsService: mapservice, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public geolocation: Geolocation, private rideServiceProvider: RideServiceProvider) {
    console.log("cnstructor");
    var width = Platform.width();
    this.buttonWidth = width - 20 + 'px';
    this.loader.present();
    this.distance(this._mapsService.latarr[0], this._mapsService.lanarr[0], this._mapsService.latarr[1], this._mapsService.lanarr[1], "K");


    // this.item=[{color:'black',size:1.2,margin:5},{color:'black',size:1.2,margin:5},{color:'black',size:1.2,margin:5}];
    this.autocompleteItems = [];
    this.autocomplete = {
      destination: '',
      pickup: ''
    };
    this.address = {
      place: ''
    };
    this.desdisable = true;

  }
  dismiss() {
    this.autocompleteItems = [];
  }
  // Check whether the selected location is for pickup or destination location
  check(i) {
    console.log("check");
    if (this.autocomplete.pickup == "" && this.autocomplete.destination == "") {
      this.toast = true;
      this.autocompleteItems = [];
      console.log(true);
    }
    // if i==0 it is for pickup else is for destination
    if (i == 0) {
      console.log("true");
      this.flag = true;
    }
    else {
      console.log("false");
      this.flag = false;
    }
  }
  // called every time when user is type any adderess in search bar
  updateSearch() {
    var query = '';
    console.log("update search");
    // this.autocomplete.query="youstart";
    if (this.autocomplete.pickup == '' && this.autocomplete.destination == '') {
      this.autocompleteItems = [];
      this.lat_lng = [];
      return;
    }
    else if (this.flag == true) {
      query = this.autocomplete.pickup;
    }
    else {
      query = this.autocomplete.destination;
    }
    var me = this;
    // Predict address according to user input in search bar
    var service = new google.maps.places.AutocompleteService();
    if (query != '') {
      service.getPlacePredictions({ input: query }, function (predictions, status) {
        me.autocompleteItems = [];
        me.__zone.run(function () {
          if (predictions != null) {
            predictions.forEach(function (prediction) {
              me.autocompleteItems.push(prediction.description);
              console.log(me.autocompleteItems);

            });
          }
        });
      });
    }
  }
  // Update List for places
  updateList(s, i) {
    console.log(s);
    console.log(s);
    this.clickSearchAddress(s, i);
  }
  // calculate distance between two lat and lang
  distance(lat1, lon1, lat2, lon2, unit) {
    console.log("distance called");
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
    console.log(dist);
    this._mapsService.distance = dist;

  }
  // called when user is choose any address
  chooseItem(s) {
    console.log(s);
    // s is location choosed by user
    if (this.flag == true) {
      this.autocomplete.pickup = s;
      this._mapsService.pickup = this.autocomplete.pickup;
    }
    else {
      this.autocomplete.destination = s;
      this._mapsService.destination = this.autocomplete.destination;
    }
    this.autocompleteItems = [];
    var temp = true;
    this._mapsService.getLatLan(s)
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
            if (this.lat_lng.length == 0 && this.flag == true) {
              this.lat_lng.push(latLng);
              this.latarr.push(lat);
              this.lanarr.push(lng);
              this.toast = false;
              this.desdisable = false;
            }
            else if (this.lat_lng.length == 1 && this.flag == false) {
              this.lat_lng.push(latLng);
              this.latarr.push(lat);
              this.lanarr.push(lng);
              this.toast = false;

            }
            else if (this.lat_lng.length == 1 && this.flag == true) {
              this.lat_lng[0] = latLng;
              this.latarr[0] = lat;
              this.lanarr[0] = lng;
              this.toast = false;

            }
            else if (this.lat_lng.length == 0 && this.flag == false) {
              this.lat_lng.push(latLng);
              this.lat_lng.push(latLng);
              this.latarr.push(lat);
              this.lanarr.push(lng);
              this.latarr.push(lat);
              this.lanarr.push(lng);
              temp = false;
              this.toast = false;

            }
            else if (this.lat_lng.length == 2 && this.flag == true) {
              this.lat_lng[0] = latLng;
              this.latarr[0] = lat;
              this.lanarr[0] = lng;
              this.up = true;
              this.mylatlng = { lat: this.latarr[1], lng: this.lanarr[1] };
              this.toast = false;

            }
            else {
              this.lat_lng[1] = latLng;
              this.latarr[1] = lat;
              this.lanarr[1] = lng;
              this.toast = false;

            }
            // if(temp==false){
            // temp=true;
            // return;
            // }

            console.log(this.latarr);
            console.log(this.lanarr);
            console.log(this.lat_lng);
            // this bove are 3 array which hold the address of latitude and longitude
            //latarr has two latitude in which zeroindex is always for pickup 
            //lanarr has two longitude in which zeroindex is always for pickup 
            //lat_lng has two lat_lng in which zeroindex is always for pickup 
            let mapOptions = {
              center: latLng,
              zoom: this._mapsService.zoom,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            if (this.flag == true) {
              this.cities = { center: { lat: lat, lng: lng } }
            }
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            // Used for putting circle in Maps for destination location
            var cityCircle = new google.maps.Circle({
              strokeColor: 'grey',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: 'white',
              fillOpacity: 0.35,
              map: this.map,
              center: this.cities.center,
              radius: Math.sqrt(6) * 10
            });


            this.addMarker();

            // this.map.setCenter(latlngbounds.getCenter());
            // this.map.fitBounds(latlngbounds);
            var path = new google.maps.MVCArray();

            //Initialize the Direction Service
            var service = new google.maps.DirectionsService();

            //Set the Path Stroke Color
            var poly = new google.maps.Polyline({ map: this.map, strokeColor: '#4986E7' });

            //Loop and Draw Path Route between the Points on MAP
            for (var i = 0; i < this.lat_lng.length; i++) {
              if ((i + 1) < this.lat_lng.length) {
                var src = this.lat_lng[i];
                var des = this.lat_lng[i + 1];
                path.push(src);
                poly.setPath(path);
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
                if (this.latarr.length == 2 && this.lanarr.length == 2) {
                  this.distance(this.latarr[0], this.lanarr[0], this.latarr[1], this.lanarr[1], "K");
                }
              }
            }

          });
        },
        error => console.log(error),
        () => console.log('Geocoding completed!')
      );
  }
  // Run when user is clicked on search address
  clickSearchAddress(s, i) {
    this._mapsService.getLatLan(s)
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
            console.log(this.lat_lng);
            let mapOptions = {
              center: latLng,
              zoom: this._mapsService.zoom,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            this.addMarker();
            // this.map.setCenter(latlngbounds.getCenter());
            // this.map.fitBounds(latlngbounds);
            var path = new google.maps.MVCArray();

            //Initialize the Direction Service
            var service = new google.maps.DirectionsService();

            //Set the Path Stroke Color
            var poly = new google.maps.Polyline({ map: this.map, strokeColor: '#4986E7' });

            //Loop and Draw Path Route between the Points on MAP
            for (var i = 0; i < this.lat_lng.length; i++) {
              if ((i + 1) < this.lat_lng.length) {
                var src = this.lat_lng[i];
                var des = this.lat_lng[i + 1];
                path.push(src);
                poly.setPath(path);
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

          });
        },
        error => console.log(error),
        () => console.log('Geocoding completed!')
      );
  }
  ionViewDidLoad() {
    this.loadRequestRidePage();
    console.log('ionViewDidLoad RequestRidePage');
    this.fee = Number(this.rideServiceProvider.fee);
    //this.baggage = this.navParams.get("baggage");
    //this.passengers = this.navParams.get("passengers");

    console.log('fee: ' + this.rideServiceProvider.fee);
    console.log('baggage: ' + this.rideServiceProvider.baggage);
    console.log('passengers: ' + this.rideServiceProvider.numberOfPassengers);
    console.log('Latitud origin: ' + this.rideServiceProvider.startLatitude);
    console.log('Longitud origin: ' + this.rideServiceProvider.startLongitude);
    console.log('Latitud destino: ' + this.rideServiceProvider.endLatitude);
    console.log('Longitud destino: ' + this.rideServiceProvider.endLongitude);

  }
  // Get geolocation from latitude and longitude
  getGeoLocation(lat: number, lng: number) {
    if (navigator.geolocation) {
      let geocoder = new google.maps.Geocoder();
      let latlng = new google.maps.LatLng(lat, lng);
      let request = { latLng: latlng };

      geocoder.geocode(request, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let result = results[0];
          console.log(results);
          let rsltAdrComponent = result.address_components;
          let resultLength = rsltAdrComponent.length;
          if (result != null) {

            console.log(rsltAdrComponent[resultLength - 8].short_name);
            console.log(rsltAdrComponent[resultLength - 7].short_name);
            this.street = rsltAdrComponent[resultLength - 8].short_name;
            this.building = rsltAdrComponent[resultLength - 7].short_name;
          } else {
            alert("No address available!");
          }
        }
      });
    }
  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'You Must select pick-up Location First',
      duration: 3000
    });
    toast.present();
  }
  loadMap() {
    var beaches = [
      ['Bondi Beach', -33.890542, 151.274856, 4],
      ['Coogee Beach', -33.923036, 151.259052, 5],
      ['Cronulla Beach', -34.028249, 151.157507, 3],
      ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
      ['Maroubra Beach', -33.950198, 151.259302, 1]
    ];
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

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: this._mapsService.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      var citymap = {
        chicago: {
          center: { lat: 41.878, lng: -87.629 },
          population: 2714856
        },
        newyork: {
          center: { lat: 40.714, lng: -74.005 },
          population: 8405837
        },
        losangeles: {
          center: { lat: 34.052, lng: -118.243 },
          population: 3857799
        },
        vancouver: {
          center: { lat: 49.25, lng: -123.1 },
          population: 603502
        }
      };


      for (var i = 0; i < beaches.length; i++) {
        var beach = beaches[i];
        console.log("deaches");
        var marker = new google.maps.Marker({
          position: { lat: beach[1], lng: beach[2] },
          map: this.map,
          icon: image,
          shape: shape,
          title: beach[0],
          zIndex: beach[3]
        });
      }
      this.addMarker();
      this.getGeoLocation(position.coords.latitude, position.coords.longitude);
      var poly = new google.maps.Polyline({ map: this.map, strokeColor: '#4986E7' });
    }, (err) => {
      console.log(err);
    });

  }

  addMarker() {
    console.log(this.up);
    this.mylatlng = { lat: this._mapsService.latarr[1], lng: this._mapsService.lanarr[1] };
    this.up = true;

    this.up = false;
    let marker = new google.maps.Marker({

      map: this.map,
      animation: google.maps.Animation.DROP,

      position: this.mylatlng

    });

    let content = "<h4>Destino: " + this._mapsService.destination + "</h4>";

    this.addInfoWindow(marker, content);
    this.cities = { center: { lat: this._mapsService.latarr[0], lng: this._mapsService.lanarr[0] } }

    var cityCircle = new google.maps.Circle({
      strokeColor: 'grey',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'white',
      fillOpacity: 0.35,
      map: this.map,
      center: this.cities.center,
      radius: Math.sqrt(6) * 10
    });
    this.drawPath();
  }
  // addMarker(){
  //   console.log(this.up);
  //
  //   if(this.up==false) {
  //     let marker = new google.maps.Marker({
  //
  //       map: this.map,
  //       animation: google.maps.Animation.DROP,
  //
  //       position: this.map.getCenter()
  //
  //     });
  //
  //     let content = "<h4>Information!</h4><button onclick='myFunction()'>hii</button>";
  //
  //     this.addInfoWindow(marker, content);
  //   }
  //   else {
  //     this.up=false;
  //     let marker = new google.maps.Marker({
  //
  //       map: this.map,
  //       animation: google.maps.Animation.DROP,
  //
  //       position: this.mylatlng
  //
  //     });
  //
  //     let content = "<h4>Information!</h4><button onclick='myFunction()'>hii</button>";
  //
  //     this.addInfoWindow(marker, content);
  //   }
  // }
  // navigate to change payment page
  gotoChangePayment() {
    this.navCtrl.push(ChangePage);
  }
  // Navigate to fare ectimate page
  gotoFareEstimate() {
    this.navCtrl.push(FareEstimatePage);
  }
  //Navigate to promocode page
  gotoPromoCode() {
    this.navCtrl.push(PromocodePage);
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
    google.maps.event.addDomListener(window, "load", this.addInfoWindow);
    var myFunction = function () {
      console.log("hii");
    }
  }
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Confirmar Carrera',
      message: "Desesas confirmar tu carrera?",

      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirmar',
          handler: data => {
            this.showPayment();
            // this.rideServiceProvider.addRide();

            // this.navCtrl.push(BookingConfitmationPage);
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  showPayment() {
    let payment = this.alertCtrl.create({
      title: 'Método de Pago',
      message: "Como deseas cancelar la carrera?",
      buttons: [
        {
          text: 'EFECTIVO',
          handler: data => {
            this.rideServiceProvider.addRide();
            this.navCtrl.push(BookingConfitmationPage);
          }
        },
        {
          text: 'TARJETA CREDITO',
          handler: data => {
            this.presentPaymentModal();
          }
        },
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    payment.present();
  }

  loading;
  presentPaymentModal() {
    let profileModal = this.modalCtrl.create(PaymentGatewayPage, { fee: this.fee });
    profileModal.onDidDismiss(() => {
      this.presentLoadingCustom();
      let flag = localStorage.getItem('trs')
      if (flag == 'exito') {
        setTimeout(() => {
          this.loading.dismiss();
          localStorage.removeItem('trs')
          this.rideServiceProvider.addRide();
          this.navCtrl.push(BookingConfitmationPage);
        }, 5000);
      } else this.loading.dismiss();
    });
    profileModal.present();
  }

  presentLoadingCustom() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Por favor espere..'
    });

    this.loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    this.loading.present();
  }
  // Called when we come to this page
  loadRequestRidePage() {
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
            console.log(this.lat_lng);
            let mapOptions = {
              center: latLng,
              zoom: this._mapsService.zoom,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            this.addMarker();
          });
        },
        error => console.log(error),
        () => console.log('Geocoding completed!')
      );
  }
  // Used For Draw Path Between Picklocation and destination Locations
  drawPath() {
    var path = new google.maps.MVCArray();

    //Initialize the Direction Service
    var service = new google.maps.DirectionsService();

    //Set the Path Stroke Color
    var poly = new google.maps.Polyline({ map: this.map, strokeColor: '#4986E7' });

    //Loop and Draw Path Route between the Points on MAP
    for (var i = 0; i < this._mapsService.lat_lng.length; i++) {
      if ((i + 1) < this._mapsService.lat_lng.length) {
        var src = this._mapsService.lat_lng[i];
        var des = this._mapsService.lat_lng[i + 1];
        path.push(src);
        poly.setPath(path);
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
    this.loader.dismiss();
  }
}
