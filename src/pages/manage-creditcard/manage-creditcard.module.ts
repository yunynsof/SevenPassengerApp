import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageCreditcardPage } from './manage-creditcard';

@NgModule({
  declarations: [
    ManageCreditcardPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageCreditcardPage),
  ],
})
export class ManageCreditcardPageModule {}
