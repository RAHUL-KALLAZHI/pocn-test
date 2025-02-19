import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProfilePage } from './my-profile.page';

const routes: Routes = [
  {
    path: '',
    component: MyProfilePage
  },
  {
    path: 'education-popover', 
    loadChildren: () => import('../education-popover/education-popover.module').then( m => m.EducationPopoverPageModule)
  },
  {
    path: 'workhistory-popover', 
    loadChildren: () => import('../workhistory-popover/workhistory-popover.module').then( m => m.WorkhistoryPopoverPageModule)
  },
  {
    path: 'licenses-popover', 
    loadChildren: () => import('../licenses-popover/licenses-popover.module').then( m => m.LicensesPopoverPageModule)
  },
  {
    path: 'education-edit-popover', 
    loadChildren: () => import('./../education-edit-popover/education-edit-popover.module').then( m => m.EducationEditPopoverPageModule)
  },
  {
    path: 'workhistory-edit-popover', 
    loadChildren: () => import('./../workhistory-edit-popover/workhistory-edit-popover.module').then( m => m.WorkhistoryEditPopoverPageModule)
  },
  {
    path: 'edit-license-modal', 
    loadChildren: () => import('./../edit-license-modal/edit-license-modal.module').then( m => m.EditLicenseModalPageModule)
  },
  {
    path: 'image-modal', 
    loadChildren: () => import('./../image-modal/image-modal.module').then( m => m.ImageModalPageModule)
  },
  {
    path: 'delete-profile-resume-modal', 
    loadChildren: () => import('./../delete-profile-resume-modal/delete-profile-resume-modal.module').then( m => m.DeleteProfileResumeModalPageModule)
  },
  {
    path: 'more-popover', 
    loadChildren: () => import('./../more-popover/more-popover.module').then( m => m.MorePopoverPageModule)
  },
  {
    path: 'resume-popover', 
    loadChildren: () => import('./../resume-popover/resume-popover.module').then( m => m.ResumePopoverPageModule)
  },
  {
    path: 'ios-selected-images',
    loadChildren: () => import('./../ios-selected-images/ios-selected-images.module').then( m => m.IosSelectedImagesPageModule)
  },
  {
    path: 'profile-image-update-popover',
    loadChildren: () => import('./../profile-image-update-popover/profile-image-update-popover.module').then( m => m.ProfileImageUpdatePopoverPageModule)
  },
  {
    path: 'delete-profile-image', 
    loadChildren: () => import('./../delete-profile-image/delete-profile-image.module').then( m => m.DeleteProfileImagePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfilePageRoutingModule {}
