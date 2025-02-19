import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategyService } from './services/custom-preloading-strategy.service';
const routes: Routes = [
  {
    path: 'tablinks',
    loadChildren: () => import('./pages/tablinks/tablinks.module').then(m => m.TablinksPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },

  {
    path: 'thankyou',
    loadChildren: () => import('./pages/thankyou/thankyou.module').then( m => m.ThankyouPageModule)
  },
  {
    path: 'dialer',
    loadChildren: () => import('./pages/dialer/dialer.module').then( m => m.DialerPageModule)
  },
  {
    path: 'dialer1',
    loadChildren: () => import('./pages/dialer1/dialer1.module').then( m => m.Dialer1PageModule)
  },
  {
    path: 'dialer2',
    loadChildren: () => import('./pages/dialer2/dialer2.module').then( m => m.Dialer2PageModule)
  },
  {
    path: 'connect',
    loadChildren: () => import('./pages/connect/connect.module').then( m => m.ConnectPageModule)
  },
  {
    path: 'post-detail-page',
    loadChildren: () => import('./pages/post-detailpage/post-detailpage.module').then( m => m.PostDetailpagePageModule)
  },
  {
    path: 'delete-popover',
    loadChildren: () => import('./pages/delete-popover/delete-popover.module').then( m => m.DeletePopoverPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/login-new/login-new.module').then( m => m.LoginNewPageModule)
  },
  {
    path: '',
    redirectTo: '/register', pathMatch: 'full'
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'overlay-popover',
    loadChildren: () => import('./pages/overlay-popover/overlay-popover.module').then( m => m.OverlayPopoverPageModule)
  },
  {
    path: 'preference',
    loadChildren: () => import('./pages/preference/preference.module').then( m => m.PreferencePageModule)
  },
  {
    path: 'user/:userId',
    loadChildren: () => import('./pages/public-profile/public-profile.module').then( m => m.PublicProfilePageModule)
  },
  {
    path: 'reset',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'reset-password-success',
    loadChildren: () => import('./pages/reset-password-success/reset-password-success.module').then( m => m.ResetPasswordSuccessPageModule)
  },
  {
    path: 'patient-connect-settings',
    loadChildren: () => import('./pages/patient-connect-settings/patient-connect-settings.module').then( m => m.PatientConnectSettingsPageModule)
  },

  {
    path: 'tablinks',
    loadChildren: () => import('./pages/tablinks/tablinks.module').then( m => m.TablinksPageModule)
  },
  {
    path: 'user-sharepage',
    loadChildren: () => import('./pages/user-sharepage/user-sharepage.module').then( m => m.UserSharepagePageModule)
  },
  {
    path: 'group-sharepage',
    loadChildren: () => import('./pages/group-sharepage/group-sharepage.module').then( m => m.GroupSharepagePageModule)
  },
  {
    path: 'connection-sharepage',
    loadChildren: () => import('./pages/connection-sharepage/connection-sharepage.module').then( m => m.ConnectionSharepagePageModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./pages/verify-signup/verify-signup.module').then( m => m.VerifySignupPageModule)
  },
  {
    path: 'group-detail/:groupId',
    loadChildren: () => import('./pages/group-detail/group-detail.module').then( m => m.GroupDetailPageModule)
  },
  {
    path: 'group-details-edit/:groupId',
    loadChildren: () => import('./pages/group-details-edit/group-details-edit.module').then( m => m.GroupDetailsEditPageModule)
  },

  {
    path: 'signup-success',
    loadChildren: () => import('./pages/signup-success/signup-success.module').then( m => m.SignupSuccessPageModule)
  },
  {
    path: 'group-details-view/:groupId',
    loadChildren: () => import('./pages/group-details-view/group-details-view.module').then( m => m.GroupDetailsViewPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./pages/contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  // {
  //   path: 'profile-image-update-popover',
  //   loadChildren: () => import('./pages/profile-image-update-popover/profile-image-update-popover.module').then( m => m.ProfileImageUpdatePopoverPageModule)
  // },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then( m => m.FaqPageModule)
  },
  {
    path: 'delete-settings',
    loadChildren: () => import('./pages/delete-settings/delete-settings.module').then( m => m.DeleteSettingsPageModule)
  },

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

