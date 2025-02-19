import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { GroupSharepagePage } from './group-sharepage.page';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('GroupSharepagePage', () => {
  let component: GroupSharepagePage;
  let fixture: ComponentFixture<GroupSharepagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSharepagePage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupSharepagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
