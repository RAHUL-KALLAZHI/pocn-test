import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeletePostPopoverPageRoutingModule } from './delete-post-popover-routing.module';

import { DeletePostPopoverPage } from './delete-post-popover.page';
import { DeletePostConfirmPopoverPage } from './../delete-post-confirm-popover/delete-post-confirm-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeletePostPopoverPageRoutingModule
  ],
  declarations: [DeletePostPopoverPage,DeletePostConfirmPopoverPage]
})
export class DeletePostPopoverPageModule {}
