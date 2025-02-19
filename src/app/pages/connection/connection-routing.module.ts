import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionPage } from './connection.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionPage
  },
  {
    path: 'reject-modal', 
    loadChildren: () => import('./../reject-modal/reject-modal.module').then( m => m.RejectModalPageModule)
  },
  {
    path: 'disconnect-modal', 
    loadChildren: () => import('./../disconnect-modal/disconnect-modal.module').then( m => m.DisconnectModalPageModule)
  },
  {
    path: 'cancel-connection-modal', 
    loadChildren: () => import('./../cancel-connection-modal/cancel-connection-modal.module').then( m => m.CancelConnectionModalPageModule)
  },
  {
    path: 'mdm-profile', 
    loadChildren: () => import('./../mdm-profile/mdm-profile.module').then( m => m.MdmProfilePageModule)
  },
  {
    path: 'mdm-profile-message', 
    loadChildren: () => import('./../mdm-profile-message/mdm-profile-message.module').then( m => m.MdmProfileMessagePageModule)
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionPageRoutingModule {}
