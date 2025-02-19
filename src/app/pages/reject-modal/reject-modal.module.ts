import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RejectModalPageRoutingModule } from './reject-modal-routing.module';

import { RejectModalPage } from './reject-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RejectModalPageRoutingModule
  ],
  declarations: []
})
export class RejectModalPageModule {}
