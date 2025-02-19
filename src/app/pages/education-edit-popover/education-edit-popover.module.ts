import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EducationEditPopoverPageRoutingModule } from './education-edit-popover-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';

import { EducationEditPopoverPage } from './education-edit-popover.page';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EducationEditPopoverPageRoutingModule,
    IonicSelectableModule,
    RouterModule,RouterTestingModule
  ],
  declarations: []
})
export class EducationEditPopoverPageModule {}
