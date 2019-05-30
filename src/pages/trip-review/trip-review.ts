import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {mapservice} from "../../providers/map.service"

/*
  Generated class for the TripReview page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-trip-review',
  templateUrl: 'trip-review.html'
})
export class TripReviewPage {
  item=[{color:'grey'},{color:'grey'},{color:'grey'},{color:'grey'},{color:'grey'}]
  constructor(public _mapService:mapservice,public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TripReviewPage');
  }
  goBack(){
    this.navCtrl.pop();
  }
  // called when user clicked on stars for revied
  review(j){
    for(var k=0;k<5;k++){
      this.item[k].color='grey';
    }
    console.log("click");
    console.log(j)
    for(var i=0;i<=j;i++){
      this.item[i].color='orange';
      console.log(this.item[i].color);
    }
  }

}
