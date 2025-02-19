import { Component, OnInit, Input,Inject } from '@angular/core';
import { Router} from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { UserProfileImage, UserResume, SpecialityNode, StateNode } from './../../services/type';
import { TokenManager } from "./../../services/token-manager";
import { AlertController } from '@ionic/angular';
import { DOCUMENT} from '@angular/common';
import { LoadingService } from 'src/app/services/loading.service';
import { MdmProfilePage } from '../mdm-profile/mdm-profile.page';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { TelemetryService } from 'src/app/services/telemetry.service';
//import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { GroupsAdminModalPage } from '../groups-admin-modal/groups-admin-modal.page';
import { DeleteGroupConfirmPopoverPage } from '../delete-group-confirm-popover/delete-group-confirm-popover.page';
@Component({
  selector: 'app-group-public-profile',
  templateUrl: './group-public-profile.page.html',
  styleUrls: ['./group-public-profile.page.scss'],
})
export class GroupPublicProfilePage implements OnInit {


  public onClick = (contact) => {}
  @Input() memberId: string;
  @Input() type: string;
  @Input() groupId: string;
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
  makeDisableAdmin:boolean =  false;
  removeDisableAdmin:boolean =  false;
  showNoBadgesMsg: boolean = false;
  leaveGrp:boolean =  false;
  leaveButton:boolean =  false;
  hideCon:boolean =  false;
  hideFol:boolean =  false;
  hideRemove:boolean =  false;
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
  showAddFacebook: boolean = false;
  showAddLinkedIn: boolean = false;
  showAddWebsite: boolean = false;
  showLinkedInInput: boolean = false;
  disableRemove: boolean = false;
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
  ignoreRequest: boolean = false;
  disableInvite:boolean = false;
  inviteGrps:boolean = false;
  removeMember:boolean = false;
  removeAdmins:boolean = false;
  makeAdmins:boolean = false;
  showRemove:boolean = false;
  folowName;
  userDetailsQuery;
  likeCount ;
  followersCount
  connectionCount ;
  postCount;
  pointCount ;
  hideButton: boolean = false;
  specialityType: SpecialityNode[] = [];
  stateList: StateNode[] = [];
  userProfileImages: UserProfileImage[] = [];
  resumeStatus = false;
  successStatus = false;
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
  userAgent: string;
  constructor(
    private modalController: ModalController,
    private router: Router,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
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

  }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "group-public-profile-popover";
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
    this.userAgent = this.detectBrowserName() + ',' + this.detectBrowserVersion();

    this.tokenManager.setRefreshTokenIntrvl();
    this.loading.present();
    //this.getPosition();
    this.getUserDetails();

