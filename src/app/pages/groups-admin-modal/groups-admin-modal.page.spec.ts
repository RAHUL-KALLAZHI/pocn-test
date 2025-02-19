import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { GroupsAdminModalPage } from './groups-admin-modal.page';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
describe('GroupsAdminModalPage', () => {
  let component: GroupsAdminModalPage;
  let fixture: ComponentFixture<GroupsAdminModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsAdminModalPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,HttpClientModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupsAdminModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
