import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteSettingsPage } from './delete-settings.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteSettingsPageRoutingModule {}
