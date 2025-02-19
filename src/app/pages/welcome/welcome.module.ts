import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { WelcomePageRoutingModule } from './welcome-routing.module';

import { WelcomePage } from './welcome.page';

@NgModule({
  imports: [
    IonicModule,
    WelcomePageRoutingModule
  ],
  declarations: [WelcomePage]
})
export class WelcomePageModule {}
