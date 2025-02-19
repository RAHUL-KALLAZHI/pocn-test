import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostSharePopoverPage } from './post-share-popover.page';

const routes: Routes = [
  {
    path: '',
    component: PostSharePopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostSharePopoverPageRoutingModule {}
