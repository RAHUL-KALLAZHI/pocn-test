import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OverlayPopoverPageRoutingModule } from './overlay-popover-routing.module';

import { OverlayPopoverPage } from './overlay-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OverlayPopoverPageRoutingModule
  ],
  declarations: [OverlayPopoverPage]
})
export class OverlayPopoverPageModule {}
