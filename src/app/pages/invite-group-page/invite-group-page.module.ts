import { NgModule } from '@angular/core';
import {CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteGroupPagePageRoutingModule } from './invite-group-page-routing.module';
import {GroupDetailsViewPageModule} from '../group-details-view/group-details-view.module';
//import { InviteGroupPagePage } from './invite-group-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InviteGroupPagePageRoutingModule,
    GroupDetailsViewPageModule
  ],
  // declarations: [GroupDetailsViewPageModule]
})
export class InviteGroupPagePageModule {}
