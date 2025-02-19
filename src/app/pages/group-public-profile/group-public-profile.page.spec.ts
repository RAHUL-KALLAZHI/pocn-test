import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupPublicProfilePage } from './group-public-profile.page';
import { RouterTestingModule } from '@angular/router/testing';
//  import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('GroupPublicProfilePage', () => {
  let component: GroupPublicProfilePage;
  let fixture: ComponentFixture<GroupPublicProfilePage>;
  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ GroupPublicProfilePage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientTestingModule,FormsModule],
      // providers:[HttpClient,GraphqlDataService]
    }).compileComponents();
  //  http = TestBed.inject(Htt=
  //  graphqlDataService = TestBed.inject(GraphqlDataService);
  //  spyOn(graphqlDataService,'').and.returnValue(error({loading:false}));
    fixture = TestBed.createComponent(GroupPublicProfilePage);
    component = fixture.componentInstance;
    component.loading.isLoading = false;
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
