import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisconnectModalPage } from './disconnect-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DisconnectModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisconnectModalPageRoutingModule {}
