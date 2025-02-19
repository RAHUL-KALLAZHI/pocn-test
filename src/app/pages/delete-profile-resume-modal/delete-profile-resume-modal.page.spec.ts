import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeleteProfileResumeModalPage } from './delete-profile-resume-modal.page';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
describe('DeleteProfileResumeModalPage', () => {
  let component: DeleteProfileResumeModalPage;
  let fixture: ComponentFixture<DeleteProfileResumeModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteProfileResumeModalPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteProfileResumeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