  //  this.getUserPublicProfile();
  //  this.getUserPrivilegeSections();

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
 //fetching browser details
detectBrowserName() {
  const agent = window.navigator.userAgent.toLowerCase()
  switch (true) {
    case agent.indexOf('edge') > -1:
      return 'edge';
    case agent.indexOf('opr') > -1 && !!(<any>window).opr:
      return 'opera';
    case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
      return 'chrome';
    case agent.indexOf('trident') > -1:
      return 'ie';
    case agent.indexOf('firefox') > -1:
      return 'firefox';
    case agent.indexOf('safari') > -1:
      return 'safari';
    default:
      return 'other';
  }
  }
  detectBrowserVersion(){
  let userAgent = navigator.userAgent, tem,
  matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

  if(/trident/i.test(matchTest[1])){
      tem =  /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE '+(tem[1] || '');
  }
  if(matchTest[1]=== 'Chrome'){
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
  }
  matchTest= matchTest[2]? [matchTest[1], matchTest[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem= userAgent.match(/version\/(\d+)/i))!= null) matchTest.splice(1, 1, tem[1]);
  return matchTest.join(' ');
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

    await this.modalController.dismiss(this.type);
    // await this.modalController.dismiss(this.type);
  }
  getUserDetails() {
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    const LoguserId = this._pocnLocalStorageManager.getData("userId");
    this._pocnService.getUserBasicProfile(token)?.subscribe(({ data }) => {
      this.userId = data['getUserBasicProfile'].data['userBasicProfile']['userId'];
      this.providerHcpNpi= data['getUserBasicProfile'].data['userBasicProfile']['npi'];
      this.userName = data['getUserBasicProfile'].data['userBasicProfile']['name'];
      if(this.type=="adminProfile" && this.memberId['roleId'] == 1 &&
      this.userId == this.memberId['ownerUserId'] && this.memberId['memberUserId'] == this.userId  ){
        this.memberIdData  = this.memberId['memberUserId'];
        this.getUserPrivilegeSections();
        this.connectText = 'Exit Group';
        this.getUserStat(this.token,this.memberIdData);
      }
      if(this.type=="adminProfile" && this.memberId['roleId'] == 1 &&
      this.userId != this.memberId['ownerUserId'] &&
      this.memberId['memberUserId'] == this.userId){
        this.memberIdData  = this.memberId['memberUserId'];
        this.getUserPrivilegeSections();
        // this.connectText = 'Remove';
        this.hideRemove = true;
        this.connectText = 'Exit Group';
        this.getUserStat(this.token,this.memberIdData);
      }
      if(this.type=="adminProfile" && this.memberId['roleId'] == 1 &&
      this.userId == this.memberId['ownerUserId'] &&
      this.userId!=this.memberId['memberUserId']){
        this.memberIdData  = this.memberId['memberUserId'];
        this.getUserPrivilegeSections();
        this.connectText = 'Remove';
        this.followText = 'Remove Admin';
        this.getUserStat(this.token,this.memberIdData);
      }
      if(this.type=="adminProfile" && this.memberId['roleId'] == 1 &&
      this.userId != this.memberId['ownerUserId'] &&
      this.memberId['memberUserId'] == this.memberId['ownerUserId']){
        this.memberIdData  = this.memberId['memberUserId'];
        this.getUserPrivilegeSections();
        this.hideCon = true;
        this.hideFol = true;
        this.getUserStat(this.token,this.memberIdData);
      }
      if(this.type=="adminProfile" && this.memberId['roleId'] == 1 &&
      this.userId != this.memberId['ownerUserId'] &&
      this.memberId['memberUserId'] != this.memberId['ownerUserId'] &&
      this.userId != this.memberId['memberUserId'] ){
        this.memberIdData  = this.memberId['memberUserId'];
        this.getUserPrivilegeSections();
        this.hideCon = true;
        this.hideFol = true;
        this.getUserStat(this.token,this.memberIdData);
      }
      if(this.type=="memebrInvite" && this.memberId['roleId'] == 2 && 
      LoguserId == this.memberId['ownerUserId']){
        this.memberIdData  = this.memberId['memberUserId'];
        this.getUserPrivilegeSections();
        this.connectText = 'Remove';
        this.followText = 'Make Admin';
        this.getUserStat(this.token,this.memberIdData);
      }
      if(this.type=="memebrInvite" && this.memberId['roleId'] == 2 && 
      LoguserId != this.memberId['ownerUserId']){
        this.memberIdData  = this.memberId['memberUserId'];
        this.getUserPrivilegeSections();
        this.connectText = 'Remove';
        this.showRemove = true;
        // this.followText = 'Make Admin';
        this.getUserStat(this.token,this.memberIdData);
      }
      if(this.type=="inviteGrp"){
        this.memberIdData  = this.memberId['userId'];
        this.getUserPrivilegeSections();
        // this.connectText = 'Remove';
        this.connectText = 'Invite';
        this.getUserStat(this.token,this.memberIdData);
      }

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
    // let profileImageArray = [];
    // let educationDetails = [];
    // let licenseDetails = [];
    // let workHistoryDetails = [];
    let educationData = [];
    let licenseData = [];
    let workHistoryData = [];
    this._pocnService.getUserPublicProfile(this.token,this.memberIdData).subscribe(({ data }) => {
       this.person = data['getUserPublicProfile'].data;
       this.primarySpecialityDesc =  this.person['userBasicProfile']['primarySpecialityDesc'].replace('(i.e., a specialty other than those appearing above)', '');
       this.educationDetails = data['getUserPublicProfile'].data['userEducationProfile'];
       this.licenseDetails =  data['getUserPublicProfile'].data['userCertLicense'];
       this.workHistoryDetails = data['getUserPublicProfile'].data['userExperienceProfile'];
       this.userProfileImages = data['getUserPublicProfile'].data['userImageProfile'];
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
        // this.workHistoryDetails.forEach((field, index) => {
        //   workHistoryData = field;

        //   let dateToString = new Date("01/"+workHistoryData['endMonth']+"/"+workHistoryData['endYear']);
        //   let dateFromString = new Date("01/"+workHistoryData['startMonth']+"/"+workHistoryData['startYear']);

        //   let yearsnew = Math.floor(this.calculateDiff(dateToString, dateFromString) / 365);
        //   let monthsnew = Math.floor(this.calculateDiff(dateToString, dateFromString) % 365 / 30);

        //   if (yearsnew>1){
        //     this.yearLabel = " Years "
        //   }
        //   else{
        //     this.yearLabel = " Year "
        //   }
        //   if (monthsnew>1){
        //     this.monthLabel = " Months "
        //   }
        //   else{
        //     this.monthLabel = " Month "
        //   }
        //   this.yearDiff = yearsnew + this.yearLabel + monthsnew + this.monthLabel;
        //   console.log(this.yearDiff);
        //   // this.workHistoryDetails.push( {diffYear:this.yearDiff});
        //   if(workHistoryData['experienceTitle'] != '') {
        //     this.workHistoryList.push({   // showing in ui form
        //       experienceTitle: workHistoryData['experienceTitle'],
        //       hcoStateProvince: workHistoryData['hcoStateProvince'],
        //       description: workHistoryData['description'],
        //       tags: workHistoryData['tags'],
        //       healthOrganization: workHistoryData['healthOrganization'],
        //       employmentType: workHistoryData['employmentType'],
        //       hcoLocality:workHistoryData['hcoLocality'],
        //       hcoSubType:workHistoryData['hcoName'],
        //       startYear:workHistoryData['startYear'],
        //       endYear:workHistoryData['endYear'],
        //       startMonth:workHistoryData['startMonth'],
        //       endMonth:workHistoryData['endMonth'],
        //       diffYear:this.yearDiff,
        //     });
        //   }
        // });
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
        if(this.loading.isLoading){
          this.loading.dismiss();
        }
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
    providerUserInfos(){
      this._pocnService.getPocnP2PConnections(this.memberIdData ).subscribe(({ data }) => {
    this.userData = data['providerUserInfos']['nodes'][0];
    // this.getUserRequestedConnections();
          })
    }
    ClickBtn(text){
      // inviteUserGroup
     if(text == 'Invite') {
      this.inviteUserGroup();
     }
     if(text == 'Exit Group') {
       if(this.userId == this.memberId['ownerUserId'] && this.memberId['memberUserId'] == this.userId){

        this.showAdminListing();
       }
      else{
        this.leaveGroup();
      }
     }
     if(text == 'Make Admin') {
      this.makeAdmin();
     }
     if(text == 'Remove Admin') {
      this.removeAdmin();
     }
     if(text == 'Remove') {
      this.removeMemberGroup();
     }
    }
    makeAdmin(){
      this.makeDisableAdmin = true;
     let makeAdminData = {
      accessToken: this.token,
      groupUuid: this.groupId,
      memberUserId: this.memberId['memberUserId'],
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      channel: this.device.userAgent,
      geoLocation: '',
      
    }
      this._pocnService.makeGroupAdmin(makeAdminData).subscribe(
        (response: any) => {
          if (response.data.makeGroupAdmin.groupStatusResponse.status === 'success') {
            // this.showGroupCreationAlert("Set group admin Successfully.");
            const spanName = "make-admin-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId,
             memberUserId: this.memberId['memberUserId']
          }
          const eventName = 'make admin';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully make as group admin' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
            this.makeAdmins= true;
            setTimeout(function () {
              this.makeAdmins= false;
            }.bind(this), 3000);
            this.followText = "Remove Admin";
            this.makeDisableAdmin = false;
          }
          else{
            const spanName = "make-admin-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId,
             memberUserId: this.memberId['memberUserId']
          }
          const eventName = 'make admin';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to make group admin' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
            this.makeDisableAdmin = false;
          }
        });
    }
    removeAdmin(){
      this.removeDisableAdmin = true;
     let removeAdminData = {
      accessToken: this.token,
      groupUuid: this.groupId,
      memberUserId: this.memberId['memberUserId'],
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      channel: this.device.userAgent,
      geoLocation: '',
      
    }
      this._pocnService.removeGroupAdmin(removeAdminData).subscribe(
        (response: any) => {
          if (response.data.removeGroupAdmin.groupStatusResponse.status  === 'success') {
            const spanName = "remove-admin-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId,
             memberUserId: this.memberId['memberUserId']
          }
          const eventName = 'remove admin';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully remove admin' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
            this.removeAdmins= true;
            setTimeout(function () {
              this.removeAdmins= false;
            }.bind(this), 3000);
            this.followText = "Make Admin";
            this.removeDisableAdmin = false;
          }
          else{
            const spanName = "remove-admin-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId,
             memberUserId: this.memberId['memberUserId']
          }
          const eventName = 'remove admin';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to remove admin' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
            this.removeDisableAdmin = false;
          }
        });
    }
    removeMemberGroup(){
      this.disableRemove = true;
     let removeMemberData = {
      accessToken: this.token,
      groupId: this.groupId,
      userId: this.memberId['memberUserId'],
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      channel: this.device.userAgent,
      geoLocation: '',
      
    }
      this._pocnService.removeMemberGroup(removeMemberData).subscribe(
        (response: any) => {
          if (response.data.removeMemberGroup.groupStatusResponse.status  === 'Success') {
            // this.showGroupCreationAlert("Remove member Successfully.");
            const spanName = "remove-member-grp-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId,
             memberUserId: this.memberId['memberUserId']
          }
          const eventName = 'remove member group';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully remove member from group' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
            this.removeMember= true;
            setTimeout(function () {
              this.removeMember= false;
            }.bind(this), 3000);
            if(this.type == 'memebrInvite'){
              this.modalController.dismiss('memebrInvite');
            }
            else{
              this.modalController.dismiss('remove');
            }
            
          }
          else{
            this.disableRemove = false;
            const spanName = "remove-member-grp-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId,
             memberUserId: this.memberId['memberUserId']
          }
          const eventName = 'remove member group';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to remove member from group' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
          }
        });
    }
    inviteUserGroup(){
      this.disableInvite = true;
     let inviteData = {
        accessToken: this.token,
        groupId: this.groupId,
        userId: this.memberId['userId'],
        npi: this.memberId['npi'],
        userFirstName:  this.memberId['firstName'],
        userLastName: this.memberId['lastName'],
        userSpecialtyCode: this.memberId['primarySpecialtyCode'],
        userSpecialtyDesc: this.memberId['primarySpecialtyDesc'],
        userDegreeGroupCode: this.memberId['primarySpecialtyGroupCode'],
        userCity:this.memberId['city'],
        userState: this.memberId['state'],
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
        ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        channel: this.userAgent,
        inviteUserClass: '',
        geoLocation:'',
        userEmail: this.memberId['emailId'],
        userMessage: "test",
        
    }
      this._pocnService.inviteUserGroup(inviteData).subscribe(
        (response: any) => {
          if (response.data.inviteUserGroup.groupStatusResponse.status === 'success') {
            // this.showGroupCreationAlert("Invited Successfully.");
            const spanName = "invite-grp-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId,
             memberUserId: this.memberId['memberUserId']
          }
          const eventName = 'invite group';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully invite from group' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
            this.disableInvite = true;
            this.inviteGrps= true;
            setTimeout(function () {
              this.inviteGrps= false;
            }.bind(this), 3000);

          }
          else{
            this.disableInvite = false;
            const spanName = "invite-grp-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId,
             memberUserId: this.memberId['memberUserId']
          }
          const eventName = 'invite group';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to invite group' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
          }
        });
    }
    showGroupCreationAlert(message) {
      this.alertController.create({
        header: '               ',
        subHeader: message,
        message: '                ',
        buttons: ['OK']
      }).then(res => {
        res.present();
      });
      // this.getUserGroups();
    }
    async showAdminListing(){
      const popover = await this.modalController.create({
        component: GroupsAdminModalPage,
        cssClass: 'public-profile-modal',
        componentProps: {
          'memberId': this.memberId,
          "type": this.type,
          "groupId": this.groupId ,
        }
      });
      popover.onDidDismiss().then((modalDataResponse) => {
        if (modalDataResponse.data == 'makeOwner') {
          this.onClick('makeOwner');
        }
      });
      await popover.present();
    }
    onImgError(event,fileName = '', extension = ''){
      event.target.src = 'assets/images-pocn/group-default-thumbnail.svg'
      // if(fileName !='' && fileName != null && extension!='' &&  extension!=null){
      //  event.target.src = environment.grpImgUrl + fileName +'.' +extension;
      // }
      //  else{
        // event.target.src = 'assets/images-pocn/group-defaultimage.svg'
      //  }
  }
  async leaveGroup(){
    this.leaveButton = true;
   const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
   const groupId = this.router.url.split('?')[0].split('/').pop();
   let type = "remove";
   let ipAddressV4 =  this._pocnLocalStorageManager.getData("ipv4");
   let ipAddressV6 =  this._pocnLocalStorageManager.getData("ipv6");
   let device = this.deviceType;
   let channel =  this.device.userAgent;
   let geoLocation =  '';
   const popover = await this.modalController.create({
     component: DeleteGroupConfirmPopoverPage,
     cssClass: 'reject-modal',
   });
   popover.onDidDismiss().then((modalDataResponse) => {
     if(modalDataResponse.data == 'confirm-delete'){
       this._pocnService.withdrawGroupJoinRequest(token,groupId,type,ipAddressV4,ipAddressV6,device,channel,geoLocation).subscribe(
         (response: any) => {
           if (response.data.withdrawGroupJoinRequest.groupStatusResponse.status === 'success') {
            const spanName = "leave-grp-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId
          }
          const eventName = 'leave group';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully leave group' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
             this.leaveGrp= true;
             setTimeout(function () {
               this.leaveGrp= false;
               this.modalController.dismiss('makeOwner');
               this.router.navigateByUrl('/tablinks/groups' ,{ state: {  tabMsg: 'groupManageTab'} } );
             }.bind(this), 3000);
            //  this.modalController.dismiss('makeOwner');
             
             // this.router.navigate(['/tablinks/groups'])
            //  this.leaveButton = false;
           }
           else{
            const spanName = "leave-grp-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId
          }
          const eventName = 'leave group';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to leave group' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
           }
         },
         (error) => {
             this.router.navigate(['/'])
         });
     }
     else{
      this.leaveButton = false;
      //  this.close('');
     }
   });
   await popover.present();
 }
 getUserStat(token,userData){
  this._pocnService.getUserStatPublicProfile(token,userData).subscribe(({ data }) => {
    this.userDetailsQuery = data['getUserStat'].data;
   this.likeCount = data['getUserStat'].data['likesCount'];
   this.connectionCount = data['getUserStat'].data['connectionCount'];
   this.postCount = data['getUserStat'].data['postsCount'];
   this.pointCount = data['getUserStat'].data['pointsCount'];
   this.followersCount = data['getUserStat'].data['followersCount'];
  });
}
}
