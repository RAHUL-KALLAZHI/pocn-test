import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupPublicProfilePage } from './group-public-profile.page';

const routes: Routes = [
  {
    path: '',
    component: GroupPublicProfilePage
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupPublicProfilePageRoutingModule {}
