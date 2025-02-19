import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotePopoverPage } from './quote-popover.page';

const routes: Routes = [
  {
    path: '',
    component: QuotePopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotePopoverPageRoutingModule {}
