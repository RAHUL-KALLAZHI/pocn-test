import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InviteGroupPagePage } from './invite-group-page.page';

const routes: Routes = [
  {
    path: '',
    component: InviteGroupPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteGroupPagePageRoutingModule {}
