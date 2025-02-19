import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { DialerEditPopoverPage } from './dialer-edit-popover.page';
import { RouterTestingModule } from "@angular/router/testing";

describe('DialerEditPopoverPage', () => {
  let component: DialerEditPopoverPage;
  let fixture: ComponentFixture<DialerEditPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialerEditPopoverPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DialerEditPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
