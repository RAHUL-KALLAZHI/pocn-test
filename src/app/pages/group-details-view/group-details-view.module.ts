import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupDetailsViewPageRoutingModule } from './group-details-view-routing.module';

import { GroupDetailsViewPage } from './group-details-view.page';
import { InviteGroupPagePage } from "./../invite-group-page/invite-group-page.page";
import { GroupPostSharePopoverPage } from './../group-post-share-popover/group-post-share-popover.page';
import { DeleteGroupConfirmPopoverPage } from "./../delete-group-confirm-popover/delete-group-confirm-popover.page";
import { MdmGroupsProfilePage } from './../mdm-groups-profile/mdm-groups-profile.page';
import { GroupPublicProfilePage } from './../group-public-profile/group-public-profile.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupDetailsViewPageRoutingModule
  ],
  exports:[
    GroupPublicProfilePage
  ],
  declarations: [GroupDetailsViewPage,InviteGroupPagePage, DeleteGroupConfirmPopoverPage, GroupPostSharePopoverPage,MdmGroupsProfilePage,GroupPublicProfilePage],
  // exports:[GroupPublicProfilePage]
})
export class GroupDetailsViewPageModule {}
