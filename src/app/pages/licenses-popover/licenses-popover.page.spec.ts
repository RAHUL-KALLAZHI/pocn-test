import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LicensesPopoverPage } from './licenses-popover.page';
import { NgForm } from '@angular/forms'; 
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { RouterTestingModule } from "@angular/router/testing";

describe('LicensesPopoverPage', () => {
  let component: LicensesPopoverPage;
  let fixture: ComponentFixture<LicensesPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensesPopoverPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LicensesPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
