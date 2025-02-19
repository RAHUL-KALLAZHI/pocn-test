import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailConnectAlertPopoverPage } from './email-connect-alert-popover.page';
// import { RouterModule} from '@angular/router';
// import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('EmailConnectAlertPopoverPage', () => {
  let component: EmailConnectAlertPopoverPage;
  let fixture: ComponentFixture<EmailConnectAlertPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailConnectAlertPopoverPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailConnectAlertPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
