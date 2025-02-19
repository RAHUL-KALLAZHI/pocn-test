import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostDetailpagePageRoutingModule } from './post-detailpage-routing.module';

import { PostDetailpagePage } from './post-detailpage.page';
// import {TimeAgoPipe} from 'time-ago-pipe';
import { TimeAgoPipeDetail } from './time-ago-pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostDetailpagePageRoutingModule
  ],
  //, TimeAgoPipe
  declarations: [PostDetailpagePage, TimeAgoPipeDetail]
})
export class PostDetailpagePageModule {}
