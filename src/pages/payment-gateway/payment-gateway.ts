import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import { AuthService } from '../../providers/auth-service/auth-service';
import { RideServiceProvider } from '../../providers/ride-service/ride-service';
import validator from 'validator';
import { v4 as uuidv4 } from 'uuid';
import jsSHA from "jssha";

/**
 * Generated class for the PaymentGatewayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-gateway',
  templateUrl: 'payment-gateway.html',
})
export class PaymentGatewayPage {
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
  selectItem;

  private MERCH_ID = "88802177";
  private MERCH_PWD = "43FfcTb9";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController

  ) {

    this.payment = navParams.get('fee')
    this.test = localStorage.getItem('list');
    if (this.test != null) {
      this.arrayCards = JSON.parse(this.test);
    }
    console.log(this.payment)
    this.validateFieldsForm();

  }

  @ViewChild('form') form: NgForm;

  validations_form: FormGroup;

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentGatewayPage');
  }

  getAuthorize() {
    var trsId = uuidv4();
    var authorizeRequest = '<?xml version="1.0" encoding="utf-8"?>' +
      '<AuthorizeRequest xmlns="http://schemas.firstatlanticcommerce.com/gateway/data">' +
      '<TransactionDetails>' +
      '<AcquirerId>464748</AcquirerId>' +
      '<MerchantId>' + this.MERCH_ID + '</MerchantId>' +
      '<OrderNumber>' + trsId + '</OrderNumber>' +
      '<TransactionCode>0</TransactionCode>' +
      '<Amount>' + this.getAmount() + '</Amount>' +
      '<Currency>340</Currency>' +
      '<CurrencyExponent>2</CurrencyExponent>' +
      '<SignatureMethod>SHA1</SignatureMethod>' +
      '<Signature>' + this.getSignature(trsId, this.getAmount()) + '</Signature>' +
      '<IPAddress />' +
      '<CustomData />' +
      '<CustomerReference />' +
      '<ExtensionData />' +
      '</TransactionDetails>' +
      '<CardDetails>' +
      '<CardNumber>' + this.numberCard + '</CardNumber>' +
      '<CardExpiryDate>' + this.dateExpiration + this.yearExpiration + '</CardExpiryDate>' +
      '<CardCVV2>' + this.cvc + '</CardCVV2>' +
      '<IssueNumber />' +
      '<StartDate />' +
      '<Installments>0</Installments>' +
      '<DocumentNumber />' +
      '<ExtensionData />' +
      '</CardDetails>' +
      '<BillingDetails>' +
      '<BillToAddress/>' +
      '<BillToAddress2 />' +
      '<BillToZipPostCode />' +
      '<BillToFirstName />' +
      '<BillToLastName />' +
      '<BillToCity/>' +
      '<BillToState />' +
      '<BillToCountry />' +
      '<BillToEmail />' +
      '<BillToTelephone/>' +
      '<BillToCounty />' +
      '<BillToMobile />' +
      '<ExtensionData />' +
      '</BillingDetails>' +
      '<FraudDetails>' +
      '<SessionId/>' +
      '<AuthResponseCode />' +
      '<AVSResponseCode />' +
      '<CVVResponseCode />' +
      '</FraudDetails>' +
      '</AuthorizeRequest>';

    this.authService.postAuthorize(authorizeRequest).subscribe(
      data => {

        console.log((<any>data)._body)
        let response = (<any>data)._body;
        let fragArray = this.getObjXmlResponse(response, 'ResponseCode')
        if (fragArray == 1) {
          localStorage.setItem('trs', 'exito')
          this.loading.dismiss();

          this.presentAlert('Transaccion Exitosa', 'Se realizo el pago correctamente.');

          setTimeout(() => {
            this.dismiss();
            this.alert.dismiss();
          }, 4000);

        } else if (fragArray == 2) {
          this.loading.dismiss();
          this.alertFailed('Transaccion Fallida', 'Se rechazó la transacción, Intente mas tarde.');
        } else if (fragArray == 3) {
          this.loading.dismiss();
          this.alertFailed('Transaccion Fallida', 'Se rechazó la transacción por un Error generado, intente con otra tarjeta.');
        }
        console.log(fragArray)

      },
      error => {
        console.log(error)
      },
      () => {

      }
    );
  }

  getAuthorize3DS() {
    var trsId = uuidv4();
    localStorage.setItem('trsId', trsId)
    var authorize3DSRequest = '<?xml version="1.0" encoding="utf-8"?>' +
      '<Authorize3DSRequest xmlns="http://schemas.firstatlanticcommerce.com/gateway/data">' +
      '<BillingDetails>' +
      '<BillToAddress/>' +
      '<BillToAddress2 />' +
      '<BillToZipPostCode />' +
      '<BillToFirstName />' +
      '<BillToLastName />' +
      '<BillToCity/>' +
      '<BillToState />' +
      '<BillToCountry />' +
      '<BillToEmail />' +
      '<BillToTelephone/>' +
      '<BillToCounty />' +
      '<BillToMobile />' +
      '<ExtensionData />' +
      '</BillingDetails>' +
      '<CardDetails>' +
      '<CardCVV2>' + this.cvc + '</CardCVV2>' +
      '<CardExpiryDate>' + this.dateExpiration + this.yearExpiration + '</CardExpiryDate>' +
      '<CardNumber>' + this.numberCard + '</CardNumber>' +
      '<Installments>0</Installments>' +
      '</CardDetails>' +
      '<MerchantResponseURL>https://seven.hn/api/v1/purchases/</MerchantResponseURL>' +
      '<TransactionDetails>' +
      '<AcquirerId>464748</AcquirerId>' +
      '<Amount>' + this.getAmount() + '</Amount>' +
      '<Currency>340</Currency>' +
      '<CurrencyExponent>2</CurrencyExponent>' +
      '<IPAddress/>' +
      '<MerchantId>' + this.MERCH_ID + '</MerchantId>' +
      '<OrderNumber>' + trsId + '</OrderNumber>' +
      '<Signature>' + this.getSignature(trsId, this.getAmount()) + '</Signature>' +
      '<SignatureMethod>SHA1</SignatureMethod>' +
      '<TransactionCode>0</TransactionCode>' +
      '<CustomerReference/>' +
      '</TransactionDetails>' +
      '<FraudDetails>' +
      '<SessionId/>' +
      '</FraudDetails>' +
      '</Authorize3DSRequest>';

    this.authService.postAuthorize3DS(authorize3DSRequest).subscribe(
      data => {

        //console.log((<any>data)._body)
        let response = (<any>data)._body;
        this.makeDocument(response)

        //this.alertFailed('Transaccion Fallida', 'Se rechazó la transacción, Intente mas tarde.');
      },
      error => {
        console.log(error);
      },
      () => {

      }
    );
  }

  getAmount() {
    var factor = Math.pow(10, 2);
    var amountSum = Math.round(12.00 * factor).toString();
    return this.pad(amountSum, 12);
  }

  pad(num, size): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  getSignature(orderId, amount) {
    var signatureAfter = this.MERCH_PWD + this.MERCH_ID + '464748' + orderId.toString() + amount.toString() + '340';
    const shaObj = new jsSHA("SHA-1", "TEXT", { encoding: "UTF8" });
    shaObj.update(signatureAfter);
    const hash = shaObj.getHash("B64");
    return hash;
  }

  getSessionId() {
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    return uuid;
  }

  makeDocument(response) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(response, "text/xml");
    var html = xmlDoc.getElementsByTagName("HTMLFormData")[0].childNodes[0].nodeValue;
    let frame: any = document.getElementById("theFrame");
    frame.setAttribute("srcdoc", html);
    document.body.appendChild(frame);
    let self = this;
    document.getElementById("theFrame").onload = function () {
      let trsId = localStorage.getItem('trsId')
      self.authService.postQuery(trsId).subscribe(
        data => {

          let reponse = JSON.parse((<any>data)._body)
          if(reponse.count == 0){
            self.loading.dismiss();
            localStorage.removeItem('trsId')
            self.alertFailed('Transaccion Fallida', 'Se rechazó la transacción por un Error generado, intente con otra tarjeta.');
          }else{
          console.log(reponse.results[0].ReasonCode)
          let fragArray = reponse.results[0].ReasonCode;

          if (fragArray == 1) {
            localStorage.setItem('trs', 'exito')
            self.loading.dismiss();
            localStorage.removeItem('trsId')
            self.presentAlert('Transaccion Exitosa', 'Se realizo el pago correctamente.');

            setTimeout(() => {
              self.dismiss();
              self.alert.dismiss();
            }, 4000);

          } else if (fragArray == 2) {
            self.loading.dismiss();
            localStorage.removeItem('trsId')
            self.alertFailed('Transaccion Fallida', 'Se rechazó la transacción, Intente mas tarde.');
          } else if (fragArray == 3) {
            self.loading.dismiss();
            localStorage.removeItem('trsId')
            self.alertFailed('Transaccion Fallida', 'Se rechazó la transacción por un Error generado, intente con otra tarjeta.');
          }
        }
        },
        error => {
          console.log(error)
        }
      );
    };

  }

  getObjXmlResponse(response, obj) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(response, "text/xml");
    return xmlDoc.getElementsByTagName(obj)[0].childNodes[0].nodeValue;

  }

  paymentGet() {
    if (this.formValidator()) {
      this.presentLoadingCustom()
      if (this.numberCard.length == 15 && this.cvc.length == 4) {

        this.getAuthorize()
      } else {

        this.getAuthorize3DS()
      }
    }
  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
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

  presentAlert(title, message) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [{
        role: 'cancel',
        handler: () => {
          this.dismiss();
        }
      },
      {
        text: 'Aceptar',
        handler: () => {
          this.dismiss();
        }
      }],
    });
    this.alert.present();

  }

  alertFailed(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  getCardsList() {
    console.log(this.selectItem)
    for (let i = 0; i < this.arrayCards.length; i++) {
      if (this.arrayCards[i].namecard == this.selectItem) {
        console.log('entro')
        this.numberCard = this.arrayCards[i].numberCard;
        console.log(this.numberCard )
        this.cvc = this.arrayCards[i].cvc;
        this.username = this.arrayCards[i].username;
        this.dateExpiration = this.arrayCards[i].dateExpiration;
        this.yearExpiration = this.arrayCards[i].yearExpiration;
      }
    }
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  validateFieldsForm() {
    let numCardRegex: RegExp = /^[0-9]{15,16}$/
    let cvcRegex: RegExp = /^[0-9]{3,4}$/
    let userNameRegex: RegExp = /(?!^\d+$)^.[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{4,30}$/
    this.validations_form = this.formBuilder.group({
      'numberCard': [null, [Validators.pattern(numCardRegex), Validators.required]],
      'cvc': [null, [Validators.pattern(cvcRegex), Validators.required]],
      'username': [null, [Validators.pattern(userNameRegex), Validators.required]],
      'dateExpiration': [null, [Validators.required]],
      'yearExpiration': [null, [Validators.required]],
      'selectItem': [null]
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
    selectItem: {
      empty: '',
    }
  };

  validation_messages = {
    'numberCard': [
      { type: 'pattern', message: 'Debe tener mas de 14 dígitos' },
      { type: 'required', message: 'Ingrese numero de tarjeta' }
    ],
    'cvc': [
      { type: 'pattern', message: 'Mínimo 4 dígitos' },
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
    
    if (this.loginFormValidator.numberCard.empty == ' ' || this.loginFormValidator.cvc.empty == ' '
      || this.loginFormValidator.username.empty == ' ' || this.loginFormValidator.dateExpiration.empty == ' '
      || this.loginFormValidator.yearExpiration.empty == ' ') {
      return false;
    } else return true;
  }
}
