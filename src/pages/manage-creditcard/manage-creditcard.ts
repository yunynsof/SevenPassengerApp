import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { AppPaymentPage } from '../app-payment/app-payment';
import { CityCabPage } from "../city-cab/city-cab";

/**
 * Generated class for the ManageCreditcardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-creditcard',
  templateUrl: 'manage-creditcard.html',
})
export class ManageCreditcardPage {
  arrayCards: any = [];
  test;
  loading;
  disabled = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
  ) {
    this.test = localStorage.getItem('list');
    if (this.test != null) {
      this.arrayCards = JSON.parse(this.test);
      this.disabled = false;
      for (let x = 0; x < this.arrayCards.length; x++){
        this.arrayCards.splice(x,1,{
          numberCard: this.arrayCards[x].numberCard,
          username: this.arrayCards[x].username,
          cvc: this.arrayCards[x].cvc,
          dateExpiration: this.arrayCards[x].dateExpiration,
          yearExpiration: this.arrayCards[x].yearExpiration,
          namecard: this.arrayCards[x].namecard,
          numberMask:"**********"+this.arrayCards[x].numberCard.substring(11, 15)
        });
      }
    }
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManageCreditcardPage');
  }

  goBack() {
    this.navCtrl.pop();
  }


  addCard() {
    let profileModal = this.modalCtrl.create(AppPaymentPage, {});
    profileModal.onDidDismiss(() => {
      this.test = localStorage.getItem('list');
      if (this.test != null) {
        this.arrayCards = JSON.parse(this.test);
      }
    });
    profileModal.present();
  }

  itemSelected(item) {
    console.log(item)
   
  }

  deleteCard(item) {
    this.showAlert('Advertencia!', 'Realmente esta seguro de eliminar este resgistro de tarjeta: ' + item.namecard, item);
  }

  showAlert(title, subTitle, item) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [{
        text: 'OK',
        handler: data => {
          for (let x = 0; x < this.arrayCards.length; x++)
            if (this.arrayCards[x].namecard == item.namecard) {
              this.arrayCards.splice(x, 1);
              localStorage.removeItem('list');
              if(this.arrayCards.length>0){
              localStorage.setItem('list', JSON.stringify(this.arrayCards))             
              }else  this.disabled = true;
            }
        }
      }]
    });
    alert.present();
  }
}
