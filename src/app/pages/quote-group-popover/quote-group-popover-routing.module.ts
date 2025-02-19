import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuoteGroupPopoverPage } from './quote-group-popover.page';

const routes: Routes = [
  {
    path: '',
    component: QuoteGroupPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuoteGroupPopoverPageRoutingModule {}
