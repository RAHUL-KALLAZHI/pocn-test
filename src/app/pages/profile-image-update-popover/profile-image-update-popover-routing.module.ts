import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileImageUpdatePopoverPage } from './profile-image-update-popover.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileImageUpdatePopoverPage
  },
  // {
  //   path: 'image-modal', 
  //   loadChildren: () => import('./../image-modal/image-modal.module').then( m => m.ImageModalPageModule)
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileImageUpdatePopoverPageRoutingModule {}
