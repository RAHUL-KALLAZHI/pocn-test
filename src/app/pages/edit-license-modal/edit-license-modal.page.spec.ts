import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditLicenseModalPage } from './edit-license-modal.page';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('EditLicenseModalPage', () => {
  let component: EditLicenseModalPage;
  let fixture: ComponentFixture<EditLicenseModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLicenseModalPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EditLicenseModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
