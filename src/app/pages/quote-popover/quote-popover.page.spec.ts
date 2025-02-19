import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuotePopoverPage } from './quote-popover.page';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
describe('QuotePopoverPage', () => {
  let component: QuotePopoverPage;
  let fixture: ComponentFixture<QuotePopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotePopoverPage ],
      imports: [IonicModule.forRoot(),HttpClientModule,FormsModule,ReactiveFormsModule, RouterTestingModule],
      providers: [ File, MediaCapture ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotePopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
