import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeletePopoverPageRoutingModule } from './delete-popover-routing.module';

import { DeletePopoverPage } from './delete-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeletePopoverPageRoutingModule
  ],
  declarations: [DeletePopoverPage]
})
export class DeletePopoverPageModule {}
