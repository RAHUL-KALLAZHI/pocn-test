import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EducationPopoverPage } from './education-popover.page';

const routes: Routes = [
  {
    path: '',
    component: EducationPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EducationPopoverPageRoutingModule {}
