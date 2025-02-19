import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DialerMorePopoverPageRoutingModule } from './dialer-more-popover-routing.module';

import { DialerMorePopoverPage } from './dialer-more-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DialerMorePopoverPageRoutingModule
  ],
  declarations: []
})
export class DialerMorePopoverPageModule {}
