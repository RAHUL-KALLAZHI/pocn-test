import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConnectionSharepagePage } from './connection-sharepage.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ConnectionSharepagePage', () => {
  let component: ConnectionSharepagePage;
  let fixture: ComponentFixture<ConnectionSharepagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionSharepagePage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionSharepagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
