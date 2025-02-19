import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicProfilePageRoutingModule } from './public-profile-routing.module';

import { PublicProfilePage } from './public-profile.page';

// import { ComponentsModule } from 'src/app/components/components.module';
// import { IonSelectSearchLibModule } from 'ionic-select-search';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicProfilePageRoutingModule,
    // ComponentsModule,
    // IonSelectSearchLibModule,
  ],
  declarations: []
})
export class PublicProfilePageModule {}
