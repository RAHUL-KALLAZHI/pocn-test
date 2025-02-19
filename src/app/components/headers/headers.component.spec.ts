import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';
import { HeadersComponent } from './headers.component';

describe('HeadersComponent', () => {
  let component: HeadersComponent;
  let fixture: ComponentFixture<HeadersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadersComponent ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,]
    }).compileComponents();

    fixture = TestBed.createComponent(HeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
