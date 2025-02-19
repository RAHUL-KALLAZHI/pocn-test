import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupPostSharePopoverPageRoutingModule } from './group-post-share-popover-routing.module';

//import { GroupPostSharePopoverPage } from './group-post-share-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupPostSharePopoverPageRoutingModule
  ],
  declarations: []
})
export class GroupPostSharePopoverPageModule {}
