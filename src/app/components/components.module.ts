import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { UtilsModule } from '../utils/utils.module';

import { HeadersComponent } from './headers/headers.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [

    HeadersComponent,
    
  ],
  imports: [CommonModule, IonicModule.forRoot(), UtilsModule,FormsModule],
  exports: [
    
    HeadersComponent
  ],
})
export class ComponentsModule {}
