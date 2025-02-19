import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RejectModalPage } from './reject-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RejectModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RejectModalPageRoutingModule {}
