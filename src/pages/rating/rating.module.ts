import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatingPage } from './rating';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    StarRatingModule,
    RatingPage,
  ],
  imports: [
    IonicPageModule.forChild(RatingPage),
  ],
})
export class RatingPageModule {}
