import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeleteGroupConfirmPopoverPage } from './delete-group-confirm-popover.page';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
describe('DeleteGroupConfirmPopoverPage', () => {
  let component: DeleteGroupConfirmPopoverPage;
  let fixture: ComponentFixture<DeleteGroupConfirmPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteGroupConfirmPopoverPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteGroupConfirmPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
