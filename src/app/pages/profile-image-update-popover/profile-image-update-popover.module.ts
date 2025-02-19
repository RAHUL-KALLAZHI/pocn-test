import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileImageUpdatePopoverPageRoutingModule } from './profile-image-update-popover-routing.module';

import { ProfileImageUpdatePopoverPage } from './profile-image-update-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileImageUpdatePopoverPageRoutingModule
  ],
  declarations: [ProfileImageUpdatePopoverPage]
})
export class ProfileImageUpdatePopoverPageModule {}
