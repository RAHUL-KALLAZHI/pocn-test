import { VideoMorePopoverPage } from './../video-more-popover/video-more-popover.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Dialer2PageRoutingModule } from './dialer2-routing.module';
import { HttpClientModule } from '@angular/common/http';
//import { Dialer2Page } from './dialer2.page';
import { VideoCallPopoverPage } from '../video-call-popover/video-call-popover.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Dialer2PageRoutingModule,
    HttpClientModule
  ],
  declarations: [VideoCallPopoverPage, VideoMorePopoverPage]
})
export class Dialer2PageModule {}
