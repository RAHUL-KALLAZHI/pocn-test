import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreferencePage } from './preference.page';

const routes: Routes = [
  {
    path: '',
    component: PreferencePage
  },
  {
    path: 'delete-preference-areas',data: {preload: true, loadAfterSeconds: 5}, 
    loadChildren: () => import('./../delete-preference-areas/delete-preference-areas.module').then( m => m.DeletePreferenceAreasPageModule)
  },
  {
    path: 'preference-sms-modal',data: {preload: true, loadAfterSeconds: 5}, 
    loadChildren: () => import('./../preference-sms-modal/preference-sms-modal.module').then( m => m.PreferenceSmsModalPageModule)
  },
  {
    path: 'preference-alert-popover',
    loadChildren: () => import('./..//preference-alert-popover/preference-alert-popover.module').then( m => m.PreferenceAlertPopoverPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreferencePageRoutingModule {}
