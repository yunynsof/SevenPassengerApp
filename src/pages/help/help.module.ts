import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { help } from "../help/help";
import { ExpandablePage } from "../expandable/expandable";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: help
      }
    ])
  ],
  declarations: [help, ExpandablePage]
})
export class HelpPageModule {}
