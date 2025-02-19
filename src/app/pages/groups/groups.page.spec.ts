import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupsPage } from './groups.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ApolloTestingModule } from 'apollo-angular/testing';
describe('GroupsPage', () => {
  let component: GroupsPage;
  let fixture: ComponentFixture<GroupsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule,ApolloTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
