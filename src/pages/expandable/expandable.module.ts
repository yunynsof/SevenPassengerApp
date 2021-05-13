import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpandablePage } from './expandable';

@NgModule({
  declarations: [
    ExpandablePage,
  ],
  imports: [
    IonicPageModule.forChild(ExpandablePage),
  ],
})
export class ExpandablePageModule {}
