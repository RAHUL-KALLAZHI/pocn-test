import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteProfileImagePage } from './delete-profile-image.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteProfileImagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteProfileImagePageRoutingModule {}
