import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeletePopoverPage } from './delete-popover.page';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('DeletePopoverPage', () => {
  let component: DeletePopoverPage;
  let fixture: ComponentFixture<DeletePopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePopoverPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DeletePopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
