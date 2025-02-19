import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';

import { WelcomePage } from './welcome.page';
import { LoginNewPageModule } from '../login-new/login-new.module';

describe('WelcomePage', () => {
  let component: WelcomePage;
  let fixture: ComponentFixture<WelcomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomePage ],
      imports: [IonicModule.forRoot(),RouterTestingModule.withRoutes([
        // [5]
        {
          path: 'register',
          pathMatch: 'full',
          component: LoginNewPageModule,
        }
      ]),RouterModule]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
