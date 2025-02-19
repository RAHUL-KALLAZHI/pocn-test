import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { WorkhistoryPopoverPageRoutingModule } from './workhistory-popover-routing.module';
import { WorkhistoryPopoverPage } from './workhistory-popover.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkhistoryPopoverPageRoutingModule,
    ComponentsModule,
    IonicSelectableModule,
    RouterModule,RouterTestingModule
  ],
  declarations: []
})
export class WorkhistoryPopoverPageModule {}
