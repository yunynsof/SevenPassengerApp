import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {
  GoogleMaps,
} from '@ionic-native/google-maps';


// /*
//   Generated class for the EditLocation page.
//
//   See http://ionicframework.com/docs/v2/components/#navigation for more info on
//   Ionic pages and navigation.
// */

declare var google;
@Component({
  selector: 'page-edit-location',
  templateUrl: 'edit-location.html'
})
export class EditLocationPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  autocompleteItems;
  autocomplete;
  flag = false;
  constructor(public __zone: NgZone, public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMaps, public geolocation: Geolocation) {
    this.autocompleteItems = [];
    this.autocomplete = {
      destination: '',
      pickup: ''
    };
  }
  // this function check that the location which is selected is for Pickup or for Destination
  check(i) {
    console.log("check");
    if (i == 0) {
      console.log("true");
      this.flag = true;
    }
    else {
      console.log("false");
      this.flag = false;
    }
  }
  // called when user put adderess in search bar and Calculate Prediction of place according to user input
  updateSearch() {
    var query = '';
    console.log("update search");
    // this.autocomplete.query="youstart";
    if (this.autocomplete.pickup == '' && this.autocomplete.destination == '') {
      this.autocompleteItems = [];
      return;
    }
    else if (this.flag == true) {
      query = this.autocomplete.pickup;
    }
    else {
      query = this.autocomplete.destination;
    }
    var me = this;
    var service = new google.maps.places.AutocompleteService();

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
  dismiss() {
    this.autocompleteItems = [];
  }
  // Called when USer is select pickup location
  chooseItem(s) {
    console.log(s);

    this.autocomplete.pickup = s;
    this.autocompleteItems = [];

  }

  ionViewDidLoad() {
    this.loadMap();
    console.log('ionViewDidLoad EditLocationPage');
  }
  // Used For Adding marker to the map
  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";

    this.addInfoWindow(marker, content);

  }
  // Used for load map
  loadMap() {

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });

  }
  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  goBack() {
    this.navCtrl.pop();
  }
}
