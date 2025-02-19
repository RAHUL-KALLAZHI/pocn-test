import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MorePopoverPageRoutingModule } from './more-popover-routing.module';

import { MorePopoverPage } from './more-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MorePopoverPageRoutingModule
  ],
  declarations: [MorePopoverPage]
})
export class MorePopoverPageModule {}
