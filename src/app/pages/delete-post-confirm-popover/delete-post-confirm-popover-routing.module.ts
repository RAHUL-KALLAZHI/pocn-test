import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeletePostConfirmPopoverPage } from './delete-post-confirm-popover.page';

const routes: Routes = [
  {
    path: '',
    component: DeletePostConfirmPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeletePostConfirmPopoverPageRoutingModule {}
