import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionPageRoutingModule } from './connection-routing.module';

import { ConnectionPage } from './connection.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ReplacePipe } from './replace.pipe';
import { RejectModalPage } from './../reject-modal/reject-modal.page';
import { CancelConnectionModalPage } from './../cancel-connection-modal/cancel-connection-modal.page';
import { DisconnectModalPage } from './../disconnect-modal/disconnect-modal.page';
import { MdmProfilePage } from './../mdm-profile/mdm-profile.page';
import { MdmProfileMessagePage } from './../mdm-profile-message/mdm-profile-message.page';
import { PostPageModule } from './../post/post.module';
import {GroupsPageModule} from '../groups/groups.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionPageRoutingModule,
    ComponentsModule,
    PostPageModule,
    GroupsPageModule
  ],
  declarations: [ConnectionPage,ReplacePipe,RejectModalPage,CancelConnectionModalPage,DisconnectModalPage,MdmProfilePage,MdmProfileMessagePage]
})
export class ConnectionPageModule {}
