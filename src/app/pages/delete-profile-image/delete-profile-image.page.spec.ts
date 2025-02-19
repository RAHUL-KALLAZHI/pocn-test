import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';
import { DeleteProfileImagePage } from './delete-profile-image.page';

describe('DeleteProfileImagePage', () => {
  let component: DeleteProfileImagePage;
  let fixture: ComponentFixture<DeleteProfileImagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteProfileImagePage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteProfileImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
