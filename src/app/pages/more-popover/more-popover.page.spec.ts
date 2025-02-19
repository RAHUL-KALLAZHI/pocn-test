import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';
import { MorePopoverPage } from './more-popover.page';

describe('MorePopoverPage', () => {
  let component: MorePopoverPage;
  let fixture: ComponentFixture<MorePopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MorePopoverPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MorePopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
