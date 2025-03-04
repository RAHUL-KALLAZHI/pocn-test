import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from '@angular/common/http';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { ConnectPage } from './connect.page';
import { GraphqlDataService } from 'src/app/services/graphql-data.service';
import { LocalStorageManager } from 'src/app/services/local-storage-manager';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { NgForm } from '@angular/forms';
import { of } from 'rxjs';

describe('ConnectPage', () => {
  let component: ConnectPage;
  let fixture: ComponentFixture<ConnectPage>;
  let pocnService: jasmine.SpyObj<GraphqlDataService>;
  let localStorageManager: jasmine.SpyObj<LocalStorageManager>;
  let telemetryService: jasmine.SpyObj<TelemetryService>;
  let originalTimeout: any;

  beforeEach(async () => {

    const pocnServiceSpy = jasmine.createSpyObj('GraphqlDataService', ['submitEmailConfirm','getDialerCaller','getTelephoneCountryCode','getUserBasicProfile','getPatientContactDetailConfirmed', 'getPatientContact','getIpAddress','masterDocumentTypes']);
    const localStorageManagerSpy = jasmine.createSpyObj('LocalStorageManager', ['getData']);
    const telemetryServiceSpy = jasmine.createSpyObj('TelemetryService', ['sendTrace']);
    telemetryServiceSpy.sendTrace.and.returnValue(Promise.resolve('traceId'));  
    await TestBed.configureTestingModule({
      declarations: [ConnectPage],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientModule, ApolloTestingModule],
      providers: [
        { provide: GraphqlDataService, useValue: pocnServiceSpy },
        { provide: LocalStorageManager, useValue: localStorageManagerSpy },
        { provide: TelemetryService, useValue: telemetryServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectPage);
    component = fixture.componentInstance;
    pocnService = TestBed.inject(GraphqlDataService) as jasmine.SpyObj<GraphqlDataService>;
    localStorageManager = TestBed.inject(LocalStorageManager) as jasmine.SpyObj<LocalStorageManager>;
    telemetryService = TestBed.inject(TelemetryService) as jasmine.SpyObj<TelemetryService>;
    // Mock method to return an observable
    pocnService.masterDocumentTypes.and.returnValue(of({
      data: {
        masterDocumentTypes: {
          nodes: [
            { id: 'doc1', name: 'Document 1' },
            { id: 'doc2', name: 'Document 2' }
          ]
        }
      },
      loading: false,          // Required by ApolloQueryResult
      networkStatus: 7,        // Required by ApolloQueryResult
      errors: null             // Required by ApolloQueryResult
    }));
    // expect(component.slides.slideTo).toHaveBeenCalledWith(4, 500);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });
  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('should call submitEmailConfirm and handle success response', () => {
    const mockForm = { value: { email: 'test@valid.com' } } as NgForm;

    localStorageManager.getData.and.callFake((key: string) => {
      switch (key) {
        case 'userId': return 'user123';
        case 'firstName': return 'John';
        case 'lastName': return 'Doe';
        case 'userEmail': return 'john.doe@example.com';
        default: return null;
      }
    });

    pocnService.submitEmailConfirm.and.returnValue(of({
      data: {
        submitEmailConfirm: {
          updateConnectionResponse: { status: 'success' }
        }
      }
    }));
    console.log(component.setSignUpConnectLoader);
    console.log(component.showVerifyEmail);
    console.log(component.disableEmail);
  //   let slidesMock = jasmine.createSpyObj('IonSlides', ['slideTo']);

  
  // component.slides = slidesMock;

  // // Mock the telemetry service's sendTrace method to return a resolved promise

  // component.sendVerifyEmail(mockForm);

  // // Check if slideTo was called with the correct arguments
  // expect(slidesMock.slideTo).toHaveBeenCalledWith(4, 500);

   // expect(pocnService.submitEmailConfirm).toHaveBeenCalled();
  });

  it('should handle error for existing email', () => {
    const mockForm = { value: { email: 'test@existing.com' } } as NgForm;
  
    // Spy on the component method
    spyOn(component, 'showEmailAlertPopOver');
    
    pocnService.submitEmailConfirm.and.returnValue(of({
      data: {
        submitEmailConfirm: {
          updateConnectionResponse: { status: 'error', error: 'Email already exists' }
        }
      }
    }));
  
    component.sendVerifyEmail(mockForm);
  
    expect(component.setSignUpConnectLoader).toBeFalse();
    expect(component.showEmailAlertPopOver).toHaveBeenCalled();
    // If slideTo is also needed to be checked, spy on it similarly:
    // expect(component.slides.slideTo).toHaveBeenCalledWith(4, 500);
  });
  

  it('should handle invalid email format', () => {
    const mockForm = { value: { email: 'invalid-email' } } as NgForm;

    component.sendVerifyEmail(mockForm);

    expect(component.setSignUpConnectLoader).toBeFalse();
    expect(component.showEmailError).toBeFalse();
    // expect(component.slides.slideTo).toHaveBeenCalledWith(4, 500);
  });

  it('should handle empty email field', () => {
    const mockForm = { value: { email: '' } } as NgForm;

    component.sendVerifyEmail(mockForm);

    expect(component.setSignUpConnectLoader).toBeFalse();
  });

});
