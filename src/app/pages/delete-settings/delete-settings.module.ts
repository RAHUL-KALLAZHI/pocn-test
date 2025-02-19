import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleteSettingsPageRoutingModule } from './delete-settings-routing.module';

import { DeleteSettingsPage } from './delete-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeleteSettingsPageRoutingModule
  ],
  declarations: [DeleteSettingsPage]
})
export class DeleteSettingsPageModule {}
