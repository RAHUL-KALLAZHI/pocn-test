import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterModule} from '@angular/router';

import { PreferencePage } from './preference.page';

describe('PreferencePage', () => {
  let component: PreferencePage;
  let fixture: ComponentFixture<PreferencePage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ PreferencePage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,ApolloTestingModule,RouterModule, FormsModule,]
    }).compileComponents();

    fixture = TestBed.createComponent(PreferencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  },5000);

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
