import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreferenceAlertPopoverPage } from './preference-alert-popover.page';

const routes: Routes = [
  {
    path: '',
    component: PreferenceAlertPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreferenceAlertPopoverPageRoutingModule {}
