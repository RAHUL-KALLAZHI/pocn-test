import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from '@angular/common/http';
import { ContactUsPage } from './contact-us.page';
import { LocalStorageManager } from 'src/app/services/local-storage-manager';
import { TelemetryService } from 'src/app/services/telemetry.service';

class MockLocalStorageManager {
  getData(key: string) {
    return 'mockData'; // Return mock data for testing
  }
}

class MockTelemetryService {
  sendTrace(spanName: string, attributes: any, eventName: string, event: any) {
    return Promise.resolve('mockParentTrace'); // Mock the promise
  }
}

describe('ContactUsPage', () => {
  let component: ContactUsPage;
  let fixture: ComponentFixture<ContactUsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactUsPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        { provide: LocalStorageManager, useClass: MockLocalStorageManager },
        { provide: TelemetryService, useClass: MockTelemetryService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactUsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call telemetry.sendTrace on ngOnInit', async () => {
    const telemetrySpy = spyOn(component.telemetry, 'sendTrace').and.callThrough();
    component.ngOnInit();
    expect(telemetrySpy).toHaveBeenCalled();
  });

  it('should set telemetry.parentTrace after sendTrace resolves', async () => {
    await component.ngOnInit();
    expect(component.telemetry.parentTrace).toBe('mockParentTrace');
  });
});
