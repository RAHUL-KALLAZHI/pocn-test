import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupPostPopoverPageRoutingModule } from './group-post-popover-routing.module';

//import { GroupPostPopoverPage } from './group-post-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupPostPopoverPageRoutingModule
  ],
  //declarations: [GroupPostPopoverPage]
})
export class GroupPostPopoverPageModule {}
