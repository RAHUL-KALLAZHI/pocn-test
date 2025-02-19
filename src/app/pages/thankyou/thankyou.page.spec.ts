import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ThankyouPage } from './thankyou.page';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from "@angular/router/testing";

describe('ThankyouPage', () => {
  let component: ThankyouPage;
  let fixture: ComponentFixture<ThankyouPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankyouPage ],
      imports: [IonicModule.forRoot(),
        RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ThankyouPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
