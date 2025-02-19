import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EducationEditPopoverPage } from './education-edit-popover.page';

const routes: Routes = [
  {
    path: '',
    component: EducationEditPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EducationEditPopoverPageRoutingModule {}
