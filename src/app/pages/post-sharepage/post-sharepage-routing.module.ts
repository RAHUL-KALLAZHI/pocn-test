import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostSharepagePage } from './post-sharepage.page';

const routes: Routes = [
  {
    path: '',
    component: PostSharepagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostSharepagePageRoutingModule {}
