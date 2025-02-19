import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupPublicProfilePageRoutingModule } from './group-public-profile-routing.module';

import { GroupPublicProfilePage } from './group-public-profile.page';
// import { GroupsAdminModalPage } from '../groups-admin-modal/groups-admin-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupPublicProfilePageRoutingModule,
    // GroupsAdminModalPage
  ],
  declarations: [],
})
export class GroupPublicProfilePageModule {}
