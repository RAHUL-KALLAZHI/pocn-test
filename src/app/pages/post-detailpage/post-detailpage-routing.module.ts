import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostDetailpagePage } from './post-detailpage.page';

const routes: Routes = [
  {
    path: '',
    component: PostDetailpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostDetailpagePageRoutingModule {}
