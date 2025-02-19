import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router'
import { ProfileImageUpdatePopoverPage } from './profile-image-update-popover.page';

describe('ProfileImageUpdatePopoverPage', () => {
  let component: ProfileImageUpdatePopoverPage;
  let fixture: ComponentFixture<ProfileImageUpdatePopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileImageUpdatePopoverPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileImageUpdatePopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
