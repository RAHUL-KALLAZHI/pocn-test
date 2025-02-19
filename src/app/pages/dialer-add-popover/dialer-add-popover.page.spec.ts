import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialerAddPopoverPage } from './dialer-add-popover.page';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
describe('DialerAddPopoverPage', () => {
  let component: DialerAddPopoverPage;
  let fixture: ComponentFixture<DialerAddPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialerAddPopoverPage, ],
      imports: [IonicModule.forRoot(),HttpClientModule,RouterTestingModule,FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DialerAddPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
