import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from '@angular/common/http';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { PostPopoverPage } from './post-popover.page';
import { File as ionicFile } from '@ionic-native/file/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('PostPopoverPage', () => {
  let component: PostPopoverPage;
  let fixture: ComponentFixture<PostPopoverPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ PostPopoverPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule, FormsModule,ReactiveFormsModule,],
      providers: [MediaCapture, ionicFile ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
