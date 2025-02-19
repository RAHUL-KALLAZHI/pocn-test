import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VideoInviteLinkPopoverPage } from './video-invite-link-popover.page';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('VideoInviteLinkPopoverPage', () => {
  let component: VideoInviteLinkPopoverPage;
  let fixture: ComponentFixture<VideoInviteLinkPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoInviteLinkPopoverPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoInviteLinkPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
