import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditLicenseModalPageRoutingModule } from './edit-license-modal-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';

import { EditLicenseModalPage } from './edit-license-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditLicenseModalPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: []
})
export class EditLicenseModalPageModule {}
