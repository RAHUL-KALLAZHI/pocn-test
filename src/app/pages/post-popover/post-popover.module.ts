import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostPopoverPageRoutingModule } from './post-popover-routing.module';

import { PostPopoverPage } from './post-popover.page';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostPopoverPageRoutingModule,
    HttpClientModule
  ],
  declarations: []
})
export class PostPopoverPageModule {}
