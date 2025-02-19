import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserSharepagePage } from './user-sharepage.page';

const routes: Routes = [
  {
    path: '',
    component: UserSharepagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSharepagePageRoutingModule {}
