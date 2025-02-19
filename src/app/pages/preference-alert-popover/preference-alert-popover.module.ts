import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreferenceAlertPopoverPageRoutingModule } from './preference-alert-popover-routing.module';

import { PreferenceAlertPopoverPage } from './preference-alert-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreferenceAlertPopoverPageRoutingModule
  ],
  declarations: [PreferenceAlertPopoverPage]
})
export class PreferenceAlertPopoverPageModule {}
