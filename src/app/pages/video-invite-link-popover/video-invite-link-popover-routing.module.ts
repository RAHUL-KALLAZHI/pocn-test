import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoInviteLinkPopoverPage } from './video-invite-link-popover.page';

const routes: Routes = [
  {
    path: '',
    component: VideoInviteLinkPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoInviteLinkPopoverPageRoutingModule {}
