import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PublicProfilePage } from './public-profile.page';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
describe('PublicProfilePage', () => {
  let component: PublicProfilePage;
  let fixture: ComponentFixture<PublicProfilePage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ PublicProfilePage ],
      imports: [IonicModule.forRoot(),RouterTestingModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule ]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicProfilePage);
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
