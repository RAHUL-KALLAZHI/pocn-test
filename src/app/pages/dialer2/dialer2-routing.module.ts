import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Dialer2Page } from './dialer2.page';

const routes: Routes = [
  {
    path: '',
    component: Dialer2Page
  },
  {
    path: 'video-more-popover', 
    loadChildren: () => import('../video-more-popover/video-more-popover.module').then( m => m.VideoMorePopoverPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Dialer2PageRoutingModule {}
