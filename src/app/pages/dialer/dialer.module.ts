import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DialerPageRoutingModule } from './dialer-routing.module';

import { DialerPage } from './dialer.page';
import { DialerPopoverPage } from './../dialer-popover/dialer-popover.page';
import { DialerEditPopoverPage } from '../dialer-edit-popover/dialer-edit-popover.page';
import { DialerAddPopoverPage } from '../dialer-add-popover/dialer-add-popover.page';
import { Dialer1Page } from '../dialer1/dialer1.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DialerPageRoutingModule
  ],
  declarations: [DialerPage, DialerPopoverPage,Dialer1Page, DialerEditPopoverPage, DialerAddPopoverPage]
})
export class DialerPageModule {}
