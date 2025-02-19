import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QuoteGroupPopoverPage } from './quote-group-popover.page';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('QuoteGroupPopoverPage', () => {
  let component: QuoteGroupPopoverPage;
  let fixture: ComponentFixture<QuoteGroupPopoverPage>;
  let mediaCapture:MediaCapture;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteGroupPopoverPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule, FormsModule],
      providers: [ File, MediaCapture ]
    }).compileComponents();
    mediaCapture = TestBed.inject(MediaCapture);
    // spyOn(mediaCapture,'captureVideo').and.stub();
     spyOn(mediaCapture,'captureVideo').and.resolveTo([]);
    fixture = TestBed.createComponent(QuoteGroupPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
