import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectPage } from './connect.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectPage
  },
  {
    path: 'dialer-popover',
    loadChildren: () => import('./../dialer-popover/dialer-popover.module').then( m => m.DialerPopoverPageModule)
  },
  {
    path: 'dialer-add-popover',
    loadChildren: () => import('./../dialer-add-popover/dialer-add-popover.module').then( m => m.DialerAddPopoverPageModule)
  },
  {
    path: 'dialer-edit-popover',
    loadChildren: () => import('./../dialer-edit-popover/dialer-edit-popover.module').then( m => m.DialerEditPopoverPageModule)
  },
  {
    path: 'addcall-popover',
    loadChildren: () => import('./../addcall-popover/addcall-popover.module').then( m => m.AddcallPopoverPageModule)
  },
  {
    path: 'dialer-more-popover',
    loadChildren: () => import('./../dialer-more-popover/dialer-more-popover.module').then( m => m.DialerMorePopoverPageModule)
  },
  {
    path: 'video-call-popover',
    loadChildren: () => import('./../video-call-popover/video-call-popover.module').then( m => m.VideoCallPopoverPageModule)
  },
  {
    path: 'video-more-popover',
    loadChildren: () => import('./../video-more-popover/video-more-popover.module').then( m => m.VideoMorePopoverPageModule)
  },
  {
    path: 'video-invite-link-popover',
    loadChildren: () => import('./../video-invite-link-popover/video-invite-link-popover.module').then( m => m.VideoInviteLinkPopoverPageModule)
  },
  // {
  //   path: 'email-connect-alert-popover',
  //   loadChildren: () => import('./../email-connect-alert-popover/email-connect-alert-popover.module').then( m => m.EmailConnectAlertPopoverPageModule)
  // },
  // {
  //   path: 'phone-connect-alert-popover',
  //   loadChildren: () => import('./../phone-connect-alert-popover/phone-connect-alert-popover.module').then( m => m.PhoneConnectAlertPopoverPageModule)
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectPageRoutingModule {}
