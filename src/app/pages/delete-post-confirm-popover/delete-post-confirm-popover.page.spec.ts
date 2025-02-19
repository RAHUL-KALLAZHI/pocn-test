import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeletePostConfirmPopoverPage } from './delete-post-confirm-popover.page';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('DeletePostConfirmPopoverPage', () => {
  let component: DeletePostConfirmPopoverPage;
  let fixture: ComponentFixture<DeletePostConfirmPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePostConfirmPopoverPage ],
      imports: [IonicModule.forRoot(),HttpClientModule,RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DeletePostConfirmPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
