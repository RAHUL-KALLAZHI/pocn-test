import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablinksPage } from './tablinks.page';

const routes: Routes = [
  {
    path: '',
    component: TablinksPage,
    children: [
      {
        path: 'post',
        loadChildren: () => import('../post/post.module').then( m => m.PostPageModule)
      },
      {
        path: 'connection',
        loadChildren: () => import('../connection/connection.module').then(m => m.ConnectionPageModule)
      },
      {
        path: 'groups',
        loadChildren: () => import('../groups/groups.module').then( m => m.GroupsPageModule)
      },
      {
        path: 'my-profile',
        loadChildren: () => import('../my-profile/my-profile.module').then( m => m.MyProfilePageModule)
      },
      {
        path: 'connection/:tab',
        loadChildren: () => import('../connection/connection.module').then(m => m.ConnectionPageModule)
      },
      {
        path: 'groups/:tab',
        loadChildren: () => import('../groups/groups.module').then( m => m.GroupsPageModule)
      },
      {
        path: 'groups/group-detail/:groupId',
        loadChildren: () => import('../group-detail/group-detail.module').then( m => m.GroupDetailPageModule)
      },
      {
        path: 'groups/group-details-view/:groupId',
        loadChildren: () => import('../group-details-view/group-details-view.module').then( m => m.GroupDetailsViewPageModule)
      },
      {
        path: 'groups/group-details-edit/:groupId',
        loadChildren: () => import('../group-details-edit/group-details-edit.module').then( m => m.GroupDetailsEditPageModule)
      },
       {
        path: 'post/post-detail-page',
        loadChildren: () => import('../post-detailpage/post-detailpage.module').then( m => m.PostDetailpagePageModule)
      },
      {
        path: '',
        redirectTo: '/post',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/my-profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablinksPageRoutingModule { }
