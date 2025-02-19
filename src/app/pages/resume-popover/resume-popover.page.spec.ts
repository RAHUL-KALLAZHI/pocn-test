import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';

import { ResumePopoverPage } from './resume-popover.page';

describe('ResumePopoverPage', () => {
  let component: ResumePopoverPage;
  let fixture: ComponentFixture<ResumePopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumePopoverPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ResumePopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
