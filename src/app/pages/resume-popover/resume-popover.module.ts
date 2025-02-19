import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResumePopoverPageRoutingModule } from './resume-popover-routing.module';

import { ResumePopoverPage } from './resume-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResumePopoverPageRoutingModule,
  ],
  declarations: [ResumePopoverPage],
  
})
export class ResumePopoverPageModule {}
