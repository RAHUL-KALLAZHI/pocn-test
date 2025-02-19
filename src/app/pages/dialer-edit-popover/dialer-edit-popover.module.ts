import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DialerEditPopoverPageRoutingModule } from './dialer-edit-popover-routing.module';

//import { DialerEditPopoverPage } from './dialer-edit-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DialerEditPopoverPageRoutingModule
  ],
  declarations: []
})
export class DialerEditPopoverPageModule {}
