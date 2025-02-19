import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionSharepagePageRoutingModule } from './connection-sharepage-routing.module';

import { ConnectionSharepagePage } from './connection-sharepage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionSharepagePageRoutingModule
  ],
  declarations: [ConnectionSharepagePage]
})
export class ConnectionSharepagePageModule {}
