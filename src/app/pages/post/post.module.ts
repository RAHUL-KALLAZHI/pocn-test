import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostPageRoutingModule } from './post-routing.module';

import { PostPage } from './post.page';
import { PostPopoverPage } from './../post-popover/post-popover.page';
import { QuotePopoverPage } from './../quote-popover/quote-popover.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PublicProfilePage } from './../public-profile/public-profile.page';
import {GroupsPageModule} from '../groups/groups.module';

// import {TimeAgoPipe} from 'time-ago-pipe';
import { TimeAgoPipeData } from './time-ago-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostPageRoutingModule,
    ComponentsModule,
    GroupsPageModule,
  ],
  exports:[
    PublicProfilePage,
    TimeAgoPipeData
  ],
  //
  declarations: [PostPage,TimeAgoPipeData,PostPopoverPage,QuotePopoverPage,PublicProfilePage]
})
export class PostPageModule {}
