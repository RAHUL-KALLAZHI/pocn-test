import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostSharePopoverPage } from './post-share-popover.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
describe('PostSharePopoverPage', () => {
  let component: PostSharePopoverPage;
  let fixture: ComponentFixture<PostSharePopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostSharePopoverPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PostSharePopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
