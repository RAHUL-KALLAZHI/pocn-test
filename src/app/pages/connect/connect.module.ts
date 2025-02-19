import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectPageRoutingModule } from './connect-routing.module';

import { ConnectPage } from './connect.page';
import { Angular2SignaturepadModule } from 'angular2-signaturepad';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonSelectSearchLibModule } from 'ionic-select-search';
import { DialerMorePopoverPage } from '../dialer-more-popover/dialer-more-popover.page';
//import { VideoCallPopoverPage } from '../video-call-popover/video-call-popover.page';
import { VideoInviteLinkPopoverPage } from '../video-invite-link-popover/video-invite-link-popover.page';
// import { EmailConnectAlertPopoverPage } from "../email-connect-alert-popover/email-connect-alert-popover.page";
// import { PhoneConnectAlertPopoverPage } from "../phone-connect-alert-popover/phone-connect-alert-popover.page";
import {PatientConnectSettingsPageModule} from '../patient-connect-settings/patient-connect-settings.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectPageRoutingModule,
    Angular2SignaturepadModule,
    IonicSelectableModule,
    PatientConnectSettingsPageModule
  ],
  declarations: [ConnectPage,DialerMorePopoverPage,VideoInviteLinkPopoverPage]
})
export class ConnectPageModule {}
