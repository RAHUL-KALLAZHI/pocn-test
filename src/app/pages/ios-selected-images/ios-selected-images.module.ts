import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IosSelectedImagesPageRoutingModule } from './ios-selected-images-routing.module';

import { IosSelectedImagesPage } from './ios-selected-images.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IosSelectedImagesPageRoutingModule
  ],
  declarations: [IosSelectedImagesPage]
})
export class IosSelectedImagesPageModule {}
