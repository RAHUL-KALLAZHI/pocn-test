import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from '@angular/common/http';

import { PostPage } from './post.page';

describe('PostPage', () => {
  let component: PostPage;
  let fixture: ComponentFixture<PostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
