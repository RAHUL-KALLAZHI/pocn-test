import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicProfilePage } from './public-profile.page';

const routes: Routes = [
  {
    path: '',
    component: PublicProfilePage
  },
  {
    path: 'mdm-profile',data: {preload: true, loadAfterSeconds: 5}, 
    loadChildren: () => import('./../mdm-profile/mdm-profile.module').then( m => m.MdmProfilePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicProfilePageRoutingModule {}
