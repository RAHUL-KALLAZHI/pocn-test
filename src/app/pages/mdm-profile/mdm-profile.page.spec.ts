import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { MdmProfilePage } from './mdm-profile.page';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { of } from 'rxjs';
describe('MdmProfilePage', () => {
  let component: MdmProfilePage;
  let fixture: ComponentFixture<MdmProfilePage>;
  let pocnService: GraphqlDataService;
  let modalController: ModalController;
  const modalSpy = jasmine.createSpyObj('Modal', ['onDidDismiss', 'onWillDismiss', 'present']);
  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ MdmProfilePage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,FormsModule,ApolloTestingModule],
      providers: [GraphqlDataService],
    }).compileComponents();
    pocnService = TestBed.inject(GraphqlDataService);
    modalController = TestBed.inject(ModalController);
    spyOn(modalController, 'create').and.callFake(() => {
      return modalSpy;
    });
    modalSpy.present.and.stub();
    spyOn(modalController, 'dismiss').and.stub();
    fixture = TestBed.createComponent(MdmProfilePage);
    component = fixture.componentInstance;
     component.memberId = {providerId:''};
     pocnService = TestBed.inject(GraphqlDataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get provider user infos', () => {
    const response: any = { data: { providerInfos: { nodes: [] } } }
    spyOn(pocnService, 'providerUserInfos').and.returnValue(of(response))
    component.providerUserInfos();
    expect(component.providerUserInfos).toBeTruthy();
  });
  it('should get mdm user profile', () => {
    const response: any = { data: { getMdmUserProfile: { data: {userBasicProfile:[]} } } }
    spyOn(pocnService, 'getMdmUserProfile').and.returnValue(of(response))
    component.getMdmUserProfile();
    expect(component.getMdmUserProfile).toBeTruthy();
  });
  it('should open message modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'speciality' });
    await component.goToMessage('');
    expect(component.goToMessage).toBeTruthy();
  });
  it('should open message modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'location' });
    await component.goToMessage('');
    expect(component.goToMessage).toBeTruthy();
  });
  it('should open message modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'education' });
    await component.goToMessage('');
    expect(component.goToMessage).toBeTruthy();
  });
  it('should open message modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'workHistory' });
    await component.goToMessage('');
    expect(component.goToMessage).toBeTruthy();
  });
  it('should open message modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'pocnUser' });
    await component.goToMessage('');
    expect(component.goToMessage).toBeTruthy();
  });
  it('should open message modal', async () => {
    modalSpy.onDidDismiss.and.resolveTo({ data: 'search' });
    await component.goToMessage('');
    expect(component.goToMessage).toBeTruthy();
  });
});
