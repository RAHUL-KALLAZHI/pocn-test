import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginNewPage } from './login-new.page';

const routes: Routes = [
  {
    path: '',
    component: LoginNewPage
  },
  {
    path: 'register-modal',data: {preload: true, loadAfterSeconds: 5}, 
    loadChildren: () => import('./../register-modal/register-modal.module').then( m => m.RegisterModalPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginNewPageRoutingModule {}
