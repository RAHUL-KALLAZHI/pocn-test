import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MdmProfileMessagePage } from './mdm-profile-message.page';

const routes: Routes = [
  {
    path: '',
    component: MdmProfileMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MdmProfileMessagePageRoutingModule {}
