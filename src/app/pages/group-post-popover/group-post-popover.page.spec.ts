import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupPostPopoverPage } from './group-post-popover.page';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
describe('GroupPostPopoverPage', () => {
  let component: GroupPostPopoverPage;
  let fixture: ComponentFixture<GroupPostPopoverPage>;

  beforeEach(async() => {
   await TestBed.configureTestingModule({
      declarations: [ GroupPostPopoverPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,HttpClientModule,FormsModule],
      providers: [ MediaCapture, File ]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupPostPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
