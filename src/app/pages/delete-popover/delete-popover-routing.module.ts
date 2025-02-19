import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeletePopoverPage } from './delete-popover.page';

const routes: Routes = [
  {
    path: '',
    component: DeletePopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeletePopoverPageRoutingModule {}
