import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WorkhistoryEditPopoverPageRoutingModule } from './workhistory-edit-popover-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { WorkhistoryEditPopoverPage } from './workhistory-edit-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkhistoryEditPopoverPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: []
})
export class WorkhistoryEditPopoverPageModule {}
