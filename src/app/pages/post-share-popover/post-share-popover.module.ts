import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostSharePopoverPageRoutingModule } from './post-share-popover-routing.module';

import { PostSharePopoverPage } from './post-share-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostSharePopoverPageRoutingModule
  ],
  declarations: [PostSharePopoverPage]
})
export class PostSharePopoverPageModule {}
