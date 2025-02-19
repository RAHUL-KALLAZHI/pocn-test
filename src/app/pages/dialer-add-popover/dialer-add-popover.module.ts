import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DialerAddPopoverPageRoutingModule } from './dialer-add-popover-routing.module';

//import { DialerAddPopoverPage } from './dialer-add-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DialerAddPopoverPageRoutingModule
  ],
  declarations: []
})
export class DialerAddPopoverPageModule {}
