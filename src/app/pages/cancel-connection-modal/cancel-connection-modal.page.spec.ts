import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CancelConnectionModalPage } from './cancel-connection-modal.page';

describe('CancelConnectionModalPage', () => {
  let component: CancelConnectionModalPage;
  let fixture: ComponentFixture<CancelConnectionModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelConnectionModalPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelConnectionModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
