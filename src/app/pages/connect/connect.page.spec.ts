import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from '@angular/common/http';

import { ConnectPage } from './connect.page';
import { ApolloTestingModule } from 'apollo-angular/testing';


describe('ConnectPage', () => {
  let component: ConnectPage;
  let fixture: ComponentFixture<ConnectPage>;

  beforeEach(async() => {
   await TestBed.configureTestingModule({
      declarations: [ ConnectPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule, HttpClientModule,ApolloTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
