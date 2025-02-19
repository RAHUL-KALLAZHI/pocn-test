import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { EducationEditPopoverPage } from './education-edit-popover.page';
import { ApolloTestingModule } from 'apollo-angular/testing';



describe('EducationEditPopoverPage', () => {
  let component: EducationEditPopoverPage;
  let fixture: ComponentFixture<EducationEditPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationEditPopoverPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,FormsModule,ApolloTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EducationEditPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
