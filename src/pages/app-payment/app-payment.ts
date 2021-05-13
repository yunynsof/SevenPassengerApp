import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, AlertController, Slides } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import validator from 'validator';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ManageCreditcardPage } from "../manage-creditcard/manage-creditcard";
/*
  Generated class for the AppPayment page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-app-payment',
  templateUrl: 'app-payment.html'
})
export class AppPaymentPage {
  payment;
  numberCard;
  cvc;
  username;
  dateExpiration;
  yearExpiration;
  loading;
  alert;
  arrayCards: any = [];
  test;
  namecard;

  // @ViewChild(Slides) slides: Slides;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController
  ) {
    this.test = localStorage.getItem('list');
    if (this.test != null) {
      this.arrayCards = JSON.parse(this.test);
    }
    this.payment = navParams.get('fee')
    console.log(this.payment)
    this.validateFieldsForm();
  }

  @ViewChild('form') form: NgForm;

  validations_form: FormGroup;
  ionViewDidLoad() {
    console.log('ionViewDidLoad AppPaymentPage');
  }
  goBack() {
    this.dismiss();
  }
  //this function user for change slide
  // next() {
  //   if (this.slides.isEnd()) {
  //     //if slide is last do nothing
  //   }
  //   else {
  //     //else change slide
  //     this.slides.slideNext();
  //   }
  // }

  paymentGet(form) {
    if (this.formValidator()) {
      this.presentLoadingCustom()
      let flag = 0;
      for (let i = 0; i < this.arrayCards.length; i++) {
        if (this.arrayCards[i].namecard == this.namecard) {
          flag++;
        }
      }
      if (flag == 0) {
        this.arrayCards.push({
          numberCard: this.numberCard,
          username: this.username,
          cvc: this.cvc,
          dateExpiration: this.dateExpiration,
          yearExpiration: this.yearExpiration,
          namecard: this.namecard
        });
        localStorage.setItem('list', JSON.stringify(this.arrayCards));
        this.loading.dismiss();
        this.showAlert('Tarjeta Guardada!', 'Ya puedes realizar pagos con tu tarjeta.');
        form.reset();
      
      } else {
        this.loading.dismiss();
        this.alertIdentifier('Identificador Duplicado!', 'Ya tienes una tajeta con ese identificador, cambia el identificador.')
      }
    }
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

  showAlert(title, subTitle) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [{
        text: 'OK',
        handler: data => {
          this.dismiss();
        }
      }]
    });
    alert.present();
  }

  alertIdentifier(title, subTitle) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }

  validateFieldsForm() {
    let numCardRegex: RegExp = /^[0-9]{15,16}$/
    let cvcRegex: RegExp = /^[0-9]{3,4}$/
    let userNameRegex: RegExp = /(?!^\d+$)^.[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{4,30}$/
    let namecardRegex: RegExp = /(?!^\d+$)^.[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{4,28}$/
    this.validations_form = this.formBuilder.group({
      'numberCard': [null, [Validators.pattern(numCardRegex), Validators.required]],
      'cvc': [null, [Validators.pattern(cvcRegex), Validators.required]],
      'username': [null, [Validators.pattern(userNameRegex), Validators.required]],
      'dateExpiration': [null, [Validators.required]],
      'yearExpiration': [null, [Validators.required]],
      'namecard': [null, [Validators.pattern(namecardRegex), Validators.required]],
    });
  }

  loginFormValidator = {
    numberCard: {
      empty: '',
    },
    cvc: {
      empty: '',
    },
    username: {
      empty: '',
    },
    dateExpiration: {
      empty: '',
    },
    yearExpiration: {
      empty: '',
    },
    namecard: {
      empty: '',
    }
  };

  validation_messages = {
    'numberCard': [
      { type: 'pattern', message: 'Debe tener mas de 14 dígitos' },
      { type: 'required', message: 'Ingrese numero de tarjeta' }
    ],
    'cvc': [
      { type: 'pattern', message: 'Minimo 4 dígitos' },
      { type: 'required', message: 'Ingrese cvc' }
    ],
    'username': [
      { type: 'pattern', message: 'Mínimo 4 caracteres y máximo 30 caracteres' },
      { type: 'required', message: 'Ingrese nombre de titular de tarjeta' }
    ],
    'dateExpiration': [
      { type: 'required', message: 'Seleccione mes de expiración' }
    ],
    'yearExpiration': [
      { type: 'required', message: 'Seleccione año' }
    ],
    'namecard': [
      { type: 'pattern', message: 'Mínimo 4 caracteres y máximo 30 caracteres' },
      { type: 'required', message: 'Ingrese identificador de tarjeta' }
    ]
  }

  formValidator(): boolean {

    if (this.validations_form.value.numberCard == null || this.validations_form.value.numberCard == '') {
      this.validations_form.value.numberCard = '';
    } if (this.validations_form.value.cvc == null || this.validations_form.value.cvc == '') {
      this.validations_form.value.cvc = '';
    } if (this.validations_form.value.username == null || this.validations_form.value.username == '') {
      this.validations_form.value.username = '';
    } if (this.validations_form.value.dateExpiration == null || this.validations_form.value.dateExpiration == '') {
      this.validations_form.value.dateExpiration = '';
    } if (this.validations_form.value.yearExpiration == null || this.validations_form.value.yearExpiration == '') {
      this.validations_form.value.yearExpiration = '';
    } if (this.validations_form.value.namecard == null || this.validations_form.value.namecard == '') {
      this.validations_form.value.namecard = '';
    }

    if (validator.isEmpty(this.validations_form.value.numberCard.toString())) {
      this.loginFormValidator.numberCard.empty = ' ';
    } else {
      this.loginFormValidator.numberCard.empty = '';
    }

    if (validator.isEmpty(this.validations_form.value.cvc.toString())) {
      this.loginFormValidator.cvc.empty = ' ';
    } else {
      this.loginFormValidator.cvc.empty = '';
    }
    if (validator.isEmpty(this.validations_form.value.username.toString())) {
      this.loginFormValidator.username.empty = ' ';
    } else {
      this.loginFormValidator.username.empty = '';
    }
    if (validator.isEmpty(this.validations_form.value.dateExpiration.toString())) {
      this.loginFormValidator.dateExpiration.empty = ' ';
    } else {
      this.loginFormValidator.dateExpiration.empty = '';
    }
    if (validator.isEmpty(this.validations_form.value.yearExpiration.toString())) {
      this.loginFormValidator.yearExpiration.empty = ' ';
    } else {
      this.loginFormValidator.yearExpiration.empty = '';
    }
    if (validator.isEmpty(this.validations_form.value.namecard.toString())) {
      this.loginFormValidator.namecard.empty = ' ';
    } else {
      this.loginFormValidator.namecard.empty = '';
    }

    if (this.loginFormValidator.numberCard.empty == ' ' || this.loginFormValidator.cvc.empty == ' '
      || this.loginFormValidator.username.empty == ' ' || this.loginFormValidator.dateExpiration.empty == ' '
      || this.loginFormValidator.yearExpiration.empty == ' ' || this.loginFormValidator.namecard.empty == ' ') {
      return false;
    } else return true;
  }
}
