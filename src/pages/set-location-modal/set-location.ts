/**
 * Created by Bunny on 15-05-2017.
 */

import { Component, NgZone } from '@angular/core';
import { Input, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { mapservice } from "../../providers/map.service"
import { CityCabPage } from "../city-cab/city-cab";

/*
 Generated class for the Verifymobile page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var google;

@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html'
})

export class SetLocationpage {
  searchItem = "";
  autocompleteItems = [];
  @ViewChild('input') myInput;
  currentlat;
  currentlng;
  currentlatlng;
  constructor(public __mapsService: mapservice, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public __zone: NgZone) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetlocatoinPage');
    
  }
  closeModal() {
    
    let data = { 'foo': 'bar' };

    this.viewCtrl.dismiss(true);
  }

  dismiss() {
    console.log("dismmis called");
    let data = { 'foo': 'bar' };
    console.log(data);
    this.viewCtrl.dismiss(false);

  }
  // Called when user put any input in search bar
  updateSearch() {
    var query = '';
    console.log("update search");
    query = this.searchItem;
    var me = this;
    var service = new google.maps.places.AutocompleteService();
    if (query != '') {
      service.getPlacePredictions({ input: query, componentRestrictions: { country: 'HN' } }, function (predictions, status) {
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
  // called when user select any address from prediction
  chooseItem(s) {
    console.log(s);
    if (this.__mapsService.flag == true) {
      this.__mapsService.pickup = s;
    }
    else {
      console.log(this.__mapsService.flag);
      this.__mapsService.destination = s;
    }
    this.autocompleteItems = [];
    var temp = true;
    this.__mapsService.getLatLan(s)
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
          if (this.__mapsService.lat_lng.length == 0 && this.__mapsService.flag == true) {
            this.__mapsService.lat_lng.push(latLng);
            this.__mapsService.latarr.push(lat);
            this.__mapsService.lanarr.push(lng);
          }
          else if (this.__mapsService.lat_lng.length == 1 && this.__mapsService.flag == false) {
            this.__mapsService.lat_lng.push(latLng);
            this.__mapsService.latarr.push(lat);
            this.__mapsService.lanarr.push(lng);

          }
          else if (this.__mapsService.lat_lng.length == 1 && this.__mapsService.flag == true) {
            this.__mapsService.lat_lng[0] = latLng;
            this.__mapsService.latarr[0] = lat;
            this.__mapsService.lanarr[0] = lng;
            // this.toast=false;

          }
          else if (this.__mapsService.lat_lng.length == 0 && this.__mapsService.flag == false) {
            var lat1, lng1, latlngbounds1, latLng1;
            this.__mapsService.getLatLan(this.__mapsService.pickup)
              .subscribe(
              result => {
                // needs to run inside zone to update the map
                this.__zone.run(() => {
                  lat1 = result.lat();
                  lng1 = result.lng();
                  this.currentlat = lat1;
                  this.currentlng = lng1;
                  console.log(lat1);
                  console.log(lng1);
                  latlngbounds1 = new google.maps.LatLngBounds();
                  latLng1 = new google.maps.LatLng(lat, lng);
                  this.currentlatlng = latLng1;

                  this.__mapsService.lat_lng.push(latLng);
                  this.__mapsService.latarr.push(lat);
                  this.__mapsService.lanarr.push(lng);
                  temp = false;
                  console.log(this.__mapsService.lat_lng);

                });
              },
              error => console.log(error),
              () => console.log('Geocoding completed!')
              );
          }
          else if (this.__mapsService.lat_lng.length == 2 && this.__mapsService.flag == true) {
            this.__mapsService.lat_lng[0] = latLng;
            this.__mapsService.latarr[0] = lat;
            this.__mapsService.lanarr[0] = lng;
            this.__mapsService.mylatlng = { lat: this.__mapsService.latarr[1], lng: this.__mapsService.lanarr[1] };

          }
          else {
            this.__mapsService.lat_lng[1] = latLng;
            this.__mapsService.latarr[1] = lat;
            this.__mapsService.lanarr[1] = lng;

          }
          console.log(this.__mapsService.lanarr);
          console.log(this.__mapsService.latarr);
          let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }

        });
      },
      error => console.log(error),
      () => console.log('Geocoding completed!')
      );
    this.closeModal();
  }

}
