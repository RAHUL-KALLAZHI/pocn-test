import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';
import { RegisterModalPage } from './register-modal.page';
import { FormsModule } from '@angular/forms';

describe('RegisterModalPage', () => {
  let component: RegisterModalPage;
  let fixture: ComponentFixture<RegisterModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterModalPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
