import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MdmGroupsProfilePageRoutingModule } from './mdm-groups-profile-routing.module';

//import { MdmGroupsProfilePage } from './mdm-groups-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MdmGroupsProfilePageRoutingModule
  ],
  declarations: []
})
export class MdmGroupsProfilePageModule {}
