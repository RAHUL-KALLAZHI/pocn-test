import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserSharepagePageRoutingModule } from './user-sharepage-routing.module';

import { UserSharepagePage } from './user-sharepage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserSharepagePageRoutingModule
  ],
  declarations: [UserSharepagePage]
})
export class UserSharepagePageModule {}
