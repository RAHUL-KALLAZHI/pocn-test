import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

import { ResetPasswordSuccessPage } from './reset-password-success.page';

describe('ResetPasswordSuccessPage', () => {
  let component: ResetPasswordSuccessPage;
  let fixture: ComponentFixture<ResetPasswordSuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordSuccessPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
