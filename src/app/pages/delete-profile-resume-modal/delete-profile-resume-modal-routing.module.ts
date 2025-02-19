import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteProfileResumeModalPage } from './delete-profile-resume-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteProfileResumeModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteProfileResumeModalPageRoutingModule {}
