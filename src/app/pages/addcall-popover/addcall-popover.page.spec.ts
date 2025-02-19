import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddcallPopoverPage } from './addcall-popover.page';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('AddcallPopoverPage', () => {
  let component: AddcallPopoverPage;
  let fixture: ComponentFixture<AddcallPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcallPopoverPage ],
      imports: [IonicModule.forRoot(),HttpClientModule,RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AddcallPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
