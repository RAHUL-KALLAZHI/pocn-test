import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { VideoCallPopoverPage } from './video-call-popover.page';
import { FormsModule } from '@angular/forms';

describe('VideoCallPopoverPage', () => {
  let component: VideoCallPopoverPage;
  let fixture: ComponentFixture<VideoCallPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoCallPopoverPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,HttpClientModule,FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoCallPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
