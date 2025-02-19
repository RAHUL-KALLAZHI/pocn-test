import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifySignupPage } from './verify-signup.page';

const routes: Routes = [
  {
    path: '',
    component: VerifySignupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifySignupPageRoutingModule {}
