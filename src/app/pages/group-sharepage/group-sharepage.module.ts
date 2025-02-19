import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupSharepagePageRoutingModule } from './group-sharepage-routing.module';

import { GroupSharepagePage } from './group-sharepage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupSharepagePageRoutingModule
  ],
  declarations: [GroupSharepagePage]
})
export class GroupSharepagePageModule {}
