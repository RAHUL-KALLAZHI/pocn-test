import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostDetailpagePage } from './post-detailpage.page';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule} from '@angular/router';
import { TimeAgoPipeDetail } from './time-ago-pipe';
describe('PostDetailpagePage', () => {
  let component: PostDetailpagePage;
  let fixture: ComponentFixture<PostDetailpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostDetailpagePage,TimeAgoPipeDetail ],
      imports: [IonicModule.forRoot(),HttpClientModule,HttpClientTestingModule,RouterTestingModule,RouterModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
