import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyProfilePage } from './my-profile.page';
import { RouterTestingModule } from '@angular/router/testing';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { File as ionicFile } from '@ionic-native/file/ngx';
import { HttpClientModule } from '@angular/common/http';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { FormsModule } from '@angular/forms';

describe('MyProfilePage', () => {
  let component: MyProfilePage;
  let fixture: ComponentFixture<MyProfilePage>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProfilePage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule,ApolloTestingModule,FormsModule],
      providers:[IOSFilePicker,ionicFile]
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfilePage);
    component = fixture.componentInstance;
    // component.list = {muted:false};
    // component.licenseList = [{speciality: ''}]
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
