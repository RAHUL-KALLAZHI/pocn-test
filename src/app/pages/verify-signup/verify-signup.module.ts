import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifySignupPageRoutingModule } from './verify-signup-routing.module';

import { VerifySignupPage } from './verify-signup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifySignupPageRoutingModule
  ],
  declarations: [VerifySignupPage]
})
export class VerifySignupPageModule {}
