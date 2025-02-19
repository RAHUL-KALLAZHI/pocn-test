import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule} from '@angular/router';
import { DisconnectModalPage } from './disconnect-modal.page';
import { HttpClientModule } from '@angular/common/http';

describe('DisconnectModalPage', () => {
  let component: DisconnectModalPage;
  let fixture: ComponentFixture<DisconnectModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisconnectModalPage ],
      imports: [IonicModule.forRoot(),RouterModule,RouterTestingModule,HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DisconnectModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
