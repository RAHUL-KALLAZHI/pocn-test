import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialerPopoverPage } from './dialer-popover.page';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('DialerPopoverPage', () => {
  let component: DialerPopoverPage;
  let fixture: ComponentFixture<DialerPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialerPopoverPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DialerPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
