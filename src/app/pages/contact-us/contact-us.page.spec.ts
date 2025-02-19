import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule} from '@angular/router';

import { ContactUsPage } from './contact-us.page';
import { RouterTestingModule } from "@angular/router/testing";

describe('ContactUsPage', () => {
  let component: ContactUsPage;
  let fixture: ComponentFixture<ContactUsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactUsPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactUsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
