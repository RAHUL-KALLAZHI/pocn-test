import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DialerPopoverPageRoutingModule } from './dialer-popover-routing.module';

//import { DialerPopoverPage } from './dialer-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DialerPopoverPageRoutingModule
  ],
  declarations: []
})
export class DialerPopoverPageModule {}
