import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditLicenseModalPage } from './edit-license-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EditLicenseModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditLicenseModalPageRoutingModule {}
