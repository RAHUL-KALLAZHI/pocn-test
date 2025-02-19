import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreferenceSmsModalPageRoutingModule } from './preference-sms-modal-routing.module';

import { PreferenceSmsModalPage } from './preference-sms-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreferenceSmsModalPageRoutingModule
  ],
  declarations: []
})
export class PreferenceSmsModalPageModule {}
