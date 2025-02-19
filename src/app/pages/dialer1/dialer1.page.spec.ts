import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from "@angular/router/testing";
import { environment } from './../../../environments/environment.stage';
import { Dialer1Page } from './dialer1.page';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const twilioServerURL = environment.twilioServerURL;
const config: SocketIoConfig = { url: `${twilioServerURL}`, options: {} };
describe('Dialer1Page', () => {
  let component: Dialer1Page;
  let fixture: ComponentFixture<Dialer1Page>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ Dialer1Page ],
      imports: [IonicModule.forRoot(),HttpClientModule,RouterTestingModule, SocketIoModule.forRoot(config)]
    }).compileComponents();

    fixture = TestBed.createComponent(Dialer1Page);
    component = fixture.componentInstance;
    component.callerData='';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
