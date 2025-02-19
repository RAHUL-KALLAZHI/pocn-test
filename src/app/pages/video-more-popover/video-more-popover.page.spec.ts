import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VideoMorePopoverPage } from './video-more-popover.page';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('VideoMorePopoverPage', () => {
  let component: VideoMorePopoverPage;
  let fixture: ComponentFixture<VideoMorePopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoMorePopoverPage ],
      imports: [IonicModule.forRoot(),HttpClientModule,RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoMorePopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
