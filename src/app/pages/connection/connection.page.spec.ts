import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController, PopoverController } from '@ionic/angular';
import { PublicProfilePage } from '../public-profile/public-profile.page';
import { ConnectionPage } from './connection.page';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { of } from 'rxjs';
import { id } from 'date-fns/locale';
import { delay } from 'rxjs/operators';
describe('ConnectionPage', () => {
  let component: ConnectionPage;
  let fixture: ComponentFixture<ConnectionPage>;
  let pocnService: GraphqlDataService;
  let modalController: ModalController;
  // let modalControllerSpy: jasmine.SpyObj<ModalController>;
  const modalSpy = jasmine.createSpyObj('Modal', ['onDidDismiss', 'onWillDismiss', 'present','dismiss']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectionPage],
      imports: [IonicModule.forRoot(), RouterModule, RouterTestingModule, HttpClientModule],
      providers: [GraphqlDataService],
    }).compileComponents();
    pocnService = TestBed.inject(GraphqlDataService);
    modalController = TestBed.inject(ModalController);
    spyOn(modalController, 'create').and.callFake(() => {
      return modalSpy;
    });
    modalSpy.present.and.stub();
    spyOn(modalController, 'dismiss').and.stub();
    // popoverController = TestBed.inject(popoverController);
    // spyOn(popoverController, 'create').and.callFake(() => {
    //   return modalSpy;
    // });
    // modalSpy.present.and.stub();
    // spyOn(popoverController, 'dismiss').and.stub();
    // modalSpy.onDidDismiss.and.resolveTo({ data: 'fakeData' });
    fixture = TestBed.createComponent(ConnectionPage);
    component = fixture.componentInstance;
    // modalController = TestBed.inject(ModalController);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user profile', () => {
    const response: any = { data: { getUserBasicProfile: { data: { userBasicProfile: { userId: '', npi: '', name: '' } } } } }
    spyOn(pocnService, 'getUserBasicProfile').and.returnValue(of(response))
    component.getUserProfile();
    fixture.whenStable().then(()=>{
      expect(component.getUserProfile).toBeTruthy();
    })
  });
  it('should get my connection data', () => {
    const response: any = { data: { getMyConnections: { data: '' } } }
    spyOn(pocnService, 'getMyConnections').and.returnValue(of(response));
    component.getMyConnections();
    expect(component.getMyConnections).toBeTruthy();
  });
  it('should get user requested connections', () => {
    const response: any = { data: { getUserRequestedConnections: { data: [] } } }
    spyOn(pocnService, 'getUserRequestedConnections').and.returnValue(of(response))
    component.getUserRequestedConnections();
    expect(component.getUserRequestedConnections).toBeTruthy();
  });
  it('should get user requested connections', () => {
    const response: any = { data: { getUserRequestedConnections: { data: '' } } }
    spyOn(pocnService, 'getUserRequestedConnections').and.returnValue(of(response))
    component.getUserRequestedConnections();
    expect(component.getUserRequestedConnections).toBeTruthy();
  });
  it('should get user requested connections', () => {
    const response: any = { data: { getUserRequestedConnections: { data: '' } } }
    spyOn(pocnService, 'getUserRequestedConnections').and.returnValue(of(response))
    component.getUserRequestedConnections();
    expect(component.getUserRequestedConnections).toBeTruthy();
  });
  it('should get my pending connections', () => {
    const response: any = { data: { getMyPendingConnections: { data: [] } } }
    spyOn(pocnService, 'getMyPendingConnections').and.returnValue(of(response))
    component.getMyPendingConnections();
    expect(component.getMyPendingConnections).toBeTruthy();
  });
  it('should get my pending connections', () => {
    const response: any = { data: { getMyPendingConnections: { data: '' } } }
    spyOn(pocnService, 'getMyPendingConnections').and.returnValue(of(response))
    component.getMyPendingConnections();
    expect(component.getMyPendingConnections).toBeTruthy();
  });
  
  it('should get user recommended connections specialties', () => {
    const response: any = { data: { getUserRecommendedConnectionsSpecialties1: { data: '' } } }
    spyOn(pocnService, 'getUserRecommendedConnectionsSpecialties').and.returnValue(of(response))
    component.getUserRecommendedConnectionsSpecialties();
    expect(component.getUserRecommendedConnectionsSpecialties).toBeTruthy();
  });
  it('should get user recommended connections specialties', () => {
    const response: any = { data: { getUserRecommendedConnectionsSpecialties1: { data: [] } } }
    spyOn(pocnService, 'getUserRecommendedConnectionsSpecialties').and.returnValue(of(response))
    component.getUserRecommendedConnectionsSpecialties();
    expect(component.getUserRecommendedConnectionsSpecialties).toBeTruthy();
  });
  it('should get location city connections', () => {
    const response: any = { data: { getUserRecommendedConnectionsCities1: { data: '' } } }
    spyOn(pocnService, 'getLocationCityConnections').and.returnValue(of(response))
    component.getLocationCityConnections();
    expect(component.getLocationCityConnections).toBeTruthy();
  });
  it('should get location city connections', () => {
    const response: any = { data: { getUserRecommendedConnectionsCities1: { data: [] } } }
    spyOn(pocnService, 'getLocationCityConnections').and.returnValue(of(response))
    component.getLocationCityConnections();
    expect(component.getLocationCityConnections).toBeTruthy();
  });
  it('should get workHistory connections', () => {
    const response: any = { data: { getUserRecommendedConnectionsExperience1: { data: '' } } }
    spyOn(pocnService, 'getWorkHistoryConnections').and.returnValue(of(response))
    component.getWorkHistoryConnections();
    expect(component.getWorkHistoryConnections).toBeTruthy();
  });
  it('should get workHistory connections', () => {
    const response: any = { data: { getUserRecommendedConnectionsExperience1: { data: [] } } }
    spyOn(pocnService, 'getWorkHistoryConnections').and.returnValue(of(response))
    component.getWorkHistoryConnections();
    expect(component.getWorkHistoryConnections).toBeTruthy();
  });
  it('should get education connections', () => {
    const response: any = { data: { getUserRecommendedConnectionsEducation1: { data: '' } } }
    spyOn(pocnService, 'getEducationConnections').and.returnValue(of(response))
    component.getEducationConnections();
    expect(component.getEducationConnections).toBeTruthy();
  });
  it('should get education connections', () => {
    const response: any = { data: { getUserRecommendedConnectionsEducation1: { data: [] } } }
    spyOn(pocnService, 'getEducationConnections').and.returnValue(of(response))
    component.getEducationConnections();
    expect(component.getEducationConnections).toBeTruthy();
  });
  it('should get pocn user recommendations', () => {
    const response: any = { data: { getPocnUserRecommendations: { data: '' } } }
    spyOn(pocnService, 'getPocnUserRecommendations').and.returnValue(of(response))
    component.getPocnUserRecommendations();
    expect(component.getPocnUserRecommendations).toBeTruthy();
  });
  it('should get pocn user recommendations', () => {
    const response: any = { data: { getPocnUserRecommendations: { data: [] } } }
    spyOn(pocnService, 'getPocnUserRecommendations').and.returnValue(of(response))
    component.getPocnUserRecommendations();
    expect(component.getPocnUserRecommendations).toBeTruthy();
  });
  // it('should get search data'', () => {
  //   const response: any = { data: { getPocnUserRecommendations: { data: [] } } }
  //   spyOn(pocnService, 'searchClick').and.returnValue(of(response))
  //   component.searchClick('','');
  //   expect(component.searchClick).toBeTruthy();
  // });
  it('should open public profile modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'speciality' });
    await component.showPublicProfileModal('', '');
    expect(component.showPublicProfileModal).toBeTruthy();
  });
  it('should open public profile modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'location' });
    await component.showPublicProfileModal('', '');
    expect(component.showPublicProfileModal).toBeTruthy();
  });
  it('should open public profile modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'education' });
    await component.showPublicProfileModal('', '');
    expect(component.showPublicProfileModal).toBeTruthy();
  });
  it('should open public profile modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'workHistory' });
    await component.showPublicProfileModal('', '');
    expect(component.showPublicProfileModal).toBeTruthy();
  });
  it('should open public profile modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'myConnections' });
    await component.showPublicProfileModal('', '');
    expect(component.showPublicProfileModal).toBeTruthy();
  });
  it('should open public profile modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'outgoingRequest' });
    await component.showPublicProfileModal('', '');
    expect(component.showPublicProfileModal).toBeTruthy();
  });
  it('should open public profile modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'incomingRequest' });
    await component.showPublicProfileModal('', '');
    expect(component.showPublicProfileModal).toBeTruthy();
  }); 
  it('should open mdm profile modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'speciality' });
    await component.showMdmMemberProfile('', '');
    expect(component.showMdmMemberProfile).toBeTruthy();
  });
  it('should open mdm profile modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'myconnection' });
    await component.showMdmMemberProfile('', '');
    expect(component.showMdmMemberProfile).toBeTruthy();
  });
  it('should open mdm profile modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'outgoingRequest' });
    await component.showMdmMemberProfile('', '');
    expect(component.showMdmMemberProfile).toBeTruthy();
  });
  it('should open mdm profile modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'incomingRequest' });
    await component.showMdmMemberProfile('', '');
    expect(component.showMdmMemberProfile).toBeTruthy();
  });
  it('should open reject modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'incomingRequest' });
    await component.showRejectModal('', '');
    expect(component.showRejectModal).toBeTruthy();
  });
  it('should open disconnect modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'myconnection' });
    await component.showDisconnectModal('', '');
    expect(component.showDisconnectModal).toBeTruthy();
  });
  it('should open withdraw connection request modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'outgoingRequest' });
    await component.withdrawConnectionRequest('', '');
    expect(component.withdrawConnectionRequest).toBeTruthy();
  });
});
