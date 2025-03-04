import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupportPage } from './supportpage-page';

const routes: Routes = [
  {
    path: '',
    component: SupportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportPagePageRoutingModule {}
