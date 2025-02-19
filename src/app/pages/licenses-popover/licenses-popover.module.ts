import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LicensesPopoverPageRoutingModule } from './licenses-popover-routing.module';

import { LicensesPopoverPage } from './licenses-popover.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LicensesPopoverPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: []
})
export class LicensesPopoverPageModule {}
