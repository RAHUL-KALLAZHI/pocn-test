import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from "@angular/router/testing";
import { LoginNewPage } from './login-new.page';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

describe('LoginNewPage', () => {
  let component: LoginNewPage;
  let fixture: ComponentFixture<LoginNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginNewPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,HttpClientModule,FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
