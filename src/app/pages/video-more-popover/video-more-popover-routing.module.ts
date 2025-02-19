import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoMorePopoverPage } from './video-more-popover.page';

const routes: Routes = [
  {
    path: '',
    component: VideoMorePopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoMorePopoverPageRoutingModule {}
