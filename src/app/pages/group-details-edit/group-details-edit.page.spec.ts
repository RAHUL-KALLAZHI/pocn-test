import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupDetailsEditPage } from './group-details-edit.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';
describe('GroupDetailsEditPage', () => {
  let component: GroupDetailsEditPage;
  let fixture: ComponentFixture<GroupDetailsEditPage>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDetailsEditPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule,FormsModule,ApolloTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupDetailsEditPage);
    component = fixture.componentInstance;
    // component.groupDetails = {speciality:''};

    fixture.detectChanges();
  });

  afterEach(async()=>{
    if(component.loading.isLoading){
      component.loading.dismiss();
    }});
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
