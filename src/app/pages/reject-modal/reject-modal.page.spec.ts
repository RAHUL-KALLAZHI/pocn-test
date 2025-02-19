import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule} from '@angular/router';
import { RouterTestingModule } from "@angular/router/testing";
import { RejectModalPage } from './reject-modal.page';
import { HttpClientModule } from '@angular/common/http';

describe('RejectModalPage', () => {
  let component: RejectModalPage;
  let fixture: ComponentFixture<RejectModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectModalPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RejectModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
