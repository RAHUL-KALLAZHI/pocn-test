import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancelConnectionModalPageRoutingModule } from './cancel-connection-modal-routing.module';

import { CancelConnectionModalPage } from './cancel-connection-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancelConnectionModalPageRoutingModule
  ],
  declarations: []
})
export class CancelConnectionModalPageModule {}
