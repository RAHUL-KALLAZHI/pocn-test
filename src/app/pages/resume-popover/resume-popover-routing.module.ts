import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumePopoverPage } from './resume-popover.page';

const routes: Routes = [
  {
    path: '',
    component: ResumePopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResumePopoverPageRoutingModule {}
