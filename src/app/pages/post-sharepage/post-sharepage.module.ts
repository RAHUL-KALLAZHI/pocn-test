import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostSharepagePageRoutingModule } from './post-sharepage-routing.module';

import { PostSharepagePage } from './post-sharepage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostSharepagePageRoutingModule
  ],
  declarations: [PostSharepagePage]
})
export class PostSharepagePageModule {}
