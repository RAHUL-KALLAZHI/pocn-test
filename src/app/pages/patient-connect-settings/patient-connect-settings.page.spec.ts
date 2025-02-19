import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PatientConnectSettingsPage } from './patient-connect-settings.page';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule} from '@angular/router';
// import { NgForm } from '@angular/forms'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { GraphqlDataService } from './../../services/graphql-data.service';
import { BrowserModule } from '@angular/platform-browser';
// import { ServService } from './serv.service';
describe('PatientConnectSettingsPage', () => {
  let component: PatientConnectSettingsPage;
  let fixture: ComponentFixture<PatientConnectSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientConnectSettingsPage ],
      imports: [IonicModule.forRoot(),HttpClientModule,HttpClientTestingModule,RouterTestingModule,RouterModule,
        FormsModule,ReactiveFormsModule,BrowserModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientConnectSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
