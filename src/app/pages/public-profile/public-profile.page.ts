import { Component, OnInit, Input, ViewChild, ElementRef ,Inject ,HostListener} from '@angular/core';
import { Router ,ActivatedRoute,Params} from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CookieManager } from "./../../services/cookie-manager";
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { Source, EmploymentNode, UserProfileImage, UserResume, AddressNode, ContactNode, DegreeNode, SpecialityNode, StateNode, educationNode } from './../../services/type';
import { Observable, Subscriber, ReplaySubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { TokenManager } from "./../../services/token-manager";
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { DOCUMENT, JsonPipe } from '@angular/common';
import { MorePopoverPage } from "../more-popover/more-popover.page";
import { ResumePopoverPage } from "../resume-popover/resume-popover.page";
import { PopoverController } from "@ionic/angular";
import { ActionSheetController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { MdmProfilePage } from '../mdm-profile/mdm-profile.page';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { DisconnectModalPage } from '../disconnect-modal/disconnect-modal.page';
//import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.page.html',
  styleUrls: ['./public-profile.page.scss'],
})
export class PublicProfilePage implements OnInit {
  public onClick = (contact) => {}
  @Input() memberId: string;
  @Input() type: string;
  yearLabel: any;
  followText;
  myFollowList = 0;
  primarySpecialityDesc;
  followsList;
  showFollowButton = false;
  monthLabel: any;
  userIp = '';
  deviceType: string = '';
  errorClass= "";
  showPattern:boolean = true ;
  showPhoneDiv:boolean = true ;
  showMobileDiv:boolean = true ;
  tabType = 'about';
  showResume = false;
  licenseDetails = [];
 profileImageArray = [];
 educationDetails = [];
  workHistoryDetails = [];
  showRenameResume;
  myRequestConnectionData;
  showRename:boolean =  false;
  hasDuplicate:boolean =  false;
  showDuplicate:boolean = true ;
  userResume: UserResume[] = [];
  profileImg = "";
  defaultImg = "assets/images-pocn/group-default-thumbnail.svg";
  showEditLinkedIn: boolean = false;
  showEditFacebook: boolean = false;
  showEditTwitter: boolean = false;
  showEditWebsite: boolean = false;
  imageUrl = environment.postProfileImgUrl;
  followcolor:boolean = false;
  showAddTwitter: boolean = false;
  disableFollow: boolean = false;
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
  followRequest: boolean = false;
  unfollowRequest: boolean = false;
  connRequest: boolean = false;
  connectionReqName;
  ignoreRequest: boolean = false;
  disableRequest: boolean = false;
  folowName;
  showNoBadgesMsg: boolean = false;
  showPic :boolean = false;
  hideButton: boolean = false;
  hideBc : boolean = false;
  hideFol : boolean = false;
  hideCon: boolean = false;
  specialityType: SpecialityNode[] = [];
  stateList: StateNode[] = [];
  userProfileImages: UserProfileImage[] = [];
  resumeStatus = false;
  successStatus = false;
  userDetailsQuery;
  likeCount ;
  connectionCount ;
  postCount;
  pointCount ;
  followersCount;
  noSpacesRegex = /.*\S.*/;
  resumeFileType = [ "application/msword", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf"];
  fileErrorStatus = false;
  uploadedFileType = "";
  uploadedFile = {};
  errorMsg = '';
  myResumeName = "";
  public myConnectionData;
  userConnectionExist;
  userConnectionReqExist
  showSignIn = false;
  public token;
  public person;
  public userbasicDetails:any=[];
  public userPrivilege:any=[];
  public addressInfoDetails;
  public contactInfoDetails;
  geolocationPosition: string = '';
  // licenseDetails = [];
  yearDiff: any;
  public educationList: any[] = [{
    school: '',
    hcoDegree: '',
    field: '',
    periodFfrom: '',
    periodTo: '',
    description: ''
  }];
  public userConnectionReqExistPost :any = [];
  public userConnectionReqExistPostCon :any = [];
public workHistoryList:any = [];
  public contactInfoList: any[] = [{
    phoneNumber: '',
    faxNumber: '',
    mobilePhoneNumber: '',
    //mobileCountryCode: '',
    email: '',
    contactType: '',
    isPrimary: ''
  }];

  public licenseList: any[] = [{
    certificateName: '',
    speciality: '',
    institutionName: ''
  }];
  slideOpts = {
    slidesPerView: 1,
    spaceBetween: 1,
    static: true,
    centeredSlides: true,
  }
  connectText;
  public userId: string;
  memberIdData;
  public userData;
  providerHcpNpi;
  userName;
  profileImgUrl
  constructor(private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private route: ActivatedRoute,
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
    private deviceService: DeviceDetectorService,
    private httpClient: HttpClient,
    public telemetry: TelemetryService,
    @Inject(DOCUMENT) document: Document
    ) {
    this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    //  this.userId = this.memberId

    // this.userId = '99b0e2b5-bf1e-5cf6-b129-24cf237978d5'; //alan
    // this.route.params.subscribe((params: Params) => {
    //   this.userId = params.userId;
    // });

  }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "public-profile-popover";
    let attributes = {
        userId: this._pocnLocalStorageManager.getData("userId"),
        firstName: this._pocnLocalStorageManager.getData("firstName"),
        lastName: this._pocnLocalStorageManager.getData("lastName"),
        userEmail:this._pocnLocalStorageManager.getData("userEmail"),
        url:this.router.url
    }
    const eventName = 'page view';
    const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'viewed page' }
    this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
        this.telemetry.parentTrace = result;
    })
    this.userFollowsCount();
    if (this.token == "" || this.token == null) {
      this.router.navigate(["/"]);
    }
    this.loadIp();
    this.tokenManager.setRefreshTokenIntrvl();
    if (this.isMobile == true) {
      this.deviceType = "Mobile"
    }
    else if (this.isTablet == true) {
      this.deviceType = "Tablet"
    }
    else if (this.isDesktop == true) {
      this.deviceType = "Desktop"
    }
    else {
      this.deviceType = "Unknown"
    }
    this.tokenManager.setRefreshTokenIntrvl();
    this.loading.present();
    //this.getPosition();
    this.getUserDetails();
   console.log(this.memberId);
   
  }
  getProfileImg(userIdImg){
     this._pocnService.providerUserImageInfos(userIdImg).subscribe(
      (res: any) => {
        if(res.data.providerUserImageInfos.nodes.length>0){
          this._pocnLocalStorageManager.saveData(
            "imgExtension",
            res.data.providerUserImageInfos.nodes[0].fileExtension,
          );
          this.profileImgUrl = environment.postProfileImgUrl + userIdImg + '.' + this._pocnLocalStorageManager.getData("imgExtension") + '?lastmod=' + Math.random();

        }
        else{
          this.profileImgUrl = "assets/images-pocn/group-default-thumbnail.svg";
        }
       

    })
  }
  get device(): any {
    return this.deviceService.getDeviceInfo();
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  get isTablet(): boolean {
    return this.deviceService.isTablet();
  }

  get isDesktop(): boolean {
    return this.deviceService.isDesktop();
  }
  //load npi
  loadIp() {
    this.httpClient.get('https://jsonip.com').subscribe(
      (value: any) => {
        this.userIp = value.ip;
      },
      (error) => {
      }
    );

  }
  getUserPrivilegeSections() {

    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getUserPrivilegeSections(this.memberIdData).subscribe(({ data }) => {
      this.userPrivilege = data['userPrivilegeSections'].nodes;
      this.userPrivilege.filter(x => x.sectionId === 1);
      this.getUserPublicProfile();
      this.providerUserInfos();

     })
     this.getUserPublicProfile();
  }
  async close() {
    // this.onClick('speciality-cancel');
    await this.modalController.dismiss(this.type);
    // await this.modalController.dismiss(this.type);
  }
  getUserDetails() {
    console.log(this.memberId);
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getUserBasicProfile(token)?.subscribe(({ data }) => {
      this.userId = data['getUserBasicProfile'].data['userBasicProfile']['userId'];
      const LoguserId = this._pocnLocalStorageManager.getData("userId");
      this.providerHcpNpi= data['getUserBasicProfile'].data['userBasicProfile']['npi'];
      this.userName = data['getUserBasicProfile'].data['userBasicProfile']['name'];
      if(this.type == 'myConnections'){
         if(this.userId == this.memberId['childUserId']){
        // this.router.navigate(["/user/" + connectionData.parentUserId]);
        this.memberIdData  = this.memberId['parentUserId'];
        this.getProfileImg(this.memberIdData);
        this.getUserStat(this.token,this.memberIdData);
        }
       else if(this.userId == this.memberId['parentUserId']){
          this.memberIdData  = this.memberId['childUserId'];
        // this.router.navigate(["/user/" + connectionData.childUserId]);
        this.getProfileImg(this.memberIdData);
        this.getUserStat(this.token,this.memberIdData);
       }
       this.connectText = 'End Connection';
       this.getUserPrivilegeSections();
      }
      if(this.type=="speciality" || this.type=="location" || this.type=="education" || this.type=="workHistory"){

        // this.memberId
        this.memberIdData  = this.memberId['userId'];
        this.connectText = 'Request Connection';
        this.getUserPrivilegeSections();
        this.getProfileImg(this.memberIdData);
        this.getUserStat(this.token,this.memberIdData);
      }
      if(this.type=="incomingRequest"){
        console.log(this.memberId);
        this.memberIdData  = this.memberId['requestorUserId'];
        this.getUserPrivilegeSections();
        this.connectText = 'Accept';
        this.followText = 'Decline';
        this.getProfileImg(this.memberIdData);
        this.getUserStat(this.token,this.memberIdData);
      }  
      if(this.type=="pocnUser"){
        console.log("hiiiiiii123333");
        this.memberIdData  = this.memberId['userId'];
        
        if(LoguserId ==  this.memberId['userId']){
        // if(this.userId == this.memberId['userId']){
          console.log("hiiiifffff");
          this.hideButton = true;
          this.hideBc = true;
          this.hideFol =true;
          this.hideCon=true;
          this.getUserPrivilegeSections();
        this.getUserConnectionExistPost();
        this.getUserStat(this.token,this.memberIdData);
        this.getProfileImg(this.memberIdData);
        }
        else{
          this.getUserPrivilegeSections();
          this.getUserConnectionExistPost();
          this.getUserStat(this.token,this.memberIdData);
          this.getProfileImg(this.memberIdData);
        }
       
      }
      if(this.type=="search"){
        this.memberIdData  = this.memberId['userId'];
        this.getUserPrivilegeSections();
        this.getUserConnectionExistPost();
        this.getUserConnectionRequest();
        this.getProfileImg(this.memberIdData);
        this.getUserStat(this.token,this.memberIdData);
      }
      if(this.type=="outgoingRequest"){
        this._pocnService.providerUserInfos(this.memberId['targetUserId']).subscribe(({ data }) => {
          // this.userData = data['providerUserInfos']['nodes'][0].userId;
          this.userData = data['providerUserInfos']['nodes'];
          this.connectText = 'Request Pending';
          if(this.userData != '' || this.userData.length != 0) {
            this.memberIdData  = this.userData[0].userId;
            this.getProfileImg(this.memberIdData);
            this.getUserStat(this.token,this.memberIdData);
          }
          else{
           this.modalController.dismiss();
            this._pocnService.providerMdmInfos(Number(this.memberId['targetUserId'])).subscribe(({ data }) => {
              this.userData = data['providerInfos']['nodes'];
              if(this.userData.length != 0){
              // this.router.navigate(["/profile/" + this.userData[0].providerId ]);
              // this.memberIdData  = this.userData[0].providerId;
              this.showMdmMemberProfile(this.memberId);
              }
                    })

          }
          this.getUserPrivilegeSections();

        });
      }
      // this._pocnLocalStorageManager.saveData(
      //   "userId",this.userId,
      // );


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
      });

  }

  async showMdmMemberProfile(arg) {
    const popover = await this.modalController.create({
      component: MdmProfilePage,
      cssClass: 'public-profile-modal',
      componentProps: {
        'memberId': arg,
      },
    });
    popover.onDidDismiss().then((modalDataResponse) => {
    });
    await popover.present();
  }
  getUserPublicProfile() {
    let educationData = [];
    let licenseData = [];
    let workHistoryData = [];
    this._pocnService.getUserBasicPublicProfile(this.token,this.memberIdData).subscribe(({ data }) => {
      if(this.loading.isLoading){
        this.loading.dismiss();
      }
      this.person = data['getUserBasicPublicProfile'].data;
      this.showPic = true;
      this.primarySpecialityDesc =  this.person['userBasicProfile']['primarySpecialityDesc'].replace('(i.e., a specialty other than those appearing above)', '');
      this.userProfileImages = data['getUserBasicPublicProfile'].data['userImageProfile'];
      this._pocnService.getUserPublicProfile(this.token,this.memberIdData).subscribe(({ data }) => {
        //this.person = data['getUserPublicProfile'].data;
        
        //this.primarySpecialityDesc =  this.person['userBasicProfile']['primarySpecialityDesc'].replace('(i.e., a specialty other than those appearing above)', '');
        this.educationDetails = data['getUserPublicProfile'].data['userEducationProfile'];
        this.licenseDetails =  data['getUserPublicProfile'].data['userCertLicense'];
        this.workHistoryDetails = data['getUserPublicProfile'].data['userExperienceProfile'];
        //this.userProfileImages = data['getUserPublicProfile'].data['userImageProfile'];
        this.userResume = data['getUserPublicProfile'].data['userResume'];
        let basicProfile = data['getUserPublicProfile'].data['userBasicProfile'];
        this.userbasicDetails = {
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
        if((this.userbasicDetails.atnp == false || this.userbasicDetails.atnp == null) && (this.userbasicDetails.atpa == false || this.userbasicDetails.atpa == null) && (this.userbasicDetails.globalOptOut == false || this.userbasicDetails.globalOptOut == null) && (this.userbasicDetails.rxAuthority == false || this.userbasicDetails.rxAuthority == null) && (this.userbasicDetails.pocnMentor == false || this.userbasicDetails.pocnMentor == null) && (this.userbasicDetails.pocnMentee == false || this.userbasicDetails.pocnMentee == null) && (this.userbasicDetails.communityAdvocate == false || this.userbasicDetails.communityAdvocate == null) && (this.userbasicDetails.educatorOfDistinction == false || this.userbasicDetails.educatorOfDistinction == null) && (this.userbasicDetails.pocnAmbassador == false || this.userbasicDetails.pocnAmbassador == null)){          
          this.showNoBadgesMsg = true;
        }

         this.profileImageArray = this.userProfileImages.filter((obj) => {
           return obj.imgType === 'profile_img';
         });
         if(this.profileImageArray.length > 0){
           // this.profileImg = profileImageArray[profileImageArray.length-1].fileContent;
           // this.profileImg = this.profileImageArray[this.profileImageArray.length-1].fileExtension;
           this.profileImg = this.imageUrl + this.memberIdData + '.' + this.profileImageArray[this.profileImageArray.length-1].fileExtension + '?lastmod=' + Math.random();
         }
         else{
           this.profileImg = "assets/images-pocn/group-default-thumbnail.svg";
         }
         this.educationDetails.forEach((field, index) => {
           educationData = field;
           if(educationData['hcoDegree'] != '') {
             this.educationList.push({
             school: educationData['hcoName'],
             field: educationData['hcoSubtype'],
             year: educationData['hcpGraduationYear'],
             hcoDegree: educationData['hcoDegree'],
             description: educationData['description'],
             });
           }
         });
         this.workHistoryList = [];
         this.workHistoryDetails.forEach((field, index) => {
           workHistoryData = field;
           let dateToString = new Date("01/" + workHistoryData['endMonth'] + "/" + workHistoryData['endYear']);
           let dateFromString = new Date("01/" + workHistoryData['startMonth'] + "/" + workHistoryData['startYear']);
           let yearsnew = Math.floor(this.calculateDiff(dateToString, dateFromString) / 365);
           let monthsnew = Math.floor(this.calculateDiff(dateToString, dateFromString) % 365 / 30);
           if (yearsnew > 1) {
             this.yearLabel = yearsnew + " Years "
           }
           else if (yearsnew == 1) {
             this.yearLabel = yearsnew + " Year "
           }
           else {
             this.yearLabel = '';
           }
 
           if (monthsnew > 1) {
             this.monthLabel = monthsnew + " Months "
           }
           else if (monthsnew == 1) {
             this.monthLabel = monthsnew + " Month "
           }
           else {
             this.monthLabel = '';
           }
 
           this.yearDiff = this.yearLabel + this.monthLabel;
           let diff;
           if(workHistoryData['startYear']!='' && workHistoryData['endYear'] !=''){
             diff=this.yearDiff
           }else{
             diff=workHistoryData['startYear']
           }
           // this.workHistoryList = [];
           this.workHistoryList.push({   // showing in ui form
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
             diffYear: diff
           });
         });
         this.licenseDetails.forEach((field, index) => {
           licenseData = field;
           // if(licenseData['certificationLicenceName'] != '') {
             this.licenseList.push({
               certificateName: licenseData['certificationLicenceName'],
               speciality: licenseData['specialty'],
               institutionName: licenseData['hcoName']
             });
           // }
         });
         // if(this.loading.isLoading){
         //   this.loading.dismiss();
         // }
      },
      (error) => {
      //  if(this.loading.isLoading){
      //    this.loading.dismiss();
      //  }
      //  this._pocnLocalStorageManager.removeData("firstName");
      //  this._pocnLocalStorageManager.removeData("lastName");
      //  this._pocnLocalStorageManager.removeData("pocnApiAccessToken");
      //  this._pocnLocalStorageManager.removeData("userEmail");
      //  this._pocnLocalStorageManager.removeData("refreshToken");
      //  this._pocnLocalStorageManager.removeData("tabName");
      //  this._pocnLocalStorageManager.removeData("subTabName");
      //  this._pocnLocalStorageManager.removeData("userId");
      //  this.router.navigate(["/register"]);
     });

    });

 
    this.getUserConnectionExist();
    this.getUserConnectionRequestExist();

  }

  getStates = () => {
    this._pocnService.getStates().subscribe(({ data }) => {
      this.stateList = data.states.nodes;
    });
  }
  showCallerSign() {
    this.router.navigate(['/connect'])
  }
  calculateDiff(dateTo, dateStart) {
    dateStart = new Date(dateStart);
    dateTo = new Date(dateTo);
    return Math.floor((Date.UTC(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate()) - Date.UTC(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate())) / (1000 * 60 * 60 * 24));
  }
  getSpecialityType = () => {
    this._pocnService.getSpecialityType().subscribe(({ data }) => {
    this.specialityType = data.masterSpecialties.nodes;
    });
  }
  showValue(){
  this.showPattern = true;
  }
  goToSettings() {
    this.router.navigate(['settings']);
  }
  editResume(){
    this.showResume = true;
  }
  submitCancelConnection() {
    let connectionRejectData;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    console.log(this.memberId);
    console.log(this.memberId['targetUserId']);
    console.log(this.type);
    this.disableRequest = true;
  if(this.type == 'pocnUser' || this.type == 'search'){
      connectionRejectData = {
        accessToken: token,
        targetUserId: this.userConnectionReqExistPostCon[0]['childUserId'],
        parentUserId : this.userConnectionReqExistPostCon[0]['parentUserId'],
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        channel: this.device.userAgent,
        geoLocation: this.geolocationPosition
      } 
    }
   else if(this.type == 'incomingRequest'){
      connectionRejectData = {
        accessToken: token,
        targetUserId: this.memberId['requestorUserId'],
        parentUserId : this.userId,
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        channel: this.device.userAgent,
        geoLocation: this.geolocationPosition
      } 
    }
    else{
        connectionRejectData = {
          accessToken: token,
          targetUserId: this.memberId['childUserId'],
          parentUserId : this.memberId['parentUserId'],
          ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
          device: this.deviceType,
          channel: this.device.userAgent,
          geoLocation: this.geolocationPosition
        }
    }
    this.showDisconnectModal(connectionRejectData);

    }
    async showDisconnectModal(memberId) {
      const popover = await this.modalController.create({
        component: DisconnectModalPage,
        cssClass: 'reject-modal',
        componentProps: {
          'requestConnection': memberId,
          "type" : this.type,
         },
       });
       popover.onDidDismiss().then((modalDataResponse) => {
         console.log(modalDataResponse,"hii2334");
        this.disableRequest = false;
         if(modalDataResponse.data == 'myconnection'){
          this.getMyConnections();
          this.userFollowsList();
          this.getUserConnectionRequest();
          this.disableRequest = false;
          this.connectText = "Request Connection";
          this.getUserStat(this.token,this.memberIdData);
         }
         if(modalDataResponse.data == 'incomingRequest'){
          this.getMyConnections();
          this.userFollowsList();
          this.getUserRequestedConnections();
          this.disableRequest = false;
          this.connectText = "Request Connection";
          this.getUserStat(this.token,this.memberIdData);
          // this.ignoreRequest = true;
          //      this.getUserRequestedConnections();
          //      this.getUserRecommendedConnectionsSpecialties();
          //      setTimeout(function () {
          //        this.ignoreRequest = false;
          //      }.bind(this), 3000);
         }
      });
      await popover.present();
    }
    getUserRequestedConnections() {
      const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
      this._pocnService.getUserRequestedConnections(token).subscribe(({ data }) => {
        this.myRequestConnectionData = data['getUserRequestedConnections']['data'];

      },
      (error) => {
          // console.log('there was an error sending the query', error);
          this.router.navigate(['/'])
      });
    }
    getMyConnections() {
      const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
      this._pocnService.getMyConnections(token).subscribe(({ data }) => {
        this.myConnectionData = data['getMyConnections']['data'];
        if (this.myConnectionData.length == 0) {
          // this.myConnectionMessage = true;
        }
        else {
          // this.myConnectionMessage = false;
        }
      });
    }
    providerUserInfos(){
      this._pocnService.getPocnP2PConnections(this.memberIdData ).subscribe(({ data }) => {
    this.userData = data['providerUserInfos']['nodes'][0];
    // this.getUserRequestedConnections();
          })
    }
    submitConnect() {
     console.log(this.type) ; 
     let connectionData:any = {};
      if(this.connectText == 'Request Connection'){
        this.connectionReqName = this.userData.fullName;
        this.disableRequest =  true;
      const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
      if(this.type == 'search'){
        connectionData = {
          accessToken: token,
          targetUserId: this.userData.npi,
          targetUserFullName: this.userData.fullName,
          targetUserFirstName: this.userData.firstName,
          targetUserLastName: this.userData.lastName,
          targetUserEmailId: this.userData.emailId,
          statusUpdateDate: "",
          source: "Organic",
          requestorUserId: this.userId,
          requestorUserFullName:this.userName,
          rejectReason: "",
          requestorNpi:this.providerHcpNpi,
          connectionStatus: "Pending",
          connectionMessage: "",
          agingDays: "0",
          ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
          ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
          device: this.deviceType,
          channel: this.device.userAgent,
          geoLocation: this.geolocationPosition,
          targetHcpDegreeCode: "",
          targetHcpDegreeGroupCode: this.memberId['destHcpDegreeCode'],
          targetPrimarySpecialtyName: this.memberId['destSpecialtyName'],
          targetUserCity: this.memberId['destCity'],
          targetUserState: this.memberId['destState'],
          domain: window.location.hostname,
        }
      }
      else{
      connectionData = {
          accessToken: token,
          targetUserId: this.userData.npi,
          targetUserFullName: this.userData.fullName,
          targetUserFirstName: this.userData.firstName,
          targetUserLastName: this.userData.lastName,
          targetUserEmailId: this.userData.emailId,
          statusUpdateDate: "",
          source: "POCN Recommendation",
          requestorUserId: this.userId,
          requestorUserFullName:this.userName,
          rejectReason: "",
          requestorNpi:this.providerHcpNpi,
          connectionStatus: "Pending",
          connectionMessage: "",
          agingDays: "0",
          ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
          ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
          device: this.deviceType,
          channel: this.device.userAgent,
          geoLocation: this.geolocationPosition,
          targetHcpDegreeCode: "",
          targetHcpDegreeGroupCode: this.memberId['destHcpDegreeCode'],
          targetPrimarySpecialtyName: this.memberId['destSpecialtyName'],
          targetUserCity: this.memberId['destCity'],
          targetUserState: this.memberId['destState'],
          domain: window.location.hostname,
        }
      }
     
      // console.log(connectionData);
      // if(this.userData.emailId!=''){
      this._pocnService.submitUserConnectionRequest(connectionData).subscribe(
        (response: any) => {
          // console.log(connectionData);
          if (response.data.submitUserConnectionRequest.connectionUpdateResponse.status === 'Success') {
            // this.disableRequest =  false;
            this._pocnService.sendConnectionRequestMail(connectionData).subscribe(
              (response: any) => {
                console.log("mail send succsfully");
              })
              this.connRequest = true;
                this.connectText = "Request Pending";
                this.followsListData();
                this.userFollowsCount();
                const spanName = "connection-request-sent-btn";
                setTimeout(function () {
                  this.connRequest = false;
                }.bind(this), 4000);
                let attributes = {
                    userId: this._pocnLocalStorageManager.getData("userId"),
                    firstName: this._pocnLocalStorageManager.getData("firstName"),
                    lastName: this._pocnLocalStorageManager.getData("lastName"),
                    userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                    targetUser: this.userData.fullName,
                    requestorUser:this.userName,
                }
                console.log(attributes);
                const eventName = 'connection request sent';
                const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully sent connection request' }
                this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                    this.telemetry.parentTrace = result;
                })
          }
          else{
            const spanName = "connection-request-sent-btn";
                let attributes = {
                    userId: this._pocnLocalStorageManager.getData("userId"),
                    firstName: this._pocnLocalStorageManager.getData("firstName"),
                    lastName: this._pocnLocalStorageManager.getData("lastName"),
                    userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                    targetUser: this.userData.fullName,
                    requestorUser:this.userName,
                }
                console.log(attributes);
                const eventName = 'connection request sent';
                const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to sent connection request' }
                this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                    this.telemetry.parentTrace = result;
                })
          }
        });

     }
    //  if(this.followText == 'Decline'){
    //   this.rejectRequest();
    //   console.log("Decline");
    //  }
     if(this.connectText == 'Accept'){
      //  console.log("accepttt");

       this.submitApproveConnectionRequest();
     }
     if(this.connectText == 'End Connection'){

      this.submitCancelConnection();
    }
    if(this.connectText == 'Remove'){

      this.withdrawConnectionRequest();
    }
    // if(this.connectText == 'Decline'){
    //   this.rejectRequest();

    //   // this.withdrawConnectionRequest();
    // }
    if(this.connectText == 'Request Pending'){

      this.withdrawConnectionRequest();
    }

    }

    getUserConnectionExist() {
      // console.log(this.memberId['userId']);
      const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
      this._pocnService.getUserConnectionExist(token,this.memberIdData).subscribe(({ data }) => {
        this.userConnectionExist = data['getUserConnectionExist'];
        // if(this.userConnectionExist['data'] == "true"){
          // this.connectText = "End Connection";
          // this.connectCheck = true;
          // this.showFollowButton = false;
          // this.showConnectButton = true;
          // this.showButton = false;
        // }
        // else{
          // this.connectText = "Request Connection";
          // this.showFollowButton = true;
          // this.connectCheck = false;
          // this.showButton = false;
        // }
      // },
      // (error) => {
      //     console.log('there was an error sending the query', error);
      //     this.router.navigate(['/'])
      });
      this.userFollowsList();

    }
    getUserConnectionRequestExist() {

      const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
      this._pocnService.getUserConnectionRequestExist(token,this.memberIdData).subscribe(({ data }) => {
        this.userConnectionReqExist = data['getUserConnectionRequestExist']['data'];
      //   if(this.userConnectionReqExist['sentStatus'] == true){
      //     this.connectText = "Request Pending";
      //   }
      //   if(this.userConnectionReqExist['receivedStatus'] == true){
      //       this.connectText = "Accept";
      //     }

      //     if(this.userConnectionExist['data'] == "true"){
      //       this.connectText = "End Connection";
      //     }
      //   if(this.userConnectionExist['data'] == "true" && (this.userConnectionReqExist['sentStatus'] == "false" || this.userConnectionReqExist['receivedStatus'] == "false")){
      //     this.connectText = "End Connection";
      //   }
      //   if(this.userConnectionExist['data'] == "false" && (this.userConnectionReqExist['sentStatus'] == "false" || this.userConnectionReqExist['receivedStatus'] == "false")){
      // this.connectText = "Request Connection";
      //   }
      });
    }
    submitApproveConnectionRequest() {
      // this.memberId
      console.log(this.memberId);
      console.log(this.type);
      console.log(this.userConnectionReqExistPost);
      let connectionApproveData;
      this.disableRequest = true;
      const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
      // if(Object.keys(this.memberId).includes("requestorUserId")){
        if(this.type == 'incomingRequest'){
          connectionApproveData = {
            accessToken: token,
            childFullName: this.memberId['destFullName'],
            childUserId: this.memberId['requestorUserId'],
            connectionRequestId: this.memberId['connectionRequestId'],
            parentFullName:  this.userName,
            parentUserId: this.userId,
            requestorNpi: this.providerHcpNpi,
            targetNpi: this.memberId['targetUserId'],
            ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
            device: this.deviceType,
            channel: this.device.userAgent,
            geoLocation: this.geolocationPosition
        }
        console.log(connectionApproveData);
    }
    else if(this.type == 'search'){
      connectionApproveData = {
        accessToken: token,
        childFullName: this.memberId['fullName'],
        childUserId: this.memberId['userId'],
        connectionRequestId: this.memberId['connectionRequestId'],
        parentFullName:  this.userName,
        parentUserId: this.userId,
        requestorNpi: this.providerHcpNpi,
        targetNpi: this.memberId['targetUserId'],
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        channel: this.device.userAgent,
        geoLocation: this.geolocationPosition
    }
    console.log(connectionApproveData);
}
    else if(this.type == 'pocnUser' ){
      // else{
      connectionApproveData = {
        accessToken: token,
        childFullName: this.userConnectionReqExistPost[0]['requestorUserFullName'],
        childUserId: this.userConnectionReqExistPost[0]['requestorUserId'],
        connectionRequestId: Number(this.userConnectionReqExistPost[0]['connectionRequestId']),
        parentFullName:  this.userName,
        parentUserId: this.userId,
        requestorNpi: this.providerHcpNpi,
        targetNpi: this.userConnectionReqExistPost[0]['targetUserId'],
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        channel: this.device.userAgent,
        geoLocation: this.geolocationPosition
    }
    console.log(connectionApproveData);
    }
      this._pocnService.submitApproveConnectionRequest(connectionApproveData).subscribe(
        (response: any) => {
          if (response.data.submitApproveConnectionRequest.connectionUpdateResponse.status === 'Success') {
            // const index: number = this.myRequestConnectionData.indexOf(data);
            this._pocnService.sendApproveConnectionRequestMail(connectionApproveData).subscribe(
              (response: any) => {
                console.log("mail send succsfully");
              })
            this.disableRequest = false;
            this.connectText = "End Connection";
            this.followsListData();
            this.getUserConnectionRequest();
            this.getUserStat(this.token,this.memberIdData);
            const spanName = "connection-accept-btn";
            let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                parentFullName:  this.userName,
                childFullName: this.userConnectionReqExistPost[0]['requestorUserFullName'],
            }
            console.log(attributes);
            const eventName = 'connection accept';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully accept connection request' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
          }
     else{
      const spanName = "connection-accept-btn";
      let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
          parentFullName:  this.userName,
          childFullName: this.userConnectionReqExistPost[0]['requestorUserFullName'],
      }
      console.log(attributes);
      const eventName = 'connection accept';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to accept connection request' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
     }
        // },
        // (error) => {
        //     console.log('there was an error sending the query', error);
        //     this.router.navigate(['/'])
        });
    }
    rejectRequest() {
      let connectionRejectData;
     const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
      if(Object.keys(this.memberId).includes("connectionRequestId")){
        this.disableFollow= true;
      connectionRejectData = {
        accessToken: token,
        connectionRequestId: this.memberId['connectionRequestId'],
        rejectReason: '',
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        channel: this.device.userAgent,
        geoLocation: this.geolocationPosition
      }
    }
    else{
      this.disableFollow= true;
      connectionRejectData = {
        accessToken: token,
        connectionRequestId: Number(this.userConnectionReqExistPost[0]['connectionRequestId']),
        rejectReason: '',
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        channel: this.device.userAgent,
        geoLocation: this.geolocationPosition
      }
    } 
      this._pocnService.submitRejectConnectionRequest(connectionRejectData).subscribe(
        (response: any) => {
          if (response.data.submitRejectConnectionRequest.connectionUpdateResponse.status === 'Success') {
            this.disableFollow= false;
            this.followsListData();
            this.connectText = 'Request Connection';
            this.getUserConnectionRequest();
            // this.followText = "Stop Following";
            // const index: number = this.myRequestConnectionData.indexOf(requestConnection);
          //  this.ignoreRequest = true;
          //  setTimeout(function () {
          //    this.ignoreRequest = false;
          //  }.bind(this), 3000);
          //   if (index !== -1) {
          //     JSON.parse(JSON.stringify(this.myRequestConnectionData.splice(index, 1)));

           //  this.getUserRequestedConnections();

            // }

          }
      },
      (error) => {
          // console.log('there was an error sending the query', error);
          this.router.navigate(['/'])
      });

   }
  withdrawConnectionRequest() {
    let cancelData;
    this.disableRequest = true;
    const  ipAddressV4= this._pocnLocalStorageManager.getData("ipv4");
    const  ipAddressV6= this._pocnLocalStorageManager.getData("ipv6");
    const device= this.deviceType;
    const channel=this.device.userAgent;
    const geoLocation = this.geolocationPosition
    if(Object.keys(this.memberId).includes("targetUserId")){
      cancelData = this.memberId['targetUserId'];
      //   this.router.navigate(["/user/" + data.requestorUserId]);
      //  }

    }else{
      cancelData = this.memberId['npi'];
    }
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken")
    this._pocnService.withdrawConnectionRequest(token,cancelData,ipAddressV4,ipAddressV6,device,channel,geoLocation).subscribe(
      (response: any) => {
        if (response.data.withdrawConnectionRequest.connectionUpdateResponse.status === 'success') {
          // const index: number = this.myPendingConnectionsData.indexOf(data);
          // this.cancelRequest = true;
          this.disableRequest = false;
          this.connectText = "Request Connection";
          const spanName = "withdraw-connection-request-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              withdrwRequestId: cancelData
          }
          console.log(attributes);
          const eventName = 'withdraw connection request';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully withdraw connection request' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
        }
      else{
        const spanName = "withdraw-connection-request-btn";
        let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            withdrwRequestId: cancelData
        }
        console.log(attributes);
        const eventName = 'withdraw connection request';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed withdraw connection request' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
          }
      },
      (error) => {
          // console.log('there was an error sending the query', error);
          this.router.navigate(['/'])
      });
  }

  createFollower() {
    // console.log(this.memberId);
    
    if(Object.keys(this.memberId).includes("fullName")){
      this.folowName = this.memberId['fullName'];
    }
    if(Object.keys(this.memberId).includes("destFullName")){
      this.folowName = this.memberId['destFullName'];
    }
      //   this.router.navigate(["/user/" + data.requestorUserId]);
      //  }
    // console.log(this.memberId['destFullName'],"this.memberId");
    if(this.followText == 'Decline'){
      this.rejectRequest();
     }
     else{
      this.disableFollow= true;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    const createFollowerData = {
      accessToken: token,
      followingUserId: this.memberIdData,
      pocnUserId: this.userId ,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      channel: this.device.userAgent,
      geoLocation: this.geolocationPosition
    }
     if(this.followText=="Follow"){
       this.followcolor = true;
     this._pocnService.createFollower(createFollowerData).subscribe(
      (response: any) => {
        if (response.data.createFollower.createResponse.status === 'success') {
          this.followRequest = true;
          this.disableFollow= false;
          this.getUserStat(this.token,this.memberIdData);
          const spanName = "connection-follow-btn";
                let attributes = {
                    userId: this._pocnLocalStorageManager.getData("userId"),
                    firstName: this._pocnLocalStorageManager.getData("firstName"),
                    lastName: this._pocnLocalStorageManager.getData("lastName"),
                    userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                    followingUserId: this.memberIdData
                }
                console.log(attributes);
                const eventName = 'connection follow ';
                const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully following' }
                this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                    this.telemetry.parentTrace = result;
                })
          setTimeout(function () {
            this.followRequest = false;
          }.bind(this), 3000);
          this.followText = "Stop Following";
          this.followcolor = false;
          this.followsListData();
          // this.userFollowsCount();
        }
        else{
          this.followText = "Follow";
          this.followcolor = true;
          this.followsListData();
          // this.userFollowsCount();
          const spanName = "connection-follow-btn";
                let attributes = {
                    userId: this._pocnLocalStorageManager.getData("userId"),
                    firstName: this._pocnLocalStorageManager.getData("firstName"),
                    lastName: this._pocnLocalStorageManager.getData("lastName"),
                    userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                    followingUserId: this.memberIdData
                }
                console.log(attributes);
                const eventName = 'connection follow ';
                const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed following' }
                this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                    this.telemetry.parentTrace = result;
                })
        }


      });

    }
    else{
      this.unfollowUser();
    }
  }
    }
    unfollowUser() {
      this.disableFollow= true;
      if(Object.keys(this.memberId).includes("fullName")){
        this.folowName = this.memberId['fullName'];
      }
      if(Object.keys(this.memberId).includes("destFullName")){
        this.folowName = this.memberId['destFullName'];
      }
      const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
      const unfollowUserData = {
        accessToken: token,
        followingUserId: this.memberIdData,
        pocnUserId: this.userId ,
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        channel: this.device.userAgent,
        geoLocation: this.geolocationPosition
      }
       this._pocnService.unfollowUser(unfollowUserData).subscribe(
        (response: any) => {
          if (response.data.unfollowUser.createResponse.status === 'success') {
            this.disableFollow= false;
            this.unfollowRequest = true;
            this.getUserStat(this.token,this.memberIdData);
            const spanName = "connection-unfollow-btn";
                let attributes = {
                    userId: this._pocnLocalStorageManager.getData("userId"),
                    firstName: this._pocnLocalStorageManager.getData("firstName"),
                    lastName: this._pocnLocalStorageManager.getData("lastName"),
                    userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                    followingUserId: this.memberIdData
                }
                console.log(attributes);
                const eventName = 'connection unfollow ';
                const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully unfollow' }
                this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                    this.telemetry.parentTrace = result;
                })
          setTimeout(function () {
            this.unfollowRequest = false;
          }.bind(this), 3000);
            this.followText = "Follow";
            this.followcolor = true;
            this.followsListData();
            // this.userFollowsCount();
          }
          else{
            this.followText = "Stop Following";
            this.followcolor = false;
            this.followsListData();
            // this.userFollowsCount();
            const spanName = "connection-unfollow-btn";
            let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                followingUserId: this.memberIdData
            }
            console.log(attributes);
            const eventName = 'connection unfollow ';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed unfollow' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
          }

        },
        (error) => {
            // console.log('there was an error sending the query', error);
            this.router.navigate(['/'])
        });
      }

  userFollowsCount() {
    let filter: any = {};
    filter = {
      // followerUserId: this.pocnUserId,
      followingUserId: this.userId,
    }
    this._pocnService.userFollowsList(filter)?.subscribe(({ data }) => {
      this.followsList = data['userFollowsList'];
      this.myFollowList = this.followsList.length;
    },
    (error) => {
        // console.log('there was an error sending the query', error);
        this.router.navigate(['/'])
    });
  }
  userFollowsList() {
    let filter: any = {};
    filter = {
      followerUserId: this.userId,
      followingUserId:  this.memberIdData,
    }
    this._pocnService.userFollowsList(filter).subscribe(({ data }) => {
      this.followsList = data['userFollowsList'];
      if(this.followsList.length == 0 && this.type!='incomingRequest'){
        this.followText = "Follow";
        this.followcolor = true;
      }
      else if(this.type=='incomingRequest'){
        this.followText = "Decline";
        this.followcolor = false;
      }
      else{
        this.followcolor = false;
        this.followText = "Stop Following";
      }
    // },
    // (error) => {
    //     console.log('there was an error sending the query', error);
    //     this.router.navigate(['/'])
    });
  }
  followsListData() {
    let filter: any = {};
    filter = {
      followerUserId: this.userId,
      followingUserId:  this.memberIdData,
    }
    this._pocnService.userFollowsList(filter).subscribe(({ data }) => {
      this.followsList = data['userFollowsList'];
      if(this.followsList.length == 0){
        this.followText = "Follow";
        this.followcolor = true;
        // console.log(this.followcolor,"this.followcolor");
      }
      else{
        this.followcolor = false;
        this.followText = "Stop Following";
      }
    // },
    // (error) => {
    //     console.log('there was an error sending the query', error);
    //     this.router.navigate(['/'])
    });
  }
  getUserConnectionRequestExistPost() {
    console.log(this.userConnectionReqExistPostCon,"hiiRequest");
    console.log(this.userConnectionReqExistPost,"hiiRequest");
    if(this.userId == this.memberId['userId']){
      console.log("hiiiifffff");
      this.hideButton = true;
      this.hideBc = true;
      this.hideFol =true;
      this.hideCon=true;
    }
    else{
      console.log("hiiielseeee");
      // this.hideButton = false;
      if(this.userConnectionReqExist['sentStatus'] == true){
        console.log("hiiRequest");
        this.connectText = 'Request Pending';
        this.userFollowsListPost();
      }
      else if(this.userConnectionReqExist['receivedStatus'] == true){
        console.log("hiiaccept");
          this.connectText = 'Accept';
          this.followText = 'Decline';
        }
       else if(this.userConnectionExist['data'] == 'true'){
        console.log("hiiEndConnection");
          this.connectText = 'End Connection';
          this.userFollowsListPost(); 
        }
      else{
        console.log("hiiRequest");
        this.connectText = 'Request Connection';
        this.userFollowsListPost(); 
      }
    }
    // });
  }
  getUserConnectionRequestExistSearch() {

    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getUserConnectionRequestExist(token,this.memberIdData).subscribe(({ data }) => {
      this.userConnectionReqExist = data['getUserConnectionRequestExist']['data'];
      if(this.userConnectionReqExist['sentStatus'] == true){
        this.connectText = 'Request Pending';
      }
      else if(this.userConnectionReqExist['receivedStatus'] == true){
          this.connectText = 'Accept';
        }
      else{
        this.connectText = 'Request Connection';
      }
    });
  }
  getUserConnectionExistPost() {
    // console.log(this.memberId['userId']);
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getUserConnectionExist(token,this.memberId['userId']).subscribe(({ data }) => {
      this.userConnectionExist = data['getUserConnectionExist'];
      this.getUserConnectionRequestExistPostt();
    });

  }
  getUserConnectionRequestExistPostt() {

    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getUserConnectionRequestExist(token,this.memberId['userId']).subscribe(({ data }) => {
      this.userConnectionReqExist = data['getUserConnectionRequestExist']['data'];
      this.getUserConnectionRequestExistPost();
    });
  }
  getUserConnectionRequest() {
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getUserConnectionRequest(token,this.memberId['userId']).subscribe(({ data }) => {
      this.userConnectionReqExistPost = data['getUserConnectionRequest']['requestedConnections'];
      this.userConnectionReqExistPostCon = data['getUserConnectionRequest']['connections'];
      console.log(this.userConnectionReqExistPost);
      console.log(this.userConnectionReqExistPostCon);
    });
  }
  userFollowsListPost() {
    let filter: any = {};
    filter = {
      followerUserId: this.userId,
      followingUserId:  this.memberId['userId'],
    }
    this._pocnService.userFollowsList(filter).subscribe(({ data }) => {
      this.followsList = data['userFollowsList'];
      if(this.followsList.length == 0 && this.type!='incomingRequest'){
        this.followText = "Follow";
        this.followcolor = true;
      }
      else if(this.type=='incomingRequest'){
        this.followText = "Decline";
        this.followcolor = false;
      }
      else{
        this.followcolor = false;
        this.followText = "Stop Following";
      }
    // },
    // (error) => {
    //     console.log('there was an error sending the query', error);
    //     this.router.navigate(['/'])
    });
  }
  getUserStat(token,userData){
    console.log("hiii")
    console.log(userData)
    this._pocnService.getUserStatPublicProfile(token,userData).subscribe(({ data }) => {
      console.log(data);
      this.userDetailsQuery = data['getUserStat'].data;
     console.log(this.userDetailsQuery);
     this.likeCount = data['getUserStat'].data['likesCount'];
     this.connectionCount = data['getUserStat'].data['connectionCount'];
     this.postCount = data['getUserStat'].data['postsCount'];
     this.pointCount = data['getUserStat'].data['pointsCount'];
     this.followersCount = data['getUserStat'].data['followersCount'];
     console.log( this.followersCount);
    });
  }
  onImgError(event){
      event.target.src = 'assets/images-pocn/group-default-thumbnail.svg';
   }
}

