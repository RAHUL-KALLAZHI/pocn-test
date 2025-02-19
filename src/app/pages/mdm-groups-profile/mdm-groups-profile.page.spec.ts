import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MdmGroupsProfilePage } from './mdm-groups-profile.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';


describe('MdmGroupsProfilePage', () => {
  let component: MdmGroupsProfilePage;
  let fixture: ComponentFixture<MdmGroupsProfilePage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ MdmGroupsProfilePage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule,FormsModule,ApolloTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MdmGroupsProfilePage);
    component = fixture.componentInstance;
    component.memberId = {providerId:''};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
