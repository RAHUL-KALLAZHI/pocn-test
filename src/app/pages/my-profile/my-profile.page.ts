import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  HostListener,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ModalController, IonInput } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CookieManager } from './../../services/cookie-manager';
import { LocalStorageManager } from './../../services/local-storage-manager';
import {
  Source,
  EmploymentNode,
  UserProfileImage,
  UserResume,
  AddressNode,
  ContactNode,
  DegreeNode,
  SpecialityNode,
  StateNode,
  educationNode,
} from './../../services/type';
import { Observable, Subscriber, ReplaySubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { TokenManager } from './../../services/token-manager';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { DOCUMENT, JsonPipe } from '@angular/common';
import { MorePopoverPage } from '../more-popover/more-popover.page';
import { ResumePopoverPage } from '../resume-popover/resume-popover.page';
import { PopoverController, Platform } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { createOverlay } from '@ionic/core/dist/types/utils/overlays';
import { EducationPopoverPage } from '../education-popover/education-popover.page';
import { WorkhistoryPopoverPage } from '../workhistory-popover/workhistory-popover.page';
import { LicensesPopoverPage } from '../licenses-popover/licenses-popover.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem } from '@capacitor/filesystem';
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from 'capacitor-native-settings';
import { environment } from 'src/environments/environment';
import { IosSelectedImagesPage } from '../ios-selected-images/ios-selected-images.page';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { File as ionicFile } from '@ionic-native/file/ngx';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { CreateRoomResponse } from './../../services/type';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { ProfileImageUpdatePopoverPage } from '../profile-image-update-popover/profile-image-update-popover.page';
import jsSHA from 'jssha';
import { PublicProfilePage } from '../public-profile/public-profile.page';
import { PostSharePopoverPage } from '../post-share-popover/post-share-popover.page';
import { IonContent } from '@ionic/angular';
import { DeletePostPopoverPage } from '../delete-post-popover/delete-post-popover.page';
import { QuotePopoverPage } from '../quote-popover/quote-popover.page';
import { LikePostResponse } from './../../services/type';
import { IonInfiniteScroll } from '@ionic/angular';
import { Location } from '@angular/common';
import { PhotoPlugin } from 'src/plugins/imagePicker';
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  @ViewChild('firstNameInput') firstNameInput;
  @ViewChild('lastNameInput') lastNameInput;
  @ViewChild('tagLineInput') tagLineInput;
  @ViewChild('specialtyInput') specialtyInput;
  @ViewChild('credentialsInput') credentialsInput;
  @ViewChild('stateInput') stateInput;
  @ViewChild('cityInput') cityInput;
  @ViewChild('zipInput') zipInput;
  @ViewChild('telephoneInput') telephoneInput;
  @ViewChild('mobileInput') mobileInput;
  @ViewChild('faxInput') faxInput;
  @ViewChild('twitterInput') twitterInput;
  @ViewChild('linkedInInput') linkedInInput;
  @ViewChild('websiteInput') websiteInput;
  @ViewChild('facebookInput') facebookInput;
  @ViewChild('profileImageUpdate') myInputVariable: ElementRef;
  @ViewChild('pickResumeInput') pickResumeInput: ElementRef;
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('resumeRenameInput') resumeRenameInput: IonInput;

  iosSlectedImageArray: any;
  fileExtesion: string;
  errorClass: string = '';
  previousPracticeValue: string = '';
  previousWebsiteValue: string = '';
  previousLinkedinValue: string = '';
  previousTwitterValue: string = '';
  previousFacebookValue: string = '';
  previousTaglineValue: string = '';
  previousCredentialValue: string = '';
  previousCityValue: string = '';
  previousStateValue: string = '';
  appPlatform: string = Capacitor.getPlatform();
  isMobile: boolean = Capacitor.getPlatform() != 'web';
  public userRoomData: string;
  userIp = '';
  deviceType: string = '';
  geolocationPosition: string = '';
  userAgent: string;
  pickedImage: any = null;
  userDetailsQuery;
  likeCount;
  connectionCount;
  postCount;
  pointCount;
  followersCount;
  showPattern: boolean = true;
  showPhoneDiv: boolean = false;
  showMobileDiv: boolean = false;
  licenseAddBtn: boolean = false;
  tabType = 'about';
  showResume = false;
  showRenameResume;
  showRename: boolean = false;
  hasDuplicate: boolean = false;
  showDuplicate: boolean = true;
  userResume: UserResume[] = [];
  profileImg = 'assets/images-pocn/group-default-thumbnail.svg';
  imageUrl = environment.postImgUrl;
  defaultImg = 'assets/images-pocn/group-default-thumbnail.svg';
  showEditLinkedIn: boolean = false;
  showEditFacebook: boolean = false;
  showEditTwitter: boolean = false;
  showEditWebsite: boolean = false;
  showAddTwitter: boolean = false;
  showAddFacebook: boolean = false;
  showAddLinkedIn: boolean = false;
  showAddWebsite: boolean = false;
  showLinkedInInput: boolean = false;
  showFacebookInput: boolean = false;
  showTwitterInput: boolean = false;
  showWebsiteInput: boolean = false;
  showSaveLinkedin: boolean = false;
  showSaveTwitter: boolean = false;
  showSaveFacebook: boolean = false;
  contactSuccess: boolean = true;
  showSaveWebsite: boolean = false;
  initialApiCall: boolean = false;
  specialityType: SpecialityNode[] = [];
  stateList: StateNode[] = [];
  userProfileImages: UserProfileImage[] = [];
  resumeStatus = false;
  successStatus = false;
  successStatusResume = false;
  noSpacesRegex = /.*\S.*/;
  resumeFileType = [
    'application/msword',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'application/doc',
    'application/docx',
  ];
  fileErrorStatus = false;
  uploadedFileType = '';
  uploadedFile = {};
  errorMsg = '';
  webisteData;
  twitterData;
  fbData;
  linkedinData;
  myResumeName = '';
  bannerImg = 'url(assets/images-pocn/sky-bg.jpg)';
  downloadBase64Resume = '';
  successMsg = '';
  public hcpVerified: number;
  public phoneLinked: number;
  public verificationType: string;
  backButtonSubscription;
  profileDetails;
  showFacebookMsg: boolean = false;
  showTwitterMsg: boolean = false;
  showLinkedinMsg: boolean = false;
  showWebsiteMsg: boolean = false;
  searchWebsite: boolean = false;
  contactProfileDetails;
  showEditTagLine: boolean = false;
  showAddTagLine: boolean = false;
  showTagLineInput: boolean = false;
  showSaveTagLine: boolean = false;
  fileLoader = false;
  imgErrorStatus = false;
  profileImgUrl: string;
  showNoBadgesMsg: boolean = false;

  showEditFirstname: boolean = false;
  showAddFirstname: boolean = false;
  showFirstnameInput: boolean = false;
  showSaveFirstname: boolean = false;
  showFirstname: boolean = false;
  showLastname: boolean = false;
  showZip: boolean = false;
  showFax: boolean = false;
  showCredentials: boolean = false;

  showConNotification: boolean = false;
  showNotification: boolean = false;
  notificationName;
  countData;
  conNotificationData;
  requestorCount;
  requestorNames;
  notificationData;
  showMobile: boolean = false;
  showPhn: boolean = false;
  showEditLastName: boolean = false;
  showAddLastName: boolean = false;
  showLastNameInput: boolean = false;
  showSaveLastName: boolean = false;

  showEditDegreeGroupCode: boolean = false;
  showAddDegreeGroupCode: boolean = false;
  showDegreeGroupCodeInput: boolean = false;
  showSaveDegreeGroupCode: boolean = false;

  showEditCredentials: boolean = false;
  showAddCredentials: boolean = false;
  showCredentialsInput: boolean = false;
  showSaveCredentials: boolean = false;

  showEditSpeciality: boolean = false;
  showAddSpeciality: boolean = false;
  showSpecialityInput: boolean = false;
  showSaveSpeciality: boolean = false;

  showEditState: boolean = false;
  showAddState: boolean = false;
  showStateInput: boolean = false;
  showSaveState: boolean = false;

  showEditCity: boolean = false;
  showAddCity: boolean = false;
  showCityInput: boolean = false;
  showSaveCity: boolean = false;

  showEditZip: boolean = false;
  showAddZip: boolean = false;
  showZipInput: boolean = false;
  showSaveZip: boolean = false;

  showEditFax: boolean = false;
  showAddFax: boolean = false;
  showFaxInput: boolean = false;
  showSaveFax: boolean = false;
  showPhnNumber: boolean = false;
  showMobileNumber: boolean = false;
  showEditTelephone: boolean = false;
  showAddTelephone: boolean = false;
  showTelephoneInput: boolean = false;
  showSaveTelephone: boolean = false;

  showEditMobile: boolean = false;
  showAddMobile: boolean = false;
  showMobileInput: boolean = false;
  showSaveMobile: boolean = false;

  showSignIn = false;
  public token;
  public person;
  basicProfileData;
  addressInfoData;
  userAddressProfile;
  public userbasicDetails: any = [];
  public addressInfoDetails;
  public contactInfoDetails;
  public hcoList;

  selectOptions;
  selectWrapper;
  firstNameData;
  lastNameData;
  taglineData;
  stateData;
  cityData;
  credentialsData;
  zipData;
  faxNumberData;
  phoneNumberData;
  mobileNumberData;
  professionalProfileDetails = [];
  userLogsList = [];
  professionalProfileDetailsValueCheck;
  licenseDetails = [];
  yearDiff: any;
  stateListTemp: any;
  specialityListTemp: any;

  public educationList: any[] = [
    {
      school: '',
      hcoDegree: '',
      field: '',
      periodFfrom: '',
      periodTo: '',
      description: '',
    },
  ];

  public userContactNumberDetails: any[] = [
    {
      mobilePhoneNumber: '',
      phoneNumber: '',
      faxNumber: '',
    },
  ];

  public userAddressDetails: any[] = [
    {
      addressZip: '',
      addressState: '',
      addressCity: '',
    },
  ];

  public workHistoryList: any[] = [
    {
      description: '',
      endYear: '',
      experienceTitle: '',
      hcoCountry: '',
      hcoDmcid: '',
      hcoLocality: '',
      hcoName: '',
      hcoPostcode: '',
      hcoStateProvince: '',
      npi: '',
      providerId: '',
      startYear: '',
      userId: '',
      tags: '',
      employmentType: '',
      startMonth: '',
      endMonth: '',
      healthOrganization: '',
    },
  ];
  public contactInfoList: any[] = [
    {
      phoneNumber: '',
      faxNumber: '',
      mobilePhoneNumber: '',
      //mobileCountryCode: '',
      email: '',
      contactType: '',
      isPrimary: '',
    },
  ];
  state;
  public profileList: any[] = [
    {
      jobTitle: '',
      hcoName: '',
      city: '',
      state: '',
      fromMonth: '',
      fromYear: '',
      bio: '',
      employmentType: '',
      description: '',
    },
  ];
  public licenseList: any[] = [
    {
      certificateName: '',
      speciality: '',
      institutionName: '',
    },
  ];
  slideOpts = {
    slidesPerView: 1,
    spaceBetween: 1,
    static: true,
    centeredSlides: true,
  };
  public addressList: any[] = [
    {
      addressLine1: '',
      addressLine2: '',
      addressCity: '',
      addressState: '',
      addressZip: '',
      timeZone: '',
      addressType: '',
      isPrimary: '',
    },
  ];
  hideSearchData: boolean = false;
  postUserView = [];
  imageType: boolean[] = [];
  videoType: boolean[] = [];
  audioType: boolean[] = [];
  userId;
  showSharePostSuccess: boolean = true;
  showDeletePostSuccess: boolean = true;
  modalDataPost;
  showPostSuccess: boolean = true;
  likeStatus: any;
  groupViewLink: string;
  descriptionLink;
  groupLinkdata;
  groupLinkContentdata;
  viewLink: boolean = true;
  classColor;
  public refetchPost;
  searchLoaderStatus: boolean = true;
  hideLinkPreview: boolean = false;
  loadPostView: boolean = false;
  descDataLink;
  groupData;
public connectStatus;
public countryCodeArray;
  constructor(
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private dataService: DataService,
    private modalController: ModalController,
    private router: Router,
    private _pocnService: GraphqlDataService,
    private _pocnCookieManager: CookieManager,
    private _pocnLocalStorageManager: LocalStorageManager,
    private _sanitizer: DomSanitizer,
    private tokenManager: TokenManager,
    public alertController: AlertController,
    public loading: LoadingService,
    public telemetry: TelemetryService,
    private platform: Platform,
    private filePicker: IOSFilePicker,
    private file: ionicFile,
    private deviceService: DeviceDetectorService,
    private location: Location,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) document: Document
  ) {
    this.token = this._pocnLocalStorageManager.getData('pocnApiAccessToken');
    this.userId = this._pocnLocalStorageManager.getData('userId');
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.refetchPost = this.location.getState();
        if (this.refetchPost.postMsg == 'pageDetail') {
          this.getUserStat();
        }
        if (this.refetchPost.msg == 'settingsRoute') {
          this.getUserProfile();
        }
      }
    });
  }

  ngOnInit() {
    if (this.token == '' || this.token == null) {
      this.router.navigate(['/']);
    }
    const spanName = 'page-view' + this.router.url.replace(/\//g, '-');
    let attributes = {
      userId: this._pocnLocalStorageManager.getData('userId'),
      firstName: this._pocnLocalStorageManager.getData('firstName'),
      lastName: this._pocnLocalStorageManager.getData('lastName'),
      userEmail: this._pocnLocalStorageManager.getData('userEmail'),
      url: this.router.url,
    };
    const eventName = 'page view';
    const event = {
      userEmail: this._pocnLocalStorageManager.getData('userEmail'),
      status: 'success',
      message: 'viewed page',
    };
    this.telemetry
      .sendTrace(spanName, attributes, eventName, event)
      .then((result: string) => {
        this.telemetry.parentTrace = result;
      });
    this.getStates();
    this.getSpecialityType();
    this.loadPostView = true;
    this.getUserStat();
    this.getHcoList();
    this.loadIp();
    this.getUserPost();
    this.patientConnectStatusCalls();
    this.getTelephoneCountryCode();
    this.getMyConnectionsRequestNotification();
    if (this.isMobileDevice == true) {
      this.deviceType = 'Mobile';
    } else if (this.isTablet == true) {
      this.deviceType = 'Tablet';
    } else if (this.isDesktop == true) {
      this.deviceType = 'Desktop';
    } else {
      this.deviceType = 'Unknown';
    }
  }
  onIonInfinite(ev) {
    setTimeout(() => {
      ev.target.complete();
      //// if(this.searchTextData === ''){
      if (this.postUserView.length > 0) {
        this.getUserPost();
      }
      //}
      // else{
      //   this.searchPosts(this.searchTextData) ;
      // }
    }, 500);
  }
  ionViewDidEnter() {
    //if(!this.initialApiCall){
    this.loading.present();
    //if(this.tabType == "posts"){
    this.postUserView = [];
    this.getUserPost();
    // }
    this.token = this._pocnLocalStorageManager.getData('pocnApiAccessToken');

    this.getUserProfile();
    //this.getUserBasicProfile();\
    this.loadPostView = true;

    this.getUserStat();
    this.getUserState();
    this.providerUserImageInfos();
    this.backButtonSubscription =
      this.platform.backButton.subscribeWithPriority(10, () => {});
    //   this.initialApiCall = true;
    // }
  }
  // ionViewWillEnter (){
  //   this.postUserView = [];
  //   this.getUserPost();
  // }
  get device(): any {
    return this.deviceService.getDeviceInfo();
  }

  get isMobileDevice(): boolean {
    return this.deviceService.isMobile();
  }

  get isTablet(): boolean {
    return this.deviceService.isTablet();
  }

  get isDesktop(): boolean {
    return this.deviceService.isDesktop();
  }
  // getLinkPreview(link: string): Observable<any> {
  //   const api = 'https://api.linkpreview.net/?key=385b793a618b1f864e5d6bcdab8d0cf0&q=' + link;
  //   console.log(api)
  //   return this.httpClient.get(api);
  // }
  // fetching country code
  getTelephoneCountryCode(){
    this._pocnService.getTelephoneCountryCode(this.token)?.subscribe(({ data }) => {
      let connectCountryCode;
      connectCountryCode = JSON.parse(JSON.stringify(data));
      this.countryCodeArray = connectCountryCode.getTelephoneCountryCode.data.countryCode;
    })
  }
  providerUserImageInfos() {
    this._pocnService
      .providerUserImageInfos(this._pocnLocalStorageManager.getData('userId'))
      .subscribe((res: any) => {
        if (res.data.providerUserImageInfos.nodes.length > 0) {
          this._pocnLocalStorageManager.saveData(
            'imgExtension',
            res.data.providerUserImageInfos.nodes[0].fileExtension
          );
          this.profileImgUrl =
            environment.postProfileImgUrl +
            this._pocnLocalStorageManager.getData('userId') +
            '.' +
            this._pocnLocalStorageManager.getData('imgExtension') +
            '?lastmod=' +
            Math.random();
        } else {
          this.profileImgUrl = 'assets/images-pocn/group-default-thumbnail.svg';
        }
      });
  }
  getHcoList = () => {
    this._pocnService.getHcoList().subscribe(({ data }) => {
      this.hcoList = data.hcoMasters.nodes;
    });
  };
  getStates = () => {
    this._pocnService.getStates().subscribe(({ data }) => {
      this.stateList = data.states.nodes;
    });
  };
  async showPopover(event, type, indexVal) {
    const popover = await this.popoverCtrl.create({
      component: MorePopoverPage,
      cssClass: 'edit-modal',
      event,
      componentProps: {
        key1: type,
        key2: indexVal,
        key3: this.hcoList,
        key4: this.specialityType,
        onClick: (type) => {
          if (
            type == 'contact' ||
            type == 'education' ||
            type == 'workhistory' ||
            type == 'professional' ||
            type == 'license'
          ) {
            this.getUserProfile();
            popover.dismiss();
          } else if (
            type == 'contact-cancel' ||
            type == 'education-cancel' ||
            type == 'workhistory-cancel' ||
            type == 'professional-cancel' ||
            type == 'license-cancel'
          ) {
            popover.dismiss();
          }
        },
      },
    });
    await popover.present();
  }
  // async showResumePopover(event,type, indexVal) {
  //   const popover = await this.popoverCtrl.create({
  //     component: ResumePopoverPage,
  //     cssClass: 'edit-modal',
  //     event,
  //     componentProps: {key1: type, key2: indexVal,
  //       onClick: (type) => {
  //        if(type=='resume'){
  //         this.getUserProfile();
  //         popover.dismiss();
  //        }
  //        else if(type=='resume-cancel' ){
  //         popover.dismiss();
  //        }
  //       },
  //     },
  //   });
  //   await popover.present();
  // }
  pickProfileImage(e: any) {}
  async showResumePopover(event, type, indexVal) {
    const popover = await this.popoverCtrl.create({
      component: ResumePopoverPage,
      cssClass: 'edit-modal',
      event,
      componentProps: {
        key1: type,
        key2: indexVal,
        person: this.person.userBasicProfile,
      },
    });

    popover.onDidDismiss().then((result) => {
      if (result['data'] != undefined) {
        this.showRenameResume = result['data'];
        if (this.showRenameResume == 'resumeRename') {
          this.showRename = true;
          this.addText();
        }
        if (this.showRenameResume == 'resumeFailedFormat') {
          this.fileErrorStatus = true;
          this.errorMsg =
            'Upload failed. Please select a valid file format (doc, docx, pdf and txt).';
          setTimeout(
            function () {
              this.fileErrorStatus = false;
            }.bind(this),
            3000
          );
        }
        if (this.showRenameResume == 'resumeFailedSize') {
          this.fileErrorStatus = true;
          this.errorMsg =
            'Upload failed. Maximum file upload size is restricted to 2 MB.';
          setTimeout(
            function () {
              this.fileErrorStatus = false;
            }.bind(this),
            3000
          );
        }
        if (this.showRenameResume == 'resume') {
          this.successStatus = true;
          this.successStatusResume = true;
          this.successMsg = 'Resume replaced successfully';
          setTimeout(
            function () {
              this.successStatus = false;
            }.bind(this),
            3000
          );
        }
        this.getUserProfile();
        // this.viewType = result['data'];
      }
    });
    return await popover.present();
  }
  addSocialTwitter() {
    this.userbasicDetails.twitter = this.userbasicDetails.twitter
      ? this.userbasicDetails.twitter
      : 'https://twitter.com/';
    // this.person.userBasicProfile.twitter = this.userbasicDetails.twitter ? this.userbasicDetails.twitter : 'https://twitter.com/';
    this.showTwitterInput = true;
    this.showAddTwitter = false;
    this.showSaveTwitter = true;
    this.showEditTwitter = false;
    this.twitterInput.setFocus();
  }
  addSocialLinkedIn() {
    this.userbasicDetails.linkedin = this.userbasicDetails.linkedin
      ? this.userbasicDetails.linkedin
      : 'https://www.linkedin.com/in/';
    this.showLinkedInInput = true;
    this.showAddLinkedIn = false;
    this.showSaveLinkedin = true;
    this.showEditLinkedIn = false;
    this.linkedInInput.setFocus();
  }
  addSocialFacebook() {
    this.userbasicDetails.facebook = this.userbasicDetails.facebook
      ? this.userbasicDetails.facebook
      : 'https://www.facebook.com/';
    this.showFacebookInput = true;
    this.showAddFacebook = false;
    this.showSaveFacebook = true;
    this.showEditFacebook = false;
    this.facebookInput.setFocus();
  }
  addSocialWebsite() {
    this.showWebsiteInput = true;
    this.showAddWebsite = false;
    this.showSaveWebsite = true;
    this.showEditWebsite = false;
    this.websiteInput.setFocus();
  }

  addContactFirstname() {
    this.showFirstnameInput = true;
    this.showAddFirstname = false;
    this.showSaveFirstname = true;
    this.showEditFirstname = false;
    this.firstNameInput.setFocus();
  }
  addContactCredentials() {
    this.showCredentialsInput = true;
    this.showAddCredentials = false;
    this.showSaveCredentials = true;
    this.showEditCredentials = false;
    this.credentialsInput.setFocus();
  }
  addContactTagLine() {
    this.showTagLineInput = true;
    this.showAddTagLine = false;
    this.showSaveTagLine = true;
    this.showEditTagLine = false;
    // this.tagLineInput.setFocus();
    this.tagLineInput.nativeElement.focus();
  }
  addContactLastName() {
    this.showLastNameInput = true;
    this.showAddLastName = false;
    this.showSaveLastName = true;
    this.showEditLastName = false;
    this.lastNameInput.setFocus();
  }
  addContactSpeciality() {
    this.showSpecialityInput = true;
    this.showAddSpeciality = false;
    this.showSaveSpeciality = true;
    this.showEditSpeciality = false;
    this.specialtyInput.open();
  }
  addContactState() {
    this.showStateInput = true;
    this.showAddState = false;
    this.showSaveState = true;
    this.showEditState = false;
    this.stateInput.open();
  }
  addContactCity() {
    this.showCityInput = true;
    this.showAddCity = false;
    this.showSaveCity = true;
    this.showEditCity = false;
    this.cityInput.setFocus();
  }
  addContactZip() {
    this.showZipInput = true;
    this.showAddZip = false;
    this.showSaveZip = true;
    this.showEditZip = false;
    this.zipInput.setFocus();
  }
  addContactFax() {
    this.showFaxInput = true;
    this.showAddFax = false;
    this.showSaveFax = true;
    this.showEditFax = false;
    this.faxInput.setFocus();
  }
  addContactTelephone() {
    this.showTelephoneInput = true;
    this.showAddTelephone = false;
    this.showSaveTelephone = true;
    this.showEditTelephone = false;
    this.telephoneInput.setFocus();
  }
  addContactMobile() {
    this.showMobileInput = true;
    this.showAddMobile = false;
    this.showSaveMobile = true;
    this.showEditMobile = false;
    this.mobileInput.setFocus();
  }

  setTwitter(e: any) {
    this.userbasicDetails.twitter = e.target.value;
  }
  setLinkedin(e: any) {
    this.userbasicDetails.linkedin = e.target.value;
  }
  setFacebook(e: any) {
    this.userbasicDetails.facebook = e.target.value;
  }
  setWebsite(e: any) {
    this.userbasicDetails.website = e.target.value;
  }
  setFirstname(e: any) {
    this.userbasicDetails.firstName = e.target.value;
  }
  setTagLine(e: any) {
    this.userbasicDetails.profileTagLine = e.target.value;
    this.addAboutmeCursor();
  }
  setLastName(e: any) {
    this.userbasicDetails.lastName = e.target.value;
  }
  setState(e: any) {
    this.userAddressDetails[0].addressState = e.target.value;
  }
  setCity(e: any) {
    this.userAddressDetails[0].addressCity = e.target.value;
  }
  setFax(e: any) {
    this.userContactNumberDetails[0].faxNumber = e.target.value;
  }
  setCredentials(e: any) {
    this.userbasicDetails.userDegreeCodeText = e.target.value;
  }
  setMobile(e: any) {
    this.userContactNumberDetails[0].mobilePhoneNumber = e.target.value;
  }
  setTelephone(e: any) {
    this.userContactNumberDetails[0].phoneNumber = e.target.value;
  }
  setZip(e: any) {
    // this.userAddressDetails[0].addressZip = e; userAddressDetails[0].addressZip
    const self = this;
    let chIbn = e.target.value.split('-').join('');
    if (chIbn.length > 0) {
      chIbn = chIbn.match(new RegExp('.{1,5}', 'g')).join('-');
    } else {
      chIbn = e.target.value;
    }
    // this.addressList[index]['addressZip'] = chIbn;
    this.userAddressDetails[0].addressZip = chIbn;
  }
  setSpeciality(e: string) {
    this.userAddressDetails[0].addressZip = e;
  }

  async addLicense() {
    this.licenseAddBtn = true;
    this.licenseList.push({
      certificateName: '',
      speciality: '',
      instututionName: '',
    });
    const popover = await this.modalController.create({
      component: LicensesPopoverPage,
      cssClass: 'license-modal',
      componentProps: { key1: this.specialityType },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse.data == 'license') {
        this.getUserProfile();
      } else {
        this.licenseAddBtn = false;
      }
    });
    await popover.present();
  }
  async addEducationModal() {
    this.educationList.push({
      school: '',
      hcoDegree: '',
      field: '',
      periodFfrom: '',
      periodTo: '',
      description: '',
    });
    const popover = await this.modalController.create({
      component: EducationPopoverPage,
      cssClass: 'education-modal',
      // componentProps: data
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse.data == 'education') {
        this.getUserProfile();
      }
    });
    await popover.present();
  }

  async addWorkhistoryModal() {
    this.workHistoryList.push({
      description: '',
      endYear: '',
      experienceTitle: '',
      hcoCountry: '',
      hcoDmcid: 0,
      hcoLocality: '',
      hcoName: '',
      hcoPostcode: '',
      hcoStateProvince: '',
      npi: '',
      providerId: '',
      startYear: '',
      userId: '',
      tags: '',
      employmentType: '',
      startMonth: '',
      endMonth: '',
      healthOrganization: '',
    });
    const popover = await this.modalController.create({
      component: WorkhistoryPopoverPage,
      cssClass: 'workhistory-modal',
      componentProps: { states: this.stateList, hcoList: this.hcoList },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse.data == 'workhistory') {
        this.getUserProfile();
      } else {
        this.getUserProfile();
      }
    });
    await popover.present();
  }
  async imageEdit() {
    const popover = await this.modalController.create({
      component: ProfileImageUpdatePopoverPage,
      cssClass: 'profile-image-delete-modal',
      // event,
      componentProps: {
        userId: this.person.userBasicProfile.userId,
        providerId: this.person.userBasicProfile.providerId,
        npi: this.person.userBasicProfile.npi,
        // 'imageFor':'profile_img',
        // 'eventDetails':null ,
        // 'selectedImageList':this.iosSlectedImageArray,
        selectImage: () => this.selectImage(),
        onClick: () => {
          this.providerUserImageInfos();

          popover.dismiss();
        },
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse.data == 'profile-delete') {
        this.modalController.dismiss();
      }
    });
    await popover.present();
  }

  async selectImage() {
    this.modalController.dismiss('profile-delete');
    let permissions: any;
    let image: any;
    let permissionList: any;
    switch (this.appPlatform) {
      case 'web':
        this.myInputVariable.nativeElement.click();
        break;
      case 'android':
        try {
          permissions = await Camera.requestPermissions();
        } catch (error) {
        }
        permissionList = await Camera.checkPermissions();
        console.log('checking permissions.....', permissionList, permissions);
        if (
          permissionList.camera === 'granted' ||
          permissionList.photos === 'granted'
        ) {
          let isCamera: boolean = permissionList.camera === 'granted';
          let isPhotos: boolean = permissionList.photos === 'granted';
          this.loading.present();
          try {
            image = await Camera.getPhoto({
              quality: 50,
              allowEditing: true,
              resultType: CameraResultType.Base64,
              saveToGallery: false,
              correctOrientation: true,
              source:
                isCamera && isPhotos
                  ? CameraSource.Prompt
                  : (isCamera && CameraSource.Camera) ||
                    (isPhotos && CameraSource.Photos),
            });
          } catch (error) {
            if (this.loading.isLoading) this.loading.dismiss();
          }
          if (image) {
            this.pickedImage = `data:image/jpeg;base64,${image.base64String}`;
            this.fileExtesion = image.format;
            this.openImageModal();
          } else {
            if (this.loading.isLoading) this.loading.dismiss();
          }
        } else {
          this.presentAlert();
        }
        break;
      case 'ios':
        try {
          permissions = await Camera.requestPermissions();
        } catch (error) {
          console.log(error);
        }
        permissionList = await Camera.checkPermissions();
        console.log('checking permissions.....', permissionList, permissions);
        let isCamera: boolean = permissionList.camera === 'granted';
        let isPhotos: boolean = permissionList.photos === 'granted';
        let isLimited: boolean = permissionList.photos === 'limited';
        if (isCamera || isPhotos || isLimited) {
          this.loading.present();
          this.checkImageSelectCondition(isCamera, isLimited, isPhotos);
        } else {
          this.presentAlert();
        }
        break;
    }
  }

  async checkImageSelectCondition(
    isCamera: boolean,
    isLimited: boolean,
    isPhotos: boolean
  ) {
    let image: any;
    let imageList: any;
    try {
      if (isCamera && isPhotos) {
        image = await Camera.getPhoto({
          quality: 50,
          allowEditing: true,
          resultType: CameraResultType.Base64,
          saveToGallery: false,
          correctOrientation: true,
          source: CameraSource.Prompt,
        });
        if (image) {
          this.pickedImage = `data:image/jpeg;base64,${image.base64String}`;
          this.fileExtesion = image.format;
          this.openImageModal();
        } else {
          if (this.loading.isLoading) this.loading.dismiss();
        }
        return;
      } else if (isCamera && isLimited) {
        this.selectImagePickOption();
        return;
      } else if (isCamera || isPhotos) {
        image = await Camera.getPhoto({
          quality: 50,
          allowEditing: true,
          resultType: CameraResultType.Base64,
          saveToGallery: false,
          correctOrientation: true,
          source:
            (isCamera && CameraSource.Camera) ||
            (isPhotos && CameraSource.Photos),
        });
        if (image) {
          this.pickedImage = `data:image/jpeg;base64,${image.base64String}`;
          this.fileExtesion = image.format;
          this.openImageModal();
        } else {
          if (this.loading.isLoading) this.loading.dismiss();
        }
        return;
      } else if (isLimited) {
        try {
          imageList = await PhotoPlugin.getPhoto({ message: 'SINGLE' });
          this.pickedImage = `data:image/jpeg;base64,${imageList.dataImage}`;
          this.fileExtesion = 'jpeg';
          this.openImageModal();
        } catch (error) {
          if (this.loading.isLoading) this.loading.dismiss();
          console.log(error);
          return;
        }
        return;
      }
    } catch (error) {
      if (this.loading.isLoading) this.loading.dismiss();
    }
    return;
  }

  async selectImagePickOption() {
    let image: any;
    let imageList: any;
    if (this.loading.isLoading) this.loading.dismiss();
    const actionSheet = await this.actionSheetCtrl.create({
      // header: 'What would you like to add?',
      buttons: [
        {
          text: 'Select from gallery',
          handler: async () => {
            await actionSheet.dismiss();
            this.loading.present();
            try {
              imageList = await PhotoPlugin.getPhoto({ message: 'SINGLE' });
            } catch (error) {
              if (this.loading.isLoading) this.loading.dismiss();
              console.log(error);
              return;
            }
            this.pickedImage = `data:image/jpeg;base64,${imageList.dataImage}`;
            this.fileExtesion = 'jpeg';
            this.openImageModal();
            await actionSheet.dismiss();
            return;
          },
        },
        {
          text: 'Capture from camera',
          handler: async () => {
            await actionSheet.dismiss();
            image = await Camera.getPhoto({
              quality: 50,
              allowEditing: true,
              resultType: CameraResultType.Base64,
              saveToGallery: false,
              correctOrientation: true,
              source: CameraSource.Camera,
            });
            if (image) {
              this.pickedImage = `data:image/jpeg;base64,${image.base64String}`;
              this.fileExtesion = image.format;
              this.openImageModal();
              await actionSheet.dismiss();
            } else {
              return;
            }
            return;
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async presentAlert() {
    let alert = await this.alertController.create({
      header: 'Permission Denied',
      message:
        'If you would like to add an image, please provide POCN access in your settings.',
      buttons: [
        'Cancel',
        {
          text: 'Go to Settings',
          handler: () => {
            if (this.appPlatform === 'ios') {
              NativeSettings.openIOS({
                option: IOSSettings.App,
              });
            } else if (this.appPlatform === 'android') {
              NativeSettings.openAndroid({
                option: AndroidSettings.ApplicationDetails,
              });
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async openIosSelectedImageModal() {
    //console.log(event);
    this.imgErrorStatus = false;
    const modal = await this.modalController.create({
      component: IosSelectedImagesPage,
      cssClass: 'profileImage-modal',
      componentProps: {
        userId: this.person.userBasicProfile.userId,
        providerId: this.person.userBasicProfile.providerId,
        npi: this.person.userBasicProfile.npi,
        imageFor: 'profile_img',
        eventDetails: null,
        selectedImageList: this.iosSlectedImageArray,
        getUserProfile: () => this.providerUserImageInfos(),
        // 'fileExtension' :this.fileExtesion
      },
    });
    modal.onDidDismiss().then((data) => {
      // this.getUserProfile();
    });
    if (this.loading.isLoading) this.loading.dismiss();
    return await modal.present();
  }

  async openImageModal() {
    if (this.pickedImage) {
      this.imgErrorStatus = false;
      const modal = await this.modalController.create({
        component: ImageModalPage,
        cssClass: 'profileImage-modal',
        componentProps: {
          userId: this.person.userBasicProfile.userId,
          providerId: this.person.userBasicProfile.providerId,
          npi: this.person.userBasicProfile.npi,
          imageFor: 'profile_img',
          eventDetails: null,
          selectedImage: this.pickedImage,
          fileExtension: this.fileExtesion,
        },
      });
      modal.onDidDismiss().then((data) => {
        this.providerUserImageInfos();
      });
      if (this.loading.isLoading) this.loading.dismiss();
      return await modal.present();
    } else {
      if (this.loading.isLoading) this.loading.dismiss();
    }
  }

  onImgError(event) {
    event.target.src = this.profileImg;
  }

  async manageProfileImage(event: any) {
    if (
      event.target.files[0].type == 'image/png' ||
      event.target.files[0].type == 'image/PNG' ||
      event.target.files[0].type == 'image/JPEG' ||
      event.target.files[0].type == 'image/JPG' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/jpeg'
    ) {
      this.imgErrorStatus = false;
      const modal = await this.modalController.create({
        component: ImageModalPage,
        cssClass: 'profileImage-modal',
        componentProps: {
          userId: this.person.userBasicProfile.userId,
          providerId: this.person.userBasicProfile.providerId,
          npi: this.person.userBasicProfile.npi,
          imageFor: 'profile_img',
          eventDetails: event,
          selectedImage: null,
        },
      });
      modal.onDidDismiss().then((data) => {
        this.providerUserImageInfos();
      });
      if (this.loading.isLoading) this.loading.dismiss();
      return await modal.present();
    } else {
      if (this.loading.isLoading) this.loading.dismiss();
      //console.log("invalid img type");
      this.imgErrorStatus = true;
      this.errorMsg = `Invalid image type. Please select a valid file format (png, jpg or jpeg).`;
    }
  }

  showCallerSign() {
    this.router.navigate(['/connect']);
    //this.showSignIn = true;
  }
  dismiss() {
    this.showSignIn = false;
  }
  calculateDiff(dateTo, dateStart) {
    dateStart = new Date(dateStart);
    dateTo = new Date(dateTo);
    return Math.floor(
      (Date.UTC(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate()) -
        Date.UTC(
          dateStart.getFullYear(),
          dateStart.getMonth(),
          dateStart.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );
  }
  getSpecialityType = () => {
    this._pocnService.getSpecialityType().subscribe(({ data }) => {
      this.specialityType = data.masterSpecialties.nodes;
    });
  };
  userLogs = (id) => {
    this._pocnService.userLogs(id).subscribe(({ data }) => {
      this.userLogsList = JSON.parse(JSON.stringify(data.userLogs.nodes));
      this.userLogsList.forEach((val, i) => {
        let dt = val.createdAt + 'Z';
        let date = new Date(dt);
        this.userLogsList[i].createdAt = date;
      });
    });
  };
  reloadEngagement() {
    this.userLogs(this._pocnLocalStorageManager.getData('userId'));
  }

  blurFunction(type: string) {
    switch (type) {
      case 'tagLine':
        this.getUserTagline();
        this.showTagLineInput = false;
        break;
      case 'firstName':
        this.getUserFirstName();
        this.showFirstnameInput = false;
        break;
      case 'lastName':
        this.getUserLastName();
        this.showLastNameInput = false;
        break;
      case 'specialty':
        let specialityData = this.specialityType.filter((obj) => {
          return (
            obj.specialtyCode === this.userbasicDetails.primarySpecialityCode
          );
        });
        this.person['userBasicProfile'].primarySpecialityDesc =
          specialityData[0].specialtyName;
        this.showSpecialityInput = false;
        if (this.person.userBasicProfile.primarySpecialityDesc == '') {
          this.getUserProfile();
        }
        break;
      case 'state':
        //this.userAddressDetails[0].addressState = this.stateData;
        //this.person['userAddressProfile'][0].addressState = this.stateData;
        //this.showStateInput = false;
        break;
      case 'city':
        this.getUserCity();
        this.showCityInput = false;
        break;
      case 'credentials':
        this.getUserDegreeCodeText();
        this.showCredentialsInput = false;
        break;
      case 'zip':
        this.getUserZip();
        this.showZipInput = false;
        break;

      case 'telephone':
        this.getUserPhoneNumber();
        this.showTelephoneInput = false;
        break;

      case 'fax':
        this.getUserFaxNumber();
        this.showFaxInput = false;
        break;
      case 'mobile':
        this.getUserMobileNumber();
        this.showMobileInput = false;
        break;
      case 'twitter':
        this.getUserTwitterProfile();
        this.showTwitterInput = false;
        break;
      case 'facebook':
        this.getUserFbProfile();
        this.showFacebookInput = false;
        break;
      case 'linkedIn':
        this.getUserLinkedinProfile();
        this.showLinkedInInput = false;

        break;
      case 'website':
        this.getUserWebsite();
        this.showWebsiteInput = false;
        break;
    }
  }
  getUserProfile() {
    let educationDetails = [];
    let educationData = [];
    let licenseData = [];
    let workHistoryData = [];
    let workHistoryDetails = [];
    var yearLabel;
    var monthLabel;
    let profileImageArray = [];
    this.userbasicDetails.primarySpecialityDesc = '';
    //if(this.token != null){

    this._pocnService.getUserBasicProfile(this.token).subscribe(
      ({ data }) => {
        if (this.loading.isLoading) {
          this.loading.dismiss();
        }
        this.userAddressProfile =
          data['getUserBasicProfile'].data['userAddressProfile'];
        this.person = JSON.parse(
          JSON.stringify(data['getUserBasicProfile'].data)
        );
        this.contactInfoDetails =
          data['getUserBasicProfile'].data['userContactProfile'][0];

        this._pocnService.getUserProfile(this.token).subscribe(({ data }) => {
          if (this.loading.isLoading) {
            this.loading.dismiss();
          }

          //this.userAddressProfile = data['getUserFullProfile'].data['userAddressProfile'];
          //this.person = JSON.parse(JSON.stringify(data['getUserFullProfile'].data));
          let basicProfile =
            data['getUserFullProfile'].data['userBasicProfile'];
          this.userbasicDetails = {
            firstName: basicProfile.firstName,
            lastName: basicProfile.lastName,
            primarySpecialityDesc: basicProfile.primarySpecialityDesc,
            primarySpecialityCode: basicProfile.primarySpecialityCode,
            email: basicProfile.email,
            website: basicProfile.website,
            facebook: basicProfile.facebook
              ? basicProfile.facebook
              : 'https://www.facebook.com/',
            linkedin: basicProfile.linkedin
              ? basicProfile.linkedin
              : 'https://www.linkedin.com/in/',
            twitter: basicProfile.twitter
              ? basicProfile.twitter
              : 'https://twitter.com/',
            aboutMe: basicProfile.aboutMe,
            npi: basicProfile.npi,
            profileTagLine: basicProfile.profileTagLine,
            degreeGroupCode: basicProfile.degreeGroupCode,
            userDegreeCodeText: basicProfile.userDegreeCodeText,
            atnp: basicProfile.atnp,
            atpa: basicProfile.atpa,
            globalOptOut: basicProfile.globalOptOut,
            rxAuthority: basicProfile.rxAuthority,
            pocnMentor: basicProfile.pocnMentor,
            pocnMentee: basicProfile.pocnMentee,
            pocnAmbassador: basicProfile.pocnAmbassador,
            communityAdvocate: basicProfile.communityAdvocate,
            educatorOfDistinction: basicProfile.educatorOfDistinction,
          };
          this.previousFacebookValue = this.userbasicDetails.facebook;
          this.previousLinkedinValue = this.userbasicDetails.linkedin;
          this.previousTwitterValue = this.userbasicDetails.twitter;
          this.previousWebsiteValue = this.userbasicDetails.website;
          this.previousTaglineValue = this.userbasicDetails.profileTagLine;
          if (
            (this.userbasicDetails.atnp == false ||
              this.userbasicDetails.atnp == null) &&
            (this.userbasicDetails.atpa == false ||
              this.userbasicDetails.atpa == null) &&
            (this.userbasicDetails.globalOptOut == false ||
              this.userbasicDetails.globalOptOut == null) &&
            (this.userbasicDetails.rxAuthority == false ||
              this.userbasicDetails.rxAuthority == null) &&
            (this.userbasicDetails.pocnMentor == false ||
              this.userbasicDetails.pocnMentor == null) &&
            (this.userbasicDetails.pocnMentee == false ||
              this.userbasicDetails.pocnMentee == null) &&
            (this.userbasicDetails.communityAdvocate == false ||
              this.userbasicDetails.communityAdvocate == null) &&
            (this.userbasicDetails.educatorOfDistinction == false ||
              this.userbasicDetails.educatorOfDistinction == null) &&
            (this.userbasicDetails.pocnAmbassador == false ||
              this.userbasicDetails.pocnAmbassador == null)
          ) {
            this.showNoBadgesMsg = true;
          }
          this.getUserFirstName();
          this.getUserLastName();
          let specialityTemp = this.specialityType.filter((obj) => {
            return obj.specialtyName === basicProfile.primarySpecialityDesc;
          });

          if (specialityTemp.length > 0) {
            this.specialityListTemp = {
              specialtyCode: specialityTemp[0].specialtyCode,
              specialtyGroupCode: specialityTemp[0].specialtyGroupCode,
              specialtyGroupName: specialityTemp[0].specialtyGroupName,
              specialtyId: specialityTemp[0].specialtyId.toString(),
              specialtyName: specialityTemp[0].specialtyName,
            };
          } else {
            this.specialityListTemp = {
              specialtyCode: '',
              specialtyGroupCode: '',
              specialtyGroupName: '',
              specialtyId: '',
              specialtyName: '',
            };
          }

          basicProfile.linkedin != ''
            ? (this.showEditLinkedIn = true)
            : (this.showAddLinkedIn = true);
          basicProfile.facebook != ''
            ? (this.showEditFacebook = true)
            : (this.showAddFacebook = true);
          basicProfile.twitter != ''
            ? (this.showEditTwitter = true)
            : (this.showAddTwitter = true);
          basicProfile.website != ''
            ? (this.showEditWebsite = true)
            : (this.showAddWebsite = true);
          basicProfile.firstName != ''
            ? (this.showEditFirstname = true)
            : (this.showAddFirstname = true);
          basicProfile.lastName != ''
            ? (this.showEditLastName = true)
            : (this.showAddLastName = true);
          basicProfile.degreeGroupCode != ''
            ? (this.showEditDegreeGroupCode = true)
            : (this.showAddDegreeGroupCode = true);
          basicProfile.profileTagLine != ''
            ? (this.showEditTagLine = true)
            : (this.showAddTagLine = true);
          basicProfile.userDegreeCodeText != ''
            ? (this.showEditCredentials = true)
            : (this.showAddCredentials = true);

          educationDetails =
            data['getUserFullProfile'].data['userEducationProfile'];
          this.professionalProfileDetails =
            data['getUserFullProfile'].data['userProfessionalProfile'];
          this.professionalProfileDetailsValueCheck = this
            .professionalProfileDetails[0]['jobTitle']
            ? this.professionalProfileDetails[0]['jobTitle']
            : '';
          this.licenseDetails =
            data['getUserFullProfile'].data['userCertLicense'];

          workHistoryDetails =
            data['getUserFullProfile'].data['userExperienceProfile'];

          //this.contactInfoDetails = data['getUserFullProfile'].data['userContactProfile'][0];
          this.userProfileImages =
            data['getUserFullProfile'].data['userImageProfile'];
          this.userResume = data['getUserFullProfile'].data['userResume'];
          this.showResume = false;
          this.successStatus = false;
          this.successStatusResume = false;
          if (this.userResume.length > 0) {
            this.resumeStatus = true;
            this.downloadBase64Resume = this.userResume[0].fileContent;
            this.myResumeName = this.userResume[0].fileName;
          }
          profileImageArray = this.userProfileImages.filter((obj) => {
            return obj.imgType === 'profile_img';
          });
          if (profileImageArray.length > 0) {
            this.profileImg =
              profileImageArray[profileImageArray.length - 1].fileContent;
            //this.profileImgUrl = environment.postProfileImgUrl + this._pocnLocalStorageManager.getData("userId") + '.' + profileImageArray[profileImageArray.length-1].fileExtension + '?lastmod=' + Math.random();
            // this.profileImgUrl = environment.postProfileImgUrl + this._pocnLocalStorageManager.getData("userId") + '.' + this._pocnLocalStorageManager.getData("imgExtension") + '?lastmod=' + Math.random();
          } else {
            this.profileImgUrl = 'assets/images-pocn/group-default-thumbnail.svg';
          }

          this.userContactNumberDetails = [];
          this.userContactNumberDetails.push({
            // showing in ui form
            mobilePhoneNumber: this.contactInfoDetails.mobilePhoneNumber,
            phoneNumber: this.contactInfoDetails.phoneNumber,
            faxNumber: this.contactInfoDetails.faxNumber,
          });

          this.addressInfoDetails =
            data['getUserFullProfile'].data['userAddressProfile'][0];
          this.addressInfoData =
            data['getUserFullProfile'].data['userAddressProfile'][0];
          this.userAddressDetails = [];
          this.userAddressDetails.push({
            // showing in ui form
            addressZip: this.addressInfoDetails.addressZip,
            addressState: this.addressInfoDetails.addressState,
            addressCity: this.addressInfoDetails.addressCity,
            // phoneNumber: this.contactInfoDetails.phoneNumber,
            // faxNumber: this.contactInfoDetails.faxNumber,
          });

          this.addressList.push({
            addressLine1: this.addressInfoDetails['addressLine1'],
            addressLine2: this.addressInfoDetails['addressLine2'],
            addressCity: this.userAddressDetails[0].addressCity,
            addressState: this.userAddressDetails[0].addressState,
            addressZip: this.userAddressDetails[0].addressZip,
            timeZone: this.addressInfoDetails['timeZone'],
            setPrimary: true,
            addressType: '1',
            addressHeaderType: '1',
          });

          this.contactInfoDetails.mobilePhoneNumber != ''
            ? (this.showEditMobile = true)
            : (this.showAddMobile = true);
          this.contactInfoDetails.phoneNumber != ''
            ? (this.showEditTelephone = true)
            : (this.showAddTelephone = true);
          this.contactInfoDetails.faxNumber != ''
            ? (this.showEditFax = true)
            : (this.showAddFax = true);
          this.addressInfoDetails.addressZip != ''
            ? (this.showEditZip = true)
            : (this.showAddZip = true);
          this.addressInfoDetails.addressState != ''
            ? (this.showEditState = true)
            : (this.showAddState = true);
          this.addressInfoDetails.addressCity != ''
            ? (this.showEditCity = true)
            : (this.showAddCity = true);

          this.educationList = [];
          educationDetails.forEach((field, index) => {
            educationData = field;
            this.educationList.push({
              school: educationData['hcoName'],
              field: educationData['hcoSubtype'],
              year: educationData['hcpGraduationYear'],
              hcoDegree: educationData['hcoDegree'],
              description: educationData['description'],
            });
          });

          this.licenseList = [];
          this.licenseDetails.forEach((field, index) => {
            licenseData = field;
            this.licenseList.push({
              certificateName: licenseData['certificationLicenceName'],
              speciality: licenseData['specialty'],
              institutionName: licenseData['hcoName'],
            });
            this.workHistoryList = [];
            workHistoryDetails.forEach((field, index) => {
              workHistoryData = field;
              let dateToString = new Date(
                '01/' +
                  workHistoryData['endMonth'] +
                  '/' +
                  workHistoryData['endYear']
              );
              let dateFromString = new Date(
                '01/' +
                  workHistoryData['startMonth'] +
                  '/' +
                  workHistoryData['startYear']
              );
              let yearsnew = Math.floor(
                this.calculateDiff(dateToString, dateFromString) / 365
              );
              let monthsnew = Math.floor(
                (this.calculateDiff(dateToString, dateFromString) % 365) / 30
              );
              if (yearsnew > 1) {
                yearLabel = yearsnew + ' Years ';
              } else if (yearsnew == 1) {
                yearLabel = yearsnew + ' Year ';
              } else {
                yearLabel = '';
              }

              if (monthsnew > 1) {
                monthLabel = monthsnew + ' Months ';
              } else if (monthsnew == 1) {
                monthLabel = monthsnew + ' Month ';
              } else {
                monthLabel = '';
              }

              this.yearDiff = yearLabel + monthLabel;
              let diff;
              if (
                workHistoryData['startYear'] != '' &&
                workHistoryData['endYear'] != ''
              ) {
                diff = this.yearDiff;
              } else {
                diff = workHistoryData['startYear'];
              }

              this.workHistoryList.push({
                // showing in ui form
                experienceTitle: workHistoryData['experienceTitle'],
                hcoStateProvince: workHistoryData['hcoStateProvince'],
                description: workHistoryData['description'],
                tags: workHistoryData['tags'],
                healthOrganization: workHistoryData['healthOrganization'],
                employmentType: workHistoryData['employmentType'],
                hcoLocality: workHistoryData['hcoLocality'],
                hcoSubType: workHistoryData['hcoName'],
                startYear: workHistoryData['startYear'],
                endYear: workHistoryData['endYear'],
                startMonth: workHistoryData['startMonth'],
                endMonth: workHistoryData['endMonth'],
                diffYear: diff,
              });
            });
          });

          this.licenseAddBtn = false;

          // if(this.loading.isLoading){
          //   this.loading.dismiss();
          // }
        });
      },
      (error) => {
        // if(this.loading.isLoading){
        //   this.loading.dismiss();
        // }
        // this._pocnLocalStorageManager.removeData("firstName");
        // this._pocnLocalStorageManager.removeData("lastName");
        // this._pocnLocalStorageManager.removeData("pocnApiAccessToken");
        // this._pocnLocalStorageManager.removeData("userEmail");
        // this._pocnLocalStorageManager.removeData("refreshToken");
        // this._pocnLocalStorageManager.removeData("tabName");
        // this._pocnLocalStorageManager.removeData("subTabName");
        // this._pocnLocalStorageManager.removeData("userId");
        // this.router.navigate(["/register"]);
      }
    );
  }

  reloadBadges() {
    this.showNoBadgesMsg = false;
    this.getUserProfile();
  }
  reloadPosts() {
    console.log('click');
    this.postUserView = [];
    this.getUserPost();
    this.getUserStat();
  }
  //hide matching error
  showValue() {
    this.showPattern = true;
  }
  resumeFilenameUpdate = (f) => {
    const resumeMutate = {
      accessCode: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      fileContent: this.userResume[0].fileContent,
      fileName: f.value['resumeRename'],
      npi: this.person.userBasicProfile.npi,
      providerId: this.person.userBasicProfile.providerId,
      userId: this.person.userBasicProfile.userId,
    };
    //   this.convertToBase64(event.target.files[0]).subscribe(base64 => {
    //     this.uploadedFile = base64;
    //     //  this.resumeSave();
    // });
    this.successStatus = false;
    this.fileErrorStatus = false;
    this.fileLoader = true;
    this._pocnService
      .updateUserResume(resumeMutate)
      .subscribe((response: any) => {
        if (
          response.data.updateUserResume.userProfileUpdateResponse.status ==
          'Success'
        ) {
          console.log('hiiiiiresume');
          this.successStatus = true;
          this.fileLoader = false;
          this.successMsg = 'Resume successfully saved';
          this.showRename = false;
          this.getUserProfile();
          const spanName = 'profile-resume-update-btn';
          let attributes = {
            userId: this._pocnLocalStorageManager.getData('userId'),
            firstName: this._pocnLocalStorageManager.getData('firstName'),
            lastName: this._pocnLocalStorageManager.getData('lastName'),
            userEmail: this._pocnLocalStorageManager.getData('userEmail'),
          };
          const eventName = 'profile resume update';
          const event = {
            userEmail: this._pocnLocalStorageManager.getData('userEmail'),
            status: 'success',
            message: 'successfully updated resume',
          };
          this.telemetry
            .sendTrace(spanName, attributes, eventName, event)
            .then((result: string) => {
              this.telemetry.parentTrace = result;
            });
        } else {
          this.fileErrorStatus = true;
          this.errorMsg =
            response.data.updateUserResume.userProfileUpdateResponse.message;
          this.fileLoader = false;
          let attributes = {
            userId: this._pocnLocalStorageManager.getData('userId'),
            firstName: this._pocnLocalStorageManager.getData('firstName'),
            lastName: this._pocnLocalStorageManager.getData('lastName'),
            userEmail: this._pocnLocalStorageManager.getData('userEmail'),
          };
          const spanName = 'profile-resume-add-btn';
          const eventName = 'profile resume add';
          const event = {
            userEmail: this._pocnLocalStorageManager.getData('userEmail'),
            status: 'failed',
            message: 'failed to update resume',
          };
          this.telemetry
            .sendTrace(spanName, attributes, eventName, event)
            .then((result: string) => {
              this.telemetry.parentTrace = result;
            });
        }
      });
  };
  updateFirstName(type: string, f) {
    console.log("hiiiupdateFirstName",type,f);
    if (type == 'firstname') {
      this.showFirstnameInput = false;
      this.showAddFirstname = false;
      this.showSaveFirstname = false;
      this.showEditFirstname = true;
      this.person.userBasicProfile.firstName = this.userbasicDetails.firstName;
    }
    if (f.invalid && type == 'firstname') {
      this.showFirstnameInput = true;
      this.showFirstname = true;
    } else {
      this.showFirstname = false;
    }
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      firstName: this.userbasicDetails.firstName,
    };
    if (this.showFirstname == false && f.value['firstName'] != '') {
      this._pocnService
        .updateUserFirstName(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;
          if (
            response.data.updateUserFirstName.userProfileUpdateResponse
              .status === 'Success'
          ) {
            this.firstNameData =
              this.person.userBasicProfile.firstName =
              this.userbasicDetails.firstName =
                response.data.updateUserFirstName.userProfileUpdateResponse.data;
                this._pocnLocalStorageManager.saveData(
                  "firstName",
                  this.firstNameData,
                );

            const spanName = 'profile-firstname-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue: this.userbasicDetails.firstName,
              previousValue: f.value['firstName'],
            };
            const eventName = 'profile firstname edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated firstname',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
          }
        });
    }
  }
  updateLastName(type: string, f) {
    let firstNameWhiteSpaceCheck = false;
    let lastNameWhiteSpaceCheck = false;
    if (!this.userbasicDetails.lastName.replace(/\s/g, '').length) {
      lastNameWhiteSpaceCheck = true;
    } else {
      lastNameWhiteSpaceCheck = false;
    }
    if (type == 'lastname') {
      this.showLastNameInput = false;
      this.showAddLastName = false;
      this.showSaveLastName = false;
      this.showEditLastName = true;
      this.person.userBasicProfile.lastName = this.userbasicDetails.lastName;
    }
    if (f.invalid && type == 'lastname') {
      this.showLastNameInput = true;
      this.showLastname = true;
    } else {
      this.showLastname = false;
    }
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      lastName: this.userbasicDetails.lastName,
    };
    if (this.showLastname == false && f.value['lastName'] != '') {
      this._pocnService
        .updateUserLastName(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;
          if (
            response.data.updateUserLastName.userProfileUpdateResponse
              .status === 'Success'
          ) {
            this.lastNameData =
              this.person.userBasicProfile.lastName =
              this.userbasicDetails.lastName =
                response.data.updateUserLastName.userProfileUpdateResponse.data;
                this._pocnLocalStorageManager.saveData(
                  "lastName",
                  this.lastNameData,
                );
            const spanName = 'profile-lastname-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue: this.userbasicDetails.lastName,
              previousValue: f.value['lastName'],
            };
            const eventName = 'profile lastname edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated lastname',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
          }
        });
    }
  }
  updateUserTagline(type: string, f) {
    if (type == 'tagLine') {
      this.showTagLineInput = false;
      this.showAddTagLine = false;
      this.showSaveTagLine = false;
      this.showEditTagLine = true;
      this.person.userBasicProfile.profileTagLine =
        this.userbasicDetails.profileTagLine;
    }
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      profileTagLine: this.userbasicDetails.profileTagLine,
    };
    if (type == 'tagLine') {
      this._pocnService
        .updateUserTagline(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;
          if (
            response.data.updateUserTagline.userProfileUpdateResponse.status ===
            'Success'
          ) {
            // this.userbasicDetails.profileTagLine =  response.data.updateUserTagline.userProfileUpdateResponse.data;
            this.taglineData =
              this.person.userBasicProfile.profileTagLine =
              this.userbasicDetails.profileTagLine =
                response.data.updateUserTagline.userProfileUpdateResponse.data;
            const spanName = 'profile-tagline-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue: this.userbasicDetails.profileTagLine,
              previousValue: this.previousTaglineValue,
            };
            const eventName = 'profile tagline edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated tagline',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
            this.showTagLineInput = false;
            if (this.taglineData == '') {
              this.showAddTagLine = true;
            } else {
              this.showAddTagLine = false;
            }
          }
        });
    }
  }
  updateUserPrimarySpecialty(type: string, f) {
    if (type == 'speciality') {
      this.showSpecialityInput = false;
      this.showAddSpeciality = false;
      this.showSaveSpeciality = false;
      this.showEditSpeciality = true;
      this.previousPracticeValue =
        this.person.userBasicProfile.primarySpecialityDesc;
      this.person.userBasicProfile.primarySpecialityDesc =
        f.value['speciality'].specialtyName;
    }
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      specialtyCode: f.value['speciality'].specialtyCode,
      specialtyDesc: f.value['speciality'].specialtyName,
      specialtyGroup: f.value['speciality'].specialtyGroupName,
      specialtyGroupCode: f.value['speciality'].specialtyGroupCode,
    };
    if (f.value['speciality'] != undefined) {
      this._pocnService
        .updateUserPrimarySpecialty(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;
          if (
            response.data.updateUserPrimarySpecialty.userProfileUpdateResponse
              .status === 'Success'
          ) {
            this.getUserProfile();
            const spanName = 'profile-practice-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue: f.value['speciality'].specialtyName,
              previousValue: this.previousPracticeValue,
            };
            const eventName = 'profile practice edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated practice',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
          }
        });
    }
  }
  updateUserWebsite(type: string, f) {
    if (type == 'website') {
      this.showWebsiteInput = false;
      this.showAddWebsite = false;
      this.showSaveWebsite = false;
      this.showEditWebsite = true;
      this.person.userBasicProfile.website = this.userbasicDetails.website;
      //this.previousWebsiteValue = this.person.userBasicProfile.website
    }
    let regexWebsite = new RegExp(
      /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9\-]+(\.[a-z\-]{2,}){1,3}(#?\/?[a-zA-Z0-9\-\.#]+)*\/?(\?[a-zA-Z0-9-_\-\.]+=[a-zA-Z0-9-%\-\.]+&?)?$/gm
      // /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9\-]+(\.[a-z\-]{2,}){1,3}(#?\/?[a-zA-Z0-9\-#]+)*\/?(\?[a-zA-Z0-9-_\-]+=[a-zA-Z0-9-%\-]+&?)?$/gm
      // /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/gm
    );
    let searchWebsite;
    if (f.value['website'] != '') {
      searchWebsite = regexWebsite.test(this.userbasicDetails.website);
      if (type == 'website' && searchWebsite == false) {
        this.showWebsiteInput = true;
        this.showWebsiteMsg = true;
        this.showAddWebsite = false;
        this.showEditWebsite = false;
      }
    } else {
      this.showWebsiteMsg = false;
    }

    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      websiteUrl: this.userbasicDetails.website,
    };
    if (searchWebsite == true || f.value['website'] === '') {
      this._pocnService
        .updateUserWebsite(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;
          if (
            response.data.updateUserWebsite.userProfileUpdateResponse.status ===
            'Success'
          ) {
            this.webisteData =
              this.userbasicDetails.website =
              this.person.userBasicProfile.website =
                response.data.updateUserWebsite.userProfileUpdateResponse.data;
            const spanName = 'profile-website-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue: this.person.userBasicProfile.website,
              previousValue: this.previousWebsiteValue,
            };
            const eventName = 'profile website edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated website',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
            if (this.webisteData != '') {
              this.showEditWebsite = true;
            } else {
              this.showEditWebsite = false;
              this.showAddWebsite = true;
            }
          }
        });
    }
  }
  updateUserTwitterProfile(type: string, f) {
    if (type == 'twitter') {
      this.showTwitterInput = false;
      this.showAddTwitter = false;
      this.showSaveTwitter = false;
      this.showEditTwitter = true;
      this.person.userBasicProfile.twitter = this.userbasicDetails.twitter;
      //this.previousTwitterValue = this.person.userBasicProfile.twitter;
    }
    let regexTwitter = new RegExp(
      /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9\-]+(\.[a-z\-]{2,}){1,3}(#?\/?[a-zA-Z0-9\-\.#]+)*\/?(\?[a-zA-Z0-9-_\-\.]+=[a-zA-Z0-9-%\-\.]+&?)?$/gm
      // /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9\-]+(\.[a-z\-]{2,}){1,3}(#?\/?[a-zA-Z0-9\-#]+)*\/?(\?[a-zA-Z0-9-_\-]+=[a-zA-Z0-9-%\-]+&?)?$/gm
      // /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/gm
    );
    let searchTwitter;
    if (f.value['twitter'] != '') {
      searchTwitter = regexTwitter.test(this.userbasicDetails.twitter);
      if (type == 'twitter' && searchTwitter == false) {
        this.showTwitterInput = true;
        this.showTwitterMsg = true;
        this.showAddTwitter = false;
        this.showEditTwitter = false;
      }
    } else {
      this.showTwitterMsg = false;
    }

    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      twitterUrl: this.userbasicDetails.twitter,
    };
    if (searchTwitter == true || f.value['twitter'] === '') {
      this._pocnService
        .updateUserTwitterProfile(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;
          if (
            response.data.updateUserTwitterProfile.userProfileUpdateResponse
              .status === 'Success'
          ) {
            const spanName = 'profile-twitter-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue: this.person.userBasicProfile.twitter,
              previousValue: this.previousTwitterValue,
            };
            const eventName = 'profile twitter edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated twitter',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
            this.twitterData =
              this.userbasicDetails.twitter =
              this.person.userBasicProfile.twitter =
                response.data.updateUserTwitterProfile.userProfileUpdateResponse.data;
            if (this.twitterData != '') {
              this.showEditTwitter = true;
            } else {
              this.showEditTwitter = false;
              this.showAddTwitter = true;
            }
          }
          // this.userbasicDetails.firstName =  this.person.userBasicProfile.firstName;
        });
    }
  }
  updateUserLinkedin(type: string, f) {
    if (type == 'linkedin') {
      this.showLinkedInInput = false;
      this.showAddLinkedIn = false;
      this.showSaveLinkedin = false;
      this.showEditLinkedIn = true;
      this.person.userBasicProfile.linkedin = this.userbasicDetails.linkedin;
    }


    let regexLinked = new RegExp(
      /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9\-]+(\.[a-z\-]{2,}){1,3}(#?\/?[a-zA-Z0-9\-\.#]+)*\/?(\?[a-zA-Z0-9-_\-\.]+=[a-zA-Z0-9-%\-\.]+&?)?$/gm
      // /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9\-]+(\.[a-z\-]{2,}){1,3}(#?\/?[a-zA-Z0-9\-#]+)*\/?(\?[a-zA-Z0-9-_\-]+=[a-zA-Z0-9-%\-]+&?)?$/gm
      // /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/gm
    );
    let searchLinked;
    if (f.value['linkedin'] != '') {
      searchLinked = regexLinked.test(this.userbasicDetails.linkedin);
      if (type == 'linkedin' && searchLinked == false) {
        this.showLinkedInInput = true;
        this.showLinkedinMsg = true;
        this.showAddLinkedIn = false;
        this.showEditLinkedIn = false;
      }
    } else {
      this.showLinkedinMsg = false;
    }
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      linkedinUrl: this.userbasicDetails.linkedin,
    };
    if (searchLinked == true || f.value['linkedin'] === '') {
      this._pocnService
        .updateUserLinkedin(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;
          if (
            response.data.updateUserLinkedin.userProfileUpdateResponse
              .status === 'Success'
          ) {
            this.linkedinData =
              this.userbasicDetails.linkedin =
              this.person.userBasicProfile.linkedin =
                response.data.updateUserLinkedin.userProfileUpdateResponse.data;
            const spanName = 'profile-linkedin-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue: this.person.userBasicProfile.linkedin,
              previousValue: this.previousLinkedinValue,
            };
            const eventName = 'profile linkedin edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated linkedin',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
            if (this.linkedinData != '') {
              this.showEditLinkedIn = true;
            } else {
              this.showEditLinkedIn = false;
              this.showAddLinkedIn = true;
            }
          }
          // this.userbasicDetails.firstName =  this.person.userBasicProfile.firstName;
        });
    }
  }
  updateUserFbProfile(type: string, f) {
    if (type == 'facebook') {
      this.showFacebookInput = false;
      this.showAddFacebook = false;
      this.showSaveFacebook = false;
      this.showEditFacebook = true;
      this.person.userBasicProfile.facebook = this.userbasicDetails.facebook;
    }
    let regexFacebook = new RegExp(
      /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9\-]+(\.[a-z\-]{2,}){1,3}(#?\/?[a-zA-Z0-9\-\.#]+)*\/?(\?[a-zA-Z0-9-_\-\.]+=[a-zA-Z0-9-%\-\.]+&?)?$/gm
      // /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/gm
    );
    let searchFacebook;

    if (f.value['facebook'] != '') {
      searchFacebook = regexFacebook.test(this.userbasicDetails.facebook);
      if (type == 'facebook' && searchFacebook == false) {
        this.showFacebookInput = true;
        this.showFacebookMsg = true;
        this.showAddFacebook = false;
        this.showEditFacebook = false;
      }
    } else {
      this.showFacebookMsg = false;
    }
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      fbUrl: this.userbasicDetails.facebook,
    };
    if (searchFacebook == true || f.value['facebook'] === '') {
      this._pocnService
        .updateUserFbProfile(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;
          if (
            response.data.updateUserFbProfile.userProfileUpdateResponse
              .status === 'Success'
          ) {
            this.fbData =
              this.userbasicDetails.facebook =
              this.person.userBasicProfile.facebook =
                response.data.updateUserFbProfile.userProfileUpdateResponse.data;
            const spanName = 'profile-facebook-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue: this.person.userBasicProfile.facebook,
              previousValue: this.previousFacebookValue,
            };
            const eventName = 'profile facebook edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated facebook',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
            if (this.fbData != '') {
              this.showEditFacebook = true;
            } else {
              this.showEditFacebook = false;
              this.showAddFacebook = true;
            }
          }
        });
    }
  }

  updateBasicProfileData(contactProfileDetails) {
    this._pocnService
      .updateUserBasicProfile(contactProfileDetails)
      .subscribe((response: any) => {
        this.showPattern = true;
        if (
          response.data.updateUserBasicProfile.userProfileUpdateResponse
            .status === 'Success'
        ) {
          // setTimeout(() => {
          //   this.getUserProfile();
          // }, 5000);
        }
      });
  }
  updateUserPhoneNumber(type: string, f) {
    let countryCodes;
    let validNumber;
    let phoneRegex;
    let findPhoneRegex;

    if (type == 'telephone') {
      this.showTelephoneInput = false;
      this.showAddTelephone = false;
      this.showSaveTelephone = false;
      this.showEditTelephone = true;
      this.person['userContactProfile'][0].phoneNumber =
        this.userContactNumberDetails[0].phoneNumber;
    }
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      phoneNumber: this.userContactNumberDetails[0].phoneNumber,
    };
    countryCodes = this.countryCodeArray;
    phoneRegex = new RegExp('^[0-9]+$');
    let phoneNumber = this.userContactNumberDetails[0].phoneNumber.replace(
      '+',
      ''
    );
    let validPhnNumber = countryCodes.some((elem) =>
      phoneNumber.match('^' + elem)
    );
    if (validPhnNumber) {
      // Remove the existing country code
      phoneNumber = phoneNumber.replace(new RegExp(`^(${countryCodes.join('|')})`), '');
    }
    
    // Add the country code from countryCodeArray[0]
    phoneNumber = countryCodes[1] + phoneNumber;
    let findPhoneRegex1 = phoneRegex.test(phoneNumber);
    if (phoneNumber != '') {
      this.showPhnNumber = false;
      // if(phoneNumber.length < 10 || findPhoneRegex1 == false){
      //   this.showMobileDiv = true;
      // }else if(phoneNumber.length > 10 && validPhnNumber == false){
      //   console.log(validPhnNumber)
      //   this.showMobileDiv = true;
      // }else{
      //   this.showMobileDiv = false;
      // }
      if (phoneNumber.length > 10 && findPhoneRegex1 == true) {
        console.log(validPhnNumber)
        if(validPhnNumber == true ){
          this.showMobileDiv = false;
          this.showTelephoneInput = false;
        }
        else{
          console.log("test1")
          this.showMobileDiv = true;
          this.showTelephoneInput = true;

        }
      }else if(phoneNumber.length < 10 || findPhoneRegex1 == false){
        this.showMobileDiv = true;
        this.showTelephoneInput = true;
        this.showPhnNumber = false;
      }
      else{
        this.showPhnNumber = false;
        this.showMobileDiv = false;
        validPhnNumber = true
      }
    } else {
      this.showPhnNumber = true;
      this.showMobileDiv = false;
      this.showTelephoneInput = true;
    }
    if (f.invalid && type == 'telephone' && this.showMobileDiv == true) {
      this.showTelephoneInput = true;
      this.showPhn = true;
    }
    this.userContactNumberDetails[0]['showMobileDiv'] = this.showMobileDiv;
    if (
      type == 'telephone' &&
      this.showMobileDiv == false &&
      validPhnNumber == true
    ) {
      this._pocnService
        .updateUserPhoneNumber(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;
          if (
            response.data.updateUserPhoneNumber.userProfileUpdateResponse
              .status === 'Success'
          ) {
            const spanName = 'profile-telephone-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue: (this.userContactNumberDetails[0].phoneNumber =
                response.data.updateUserPhoneNumber.userProfileUpdateResponse.data),
              previousValue: f.value['phoneNumber'],
            };
            const eventName = 'profile telephone edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated telephone',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
            this.phoneNumberData =
              this.person['userContactProfile'][0].phoneNumber =
              this.userContactNumberDetails[0].phoneNumber =
                response.data.updateUserPhoneNumber.userProfileUpdateResponse.data;
            this.showTelephoneInput = false;
            if (this.phoneNumberData == '') {
              this.showAddTelephone = true;
            } else {
              this.showAddTelephone = false;
            }
          }
        });
    }
  }
  updateUserMobileNumber(type: string, f) {
    let countryCodes;
    let validNumber;
    let phoneRegex;
    let findPhoneRegex;
    if (type == 'mobile') {
      this.showMobileInput = false;
      this.showAddMobile = false;
      this.showSaveMobile = false;
      this.showEditMobile = true;
      this.person['userContactProfile'][0].mobilePhoneNumber =
        this.userContactNumberDetails[0].mobilePhoneNumber;
    }
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      mobileNumber: this.userContactNumberDetails[0].mobilePhoneNumber,
    };
    let mobileNumber =
      this.userContactNumberDetails[0].mobilePhoneNumber.replace('+', '');
    countryCodes = this.countryCodeArray;
    validNumber = countryCodes.some((elem) => mobileNumber.match('^' + elem));
    phoneRegex = new RegExp('^[0-9]+$');
    findPhoneRegex = phoneRegex.test(mobileNumber);
    if (mobileNumber != '') {
      this.showMobileNumber = false;
      // if (
      //   validNumber == true &&
      //   mobileNumber.length >= 11 &&
      //   findPhoneRegex == true
      // ) {
      //   this.showPhoneDiv = false;
      // } else {
      //   this.showPhoneDiv = true;
      //   this.showMobileInput = true;
      //   this.showMobileNumber = false;
      // }
      if (mobileNumber.length > 10 && findPhoneRegex == true) {
        if(validNumber == true ){
          this.showPhoneDiv = false;
          this.showMobileInput = false;

        }
        else{
          this.showPhoneDiv = true;
          this.showMobileInput = true;
        }
      }else if(mobileNumber.length < 10 || findPhoneRegex == false){
        this.showMobileNumber = false;
        this.showPhoneDiv = true;
        this.showMobileInput = true;
      }
      else{
        this.showMobileNumber = false;
        this.showPhoneDiv = false;
        validNumber = true
      }
    } else {
      this.showMobileNumber = true;
      this.showPhoneDiv = false;
      this.showMobileInput = true;
    }
    this.userContactNumberDetails[0]['showPhoneDiv'] = this.showPhoneDiv;

    if (f.invalid && type == 'mobile' && this.showPhoneDiv == true) {
      this.showMobileInput = true;
      this.showMobile = true;
    }
    this.userContactNumberDetails[0]['showMobileDiv'] = this.showMobileDiv;
    if (type == 'mobile' && this.showPhoneDiv == false && validNumber == true) {
      this._pocnService
        .updateUserMobileNumber(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;
          if (
            response.data.updateUserMobileNumber.userProfileUpdateResponse
              .status === 'Success'
          ) {
            this.mobileNumberData =
              this.person['userContactProfile'][0].mobilePhoneNumber =
              this.userContactNumberDetails[0].mobilePhoneNumber =
                response.data.updateUserMobileNumber.userProfileUpdateResponse.data;
            this.showMobileInput = false;
            if (this.mobileNumberData == '') {
              this.showAddMobile = true;
            } else {
              this.showAddMobile = false;
            }
            const spanName = 'profile-mobile-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue:
                (this.userContactNumberDetails[0].mobilePhoneNumber =
                  response.data.updateUserMobileNumber.userProfileUpdateResponse.data),
              previousValue: f.value['mobilePhoneNumber'],
            };
            const eventName = 'profile mobile number edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated mobile number',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
          }
        });
    }
  }
  updateUserFax(type: string, f) {
    if (type == 'fax') {
      this.showFaxInput = false;
      this.showAddFax = false;
      this.showSaveFax = false;
      this.showEditFax = true;
      this.person['userContactProfile'][0].faxNumber =
        this.userContactNumberDetails[0].faxNumber;
    }
    let pattern = new RegExp('^[0-9]+$');
    let findFax = pattern.test(f.value['faxNumber']);
    if (type == 'fax' && findFax == false) {
      this.showFaxInput = true;
      this.person['userContactProfile'][0].faxNumber =
        this.userContactNumberDetails[0].faxNumber;
      this.showFax = true;
    } else {
      this.showFaxInput = false;
      this.showFax = false;
      // this.showAddFax = false;
    }
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      fax: this.userContactNumberDetails[0].faxNumber,
    };
    if (
      type == 'fax' &&
      !isNaN(this.userContactNumberDetails[0].faxNumber) == true
    ) {
      this._pocnService
        .updateUserFax(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;
          if (
            response.data.updateUserFax.userProfileUpdateResponse.status ===
            'Success'
          ) {
            this.showFaxInput = false;

            this.faxNumberData =
              this.person['userContactProfile'][0].faxNumber =
              this.userContactNumberDetails[0].faxNumber =
                response.data.updateUserFax.userProfileUpdateResponse.data;
            if (this.faxNumberData == '') {
              this.showAddFax = true;
            } else {
              this.showAddFax = false;
            }

            const spanName = 'profile-fax-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue:
                response.data.updateUserFax.userProfileUpdateResponse.data,
              previousValue: f.value['faxNumber'],
            };
            const eventName = 'profile fax number edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated fax number',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
          }
        });
    }
  }
  updateUserContactNumberDetails = (type: string, f) => {
    let contactProfile = [];

    if (type == 'fax') {
      this.showFaxInput = false;
      this.showAddFax = false;
      this.showSaveFax = false;
      this.showEditFax = true;
      this.person['userContactProfile'][0].faxNumber =
        this.userContactNumberDetails[0].faxNumber;
    } else if (type == 'mobile') {
      this.showMobileInput = false;
      this.showAddMobile = false;
      this.showSaveMobile = false;
      this.showEditMobile = true;
      this.person['userContactProfile'][0].mobilePhoneNumber =
        this.userContactNumberDetails[0].mobilePhoneNumber;
    } else if (type == 'telephone') {
      this.showTelephoneInput = false;
      this.showAddTelephone = false;
      this.showSaveTelephone = false;
      this.showEditTelephone = true;
      this.person['userContactProfile'][0].phoneNumber =
        this.userContactNumberDetails[0].phoneNumber;
    }

    let checkPhnNumArray = [];
    let checkMobileNumArray = [];
    // let pattern="^[0-9]
    let pattern = new RegExp('^[0-9]+$');
    let findFax = pattern.test(f.value['faxNumber']);
    if (type == 'fax' && findFax == false) {
      this.showFaxInput = true;
      this.person['userContactProfile'][0].faxNumber =
        this.userContactNumberDetails[0].faxNumber;
      this.showFax = true;
    }

    this.userContactNumberDetails.forEach((ed, index) => {
      if (checkPhnNumArray.includes(ed.mobilePhoneNumber)) {
        this.userContactNumberDetails[0]['showDuplicate'] = true;
      } else {
        checkPhnNumArray.push(ed.mobilePhoneNumber);
        this.userContactNumberDetails[0]['showDuplicate'] = false;
      }
      if (checkMobileNumArray.includes(ed.phoneNumber)) {
        this.userContactNumberDetails[0]['hasDuplicate'] = true;
      } else {
        checkMobileNumArray.push(ed.phoneNumber);
        this.userContactNumberDetails[0]['hasDuplicate'] = false;
      }
      //Phone number validation
      // let mobileNumber = f.value['mobilePhoneNumber'];
      let countryCodes;
      let validNumber;
      let phoneRegex;
      let findPhoneRegex;

      let mobileNumber =
        this.userContactNumberDetails[0].mobilePhoneNumber.replace('+', '');
      countryCodes = this.countryCodeArray;
      validNumber = countryCodes.some((elem) => mobileNumber.match('^' + elem));
      phoneRegex = new RegExp('^[0-9]+$');
      findPhoneRegex = phoneRegex.test(mobileNumber);
      if (mobileNumber != '') {
        if (
          validNumber == true &&
          mobileNumber.length > 10 &&
          findPhoneRegex == true
        ) {
          console.log(validNumber)
          this.showPhoneDiv = false;
        }else if(mobileNumber.length < 10 || findPhoneRegex == false){
          console.log(findPhoneRegex)
          this.showMobileNumber = false;
          this.showPhoneDiv = true;
          this.showTelephoneInput = true;
        }
        else{
          this.showMobileNumber = false;
          this.showPhoneDiv = false;
          validNumber = true
        }
        // if (
        //   validNumber == true &&
        //   mobileNumber.length >= 11 &&
        //   findPhoneRegex == true
        // ) {
        //   console.log(validNumber)
        //   this.showPhoneDiv = false;
        // } else {
        //   this.showPhoneDiv = true;
        // }
      }
      this.userContactNumberDetails[0]['showPhoneDiv'] = this.showPhoneDiv;

      let phoneNumber = this.userContactNumberDetails[0].phoneNumber.replace(
        '+',
        ''
      );
      let validPhnNumber = countryCodes.some((elem) =>
        phoneNumber.match('^' + elem)
      );
      let findPhoneRegex1 = phoneRegex.test(phoneNumber);
      if (phoneNumber != '') {
        if (
          validPhnNumber == true &&
          phoneNumber.length >= 11 &&
          findPhoneRegex1 == true
        ) {
          this.showMobileDiv = false;
        } else {
          this.showMobileDiv = true;
        }
      }
      this.userContactNumberDetails[0]['showMobileDiv'] = this.showMobileDiv;

      contactProfile.push({
        userId: this._pocnLocalStorageManager.getData('userId'),
        npi: this.userbasicDetails.npi,
        mobilePhoneNumber: mobileNumber,
        faxNumber: ed.faxNumber,
        phoneNumber: phoneNumber,
        isPrimary: true,
        email: ed.email,
        contactType: '1',
      });

      if (f.invalid && type == 'mobile' && this.showPhoneDiv == true) {
        this.showMobileInput = true;
        this.showMobile = true;
      }
      if (f.invalid && type == 'telephone' && this.showMobileDiv == true) {
        this.showTelephoneInput = true;
        this.showPhn = true;
      }
      if (type == 'mobile' && this.showPhoneDiv == true) {
        this.showMobileInput = true;
        this.showMobile = true;
      }
      if (type == 'telephone' && this.showMobileDiv == true) {
        this.showTelephoneInput = true;
        this.showPhn = true;
      }

      if (
        type == 'telephone' &&
        this.showMobileDiv == false &&
        validPhnNumber == true
      ) {
        this._pocnService
          .updateUserContactProfile(contactProfile, this.token)
          .subscribe((response: any) => {
            if (
              response.data.updateUserContactProfile.userProfileUpdateResponse
                .status === 'Success'
            ) {
              this.showFaxInput = false;
              // setTimeout(() => {
              //   this.getUserProfile();
              // }, 5000);
            }
          });
      }
      if (
        type == 'fax' &&
        !isNaN(this.userContactNumberDetails[0].faxNumber) == true
      ) {
        this._pocnService
          .updateUserContactProfile(contactProfile, this.token)
          .subscribe((response: any) => {
            if (
              response.data.updateUserContactProfile.userProfileUpdateResponse
                .status === 'Success'
            ) {
              this.showFaxInput = false;
              // setTimeout(() => {
              //   this.getUserProfile();
              // }, 5000);
            }
          });
      }
      if (
        type == 'mobile' &&
        this.showPhoneDiv == false &&
        validNumber == true
      ) {
        this._pocnService
          .updateUserContactProfile(contactProfile, this.token)
          .subscribe((response: any) => {
            if (
              response.data.updateUserContactProfile.userProfileUpdateResponse
                .status === 'Success'
            ) {
              this.showFaxInput = false;
              // setTimeout(() => {
              //   this.getUserProfile();
              // }, 5000);
            }
          });
      }
    }); // this.contactSuccess = true;
  };
  addHyphen(val, index) {
    const self = this;
    let chIbn = val.split('-').join('');
    if (chIbn.length > 0) {
      chIbn = chIbn.match(new RegExp('.{1,5}', 'g')).join('-');
    } else {
      chIbn = val;
    }
    // this.addressList[index]['addressZip'] = chIbn;
    this.userAddressDetails[0].addressZip = chIbn;
  }
  updateState(type: string, f: NgForm) {
    if (type == 'state') {
      this.showStateInput = false;
      this.showAddState = false;
      this.showSaveState = false;
      this.showEditState = true;
      this.previousStateValue =
        this.person['userAddressProfile'][0].addressState;
      //this.person['userAddressProfile'][0].addressState = this.userAddressDetails[0].addressState;
      this.person['userAddressProfile'][0].addressState =
        f.value['state'].statevalue;
      //this.stateListTemp.statevalue = f.value['state'].statevalue;
    }
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      //state: this.userAddressDetails[0].addressState,
      state: this.person['userAddressProfile'][0].addressState,
    };
    if (
      type == 'state' &&
      this.person['userAddressProfile'][0].addressState != null
    ) {
      this._pocnService
        .updateUserState(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;
          if (
            response.data.updateUserState.userProfileUpdateResponse.status ===
            'Success'
          ) {
            //this.userAddressDetails[0].addressState = response.data.updateUserState.userProfileUpdateResponse.data;

            // this.stateData = this.stateListTemp.statevalue = JSON.parse(JSON.stringify(response.data.updateUserState.userProfileUpdateResponse.data));
            // this.showStateInput = false;

            this.stateData =
              this.person['userAddressProfile'][0].addressState =
              this.userAddressDetails[0].addressState =
                response.data.updateUserState.userProfileUpdateResponse.data;

            // this.getUserState();
            const spanName = 'profile-state-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue: (this.userAddressDetails[0].addressState =
                response.data.updateUserState.userProfileUpdateResponse.data),
              previousValue: this.previousStateValue,
            };
            const eventName = 'profile state edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated state',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
          }
        });
    }
  }
  updateCity(type: string, f) {
    if (type == 'city') {
      this.showCityInput = false;
      this.showAddCity = false;
      this.showSaveCity = false;
      this.showEditCity = true;
      this.previousCityValue = this.person['userAddressProfile'][0].addressCity;

      this.person['userAddressProfile'][0].addressCity =
        this.userAddressDetails[0].addressCity;
    }
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      city: this.userAddressDetails[0].addressCity,
    };
    if (type == 'city') {
      this._pocnService
        .updateUserCity(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;

          if (
            response.data.updateUserCity.userProfileUpdateResponse.status ===
            'Success'
          ) {
            this.cityData =
              this.person['userAddressProfile'][0].addressCity =
              this.userAddressDetails[0].addressCity =
                response.data.updateUserCity.userProfileUpdateResponse.data;
            this.showCityInput = false;
            if (this.cityData == '') {
              this.showAddCity = true;
            } else {
              this.showAddCity = false;
            }
            // this.getUserCity();
            const spanName = 'profile-city-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue: (this.userAddressDetails[0].addressCity =
                response.data.updateUserCity.userProfileUpdateResponse.data),
              previousValue: this.previousCityValue,
            };
            const eventName = 'profile city edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated city',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
          }
        });
    }
  }
  updateCredentials(type: string, f) {
    if (type == 'credentials') {
      this.showCredentialsInput = false;
      this.showAddCredentials = false;
      this.showSaveCredentials = false;
      this.showEditCredentials = true;
      this.previousCredentialValue =
        this.person.userBasicProfile.userDegreeCodeText;
      this.person.userBasicProfile.userDegreeCodeText =
        this.userbasicDetails.userDegreeCodeText;
    }
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      degreeCodeText: this.userbasicDetails.userDegreeCodeText,
    };
    if (type == 'credentials') {
      this._pocnService
        .updateUserDegreeCodeText(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;
          if (
            response.data.updateUserDegreeCodeText.userProfileUpdateResponse
              .status === 'Success'
          ) {
            // this.credentialsData = this.person.userDegreeCodeText = this.userAddressDetails[0].addressCity = response.data.updateUserCity.userProfileUpdateResponse.data;
            this.credentialsData =
              this.person.userBasicProfile.userDegreeCodeText =
              this.userbasicDetails.userDegreeCodeText =
                response.data.updateUserDegreeCodeText.userProfileUpdateResponse.data;
            this.showCredentialsInput = false;
            if (this.credentialsData == '') {
              this.showAddCredentials = true;
            } else {
              this.showAddCredentials = false;
            }
            // this.getUserCity();
            const spanName = 'profile-credentials-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue:
                response.data.updateUserDegreeCodeText.userProfileUpdateResponse
                  .data,
              previousValue: this.previousCredentialValue,
            };
            const eventName = 'profile credentials edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated credentials',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
          }
        });
    }
  }
  updateZip(type: string, f) {
    let regexZipCode = new RegExp(/^[0-9-]+$/);
    let searchZipCode = regexZipCode.test(
      this.userAddressDetails[0].addressZip
    );
    if (type == 'zip') {
      this.showZipInput = false;
      this.showAddZip = false;
      this.showSaveZip = false;
      this.showEditZip = true;
      this.person['userAddressProfile'][0].addressZip =
        this.userAddressDetails[0].addressZip;
    }
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      zip: this.userAddressDetails[0].addressZip,
    };
    let address = [];
    if (f.invalid && type == 'zip') {
      this.showZipInput = true;
      this.showZip = true;

      // this.person['userAddressProfile'][0].addressZip = this.userAddressDetails[0].addressZip = this.zipData;
    } else {
      this.showZipInput = false;
      this.showZip = false;
    }
    if (
      type == 'zip' &&
      !(
        this.userAddressDetails[0].addressZip.length == 5 ||
        this.userAddressDetails[0].addressZip.length == 10
      )
    ) {
      this.showZipInput = true;
      this.showZip = true;
      // this.userAddressDetails[0].addressZip = this.person['userAddressProfile'][0].addressZip  ;
    }
    if (
      searchZipCode == true &&
      (this.userAddressDetails[0].addressZip.length == 5 ||
        this.userAddressDetails[0].addressZip.length == 10)
    ) {
      this._pocnService
        .updateUserZip(contactProfileDetails)
        .subscribe((response: any) => {
          this.showPattern = true;
          if (
            response.data.updateUserZip.userProfileUpdateResponse.status ===
            'Success'
          ) {
            // this.getUserZip();
            this.zipData =
              this.person['userAddressProfile'][0].addressZip =
              this.userAddressDetails[0].addressZip =
                response.data.updateUserZip.userProfileUpdateResponse.data;
            this.showZipInput = false;
            if (this.zipData == '') {
              this.showAddZip = true;
            } else {
              this.showAddZip = false;
            }

            const spanName = 'profile-zip-edit-btn';
            let attributes = {
              userId: this._pocnLocalStorageManager.getData('userId'),
              firstName: this._pocnLocalStorageManager.getData('firstName'),
              lastName: this._pocnLocalStorageManager.getData('lastName'),
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              updatedValue:
                response.data.updateUserZip.userProfileUpdateResponse.data,
              previousValue: f.value['addressZip'],
            };
            const eventName = 'profile fax number edit';
            const event = {
              userEmail: this._pocnLocalStorageManager.getData('userEmail'),
              status: 'success',
              message: 'successfully updated Zip code',
            };
            this.telemetry
              .sendTrace(spanName, attributes, eventName, event)
              .then((result: string) => {
                this.telemetry.parentTrace = result;
              });
          }
        });
    }
  }
  updateUserAddressDetails = (type: string, f) => {
    let regexZipCode = new RegExp(/^[0-9-]+$/);
    let searchZipCode = regexZipCode.test(
      this.userAddressDetails[0].addressZip
    );
    if (type == 'zip') {
      this.showZipInput = false;
      this.showAddZip = false;
      this.showSaveZip = false;
      this.showEditZip = true;
      this.person['userAddressProfile'][0].addressZip =
        this.userAddressDetails[0].addressZip;
    }
    if (type == 'state') {
      this.showStateInput = false;
      this.showAddState = false;
      this.showSaveState = false;
      this.showEditState = true;
      this.person['userAddressProfile'][0].addressState =
        this.userAddressDetails[0].addressState;
    }
    if (type == 'city') {
      this.showCityInput = false;
      this.showAddCity = false;
      this.showSaveCity = false;
      this.showEditCity = true;
      this.person['userAddressProfile'][0].addressCity =
        this.userAddressDetails[0].addressCity;
    }
    let address = [];
    if (f.invalid && type == 'zip') {
      this.showZipInput = true;
      this.showZip = true;
    }
    if (
      type == 'zip' &&
      !(
        this.userAddressDetails[0].addressZip.length == 5 ||
        this.userAddressDetails[0].addressZip.length == 10
      )
    ) {
      this.showZipInput = true;
      this.showZip = true;
    }
    this.addressList.forEach((ad, index) => {
      address.push({
        userId: this._pocnLocalStorageManager.getData('userId'),
        npi: this.userbasicDetails.npi,
        addressType: '1',
        addressUnit: '',
        addressLine1: ad.addressLine1,
        addressLine2: ad.addressLine2,
        addressCity: this.userAddressDetails[0].addressCity,
        addressState: this.userAddressDetails[0].addressState,
        addressZip: this.userAddressDetails[0].addressZip,
        addressCountry: '',
        timeZone: ad.timeZone,
        isPrimary: true,
      });
    });
    // ad.addressZip != '' && (ad.addressZip.length == 5 || ad.addressZip.length == 10) && searchZipCode == true
    if (
      searchZipCode == true &&
      (this.userAddressDetails[0].addressZip.length == 5 ||
        this.userAddressDetails[0].addressZip.length == 10)
    ) {
      this._pocnService
        .updateAddress(address, this.token)
        .subscribe((response: any) => {
          if (response.data) {
            if (
              response.data.updateUserAddressProfile.userProfileUpdateResponse
                .status === 'Success'
            ) {
              this.showZipInput = false;
              // this.getUserProfile();
            }
          }
        });
    } else if (type == 'state') {
      this._pocnService
        .updateAddress(address, this.token)
        .subscribe((response: any) => {
          if (response.data) {
            if (
              response.data.updateUserAddressProfile.userProfileUpdateResponse
                .status === 'Success'
            ) {
              this.showStateInput = false;
              // setTimeout(() => {
              //   this.getUserProfile();
              // }, 5000);
            }
          }
        });
    } else if (type == 'city') {
      this._pocnService
        .updateAddress(address, this.token)
        .subscribe((response: any) => {
          if (response.data) {
            if (
              response.data.updateUserAddressProfile.userProfileUpdateResponse
                .status === 'Success'
            ) {
              this.showCityInput = false;
              // if(this.userAddressDetails[0].addressCity != ''){
              //   this.showAddCity = false;;
              // }
              // setTimeout(() => {
              //   this.getUserProfile();
              // }, 5000);
            }
          }
        });
    }
  };
  goToSettings() {
    this.router.navigate(['settings']);
  }

  addResume() {
    this.showResume = true;
  }
  editResume() {
    this.showResume = true;
  }

  async selectFile() {
    let permissions: any;
    let listPermission: any;
    switch (this.appPlatform) {
      case 'web':
        this.pickResumeInput.nativeElement.click();
        break;
      case 'android':
        try {
          permissions = await Filesystem.requestPermissions();
        } catch (error) {
          console.log(error);
        }
        listPermission = await Filesystem.checkPermissions();
        if (listPermission.publicStorage === 'granted') {
          console.log(permissions, 'checking permission');
          this.pickResumeInput.nativeElement.click();
        } else {
          this.presentAlert();
        }
        break;
      case 'ios':
        try {
          permissions = await Camera.requestPermissions();
        } catch (error) {
          console.log(error);
        }
        listPermission = await Camera.checkPermissions();
        if (
          listPermission.photos === 'granted' ||
          listPermission.photos === 'limited'
        ) {
          this.filePicker
            .pickFile()
            .then((uri) => {
              console.log(uri);
              this.pickResumeIOS(uri);
            })
            .catch((err) => console.log('Error', err));
        } else {
          this.presentAlert();
        }
        break;
    }
  }

  async pickResumeIOS(url: string) {
    let fileSize: any;
    let path: any;
    let content: any;
    this.fileErrorStatus = false;
    this.successStatus = false;
    const fileName = url.split('/').pop();
    const filetype = url.split('.').pop();
    console.group('FILE_UPLOAD');
    console.log('%c _________iosfunction_calld________', 'color: green');
    console.log('%c__filetype: ', 'color: yellow', filetype);
    this.myResumeName = fileName;
    console.log('%c__fileName: ', 'color: yellow', fileName);
    try {
      path = await this.file.resolveLocalFilesystemUrl(`file://${url}`);
    } catch (err) {
      console.log(err);
    }
    console.log('%c__filePath: ', 'color: yellow', path);
    content = await Filesystem.readFile({ path: path.nativeURL });
    const buffer: any = content.data.substring(content.data.indexOf(',') + 1);
    fileSize = buffer.length / 1000000;
    console.log('%c__fileSize: ', 'color: yellow', fileSize);
    if (this.resumeFileType.includes(`application/${filetype}`)) {
      if (fileSize / 1000000 <= 2) {
        this.uploadedFile = `data:application/${filetype};base64,${content.data}`;
        console.log('%c__Base64: ', 'color: #D61355', content.data);
        console.groupEnd();
        this.resumeSave();
      } else {
        this.fileErrorStatus = true;
        this.errorMsg =
          'Upload failed. Maximum file upload size is restricted to 2 MB.';
      }
    } else {
      this.fileErrorStatus = true;
      this.errorMsg =
        'Upload failed. Please select a valid file format (doc, docx, pdf and txt).';
    }
    return;
  }

  pickResume(event) {
    this.fileErrorStatus = false;
    this.successStatus = false;
    const file = (event.target as HTMLInputElement).files[0];
    this.myResumeName = file.name;
    if (this.resumeFileType.includes(file.type)) {
      if (file.size / 1000000 <= 2) {
        this.convertToBase64(event.target.files[0]).subscribe((base64) => {
          this.uploadedFile = base64;
          this.resumeSave();
        });
      } else {
        this.fileErrorStatus = true;
        this.errorMsg =
          'Upload failed. Maximum file upload size is restricted to 2 MB.';
      }
    } else {
      this.fileErrorStatus = true;
      this.errorMsg =
        'Upload failed. Please select a valid file format (doc, docx, pdf and txt).';
    }
  }
  convertToBase64(file: File): Observable<string> {
    console.log(file, 'file path on convert function');
    const result = new ReplaySubject<any>(1);
    let reader = new FileReader();
    const realFileReader = (reader as any)._realReader;
    if (realFileReader) {
      reader = realFileReader;
    }
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      console.log(reader.result, 'converted base64');
      result.next(reader.result);
    };
    return result;
  }
  resumeSave() {
    const resumeMutate = {
      accessCode: this._pocnLocalStorageManager.getData('pocnApiAccessToken'),
      fileContent: this.uploadedFile,
      fileName: this.myResumeName,
      npi: this.person.userBasicProfile.npi,
      providerId: this.person.userBasicProfile.providerId,
      userId: this.person.userBasicProfile.userId,
    };
    this.successStatus = false;
    this.fileErrorStatus = false;
    this.fileLoader = true;
    this._pocnService
      .updateUserResume(resumeMutate)
      .subscribe((response: any) => {
        if (
          response.data.updateUserResume.userProfileUpdateResponse.status ==
          'Success'
        ) {
          console.log('hiiiii');
          this.successStatus = true;
          this.successStatusResume = true;
          this.fileLoader = false;
          this.successMsg = 'Resume successfully saved';
          this.getUserProfile();
        } else {
          this.fileErrorStatus = true;
          this.errorMsg =
            response.data.updateUserResume.userProfileUpdateResponse.message;
          this.fileLoader = false;
        }
      });
  }
  // ionViewDidEnter() {
  //   this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {

  //   });
  // }

  ionViewDidLeave() {
    this.backButtonSubscription.unsubscribe();
  }
  getUserFirstName() {
    this._pocnService.getUserFirstName(this.token).subscribe(({ data }) => {
      this.firstNameData = data['getUserFirstName'].data;
      this.showFirstnameInput = false;
      this.userbasicDetails.firstName = this.person.userBasicProfile.firstName =
        this.firstNameData;
      if (
        this.userbasicDetails.firstName == '' ||
        this.person.userBasicProfile.firstName == ''
      ) {
        this.userbasicDetails.firstName = this.firstNameData;
        this.person.userBasicProfile.firstName = this.firstNameData;
        if (this.firstNameData == '') {
          this.showAddFirstname = true;
        }
      }
    });
  }
  getUserLastName() {
    this._pocnService.getUserLastName(this.token).subscribe(({ data }) => {
      this.lastNameData = data['getUserLastName'].data;
      this.showLastNameInput = false;
      this.userbasicDetails.lastName = this.person.userBasicProfile.lastName =
        this.lastNameData;
      if (
        this.userbasicDetails.lastName == '' ||
        this.person.userBasicProfile.lastName == ''
      ) {
        this.userbasicDetails.lastName = this.lastNameData;
        this.person.userBasicProfile.lastName = this.lastNameData;
        if (this.lastNameData == '') {
          this.showAddLastName = true;
        }
      }
    });
  }
  getUserTagline() {
    this._pocnService.getUserTagline(this.token).subscribe(({ data }) => {
      this.taglineData = data['getUserTagline'].data;
      this.showTagLineInput = false;
      this.showAddTagLine = false;
      this.userbasicDetails.profileTagLine =
        this.person.userBasicProfile.profileTagLine = this.taglineData;
      if (
        this.userbasicDetails.profileTagLine == '' ||
        this.person.userBasicProfile.profileTagLine == ''
      ) {
        this.userbasicDetails.profileTagLine = this.taglineData;
        this.person.userBasicProfile.profileTagLine = this.taglineData;
        if (this.taglineData == '') {
          this.showAddTagLine = true;
        } else {
          this.showAddTagLine = false;
        }
      }
    });
  }
  getUserState() {
    this._pocnService.getUserState(this.token).subscribe(({ data }) => {
      this.stateData = JSON.parse(JSON.stringify(data['getUserState'].data));

      //JSON.parse(JSON.stringify(response.data.updateUserState.userProfileUpdateResponse.data));

      let stateTemp = this.stateList.filter((obj) => {
        return obj.statevalue === this.stateData;
      });

      if (stateTemp.length > 0) {
        this.stateListTemp = {
          id: stateTemp[0].id,
          statename: stateTemp[0].statename,
          statevalue: stateTemp[0].statevalue,
        };
      } else {
        this.stateListTemp = { id: '', statename: '', statevalue: '' };
      }
    });
  }
  getUserCity() {
    this._pocnService.getUserCity(this.token).subscribe(({ data }) => {
      this.cityData = data['getUserCity'].data;
      this.showCityInput = false;

      this.userAddressDetails[0].addressCity = this.person[
        'userAddressProfile'
      ][0].addressCity = this.cityData;
      if (
        this.userAddressDetails[0].addressCity == '' ||
        this.person['userAddressProfile'][0].addressCity == ''
      ) {
        this.userAddressDetails[0].addressCity = this.cityData;
        this.person['userAddressProfile'][0].addressCity = this.cityData;
        if (this.cityData == '') {
          this.showAddCity = true;
        } else {
          this.showAddCity = false;
        }
      }
    });
  }
  getUserDegreeCodeText() {
    this._pocnService
      .getUserDegreeCodeText(this.token)
      .subscribe(({ data }) => {
        this.credentialsData = data['getUserDegreeCodeText'].data;
        this.showCredentialsInput = false;
        this.userbasicDetails.userDegreeCodeText =
          this.person.userBasicProfile.userDegreeCodeText =
            this.credentialsData;
        if (
          this.userbasicDetails.userDegreeCodeText == '' ||
          this.person.userBasicProfile.userDegreeCodeText == ''
        ) {
          this.userbasicDetails.userDegreeCodeText = this.credentialsData;
          this.person.userBasicProfile.userDegreeCodeText =
            this.credentialsData;
          if (this.credentialsData == '') {
            this.showAddCredentials = true;
          } else {
            this.showAddCredentials = false;
          }
        }
      });
  }
  getUserZip() {
    this._pocnService.getUserZip(this.token).subscribe(({ data }) => {
      this.zipData = data['getUserZip'].data;
      this.showZipInput = false;
      // this.showAddZip = false;
      this.userAddressDetails[0].addressZip = this.person[
        'userAddressProfile'
      ][0].addressZip = this.zipData;
      if (
        this.userAddressDetails[0].addressZip == '' ||
        this.person['userAddressProfile'][0].addressZip == ''
      ) {
        this.userAddressDetails[0].addressZip = this.zipData;
        this.person['userAddressProfile'][0].addressZip = this.zipData;
        if (this.zipData == '') {
          this.showAddZip = true;
        } else {
          this.showAddZip = false;
        }
      }
    });
  }
  getUserFaxNumber() {
    this._pocnService.getUserFaxNumber(this.token).subscribe(({ data }) => {
      this.faxNumberData = data['getUserFaxNumber'].data;
      this.showFaxInput = false;
      // this.showAddFax = false;
      this.userContactNumberDetails[0].faxNumber =
        this.person['userContactProfile'][0].faxNumber =
        this.faxNumberData =
          this.faxNumberData;
      // this.person['userContactProfile'][0].faxNumber = this.faxNumberData;
      if (
        this.userContactNumberDetails[0].faxNumber == '' ||
        this.person['userContactProfile'][0].faxNumber == ''
      )
        this.userContactNumberDetails[0].faxNumber = this.faxNumberData;
      this.person['userContactProfile'][0].faxNumber = this.faxNumberData;
      if (this.faxNumberData == '') {
        this.showAddFax = true;
      } else {
        this.showAddFax = false;
      }
    });
  }
  getUserPhoneNumber() {
    this._pocnService.getUserPhoneNumber(this.token).subscribe(({ data }) => {
      this.phoneNumberData = data['getUserPhoneNumber'].data;
      this.showTelephoneInput = false;

      this.userContactNumberDetails[0].phoneNumber =
        this.person['userContactProfile'][0].phoneNumber =
        this.phoneNumberData =
          this.phoneNumberData;
      // this.person['userContactProfile'][0].phoneNumber = this.phoneNumberData;
      if (
        this.userContactNumberDetails[0].phoneNumber == '' ||
        this.person['userContactProfile'][0].phoneNumber == ''
      ) {
        this.userContactNumberDetails[0].phoneNumber = this.phoneNumberData;
        this.person['userContactProfile'][0].phoneNumber = this.phoneNumberData;
        if (this.phoneNumberData == '') {
          this.showAddTelephone = true;
        } else {
          this.showAddTelephone = false;
        }
      }
    });
  }
  getUserMobileNumber() {
    this._pocnService.getUserMobileNumber(this.token).subscribe(({ data }) => {
      this.mobileNumberData = data['getUserMobileNumber'].data;
      this.showMobileInput = false;

      this.userContactNumberDetails[0].mobilePhoneNumber = this.person[
        'userContactProfile'
      ][0].mobilePhoneNumber = this.mobileNumberData;
      // this.person['userContactProfile'][0].mobilePhoneNumber = this.mobileNumberData;
      if (
        this.userContactNumberDetails[0].mobilePhoneNumber == '' ||
        this.person['userContactProfile'][0].mobilePhoneNumber == ''
      ) {
        this.userContactNumberDetails[0].mobilePhoneNumber =
          this.mobileNumberData;
        this.person['userContactProfile'][0].mobilePhoneNumber =
          this.mobileNumberData;
        if (this.mobileNumberData == '') {
          this.showAddMobile = true;
        } else {
          this.showAddMobile = false;
        }
      }
    });
  }
  getUserTwitterProfile() {
    this._pocnService
      .getUserTwitterProfile(this.token)
      .subscribe(({ data }) => {
        this.twitterData = data['getUserTwitterProfile'].data;
        this.showTwitterInput = false;
        this.showEditTwitter = true;
        this.showAddTwitter = false;
        this.showTwitterMsg = false;
        this.userbasicDetails.twitter = this.person.userBasicProfile.twitter =
          this.twitterData;
        if (
          this.userbasicDetails.twitter == '' ||
          this.person.userBasicProfile.twitter == ''
        )
          this.userbasicDetails.twitter = this.twitterData;
        this.person.userBasicProfile.twitter = this.twitterData;
        if (this.twitterData == '') {
          this.showAddTwitter = true;
          this.showEditTwitter = false;
        }
      });
  }

  getUserFbProfile() {
    this._pocnService.getUserFbProfile(this.token).subscribe(({ data }) => {
      this.fbData = data['getUserFbProfile'].data;
      this.showFacebookInput = false;
      this.showEditFacebook = true;
      this.showAddFacebook = false;
      this.showFacebookMsg = false;
      this.userbasicDetails.facebook = this.person.userBasicProfile.facebook =
        this.fbData;
      if (
        this.userbasicDetails.facebook == '' ||
        this.person.userBasicProfile.facebook == ''
      )
        this.userbasicDetails.facebook = this.fbData;
      this.person.userBasicProfile.facebook = this.fbData;
      if (this.fbData == '') {
        this.showAddFacebook = true;
        this.showEditFacebook = false;
      }
    });
  }
  getUserLinkedinProfile() {
    this._pocnService
      .getUserLinkedinProfile(this.token)
      .subscribe(({ data }) => {
        this.linkedinData = data['getUserLinkedinProfile'].data;
        this.showLinkedInInput = false;
        this.showEditLinkedIn = true;
        this.showAddLinkedIn = false;
        this.showLinkedinMsg = false;
        this.userbasicDetails.linkedin = this.person.userBasicProfile.linkedin =
          this.linkedinData;
        if (
          this.userbasicDetails.linkedin == '' ||
          this.person.userBasicProfile.linkedin == ''
        ) {
          this.userbasicDetails.linkedin = this.linkedinData;
          this.person.userBasicProfile.linkedin = this.linkedinData;
          if (this.linkedinData == '') {
            this.showAddLinkedIn = true;
            this.showEditLinkedIn = false;
          }
        }
      });
  }
  getUserWebsite() {
    this._pocnService.getUserWebsite(this.token).subscribe(({ data }) => {
      this.webisteData = data['getUserWebsite'].data;
      this.showWebsiteInput = false;
      this.showEditWebsite = true;
      this.showAddWebsite = false;
      this.showWebsiteMsg = false;
      this.userbasicDetails.website = this.person.userBasicProfile.website =
        this.webisteData;
      if (
        this.userbasicDetails.website == '' ||
        this.person.userBasicProfile.website == ''
      ) {
        this.userbasicDetails.website = this.webisteData;
        this.person.userBasicProfile.website = this.webisteData;
        if (this.webisteData == '') {
          this.showAddWebsite = true;
          this.showEditWebsite = false;
        }
      }
    });
  }
  async close() {
    await this.modalController.dismiss();
  }
  imageErrorUrl(e: any) {
    this.profileImgUrl = 'assets/images-pocn/group-default-thumbnail.svg';
  }
  getUserStat() {
    this._pocnService.getUserStat(this.token)?.subscribe(({ data }) => {
      this.userDetailsQuery = data['getUserStat'].data;
      this.likeCount = data['getUserStat'].data['likesCount'];
      this.connectionCount = data['getUserStat'].data['connectionCount'];
      this.postCount = data['getUserStat'].data['postsCount'];
      this.pointCount = data['getUserStat'].data['pointsCount'];
      this.followersCount = data['getUserStat'].data['followersCount'];
    });
  }

  patientConnectStatusCalls() {
    this._pocnService
      .patientConnectStatusCalls(
        this._pocnLocalStorageManager.getData('userId').toUpperCase()
      )
      .subscribe(({ data }) => {
        if (data.patientConnectStatusCalls.nodes != '') {
          let setSuccess;
          setSuccess = data.patientConnectStatusCalls.nodes[0];
          this.hcpVerified = setSuccess.hcpVerified;
          this.phoneLinked = setSuccess.phoneLinked;
          this.verificationType = setSuccess.verificationType;
          this.connectStatus = setSuccess.patientConnectRegistrationStatus == 1;
          // if (setSuccess.patientConnectRegistrationStatus == 1) {
          //   if(type == 'audio') {
          //    this.connectNav =  this.router.navigate(['/dialer']);
          //    this.audioType= true;
          //   } else {
          //     this.audioType= false;

          //     this.goToVideoCall();
          //   }
          // } else {
          //   this.router.navigateByUrl('/connect', {
          //     state: { tabName: 'my-profile', type: type },
          //   });
          // }
        }
      });
  }
  statusConnectCalls(type){
    localStorage.removeItem('typeConnect');
    localStorage.setItem(
      "typeConnect",
      type
    );
    if (this.connectStatus == 1) {
      if(type == "audio"){
        this.router.navigate(['/dialer']);
      }else{
        this.goToVideoCall();
      }
  }else {
    this.router.navigateByUrl('/connect', {
      state: { tabName: 'my-profile', type: type },
    });
  }
}
  goToVideoCall() {
    let createRoom: any;
    createRoom = {
      accessToken: this.token,
      channel: this.device.userAgent,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      geoLocation: this.geolocationPosition,
    };
    this._pocnService
      .createRoom(createRoom)
      .subscribe((response: CreateRoomResponse) => {
        if (
          response.data.createRoom.updateConnectionResponse.status === 'success'
        ) {
          this.userRoomData =
            response.data.createRoom.updateConnectionResponse.data;
          const spanName = 'connect-call-create-room-btn';
          let attributes = {
            userId: this._pocnLocalStorageManager.getData('userId'),
            firstName: this._pocnLocalStorageManager.getData('firstName'),
            lastName: this._pocnLocalStorageManager.getData('lastName'),
            userEmail: this._pocnLocalStorageManager.getData('userEmail'),
          };
          const eventName = 'connect video call create room';
          const event = {
            userEmail: this._pocnLocalStorageManager.getData('userEmail'),
            status: 'success',
            message: 'successfully room created in video call',
          };
          this.telemetry
            .sendTrace(spanName, attributes, eventName, event)
            .then((result: string) => {
              this.telemetry.parentTrace = result;
            });
        }
        this.router.navigateByUrl('/dialer2', {
          state: { userDataId: this.userRoomData },
        });
      });
  }
  loadIp() {
    this.httpClient.get('https://jsonip.com').subscribe(
      (value: any) => {
        this.userIp = value.ip;
      },
      (error) => {}
    );
  }
  getUserPost() {
    this.loadPostView = false;;
    this.searchLoaderStatus = false;
    let token = this._pocnLocalStorageManager.getData('pocnApiAccessToken');
    let i = this.postUserView.length;
    this._pocnService.pocnLimitedUserPost(token, i)?.subscribe(({ data }) => {
      this.loadPostView = true;
        if (this.loading.isLoading) {
        this.loading.dismiss();
      }
      this.searchLoaderStatus = true;
      let postList = JSON.parse(JSON.stringify(data['getUserPost'].data));
      postList.forEach((pst, index) => {
        let dt = pst.postDate + 'Z';
        let date = new Date(dt);
        pst.postDate = date;
        pst.profileImgUrl =
          environment.postProfileImgUrl +
          pst.userId +
          '.' +
          pst.fileExtension +
          '?lastmod=' +
          Math.random();

        let postImageUrl =
          environment.postImgUrl + pst.fileName + '?lastmod=' + Math.random();
        var encoded_url = btoa(postImageUrl)
          .replace(/=/g, '')
          .replace(/\//g, '_')
          .replace(/\+/g, '-');
        var path =
          '/rs:' +
          'fit' +
          ':' +
          '300' +
          ':' +
          '400' +
          ':' +
          0 +
          '/g:' +
          'no' +
          '/' +
          encoded_url +
          '.' +
          pst.fileExtension;
        //console.log(path)
        var shaObj = new jsSHA('SHA-256', 'BYTES');
        shaObj.setHMACKey(environment.imageProxyKey, 'HEX');
        shaObj.update(this.hex2a(environment.imageProxySalt));
        shaObj.update(path);
        var hmac = shaObj
          .getHMAC('B64')
          .toString()
          .replace(/=/g, '')
          .replace(/\//g, '_')
          .replace(/\+/g, '-');

        pst.postImageUrl =
          environment.imageProxyUrl +
          '/' +
          hmac +
          path +
          '?lastmod=' +
          Math.random();
        this.groupViewLink = environment.groupLink + '/group-details-edit/';
        //descrition
        const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        const isBase64 = base64RegExp.test(pst.description);
        pst.newLinkDescription = decodeURIComponent(escape(window.atob( pst.description)));
        console.log( pst.newDescription)
        let descriptionLinkData = pst.newLinkDescription.replace('==*', '');
        console.log( pst.description)
        if(isBase64 == true){
          console.log( pst.description)
          pst.newDescription = decodeURIComponent(escape(window.atob( pst.description)));
          console.log( pst.newDescription)
          let descriptionData = pst.newDescription.replace('==*', '');
          this.groupLinkdata = descriptionData.split(':-');
          if (this.groupLinkdata[1]) {
            let startPos = pst.newDescription.indexOf('==>') + 1
            let endPos = pst.newDescription.indexOf('==>', startPos)
            let textDesc = pst.newDescription.substring(startPos, endPos)
            let newDescription = textDesc.replace('=>', '')
            this.viewLink = false
            pst.newDescription = newDescription;
            pst.descDataLink= this.groupLinkdata[0];

            console.log(pst.newDescription)
            pst.colorCss = 'faq'
          }else if(descriptionLinkData.includes('Check out my new Group')){
              let startPos = pst.newLinkDescription.indexOf('==>') + 1;
              let endPos = pst.newLinkDescription.indexOf('==>',startPos);
              let textDesc = pst.newLinkDescription.substring(startPos,endPos)
              pst.newDescription = textDesc.replace('=>', '');
              console.log( pst.newLinkDescription )
              console.log( textDesc)
                // let urlData =descriptionData.slice(
                //   descriptionData.indexOf('/') + 1,
                //   descriptionData.lastIndexOf('Check out my new Group'),
                // );
                // this.url =urlData.slice(urlData.lastIndexOf('/') + 1).replace('==>', '');
            }
          else {
            this.viewLink = true;
            pst.colorCss = '';
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            const isBase64 = base64RegExp.test(pst.description)
            if(isBase64 == true){
              pst.newDescription = decodeURIComponent(escape(window.atob(pst.description)))
            }
            else{
              pst.newDescription  = pst.description;
            }
          }
        }
        // else{
        //   pst.newDescription  = pst.description;
        // }
      // else {
      //     this.viewLink = true
      //     pst.colorCss = ''
      //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
      //     const isBase64 = base64RegExp.test(pst.description )
      //     if(isBase64 == true){
      //       pst.description  = decodeURIComponent(escape(window.atob(pst.description )))
      //     }
      //     else{
      //       pst.description  = pst.description ;
      //     }
      //   }
        //parent content
        if(pst.parentPostContent) {
            const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
            const isBase64 = base64RegExp.test(pst.parentPostContent);
            console.log( pst.parentPostContent)
          if(isBase64 == true){
            console.log( pst.parentPostContent)
            pst.newContentDescription = decodeURIComponent(escape(window.atob( pst.parentPostContent)));
            console.log( pst.newContentDescription)
            let descriptionContentData = pst.newContentDescription.replace('==*', '');
            this.groupLinkContentdata = descriptionContentData.split(':-');
            if (this.groupLinkContentdata[1]) {
              let startPos = pst.newContentDescription.indexOf('==>') + 1
              let endPos = pst.newContentDescription.indexOf('==>', startPos)
              let textDesc = pst.newContentDescription.substring(startPos, endPos)
              let newContentDescription = textDesc.replace('=>', '')
              this.viewLink = false;
              pst.descDataContentLink= this.groupLinkdata[0];
              pst.newContentDescription = newContentDescription
              console.log(pst.newContentDescription)
              pst.colorCss = 'faq'
            }
            else {
              this.viewLink = true
              pst.colorCss = '';
              const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
              const isBase64 = base64RegExp.test(pst.parentPostContent)
              if(isBase64 == true){
                pst.parentPostContent = decodeURIComponent(escape(window.atob(pst.parentPostContent)))
              }
              else{
                pst.parentPostContent  = pst.parentPostContent;
              }
            }
          }
      }
        // let descriptionData = pst.description.replace('==*', '');
        // this.groupLinkdata = descriptionData.split(':-');
        // const urlRegex = /(https?:\/\/[^\s]+)/g;
        // if (this.groupLinkdata[1]) {
        //   console.log("test")
        //   let startPos = pst.description.indexOf('==>') + 1;
        //   let endPos = pst.description.indexOf('==>', startPos);
        //   let textDesc = pst.description.substring(startPos, endPos);
        //   let newDescription = textDesc.replace('=>', '');
        //   this.viewLink = false;
        //   pst.description = this.groupLinkdata[0];
        //   pst.colorCss = 'faq';
        //  // pst.newDescription = newDescription;
        //   const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        //   const isBase64 = base64RegExp.test(newDescription)

        //   if(isBase64 == true){
        //     pst.newDescription = decodeURIComponent(escape(window.atob(newDescription)))
        //   }
        //   else{
        //     pst.newDescription = newDescription;
        //   }
        // }else if(descriptionData.includes('Check out my new Group')){
        //      pst.description.match(urlRegex);
        //      let trimDescription = pst.description;
        //     const matches = pst.description.match(urlRegex);
        //     const firstUrl = pst.description.match(/https?:\/\/[^\s]+/);
        //     pst.description = firstUrl ? pst.description.replace(firstUrl[0], '') : pst.description;
        //     let startPos = pst.description.indexOf('==>') + 1;
        //     let endPos = pst.description.indexOf('==>',startPos);
        //     let textDesc = pst.description.substring(startPos,endPos)
        //     pst.newDescription = textDesc.replace('=>', '');
        //     console.log( pst.description )
        //     console.log( textDesc)

        //     // let urlData =descriptionData.slice(
        //     //   descriptionData.indexOf('/') + 1,
        //     //   descriptionData.lastIndexOf('Check out my new Group'),
        //     // );
        //     // this.url =urlData.slice(urlData.lastIndexOf('/') + 1).replace('==>', '');
        // }
      //   else if(pst.description.match(urlRegex)) {
      //     let trimDescription = pst.description;
      //     const matches = pst.description.match(urlRegex);
      //     const firstUrl = pst.description.match(/https?:\/\/[^\s]+/);
      //     pst.description = firstUrl ? pst.description.replace(firstUrl[0], '') : pst.description;
      //     console.log(matches)
      //     pst.urlMeta = matches;
      //     console.log( pst.urlMeta)
      //     this.getLinkPreview(pst.urlMeta[0])
      //     .subscribe(preview => {
      //       pst.preview = preview;
      //       if (!pst.preview.title) {
      //         pst.title = pst.preview.url;
      //       }
      //       this.hideLinkPreview = true;

      //     }, error => {
      //       pst.description = trimDescription;
      //       this.hideLinkPreview = false;
      //       pst.preview.url = pst.urlMeta;
      //       pst.preview.title = pst.preview.url;
      //     });
      //     pst.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl( pst.urlMeta[0]);
      // }
      //  else {
      //   console.log("test3")
      //     this.viewLink = true;
      //     pst.colorCss = '';
      //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
      //     const isBase64 = base64RegExp.test(pst.description)
      //     if(isBase64 == true){
      //       pst.description = decodeURIComponent(escape(window.atob(pst.description)))
      //     }
      //     else{
      //       console.log("test1")

      //       pst.description = pst.description;
      //     }
      //   }
        //parent content
        // if (pst.parentPostContent) {
        //   let descriptionContentData = pst.parentPostContent.replace('==*', '');
        //   this.groupLinkContentdata = descriptionContentData.split(':-');

        //   if (this.groupLinkContentdata[1]) {
        //     let startPos = pst.parentPostContent.indexOf('==>') + 1;
        //     let endPos = pst.parentPostContent.indexOf('==>', startPos);
        //     let textDesc = pst.parentPostContent.substring(startPos, endPos);
        //     let newDescription = textDesc.replace('=>', '');
        //     this.viewLink = false;
        //     pst.parentPostContent = this.groupLinkContentdata[0];
        //     pst.colorCss = 'faq';
        //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        //     const isBase64 = base64RegExp.test(newDescription)
        //     if(isBase64 == true){
        //       pst.newContentDescription = decodeURIComponent(escape(window.atob(newDescription)))
        //     }
        //     else{
        //       pst.newContentDescription = newDescription;
        //     }
        //   } else {
        //     this.viewLink = true;
        //     pst.colorCss = '';
        //     const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        //     const isBase64 = base64RegExp.test(pst.parentPostContent)
        //     if(isBase64 == true){
        //       pst.parentPostContent = decodeURIComponent(escape(window.atob(pst.parentPostContent)))
        //     }
        //     else{
        //       pst.parentPostContent = pst.parentPostContent;
        //     }
        //   }
        // }

        if (pst.postFrom == 'admin') {
          console.log(pst.postFrom);
          pst.postFromData = 'POCN';
        }
        if (
          pst.postFileType == 'image/png' ||
          pst.postFileType == 'image/jpg' ||
          pst.postFileType == 'image/jpeg'
        ) {
          this.imageType[i] = false;
          this.videoType[i] = true;
          this.audioType[i] = true;
        } else if (
          pst.postFileType == 'video/mpeg' ||
          pst.postFileType == 'video/mpg' ||
          pst.postFileType == 'video/mp4' ||
          pst.postFileType == 'video/quicktime'
        ) {
          this.videoType[i] = false;
          this.imageType[i] = true;
          this.audioType[i] = true;
        } else if (
          pst.postFileType == 'audio/mpeg' ||
          pst.postFileType == 'audio/wave' ||
          pst.postFileType == 'audio/mp3'
        ) {
          this.videoType[i] = true;
          this.imageType[i] = true;
          this.audioType[i] = false;
        } else {
          this.videoType[i] = true;
          this.imageType[i] = true;
          this.audioType[i] = true;
        }
        i = i + 1;
        this.postUserView.push(pst);
      });
    });
  }
  hex2a(hexx: any) {
    var hex = hexx.toString(); //force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }
  onProfileImgError(event) {
    event.target.src = 'assets/images-pocn/group-default-thumbnail.svg';
  }
  async basicProfileClick(userId) {
    let postData;
    postData = {
      userId: userId,
    };
    const popover = await this.modalController.create({
      // component: PostPublicProfilePage,
      // cssClass: 'post-profile-modal',
      component: PublicProfilePage,
      cssClass: 'public-profile-modal',
      componentProps: {
        memberId: postData,
        type: 'pocnUser',
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {});
    await popover.present();
  }
  postDetailNavigate(postId) {
    //this.router.navigate(['/post-detailpage'])
    this.router.navigateByUrl('/post-detail-page', {
      state: { postId: postId, postMsg: 'profilePost' },
    });
  }
  onImgPostError(event, fileName) {
    event.target.src =
      environment.postImgUrl + fileName + '?lastmod=' + Math.random();
  }
  async showSharePopover(postId) {
    console.log(postId);
    //temporarily commented
    const popover = await this.popoverCtrl.create({
      component: PostSharePopoverPage,
      cssClass: 'edit-modal',
      event,
      componentProps: {
        postId: postId,
        // onClick: (type) => {
        // },
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse && modalDataResponse.data == 'connection') {
        this.showSharePostSuccess = false;
        this.content.scrollToTop(3000);
        setTimeout(
          function () {
            this.showSharePostSuccess = true;
          }.bind(this),
          3500
        );
        this.postUserView = [];
        this.getUserPost();
      }
    });
    await popover.present();
  }
  async deletePostPopover(deletePostId) {
    const popover = await this.popoverCtrl.create({
      component: DeletePostPopoverPage,
      cssClass: 'edit-modal',
      event,
      componentProps: {
        postId: deletePostId,
        // onClick: (type) => {
        // },
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse && modalDataResponse.data == 'delete') {
        this.loading.present();

        this.showDeletePostSuccess = false;
        this.content.scrollToTop(3000);
        setTimeout(
          function () {
            this.showDeletePostSuccess = true;
          }.bind(this),
          3500
        );
        this.postUserView = [];
        this.getUserPost();
        this.getUserStat();
      }
    });
    await popover.present();
  }
  async commentPopover(postId, descData, index) {
    const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
    const isBase64 = base64RegExp.test(descData)
    if(isBase64 == true){
      let descDecodeData;
      descDecodeData = decodeURIComponent(escape(window.atob(descData)))
      let descriptionData = descDecodeData.replace('==*', '')
      this.groupLinkdata = descriptionData.split(':-')
      if (this.groupLinkdata[1]) {
        let startPos = descDecodeData.indexOf('==>') + 1
        let endPos = descDecodeData.indexOf('==>', startPos)
        let textDesc = descDecodeData.substring(startPos, endPos)
        let newDescription = textDesc.replace('=>', '')
        this.viewLink = false;
        this.descDataLink= this.groupLinkdata[0];
        descData = newDescription;
        this.groupData = "faq";
        // const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
        // const isBase64 = base64RegExp.test(newDescription)
        // if(isBase64 == true){
        //   descData = decodeURIComponent(escape(window.atob(newDescription)))
        // }
        // else{
        //   descData  = newDescription;
        // }
      }
      else{
        descData = descDecodeData;
        this.groupData = "faq";
      }
    }
    const popover = await this.modalController.create({
      component: QuotePopoverPage,
      cssClass: 'quote-modal',
      componentProps: { postId: postId, descData: descData, groupData:this.groupData, descDataLink: this.descDataLink  },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse && modalDataResponse.data == 'success') {
        this.modalDataPost = modalDataResponse.data;
        this.loading.present();
        this.showPostSuccess = false;
        this.content.scrollToTop(3000);
        setTimeout(
          function () {
            this.showPostSuccess = true;
          }.bind(this),
          3500
        );
        this.postUserView = [];
        this.getUserPost();
        this.getUserStat();
      }
    });
    await popover.present();
  }
  likePost(postId, i, likeStatus): void {
    const token = this._pocnLocalStorageManager.getData('pocnApiAccessToken');
    let postLikeData = {
      accessToken: token,
      postId: postId,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      geoLocation: '',
      device: this.deviceType,
      channel: this.device.userAgent,
    };
    if (likeStatus == 'liked') {
      this.postUserView[i].likeCount++;
      this.postUserView[i].likedUsers.push(
        this._pocnLocalStorageManager.getData('userId')
      );
    } else {
      this.postUserView[i].likeCount--;
      // const index = this.postUserView[i].likedUsers.indexOf(this._pocnLocalStorageManager.getData("userId"))
      // this.postUserView[i].likedUsers.splice(index,1)
      const index = this.postUserView[i].likedUsers.indexOf(
        this._pocnLocalStorageManager.getData('userId')
      );
      this.postUserView[i].likedUsers.splice(index, 1);
    }
    this._pocnService
      .likePost(postLikeData)
      .subscribe((response: LikePostResponse) => {
        if (response.data) {
          if (
            response.data.likePost.postStatusLikeResponse.status == 'success'
          ) {
            this.getUserStat();
            //this.postUserView[i].likeCount = response.data.likePost.postStatusLikeResponse.totalCount;
            this.likeStatus =
              response.data.likePost.postStatusLikeResponse.likeStatus;
            if (this.likeStatus == 'True') {
              //this.pocnRefetchPosts();
              //this.postUserView[i].likedUsers.push(this._pocnLocalStorageManager.getData("userId"));
            } else {
              if (this.likeStatus == 'False') {
                //this.pocnRefetchPosts();
                //   const index = this.postUserView[i].likedUsers.indexOf(this._pocnLocalStorageManager.getData("userId"))
                //  this.postUserView[i].likedUsers.splice(index,1)
              }
            }
          }
        }
      });
  }
  getMyConnectionsRequestNotification() {
    const token = this._pocnLocalStorageManager.getData('pocnApiAccessToken');
    this._pocnService
      .getMyConnectionsRequestNotification(token)
      ?.subscribe(({ data }) => {
        this.notificationData =
          data['getMyConnectionsRequestNotification'].data;
        this.requestorCount =
          data['getMyConnectionsRequestNotification'].data.requestorCount;
        this.requestorNames =
          data['getMyConnectionsRequestNotification'].data.requestorNames;
        if (this.requestorCount == 0) {
          this.showNotification = false;
        }
        if (this.requestorCount == 1 || this.requestorCount == 2) {
          this.showNotification = true;
        }
        if (this.requestorCount > 2) {
          this.showConNotification = true;
          this.conNotificationData = this.requestorNames.split(',');
          this.countData = this.requestorCount - 2;
          this.notificationName =
            this.conNotificationData[0] + ',' + this.conNotificationData[1];
        }
      });
  }
  dismissNot() {
    const token = this._pocnLocalStorageManager.getData('pocnApiAccessToken');
    this._pocnService
      .updateMyConnectionsRequestNotification(token)
      .subscribe(({ data }) => {
        this.showNotification = false;
        this.showConNotification = false;
      });
  }
  addText() {
    this.resumeRenameInput.setFocus();
   }
   addAboutmeCursor() {
     this.tagLineInput.setFocus();
     }
     onKeyupEnterFirstName(value: string,f): void {
      if (this.showAddFirstname) {
        this.addContactFirstname();
          
      } else {
        this.updateFirstName(value, f);
      }
  }
  onKeyupEnterLastName(value: string,F1): void {
    if (this.showAddLastName) {
      this.addContactLastName();
        
    } else {
      this.updateLastName(value, F1);
    }
}


onKeyupEnterCredentials(value: string,fCredentials): void {
  if (this.showAddCredentials) {
    this.addContactCredentials();
      
  } else {
    this.updateCredentials(value, fCredentials);
  }
}


onKeyupEnterCity(value: string,f): void {
  if (this.showAddCity) {
    this.addContactCity();
      
  } else {
    this.updateCity(value, f);
  }
}
onKeyupEnterZip(value: string,f): void {
  if (this.showAddZip) {
    this.addContactZip();
      
  } else {
    this.updateZip(value, f);
  }
}
onKeyupEnterPhoneNumber(value: string,f): void {
  if (this.showAddTelephone) {
    this.addContactTelephone();
      
  } else {
    this.updateUserPhoneNumber(value, f);
  }
}
onKeyupEnterMobileNumber(value: string,f): void {
  if (this.showAddMobile) {
    this.addContactMobile();
      
  } else {
    this.updateUserMobileNumber(value, f);
  }
}
onKeyupEnterFax(value: string,f): void {
  if (this.showAddFax) {
    this.addContactFax();
      
  } else {
    this.updateUserFax(value, f);
  }
}
}
