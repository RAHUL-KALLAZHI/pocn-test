import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";

import { Dialer2Page } from './dialer2.page';
import { FormControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
describe('Dialer2Page', () => {
  let component: Dialer2Page;
  let fixture: ComponentFixture<Dialer2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dialer2Page ],
      imports: [IonicModule.forRoot(),HttpClientModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Dialer2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
