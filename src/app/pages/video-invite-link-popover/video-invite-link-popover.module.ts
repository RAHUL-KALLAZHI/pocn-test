import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoInviteLinkPopoverPageRoutingModule } from './video-invite-link-popover-routing.module';

import { VideoInviteLinkPopoverPage } from './video-invite-link-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoInviteLinkPopoverPageRoutingModule
  ],
  declarations: []
})
export class VideoInviteLinkPopoverPageModule {}
