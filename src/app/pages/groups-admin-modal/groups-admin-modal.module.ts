import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupsAdminModalPageRoutingModule } from './groups-admin-modal-routing.module';

// import { GroupsAdminModalPage } from './groups-admin-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupsAdminModalPageRoutingModule
  ],
  declarations: []
})
export class GroupsAdminModalPageModule {}
