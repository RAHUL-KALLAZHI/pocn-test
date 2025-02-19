import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IosSelectedImagesPage } from './ios-selected-images.page';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('IosSelectedImagesPage', () => {
  let component: IosSelectedImagesPage;
  let fixture: ComponentFixture<IosSelectedImagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IosSelectedImagesPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(IosSelectedImagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
