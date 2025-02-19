import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PreferenceSmsModalPage } from './preference-sms-modal.page';
import { FormsModule } from '@angular/forms';

describe('PreferenceSmsModalPage', () => {
  let component: PreferenceSmsModalPage;
  let fixture: ComponentFixture<PreferenceSmsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceSmsModalPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,HttpClientModule,FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PreferenceSmsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
