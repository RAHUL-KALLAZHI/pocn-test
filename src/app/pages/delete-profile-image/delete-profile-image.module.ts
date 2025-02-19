import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleteProfileImagePageRoutingModule } from './delete-profile-image-routing.module';

import { DeleteProfileImagePage } from './delete-profile-image.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeleteProfileImagePageRoutingModule
  ],
  declarations: [DeleteProfileImagePage]
})
export class DeleteProfileImagePageModule {}
