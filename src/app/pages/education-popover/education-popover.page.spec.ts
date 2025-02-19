import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { EducationPopoverPage } from './education-popover.page';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';
describe('EducationPopoverPage', () => {
  let component: EducationPopoverPage;
  let fixture: ComponentFixture<EducationPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationPopoverPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,FormsModule,ApolloTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EducationPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
