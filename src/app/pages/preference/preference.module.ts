import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreferencePageRoutingModule } from './preference-routing.module';

import { PreferencePage } from './preference.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonSelectSearchLibModule } from 'ionic-select-search';
import { PreferenceSmsModalPage } from './../preference-sms-modal/preference-sms-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreferencePageRoutingModule,
    IonicSelectableModule,
    ComponentsModule,
    IonSelectSearchLibModule
  ],
  declarations: [PreferencePage, PreferenceSmsModalPage]
})
export class PreferencePageModule {}
