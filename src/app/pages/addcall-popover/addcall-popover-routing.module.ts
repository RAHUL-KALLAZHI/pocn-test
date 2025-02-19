import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddcallPopoverPage } from './addcall-popover.page';

const routes: Routes = [
  {
    path: '',
    component: AddcallPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddcallPopoverPageRoutingModule {}
