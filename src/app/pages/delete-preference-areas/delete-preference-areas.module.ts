import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeletePreferenceAreasPageRoutingModule } from './delete-preference-areas-routing.module';

import { DeletePreferenceAreasPage } from './delete-preference-areas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeletePreferenceAreasPageRoutingModule
  ],
  declarations: [DeletePreferenceAreasPage]
})
export class DeletePreferenceAreasPageModule {}
