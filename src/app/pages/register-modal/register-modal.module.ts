import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterModalPageRoutingModule } from './register-modal-routing.module';
import { RegisterModalPage } from './register-modal.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    ComponentsModule,
    HttpClientModule,
    RegisterModalPageRoutingModule
  ],
  declarations: []
})
export class RegisterModalPageModule {}
