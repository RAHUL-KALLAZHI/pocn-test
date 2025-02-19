import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GroupsPageRoutingModule } from './groups-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { GroupsPage } from './groups.page';
import { ComponentsModule } from 'src/app/components/components.module';
// import {InviteModalPage} from '../invite-modal/invite-modal.page';
import {Dialer2Page} from '../dialer2/dialer2.page';
// import { PostPageModule } from './../post/post.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupsPageRoutingModule,
    ComponentsModule,
    IonicSelectableModule,
    // PostPageModule
  ],
  exports:[Dialer2Page],
  declarations: [GroupsPage,Dialer2Page]
})
export class GroupsPageModule {}
