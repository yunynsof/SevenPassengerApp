import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { RideServiceProvider } from '../../providers/ride-service/ride-service';
import { CityCabPage } from '../city-cab/city-cab';
import { AuthService } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the RatingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {
  ratingValue;
  user;
  docId;
  driverId;
  driverName;
  imgDriver;

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public rideServiceProvider: RideServiceProvider,
    public navCtrl: NavController,
    public authService: AuthService) {

    this.user = navParams.get('user')
    this.docId = this.user.docId
    this.driverId = this.user.driverId
    this.driverName = this.user.driverName
    this.imgDriver = 'https://seven.hn/admin/taxiadmin/driver/' + this.driverId + '/image/'
  }

  logRatingChange(rating) {
    this.dismiss();
    console.log("changed rating: ", rating);
    this.ratingValue = rating;

    var ride = this.rideServiceProvider.getRide(this.docId);
    ride.update({ status: 0 });
    this.authService.setRating(this.driverId , this.ratingValue);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
