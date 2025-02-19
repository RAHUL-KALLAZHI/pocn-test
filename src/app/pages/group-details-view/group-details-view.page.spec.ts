import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupDetailsViewPage } from './group-details-view.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { GraphqlDataService } from './../../services/graphql-data.service';
describe('GroupDetailsViewPage', () => {
  let component: GroupDetailsViewPage;
  let fixture: ComponentFixture<GroupDetailsViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDetailsViewPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule,ApolloTestingModule],
      providers:[GraphqlDataService]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupDetailsViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
