import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddcallPopoverPageRoutingModule } from './addcall-popover-routing.module';

import { AddcallPopoverPage } from './addcall-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddcallPopoverPageRoutingModule
  ],
  declarations: []
})
export class AddcallPopoverPageModule {}
