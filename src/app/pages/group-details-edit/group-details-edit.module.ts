import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupDetailsEditPageRoutingModule } from './group-details-edit-routing.module';

import { GroupDetailsEditPage } from './group-details-edit.page';
import {GroupDetailsViewPageModule} from '../group-details-view/group-details-view.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { GroupsAdminModalPage } from '../groups-admin-modal/groups-admin-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupDetailsEditPageRoutingModule,
    GroupDetailsViewPageModule,
    IonicSelectableModule
  ],
  declarations: [GroupDetailsEditPage,GroupsAdminModalPage]
  
})
export class GroupDetailsEditPageModule {}
