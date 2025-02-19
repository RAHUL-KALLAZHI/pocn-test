import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EducationPopoverPageRoutingModule } from './education-popover-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';

import { EducationPopoverPage } from './education-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EducationPopoverPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: []
})
export class EducationPopoverPageModule {}
