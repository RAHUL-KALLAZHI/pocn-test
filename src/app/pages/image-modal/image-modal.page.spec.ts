import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from "@angular/router/testing";
import { ImageModalPage } from './image-modal.page';

describe('ImageModalPage', () => {
  let component: ImageModalPage;
  let fixture: ComponentFixture<ImageModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageModalPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
