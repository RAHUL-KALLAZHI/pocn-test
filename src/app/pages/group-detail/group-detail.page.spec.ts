import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupDetailPage } from './group-detail.page';
import { RouterTestingModule } from "@angular/router/testing";
// import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { async } from 'q';
describe('GroupDetailPage', () => {
  let component: GroupDetailPage;
  let fixture: ComponentFixture<GroupDetailPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ GroupDetailPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientTestingModule,HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupDetailPage);
    component = fixture.componentInstance;
    
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
