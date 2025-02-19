import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IosSelectedImagesPage } from './ios-selected-images.page';

const routes: Routes = [
  {
    path: '',
    component: IosSelectedImagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IosSelectedImagesPageRoutingModule {}
