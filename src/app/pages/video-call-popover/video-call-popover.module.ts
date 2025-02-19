import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoCallPopoverPageRoutingModule } from './video-call-popover-routing.module';

import { VideoCallPopoverPage } from './video-call-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoCallPopoverPageRoutingModule
  ],
  declarations: []
})
export class VideoCallPopoverPageModule {}
