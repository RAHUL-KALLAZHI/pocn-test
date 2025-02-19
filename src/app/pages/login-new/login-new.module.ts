import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { HttpClientModule } from '@angular/common/http';
import { IonSelectSearchLibModule } from 'ionic-select-search';
import { LoginNewPageRoutingModule } from './login-new-routing.module';
import { LoginNewPage } from './login-new.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { RegisterModalPage } from './../register-modal/register-modal.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    IonSelectSearchLibModule,
    ComponentsModule,
    HttpClientModule,
    LoginNewPageRoutingModule,
    IonicSelectableModule,
  ],
  declarations: [LoginNewPage,RegisterModalPage]
})
export class LoginNewPageModule {}
