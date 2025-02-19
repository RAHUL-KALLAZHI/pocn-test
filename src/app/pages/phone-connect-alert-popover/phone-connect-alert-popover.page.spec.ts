import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PhoneConnectAlertPopoverPage } from './phone-connect-alert-popover.page';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('PhoneConnectAlertPopoverPage', () => {
  let component: PhoneConnectAlertPopoverPage;
  let fixture: ComponentFixture<PhoneConnectAlertPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneConnectAlertPopoverPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneConnectAlertPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
