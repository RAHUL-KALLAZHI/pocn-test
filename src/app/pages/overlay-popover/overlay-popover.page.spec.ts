import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OverlayPopoverPage } from './overlay-popover.page';
import { RouterTestingModule } from '@angular/router/testing';
 import { RouterModule} from '@angular/router';
describe('OverlayPopoverPage', () => {
  let component: OverlayPopoverPage;
  let fixture: ComponentFixture<OverlayPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlayPopoverPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,RouterModule]
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
