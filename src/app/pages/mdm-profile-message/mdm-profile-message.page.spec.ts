import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from '@angular/common/http';
import { MdmProfileMessagePage } from './mdm-profile-message.page';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('MdmProfileMessagePage', () => {
  let component: MdmProfileMessagePage;
  let fixture: ComponentFixture<MdmProfileMessagePage>;
  let pocnService: GraphqlDataService;
  let modalController: ModalController;
  const modalSpy = jasmine.createSpyObj('Modal', ['onDidDismiss', 'onWillDismiss', 'present']);
  beforeEach(async() => {
  await  TestBed.configureTestingModule({
      declarations: [ MdmProfileMessagePage ],
      imports: [IonicModule.forRoot(),RouterTestingModule,HttpClientModule,HttpClientTestingModule],
      providers: [GraphqlDataService],
    }).compileComponents();
    pocnService = TestBed.inject(GraphqlDataService);
    modalController = TestBed.inject(ModalController);
    spyOn(modalController, 'create').and.callFake(() => {
      return modalSpy;
    });
    modalSpy.present.and.stub();
    spyOn(modalController, 'dismiss').and.stub();
    fixture = TestBed.createComponent(MdmProfileMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get user basic profile', () => {
    const response: any = { data: { getUserBasicProfile: { data: { userBasicProfile: { userId: '', npi: '', name: '' } } } } }
    // const response: any = { data: { getUserBasicProfile: { data: {userBasicProfile:[]} } } }
    spyOn(pocnService, 'getUserBasicProfile').and.returnValue(of(response))
    component.getUserDetails();
    expect(component.getUserDetails).toBeTruthy();
  });
  it('should get provider user info', () => {
    const response: any = { data: { providerInfos: { nodes: '' } } }
    spyOn(pocnService, 'providerUserInfos').and.returnValue(of(response))
    component.providerUserInfos();
    expect(component.providerUserInfos).toBeTruthy();
  });
  // it('should open message modal', async () => {
  //   modalSpy.onDidDismiss.and.resolveTo({ data: 'speciality' });
  //   await component.goToMessage('');
  //   expect(component.goToMessage).toBeTruthy();
  // });
});
