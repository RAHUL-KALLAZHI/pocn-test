import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupPostSharePopoverPage } from './group-post-share-popover.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { File as ionicFile } from '@ionic-native/file/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('GroupPostSharePopoverPage', () => {
  let component: GroupPostSharePopoverPage;
  let fixture: ComponentFixture<GroupPostSharePopoverPage>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupPostSharePopoverPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule, FormsModule,ReactiveFormsModule,],
      providers: [ MediaCapture, ionicFile  ]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupPostSharePopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
