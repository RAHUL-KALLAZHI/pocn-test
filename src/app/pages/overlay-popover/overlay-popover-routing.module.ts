import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverlayPopoverPage } from './overlay-popover.page';

const routes: Routes = [
  {
    path: '',
    component: OverlayPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverlayPopoverPageRoutingModule {}
