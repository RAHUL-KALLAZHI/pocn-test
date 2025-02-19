import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleteProfileResumeModalPageRoutingModule } from './delete-profile-resume-modal-routing.module';

import { DeleteProfileResumeModalPage } from './delete-profile-resume-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeleteProfileResumeModalPageRoutingModule
  ],
  declarations: [DeleteProfileResumeModalPage]
})
export class DeleteProfileResumeModalPageModule {}
