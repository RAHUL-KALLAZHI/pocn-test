import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupDetailPageRoutingModule } from './group-detail-routing.module';

import { GroupDetailPage } from './group-detail.page';
import { GroupPostPopoverPage } from './../group-post-popover/group-post-popover.page';
import {PostPageModule} from '../post/post.module';
import { QuoteGroupPopoverPage} from "../quote-group-popover/quote-group-popover.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupDetailPageRoutingModule,
    PostPageModule
  ],
  declarations: [GroupDetailPage, GroupPostPopoverPage,QuoteGroupPopoverPage ]
})
export class GroupDetailPageModule {}
