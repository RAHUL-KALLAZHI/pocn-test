import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MdmProfileMessagePageRoutingModule } from './mdm-profile-message-routing.module';

import { MdmProfileMessagePage } from './mdm-profile-message.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MdmProfileMessagePageRoutingModule
  ],
  declarations: []
})
export class MdmProfileMessagePageModule {}
