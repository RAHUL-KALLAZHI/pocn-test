import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuoteGroupPopoverPageRoutingModule } from './quote-group-popover-routing.module';
import { MediaCapture } from '@ionic-native/media-capture';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuoteGroupPopoverPageRoutingModule
  ],
  declarations: [],
  providers: [ MediaCapture ]
})
export class QuoteGroupPopoverPageModule {}
