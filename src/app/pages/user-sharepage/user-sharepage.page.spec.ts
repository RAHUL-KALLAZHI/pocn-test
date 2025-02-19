import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { UserSharepagePage } from './user-sharepage.page';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('UserSharepagePage', () => {
  let component: UserSharepagePage;
  let fixture: ComponentFixture<UserSharepagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSharepagePage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,HttpClientModule,ApolloTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UserSharepagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
