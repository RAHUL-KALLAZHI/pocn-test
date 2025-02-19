import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostPopoverPage } from './post-popover.page';

const routes: Routes = [
  {
    path: '',
    component: PostPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostPopoverPageRoutingModule {}
