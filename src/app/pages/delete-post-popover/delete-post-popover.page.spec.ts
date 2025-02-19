import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DeletePostPopoverPage } from './delete-post-popover.page';

describe('DeletePostPopoverPage', () => {
  let component: DeletePostPopoverPage;
  let fixture: ComponentFixture<DeletePostPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePostPopoverPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DeletePostPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
