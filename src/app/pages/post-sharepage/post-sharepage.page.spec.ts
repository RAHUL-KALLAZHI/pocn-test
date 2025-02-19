import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { PostSharepagePage } from './post-sharepage.page';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
describe('PostSharepagePage', () => {
  let component: PostSharepagePage;
  let fixture: ComponentFixture<PostSharepagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostSharepagePage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,HttpClientModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostSharepagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
