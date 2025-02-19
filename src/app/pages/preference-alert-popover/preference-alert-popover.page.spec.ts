import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreferenceAlertPopoverPage } from './preference-alert-popover.page';

describe('PreferenceAlertPopoverPage', () => {
  let component: PreferenceAlertPopoverPage;
  let fixture: ComponentFixture<PreferenceAlertPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceAlertPopoverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreferenceAlertPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
