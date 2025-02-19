import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreferenceSmsModalPage } from './preference-sms-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PreferenceSmsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreferenceSmsModalPageRoutingModule {}
