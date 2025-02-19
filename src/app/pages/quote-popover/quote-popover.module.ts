import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuotePopoverPageRoutingModule } from './quote-popover-routing.module';

import { QuotePopoverPage } from './quote-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuotePopoverPageRoutingModule
  ],
  declarations: []
})
export class QuotePopoverPageModule {}
