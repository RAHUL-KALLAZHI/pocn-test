import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionSharepagePage } from './connection-sharepage.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionSharepagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionSharepagePageRoutingModule {}
