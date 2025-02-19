import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
//import {TimeAgoPipe} from 'time-ago-pipe';
import { MyProfilePageRoutingModule } from './my-profile-routing.module';

import { MyProfilePage } from './my-profile.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { EducationPopoverPage } from './../education-popover/education-popover.page';
import { LicensesPopoverPage } from './../licenses-popover/licenses-popover.page';
import { WorkhistoryPopoverPage } from './../workhistory-popover/workhistory-popover.page';
import { WorkhistoryEditPopoverPage } from './../workhistory-edit-popover/workhistory-edit-popover.page';
import { EditLicenseModalPage } from './../edit-license-modal/edit-license-modal.page';
import { EducationEditPopoverPage } from './../education-edit-popover/education-edit-popover.page';
import { ImageModalPageModule } from './../image-modal/image-modal.module';
import { IosSelectedImagesPageModule } from './../ios-selected-images/ios-selected-images.module';
import { GroupsPageModule} from '../groups/groups.module';
import {PostPageModule} from '../post/post.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProfilePageRoutingModule,
    ComponentsModule,
    IonicSelectableModule,
    ImageModalPageModule,
    GroupsPageModule,
    IosSelectedImagesPageModule,
    PostPageModule

  ],
  //declarations: [MyProfilePage, TimeAgoPipe]
  declarations: [MyProfilePage,EducationPopoverPage, LicensesPopoverPage, WorkhistoryPopoverPage, WorkhistoryEditPopoverPage, EditLicenseModalPage, EducationEditPopoverPage]
})
export class MyProfilePageModule {}
