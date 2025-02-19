import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Dialer1PageRoutingModule } from './dialer1-routing.module';

import { Dialer1Page } from './dialer1.page';
import { AddcallPopoverPage } from '../addcall-popover/addcall-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Dialer1PageRoutingModule
  ],
  declarations: [AddcallPopoverPage]
})
export class Dialer1PageModule {}
