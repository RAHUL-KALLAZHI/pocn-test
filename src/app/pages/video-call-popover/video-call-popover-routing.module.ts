import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoCallPopoverPage } from './video-call-popover.page';

const routes: Routes = [
  {
    path: '',
    component: VideoCallPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoCallPopoverPageRoutingModule {}
