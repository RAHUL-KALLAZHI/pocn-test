import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostPage } from './post.page';

const routes: Routes = [
  {
    path: '',
    component: PostPage
  },
  {
    path: 'post-popover', 
    loadChildren: () => import('./../post-popover/post-popover.module').then( m => m.PostPopoverPageModule)
  },
  {
    path: 'post-share-popover', 
    loadChildren: () => import('./../post-share-popover/post-share-popover.module').then( m => m.PostSharePopoverPageModule)
  },
  {
    path: 'delete-post-popover', 
    loadChildren: () => import('./../delete-post-popover/delete-post-popover.module').then( m => m.DeletePostPopoverPageModule)
  }, 
  {
    path: 'quote-popover', 
    loadChildren: () => import('./../quote-popover/quote-popover.module').then( m => m.QuotePopoverPageModule)
  },
  {
    path: 'post-sharepage', 
    loadChildren: () => import('./../post-sharepage/post-sharepage.module').then( m => m.PostSharepagePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostPageRoutingModule {}
