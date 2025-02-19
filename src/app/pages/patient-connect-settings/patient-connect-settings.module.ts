import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientConnectSettingsPageRoutingModule } from './patient-connect-settings-routing.module';

import { PatientConnectSettingsPage } from './patient-connect-settings.page';
import { EmailConnectAlertPopoverPage } from "../email-connect-alert-popover/email-connect-alert-popover.page";
import { PhoneConnectAlertPopoverPage } from "../phone-connect-alert-popover/phone-connect-alert-popover.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientConnectSettingsPageRoutingModule
  ],
  declarations: [PatientConnectSettingsPage, EmailConnectAlertPopoverPage, PhoneConnectAlertPopoverPage]
})
export class PatientConnectSettingsPageModule {}
