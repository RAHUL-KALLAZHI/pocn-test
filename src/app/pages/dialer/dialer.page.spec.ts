import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialerPage } from './dialer.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DialerPage', () => {
  let component: DialerPage;
  let fixture: ComponentFixture<DialerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialerPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DialerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
