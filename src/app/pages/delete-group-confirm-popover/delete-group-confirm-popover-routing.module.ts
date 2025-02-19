import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteGroupConfirmPopoverPage } from './delete-group-confirm-popover.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteGroupConfirmPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteGroupConfirmPopoverPageRoutingModule {}
