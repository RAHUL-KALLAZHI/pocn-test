import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialerMorePopoverPage } from './dialer-more-popover.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DialerMorePopoverPage', () => {
  let component: DialerMorePopoverPage;
  let fixture: ComponentFixture<DialerMorePopoverPage>;
 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialerMorePopoverPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule,HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DialerMorePopoverPage);
    component = fixture.componentInstance;
    component.list = {muted:false};
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
