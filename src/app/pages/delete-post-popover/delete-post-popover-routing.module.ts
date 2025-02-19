import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeletePostPopoverPage } from './delete-post-popover.page';

const routes: Routes = [
  {
    path: '',
    component: DeletePostPopoverPage
  },
  {
    path: 'delete-post-confirm-popover',
    loadChildren: () => import('./../delete-post-confirm-popover/delete-post-confirm-popover.module').then( m => m.DeletePostConfirmPopoverPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeletePostPopoverPageRoutingModule {}
