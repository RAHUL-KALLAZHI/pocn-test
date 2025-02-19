import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeletePreferenceAreasPage } from './delete-preference-areas.page';

const routes: Routes = [
  {
    path: '',
    component: DeletePreferenceAreasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeletePreferenceAreasPageRoutingModule {}
