import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupSuccessPage } from './signup-success.page';
// import {RouterModule,ActivatedRoute} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('SignupSuccessPage', () => {
  let component: SignupSuccessPage;
  let fixture: ComponentFixture<SignupSuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupSuccessPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule],
      // providers:[ActivatedRoute]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
