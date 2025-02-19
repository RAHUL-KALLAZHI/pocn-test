import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Dialer1Page } from './dialer1.page';

const routes: Routes = [
  {
    path: '',
    component: Dialer1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Dialer1PageRoutingModule {}
