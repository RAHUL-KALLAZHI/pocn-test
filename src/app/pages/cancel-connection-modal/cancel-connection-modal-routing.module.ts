import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CancelConnectionModalPage } from './cancel-connection-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CancelConnectionModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancelConnectionModalPageRoutingModule {}
