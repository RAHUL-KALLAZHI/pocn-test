import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd,ActivatedRoute,Params} from '@angular/router';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { OverlayPopoverPage } from "../overlay-popover/overlay-popover.page";
import { CreateRoomResponse } from './../../services/type';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
// import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';
import {IonInput} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
import { NgForm } from '@angular/forms';
import { Source, EmploymentNode, UserProfileImage, UserResume, AddressNode, ContactNode, DegreeNode, SpecialityNode, StateNode, educationNode } from './../../services/type';
import { Observable, Subscriber, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PublicProfilePage } from '../public-profile/public-profile.page';
import jsSHA from 'jssha';
import { IonContent } from '@ionic/angular';
import { Location } from '@angular/common'
import { DomSanitizer } from '@angular/platform-browser';
import {  ModalController, Platform } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { PhotoPlugin } from 'src/plugins/imagePicker';
@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  tabType = 'subscribed';
  showSearch: boolean = false;
  public myUserDialerData: any[];
  userDetails = false;
  public hcpVerified : number;
  public phoneLinked: number;
  public verificationType: string;
  userId: string;
  appPlatform: string = Capacitor.getPlatform();
  token: string;
  imageUrl = environment.postProfileImgUrl;
  profileImgUrl;
  bannerImgUrl;
  inviteProfileImgUrl;
  joinReqBannerImgUrl;
  specialityType: SpecialityNode[] = [];
  person = [];
  sentInvite;
  searchText;
  hideGrpBtn: boolean = false;
  showGrpName: boolean = false;
  showType: boolean = false;
  showLocation: boolean = false;
  showGrpDesc:boolean = false;
  specialityListTemp: any;
  public userRoomData: string;
  userIp = '';
  deviceType: string = '';
  geolocationPosition: string = '';
  backButtonSubscription;
  userAgent: string;
  showMyGroupsLoader: boolean = false;
  public myGroups = [];
  interestedAreaList = [];
  topicsOfInterestList = [];
  defaultImg ="assets/images-pocn/group-default-thumbnail.svg";
  myCreatedGroupEmptytMessage: boolean = false;
  mySubscribedGroupEmptytMessage: boolean = false;
  mySubscribedGroupLoader: boolean = false;
  public mySubscribedGroups;
  roleId;
  group;
  public myCreatedGroups = [];
  public myGroupList;
  public myPendingRequestGroups;
  public groupRecoSpecilality;
  public groupRecoLocation;
  public groupRecoTa;
  public groupRecoTags;
  public groupRecoName;
  specialityLoaderStatus: boolean = false;
  locationLoaderStatus: boolean = false;
  taLoaderStatus: boolean = false;
  tagsLoaderStatus: boolean = false;
  nameLoaderStatus: boolean = false;
  public connectionRecommendationMessage;
  public connectionLocationMessage;
  public connectionTaMessage;
  public connectionTagsMessage;
  public connectionNameMessage;
  public groupRecoType;
  typeLoaderStatus: boolean = false;
  invitationsSentLoader: boolean = true;
  invitationsRecLoader: boolean = false;
  requestSentLoader: boolean = false;
  requestRecLoader: boolean = false;
  showInviteSent: boolean = false;
  showInviteRec: boolean = false;
  showRequestSent: boolean = false;
  showRequestRec: boolean = false;
  public connectionRecoMessageBytype;
  public myPendingApprovalGroups;
  public regionalMasters;
  stateList;
  createGrpRequest: boolean = false;
  acceptInvitRequest: boolean = false;
  rejectInvitRequest: boolean = false;
  withdrawInvitRequest: boolean = false;
  withdrawJoinRequest: boolean = false;
  acceptJoinRequest: boolean = false;
  rejectJoinRequest: boolean = false;
  rejectRequest: boolean = false;
  public groupScopMasters;
  groupPendingRequestEmptyMessage: boolean = false;
  groupRecomendationEmptyMessage: boolean = false;
  groupPendingRequestApprovalEmptyMessage: boolean = false;
  showGroupForm: boolean = false;
  showManageTab: boolean = true;
  validGroupCreation;
  searchGroupData;
  searchGroupMessage: boolean = false;
  mySearchGroupLoader: boolean = true;
  postFileName = "";
  fileSize: any;
  fileType: string;
  fileDate: string;
  idfileErrorStatus:boolean = false;
  errorMsg = '';
  postImageErrorMsg: boolean = false;
  postErrorMsg = '';
  resumeFileType = ["image/jpeg", "image/jpg", "image/png","image/PNG", "image/JPG", "image/JPEG"];
  postFileType;
  showImageData;
  showImage;
  attachmentTypeContent ;
  @ViewChild('autoFocus', {static: false}) autoFocus!: IonInput;
  @ViewChild('pickImageInput ') pickImageInput : ElementRef;
  @ViewChild(IonContent) content: IonContent;
  public controlledGroup;
  public membersList;
  public pendingMembers;
  public memberInvite: boolean = false;
  public joinBtn: boolean = false;
  public canceljoinBtn: boolean = false;
  public joinRequestEmptyMessage: boolean = false;
  memberTotalCount;
  memberTotalCountOnly= 1;
  membersCountLabel= 'Member';
  adminUserId;
  loggedInUserId;
  ownerUserIdData;
  public connectionPocnMessage;
  pocnLoaderStatus: boolean = false;
  public groupRecoPocn;
  public adminView: boolean = false;
  userBasicData;
  showConNotification: boolean= false;
  showNotification: boolean= false;
  notificationName;
  countData;
  conNotificationData;
  requestorCount;
  requestorNames;
  notificationData;
  public groupDetails = {
    controlledGroup: true,
    groupDescription: "",
    groupName:'',
    private:'',
    memberInvite:true,
    enrollment:'open',
    tags:'',
    therapeuticArea:'',
    speciality: "",
    groupBanner: "",
    groupIcon: "",
    type: "",
    groupUuid: "",
    provideType:'',
    scope: '',
    groupScope: '',
  }

  sentInvitation = [];
  recInvitation = [];
  sentInviteMsg: boolean = false;
  recInviteMsg: boolean = false;
  msgForm = '';
  errorBtn: boolean = false;
  refetchPost;
  // specialityType;
  grpDescWhiteSpaceCheck: boolean = true;
  grpDetails;
public subcribeSearchClick;
public connectStatus;
  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    private deviceService: DeviceDetectorService,
    private httpClient: HttpClient,
    public alertController: AlertController,
    private location: Location,
    private platform: Platform,
    public telemetry: TelemetryService,
    ) {
      this._pocnService.getIpAddress();
      this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
      let currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.refetchPost = this.location.getState();
        if(this.refetchPost.groupMsg == "groups"){
          this.getUserGroups();
        }
       if(this.refetchPost.tabMsg == 'groupManageTab'){
        this.tabType = 'managed';
        this.getUserGroups();
       }
       if(this.refetchPost.tabMsg == 'groupSubscribeTab'){
        this.tabType = 'subscribed';
        // this.recClick();
        this.subClick() ;
       }
       if(this.refetchPost.tabMsg == 'reccTab'){
        this.tabType = 'recommended';
        this.recClick();
       }
       if(this.refetchPost.tabMsg == 'groupPendingTab'){
        this.tabType = 'pending';
        this.pendingClick();
       }
      };
    });
    this.route.params.subscribe((params: Params) => {
      if(params.tab && params.tab== 'request'){
        this.tabType = 'pending';
        this.pendingClick();
        // localStorage.setItem(
        //   "connectionTabName",
        //     "connectionRequest"
        // );
      }
    });
    }

  ngOnInit() {
    this.getMyConnectionsRequestNotification();
    this.getUserProfile();
    this.getDialerCaller();
    this.getUserGroups();
    this.patientConnectStatusCalls();
    this.getSpecialityType();
    this.groupRecommendationByPocn();
    // this.getUserGroupDetail();
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') ;
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
    if(this.isMobile == true){
      this.deviceType = "Mobile"
      }
      else if(this.isTablet == true){
      this.deviceType = "Tablet"
      }
      else if(this.isDesktop == true){
      this.deviceType = "Desktop"
      }
      else{
      this.deviceType = "Unknown"
      }
      this.userAgent = this.detectBrowserName() + ',' + this.detectBrowserVersion();
      // this.getPosition();
      this.loadIp();
  }
  hex2a(hexx:any) {
    var hex = hexx.toString() //force conversion
    var str = ''
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    return str
  }
  getGroupScopMasters = () => {
    this._pocnService.groupScopMasters().subscribe(({ data }) => {
    this.groupScopMasters = data.groupScopMasters.nodes;
    //  this.groupScopMasters =  this.groupScopMasters.filter((obj) => {
    //   return obj.status = 0;
    // });
  })
}
  getSpecialityType = () => {
    this._pocnService.getSpecialityType().subscribe(({ data }) => {
    this.specialityType = data.masterSpecialties.nodes;
    });
  }
  // getPosition(): any {
  //   Geolocation.getCurrentPosition().then(coordinates => {
  //     this.geolocationPosition = coordinates.coords.latitude + ',' + coordinates.coords.longitude;
  //   }).catch((error) => {
  //     this.geolocationPosition = "";
  //     console.log('Error getting location', error);
  //   });
  // }
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
  getUserProfile() {
    this._pocnService.getUserProfile(this.token)?.subscribe(({ data }) => {
    // this.userBasicData = data['getUserFullProfile'].data['userBasicProfile']['degreeGroupCode'];
    // console.log(this.userBasicData);
    if(data['getUserFullProfile'].data['userBasicProfile']['degreeGroupCode'] == 'PA'){
      this.userBasicData = 'Physician Associate';
    }
    else{
      this.userBasicData = 'Nurse Practitioner';
    }
    this.userId = data['getUserFullProfile'].data['userBasicProfile']['userId'];
    this.person = JSON.parse(JSON.stringify(data['getUserFullProfile'].data));
    let basicProfile = data['getUserFullProfile'].data['userBasicProfile'];
    let specialityTemp =  this.specialityType.filter((obj) => {
      return obj.specialtyName === basicProfile.primarySpecialityDesc;
    });

    if(specialityTemp.length>0){
      this.specialityListTemp = {
        specialtyCode: specialityTemp[0].specialtyCode,
        specialtyGroupCode: specialityTemp[0].specialtyGroupCode,
        specialtyGroupName: specialityTemp[0].specialtyGroupName,
        specialtyId: (specialityTemp[0].specialtyId).toString(),
        specialtyName: specialityTemp[0].specialtyName
      };
    }
    else{
      this.specialityListTemp = {
        specialtyCode: '',
        specialtyGroupCode: '',
        specialtyGroupName: '',
        specialtyId: '',
        specialtyName: ''
      };
    }


    },
      (error) => {
          this.router.navigate(['/'])
      });
  }
  getDialerCaller() {
      this._pocnService.getDialerCaller(this.token)?.subscribe(({ data }) => {
      this.myUserDialerData = data['getDialerCaller'].data;
    })
  }
  patientConnectStatusCalls(){
    this._pocnService.patientConnectStatusCalls(this._pocnLocalStorageManager.getData("userId").toUpperCase( )).subscribe(({ data }) => {
      if(data.patientConnectStatusCalls.nodes != ''){
        let setSuccess ;
        setSuccess = data.patientConnectStatusCalls.nodes[0];
        this.hcpVerified = setSuccess.hcpVerified;
        this.phoneLinked = setSuccess.phoneLinked;
        this.verificationType = setSuccess.verificationType;
        this.connectStatus = setSuccess.patientConnectRegistrationStatus;
        // if(setSuccess.patientConnectRegistrationStatus == 1){
        //   if(type == 'audio'){
        //     this.router.navigate(['/dialer'])
        //   }
        //   else{
        //     this.goToVideoCall();
        //   }
        // } else{
        //     // if(setSuccess.hcpVerified == 0 && setSuccess.phoneLinked == 1 &&  this.myUserDialerData.length > 0 && this.verificationType == 'Manual' ){
        //     //   this.router.navigate(['/dialer'])
        //     //   this.presentLoading();
        //     // } else{
        //       this.router.navigateByUrl('/connect', { state: { tabName: 'groups' , type: type} });
        //    // }
        // }
      }
    })
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
    this.router.navigateByUrl('/connect', { state: { tabName: 'groups' , type: type} });
  }
}
  goToVideoCall(){
    let createRoom: any;
    createRoom = {
            accessToken: this.token,
            channel: this.userAgent,
            ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
            ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
            device: this.deviceType,
            geoLocation:this.geolocationPosition,
          }
    this._pocnService.createRoom(createRoom).subscribe(
      (response: CreateRoomResponse) => {
        if(response.data.createRoom.updateConnectionResponse.status === 'success') {
          this.userRoomData = response.data.createRoom.updateConnectionResponse.data;
          const spanName = "connect-call-create-room-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail")
          }
          const eventName = 'connect video call create room';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully room created in video call' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
        }
        this.router.navigateByUrl('/dialer2', { state: { userDataId: this.userRoomData} });
    });
  }

  //navigate to dialer screen
  async presentLoading() {
    const popover = await this.modalController.create({
      component: OverlayPopoverPage,
      cssClass: 'overlay-modal',
    });
    popover.onDidDismiss().then((modalDataResponse) => {
      this.router.navigate(['/tablinks/my-profile'])
    });
    await popover.present();
  }
  getUserGroups(){
    this.mySubscribedGroupLoader = true;
    this.showMyGroupsLoader = true;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");

    const userId = this._pocnLocalStorageManager.getData("userId");
    this._pocnService.getUserGroups(token)?.subscribe(({ data }) => {

      this.myGroups = data['getUserGroups']['data'];
       if(this.myGroups.length<1){
       // this.myGroupEmptytMessage = true;
      //  this.mySubscribedGroupEmptytMessage = true;
      //  this.mySubscribedGroupLoader = false;
      this.mySubscribedGroupLoader = false;
      this.mySubscribedGroupEmptytMessage = true;
      this.showMyGroupsLoader = false;
      this.myCreatedGroupEmptytMessage = true;
       }
       else{
         this.mySubscribedGroups = this.myGroups.filter(x => x.ownerUserId !== userId && x.roleId !=1);
         if(this.mySubscribedGroups.length > 0){
          this.mySubscribedGroupEmptytMessage = false;
          this.mySubscribedGroupLoader = false;

         }

         else{
          this.mySubscribedGroupLoader = false;
          this.mySubscribedGroupEmptytMessage = true;
         }
         this.mySubscribedGroups = JSON.parse(JSON.stringify(this.myGroups.filter(x => x.ownerUserId !== userId && x.roleId !=1)));


         this.mySubscribedGroups.forEach((field, index) => {
         let grpSubImageUrl = environment.grpImgUrl + field.bannerFileName + '.' + field.bannerExtension + '?lastmod=' + Math.random();

         var encoded_url = btoa(grpSubImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
         var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
          "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
          //console.log(path)
          var shaObj = new jsSHA("SHA-256", "BYTES")
          shaObj.setHMACKey(environment.imageProxyKey, "HEX");
          shaObj.update(this.hex2a(environment.imageProxySalt));
          shaObj.update(path);
         var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

         field.grpSubImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();

         });
        //  this.myCreatedGroups
        // this.myCreatedGroups = this.myGroups.filter(x => x.ownerUserId === userId);
        this.myCreatedGroups = this.myGroups.filter(x => x.roleId == 1);
        if(this.myCreatedGroups.length > 0){
          this.showMyGroupsLoader = false;
          this.myCreatedGroupEmptytMessage = false;
         }
         else{
           this.showMyGroupsLoader = false;
           this.myCreatedGroupEmptytMessage = true;

         }
         this.myCreatedGroups = JSON.parse(JSON.stringify(this.myGroups.filter(x => x.roleId == 1)));

         this.myCreatedGroups.forEach((field, index) => {
         let grpImageUrl = environment.grpImgUrl + field.bannerFileName + '.' + field.bannerExtension + '?lastmod=' + Math.random();
         var encoded_url = btoa(grpImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
         var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
          "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
          //console.log(path)
          var shaObj = new jsSHA("SHA-256", "BYTES")
          shaObj.setHMACKey(environment.imageProxyKey, "HEX");
          shaObj.update(this.hex2a(environment.imageProxySalt));
          shaObj.update(path);
         var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

         field.grpImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
         });
       }


    });
  }
  groupJoinRequestsPendingToApprove(){
    this.invitationsRecLoader = true;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken")
    this._pocnService.groupJoinRequestsPendingToApprove(token).subscribe(({ data }) => {
      this.showRequestRec = true;
      // bannerExtension

      this.myPendingApprovalGroups = data.getApprovalWaitingRequest.data;
      let len = this.myPendingApprovalGroups.length;
      this.invitationsRecLoader = false;
      if(len > 0){
        this.groupPendingRequestApprovalEmptyMessage = false;
      }
      else{
        this.groupPendingRequestApprovalEmptyMessage = true;
      }
      this.myPendingApprovalGroups = JSON.parse(JSON.stringify(data.getApprovalWaitingRequest.data));
      this.myPendingApprovalGroups.forEach((field, index) => {
       let grpImageUrl = environment.grpImgUrl + field.bannerFileName + '.' + field.bannerExtension + '?lastmod=' + Math.random();
       var encoded_url = btoa(grpImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
       var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
        "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
        //console.log(path)
        var shaObj = new jsSHA("SHA-256", "BYTES")
        shaObj.setHMACKey(environment.imageProxyKey, "HEX");
        shaObj.update(this.hex2a(environment.imageProxySalt));
        shaObj.update(path);
       var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

       field.grpImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
       });
       this.myPendingApprovalGroups.forEach((field, index) => {


         let grpProfileImageUrl = environment.postProfileImgUrl + field.memberUserId + '.' + field.userImgExtension + '?lastmod=' + Math.random();
       var encoded_url = btoa(grpProfileImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
       var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
        "/g:" + "no"  + "/" + encoded_url + "." + field.userImgExtension;
        //console.log(path)
        var shaObj = new jsSHA("SHA-256", "BYTES")
        shaObj.setHMACKey(environment.imageProxyKey, "HEX");
        shaObj.update(this.hex2a(environment.imageProxySalt));
        shaObj.update(path);
       var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

       field.grpProfileImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();

       });
    });
    //
  }
  approveGroupJoinRequest(member){
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    let input = {
      groupId: member.groupUuid,
      actionType: "approve",
      requestedUserId: member.memberUserId,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      channel: this.device.userAgent,
      geoLocation: '',
    }
    this._pocnService.approveGroupJoinRequest(input,token).subscribe(
      (response: any) => {
        if (response.data.approveRequest.groupStatusResponse.status === 'success') {
          const spanName = "approve-join-request-grp-btn";
          let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            groupId: member.groupUuid,
            requestedUserId: member.memberUserId
        }
        const eventName = 'approve join request';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully approve join request' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
          this.acceptJoinRequest = true;
          this.content.scrollToTop(3000);
        setTimeout(function () {
          this.acceptJoinRequest = false;
        }.bind(this), 3000);
          this.groupJoinRequestsPendingToApprove();
        }
        else{
          const spanName = "approve-join-request-grp-btn";
          let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            groupId: member.groupUuid,
            requestedUserId: member.memberUserId
        }
        const eventName = 'approve join request';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to approve join request' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
        }
      },
      (error) => {
        this.router.navigate(['/'])
      });
  }

  rejectGroupJoinRequest(member){
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    let input = {
      groupId: member.groupUuid,
      actionType: "reject",
      requestedUserId: member.memberUserId,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      channel: this.device.userAgent,
      geoLocation: '',

    }
    this._pocnService.approveGroupJoinRequest(input,token).subscribe(
      (response: any) => {
        if (response.data.approveRequest.groupStatusResponse.status === 'success') {
          const spanName = "reject-join-request-grp-btn";
          let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            groupId: member.groupUuid,
            requestedUserId: member.memberUserId
        }
        const eventName = 'reject join request';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully reject join request' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
          this.rejectRequest = true;
          this.content.scrollToTop(3000);
        setTimeout(function () {
          this.rejectRequest = false;
        }.bind(this), 3000);
          this.groupJoinRequestsPendingToApprove();
        }
        else{
          const spanName = "reject-join-request-grp-btn";
          let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            groupId: member.groupUuid,
            requestedUserId: member.memberUserId
        }
        const eventName = 'reject join request';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to reject join request' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
        }
      },
      (error) => {
        this.router.navigate(['/'])
      });
  }
  pendingGroupJoinRequests(){
    this.requestSentLoader = true;
    const currentUserId = this._pocnLocalStorageManager.getData("userId");
    this._pocnService.myPendingGroupJoinRequests(currentUserId).subscribe(({ data }) => {
      if(data.groupMembersLists.totalCount>0){
        this.myPendingRequestGroups = data.groupMembersLists.nodes;
        this.groupPendingRequestEmptyMessage = false;
      }
      else{
        this.groupPendingRequestEmptyMessage = true;
      }
      this.requestSentLoader = false;
      this.groupJoinRequestsPendingToApprove();
      this.showRequestSent = true;
      this.myPendingRequestGroups = JSON.parse(JSON.stringify(data.groupMembersLists.nodes));
      this.myPendingRequestGroups.forEach((field, index) => {
       let grpImageUrl = environment.grpImgUrl + field.bannerFileName + '.' + field.bannerExtension + '?lastmod=' + Math.random();
       var encoded_url = btoa(grpImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
       var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
        "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
        //console.log(path)
        var shaObj = new jsSHA("SHA-256", "BYTES")
        shaObj.setHMACKey(environment.imageProxyKey, "HEX");
        shaObj.update(this.hex2a(environment.imageProxySalt));
        shaObj.update(path);
       var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

       field.grpImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
       });
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
    this.getUserGroups();
  }
  subClick() {
    this.getUserGroups();
    // this.showSearch = false;
    this.searchText = '';
  }
  pendingClick() {
    // this.groupJoinRequestsPendingToApprove();
    // this.pendingGroupJoinRequests();
    this.getMySentInvitationRequest();
    // this.getMyReceivedInvitationRequest();
  }
  managedClick() {
    this.getUserGroups();
    // this.showSearch = false;
    this.searchText = '';
  }
  recClick(){
    // this.groupRecommendationBySpecialty();
    // this.groupRecommendationByType();
    // this.groupRecommendationByLocation();
    // this.groupRecommendationByTa();
    // this.groupRecommendationByName();
    // this.groupRecommendationByTags();
    this.groupRecommendationByPocn();
    // this.showSearch = false;
    this.searchText = '';
  }
  showGroupMethod (){
    this.showGroupForm = true;
    this.showManageTab = false;
    // this.showCreateGroupBtn = false;
    // this.showGroupTabContent = false;
    this.getSpecialityType();
    this.getGroupScopMasters();
    this.getStates();
    this.getRegionalMasters();

   }
   getStates = () => {
    this._pocnService.getStates().subscribe(({ data }) => {
      this.stateList = data.states.nodes;
    });
  }

  getRegionalMasters = () => {
    this._pocnService.regionalMasters().subscribe(({ data }) => {
    this.regionalMasters = data.regionalMasters.nodes;
    });
  }
   cancelGroupCreation(groupDetails, f:NgForm){
    this.showGroupForm = false;
    this.showManageTab = true;
    // f.resetForm();
    this.showGrpName = false;
    this.showGrpDesc = false;
   this.showType = false;
   this.showLocation = false;
    this.attachmentTypeContent = '';
    groupDetails = {
      controlledGroup: true,
      groupDescription: "",
      groupName:'',
      private:'',
      memberInvite:true,
      enrollment:'',
      tags:'',
      therapeuticArea:'',
      speciality: "",
      groupBanner: "",
      groupIcon: "",
      type: "",
      groupUuid: "",
      provideType:'',
      scope: '',
      groupScope: '',
    }


  }
  submitGroupFormMethod(groupDetails, f:NgForm){
    let scopeData;
    let controlledGroup;
    if(f.value['grpName'] == ''){
      this.showGrpName = true;
    }
    else{
      this.showGrpName = false;
    }
    if(f.value['desc'] == ''){
      this.showGrpDesc= true;
    }
    else{
      this.showGrpDesc = false;
    }
    if(f.value['provideType'] == ''){
      this.showType= true;
    }
    else{
      this.showType = false;
    }
    if(f.value['groupScope'] == ''){
      this.showLocation= true;
    }
    else{
      this.showLocation = false;
    }
    if(f.value['enrollment'] == 'open'){
      controlledGroup = true;
    }
    else{
      controlledGroup = false;
    }
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    if(f.value['groupScope'].scopeTitle == 'Local'){
      scopeData = groupDetails.scope.statevalue
    }
   else if(f.value['groupScope'].scopeTitle == 'Regional'){
      scopeData = groupDetails.scope.title
    }
    else{
      scopeData = ''
    }

   let grpNameWhiteSpaceCheck = false;
    let groupData = {
      controlledGroup: controlledGroup,
      groupDescription: groupDetails.groupDescription,
      groupName:groupDetails.groupName,
      private:Boolean('no'),
      tagLine:'',
      memberInvite:groupDetails.memberInvite,
      enrollment:groupDetails.enrollment,
      tags:groupDetails.tags,
      therapeuticArea:groupDetails.therapeuticArea.title,
      specialty: groupDetails.speciality.specialtyName,
      specialtyCode  : groupDetails.speciality.specialtyCode,
      groupBanner: this.attachmentTypeContent,
      groupIcon: '',
      // type: groupDetails.provideType,
      // groupUuid: groupDetails.groupUuid,
      type: groupDetails.provideType,
      scope: scopeData,
      groupScope: groupDetails.groupScope.scopeTitle,
      bannerExtension: this.fileType,
      iconExtension: '',
      ipAddressV4 : this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6 : this._pocnLocalStorageManager.getData("ipv6"),
      device : this.deviceType,
      channel : this.device.userAgent,
      geoLocation : ''
    }
    if(groupDetails.groupName!= null && groupDetails.groupName!= ""){
      if (!groupDetails.groupName.replace(/\s/g, '').length) {
        grpNameWhiteSpaceCheck = true;
      } else {
        grpNameWhiteSpaceCheck = false;
      }
    }
    else {
      grpNameWhiteSpaceCheck = true;
    }

    if (groupDetails.groupDescription.replace(/\s/g, '').length) {
      this.grpDescWhiteSpaceCheck = true;
    } else {
      this.grpDescWhiteSpaceCheck = false;
    }
    if(groupDetails.groupName != '' && grpNameWhiteSpaceCheck == false   && groupDetails.provideType != ''
     && groupDetails.provideType != null && groupDetails.groupDescription !='' && groupDetails.groupDescription!= null
     && groupDetails.groupScope.scopeTitle != '' && groupDetails.groupScope.scopeTitle != null && this.grpDescWhiteSpaceCheck == true){
      this.validGroupCreation = true;
    }
    else{
      this.validGroupCreation = false;
    }
  // this.groupDetails.specialty =
    if(this.validGroupCreation){
    delete this.groupDetails.groupUuid;
   this.hideGrpBtn = true;
    this._pocnService.createGroup(groupData,token).subscribe(

        (response: any) => {
          if (response.data) {
            if (response.data.createGroup.groupStatusResponse.status === 'success') {
              const spanName = "create-grp-btn";
          let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            groupName:groupDetails.groupName,
        }
        const eventName = 'create group';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully create group' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
              this.createGrpRequest = true;
              setTimeout(function () {
                this.createGrpRequest = false;
              }.bind(this), 3000);
              this.showGroupForm = false;
              this.showManageTab = true;
              this.getUserGroups();
              this.hideGrpBtn = false;
              this.myCreatedGroupEmptytMessage = false;
              // f.resetForm();
              this.attachmentTypeContent = '';
              this.groupDetails = {
                controlledGroup: true,
                groupDescription: "",
                groupName:'',
                private:'',
                memberInvite:true,
                enrollment:'',
                tags:'',
                therapeuticArea:'',
                speciality: "",
                groupBanner: "",
                groupIcon: "",
                type: "",
                groupUuid: "",
                provideType:'',
                scope: '',
                groupScope: '',
              }
            }
            else if (response.data.createGroup.groupStatusResponse.status === 'error'){
              const spanName = "create-grp-btn";
          let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            groupName:groupDetails.groupName,
        }
        const eventName = 'create group';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to create group' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
              this.hideGrpBtn = false;
              // this.showGroupCreationAlert(response.data.createGroup.groupStatusResponse.error);
              this.content.scrollToTop(3000);
              this.msgForm = response.data.createGroup.groupStatusResponse.error;
              this.errorBtn = true;
              setTimeout(function () {
                this.errorBtn = false;
              }.bind(this), 3000);


            }
            else{
              const spanName = "create-grp-btn";
              let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                groupName:groupDetails.groupName,
            }
            const eventName = 'create group';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'error', 'message': 'Cfailed to create Group, Please try again later' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
              this.msgForm = ("Could n't create Group, Please try again later.");
              // this.showGroupCreationAlert("Could n't create Group, Please try again later.")
              this.content.scrollToTop(3000);
              this.hideGrpBtn = false;
              this.errorBtn = true;
              setTimeout(function () {
                this.errorBtn = false;
              }.bind(this), 3000);
            }
          }
        });
    }

   }

  convertToBase64(file : File) : Observable<string> {
    const result = new ReplaySubject<any>(1);
    let reader = new FileReader();
    const realFileReader = (reader as any)._realReader;
    if (realFileReader) {
      reader = realFileReader;
    }
    reader.readAsDataURL(file);
    reader.onloadend =  function() {
      result.next(reader.result);
    };
    return result;
  }
  async selectFile() {
    let permissions: any;
    let permissionList: any;
    let image: any;
    switch (this.appPlatform) {
      case 'web':
        this.pickImageInput.nativeElement.click()
        break;
      case 'android':
        try {
          permissions = await Camera.requestPermissions();
        } catch (error) {
        }
        permissionList = await Camera.checkPermissions();
        if ( permissionList.photos === 'granted' ) {
          this.pickImageInput.nativeElement.click()
        }else{
          this.presentAlert()
        }
        break;
      case 'ios':
        try {
          permissions = await Camera.requestPermissions();
        } catch (error) {
        }
        permissionList = await Camera.checkPermissions();
        if ( permissionList.photos === 'granted') {
          try {
            image = await Camera.getPhoto({
              quality: 80,
              allowEditing: false,
              resultType: CameraResultType.Base64,
              saveToGallery: true,
              correctOrientation: true,
              source: CameraSource.Photos
            });
          } catch (error) {
          }
          if (image) {
            this.galleryImageUploads(image.base64String)
          }
        }else if(permissionList.photos === 'limited'){
          try {
            image = await PhotoPlugin.getPhoto({ message: 'SINGLE' });
            if (image) {
              this.galleryImageUploads(image.dataImage)
            }
          } catch (error) {
            return;
          }
        }else {
          this.presentAlert()
        }
        break;
    }

  }

  galleryImageUploads(image: any){
    const file  = `data:image/jpeg;base64,${image}`;
    this.fileType = 'jpeg';
    let fileFormat = `image/${this.fileType}`
    let fileName = new Date().toLocaleString()
    this.postFileName = `${fileName.replace(' ', '')}.${this.fileType}`;
    const buffer: any = file.substring(file.indexOf(',') + 1);
    this.fileSize =  buffer.length / 1000000;
    this.fileDate= '';
    if(this.resumeFileType.includes(fileFormat)){
      this.showImageData = false;
      // this.showDeleteIcon = false;
      this.idfileErrorStatus = false;
      this.postImageErrorMsg = false;
      if(fileFormat == 'image/png' || fileFormat == 'image/PNG' || fileFormat == 'image/JPEG' || fileFormat == 'image/JPG' || fileFormat == 'image/jpg'  || fileFormat == 'image/jpeg') {
        this.postFileType = fileFormat;
        if((this.fileSize) <= 12){
          this.attachmentTypeContent  = file;
          this.showImage = false;
        } else{
          this.postImageErrorMsg = true;
          let errorMsg = "Maximum file upload size is restricted to 12 MB.";
          this.postErrorMsg = errorMsg ;
        }
  }
 }
 else{
  this.idfileErrorStatus = true;
  this.errorMsg = "Upload failed. Please select a valid file format (Jpg, png, jpeg).";
 }
}

  async presentAlert() {
    let alert = await this.alertController.create({
      header: 'Permission Denied',
      message: 'If you would like to add an image, please provide POCN access in your settings.',
      buttons: ['Cancel', {
        text: 'Go to Settings',
        handler: () => {
          if(this.appPlatform === 'ios'){
            NativeSettings.openIOS({
              option: IOSSettings.App,
            });
          }else if(this.appPlatform === 'android'){
            NativeSettings.openAndroid({
              option: AndroidSettings.ApplicationDetails,
            });
          }
        }
        }]
    });
    await alert.present();
  }
  postImageUploads(event){
    const file  = (event.target as HTMLInputElement).files[0];
    this.postFileName = file.name;
    this.fileSize = Math.round(file.size / 1024) + " KB";
    this.fileType= file.type.split("/").pop();
    this.fileDate= '';
    if(this.resumeFileType.includes(file.type)){
      this.showImageData = false;
      // this.showDeleteIcon = false;
      this.idfileErrorStatus = false;
      this.postImageErrorMsg = false;
      if(file.type == 'image/png' || file.type == 'image/PNG' || file.type == 'image/JPEG' || file.type == 'image/JPG' || file.type == 'image/jpg'  || file.type == 'image/jpeg') {
        this.postFileType = file.type;
        if((file.size/1000000) <= 12){
          this.convertToBase64(event.target.files[0]).subscribe(base64 => {
          this.attachmentTypeContent  = base64;
          this.showImage = false;
          // this.showVideo = true;
          });
        } else{
          this.postImageErrorMsg = true;
          let errorMsg = "Maximum file upload size is restricted to 12 MB.";
          this.postErrorMsg = errorMsg ;
        }
  }
 }
 else{
  this.idfileErrorStatus = true;
  this.errorMsg = "Upload failed. Please select a valid file format (Jpg, png, jpeg).";
 }
}
getTherapeuticArea(selectedValueCode) {
  this._pocnService.getTherapeuticArea(this.token, selectedValueCode).subscribe(({ data }) => {
    if (data['getTherapeuticAreasSpecCode']['data'] != null) {
      data['getTherapeuticAreasSpecCode']['data'].forEach((field, item) => {
        let index = this.topicsOfInterestList.findIndex(x => x.title === field.therapeuticAreas);
        if(index === -1) {
          this.topicsOfInterestList.push({title: field.therapeuticAreas });
        }
      })
    }
    // else{
    //   this.topicsOfInterestList = [];
    // }
  });
}
showGroupDetail(group){
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  const userId = this._pocnLocalStorageManager.getData("userId");
  this.userId = userId;
  this.loggedInUserId = userId;
  this._pocnService.getUserGroupDetail(token,group.groupUuid).subscribe(({ data }) => {

    this.grpDetails =  data['getUserGroupDetail'].data.filter((x) => {
      if(x.memberUserId.toLowerCase() == userId){
       return x.roleId
      }
   });

   this.roleId = data['getUserGroupDetail'].data[0].roleId;
   if(this.roleId == "1" || this.roleId == "2"){
     console.log("hiiitabgrpp");
     this.router.navigate(['tablinks/groups/group-detail/' + group.groupUuid]);
   }
   else{
    this.router.navigate(['tablinks/groups/group-details-view/' + group.groupUuid]);
   }

  },
  (error) => {
      this.router.navigate(['/'])
  });
}
// groupIconClick (data){
//   if(Object.keys(data).includes("groupUuid")){
//     this.router.navigate(["/group/" + data.groupUuid]);
//   }
//   else if(Object.keys(data).includes("groupId")){
//     this.router.navigate(["/group/" + data.groupId]);
//   }
// }
searchGroup(searchText,subscribed) {
 if(subscribed == "managed"){
this.subcribeSearchClick= "managedTab";
 }
 else{
  if(subscribed == "subscribed")
  this.subcribeSearchClick= "subscribedTab";

 }
  this.mySearchGroupLoader = true;
  if(searchText!=''){
    this.showSearch = true;
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.filterGroup(token,searchText).subscribe(({ data }) => {
      this.searchGroupData = data['filterGroup']['data'];
      const spanName = "serach-group-btn";
      let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
          searchText:this.searchText
      }
      const eventName = 'serach group';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully search group' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
      this.userDetails = true;
      if (this.searchGroupData.length === 0) {
        this.searchGroupMessage = true;
        this.mySearchGroupLoader = false;
      }
      else {
        this.searchGroupMessage = false;
        this.mySearchGroupLoader = false;
      }
      // this.searchGroupData = data['filterGroup']['data'];
      this.searchGroupData = JSON.parse(JSON.stringify(data['filterGroup']['data']));
      this.searchGroupData.forEach((field, index) => {
       let grpImageUrl = environment.grpImgUrl + field.bannerFileName + '.' + field.bannerExtension + '?lastmod=' + Math.random();
       var encoded_url = btoa(grpImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
       var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
        "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
        //console.log(path)
        var shaObj = new jsSHA("SHA-256", "BYTES")
        shaObj.setHMACKey(environment.imageProxyKey, "HEX");
        shaObj.update(this.hex2a(environment.imageProxySalt));
        shaObj.update(path);
       var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

       field.grpImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
       });
    },
    (error) => {
        this.router.navigate(['/'])
    });
  }
  else{
    this.searchGroupData = [];
    this.searchGroupMessage = true;
  }
}
showGroupDetailEdit(searchData){
 const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
 const userId = this._pocnLocalStorageManager.getData("userId");
 this._pocnService.getUserGroupDetail(token,searchData.groupUuid).subscribe(({ data }) => {

  this.grpDetails =  data['getUserGroupDetail'].data.filter((x) => {
    if(x.memberUserId.toLowerCase() == userId){
     return x.roleId
    }
 });

 this.roleId = data['getUserGroupDetail'].data[0].roleId;


},
(error) => {
    this.router.navigate(['/'])
});
 if(this.subcribeSearchClick == "managedTab"){
  if((this.roleId == "1" || this.roleId == "2") && searchData.memberUserId == userId){
    this.router.navigate(['tablinks/groups/group-detail/' + searchData.groupUuid]);
  }
  else{
   this.router.navigate(['tablinks/groups/group-details-edit/' + searchData.groupUuid]);
  }

 }
 else{
  if(this.subcribeSearchClick == "subscribedTab"){
    if((this.roleId == "1" || this.roleId == "2") && searchData.memberUserId == userId){
      this.router.navigate(['tablinks/groups/group-detail/' + searchData.groupUuid]);
    }
    else{
     this.router.navigate(['tablinks/groups/group-details-view/' + searchData.groupUuid]);
    }
  }


 }
  // if(searchData.ownerUserIdData == this.userId) {
  //   this.router.navigate(['/group-details-edit/' + searchData.groupUuid]);
  // }
  // else{
  //   this.router.navigate(['/group-details-view/' + searchData.groupUuid]);
  // }
}
showGroupDetailSearch(searchData){
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  const userId = this._pocnLocalStorageManager.getData("userId");
  this._pocnService.getUserGroupMemberCheck(token,searchData.groupUuid).subscribe(({ data }) => {
  if(data['getUserGroupMemberCheck'] == "True"){
    this.router.navigate(['tablinks/groups/group-detail/' + searchData.groupUuid]);
  }
  else{
    this.router.navigate(['tablinks/groups/group-details-view/' + searchData.groupUuid]);
  }
  });
}
showGroupDetailView(searchData){
   // if(searchData.ownerUserIdData == this.userId) {
   //   this.router.navigate(['/group-details-edit/' + searchData.groupUuid]);
   // }
   // else{
   //   this.router.navigate(['/group-details-view/' + searchData.groupUuid]);
   // }
   this.router.navigateByUrl('tablinks/groups/group-details-view/' + searchData.groupUuid,{ state: {  tabMsg: 'reccTab'} } );
  //  this.router.navigate(['/group-details-view/' + searchData.groupUuid]);
 }
withdrawGroupRequest(data) {
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken")
  let type = "withdraw";
  let ipAddressV4 =  this._pocnLocalStorageManager.getData("ipv4");
  let ipAddressV6 =  this._pocnLocalStorageManager.getData("ipv6");
  let device = this.deviceType;
  let channel =  this.device.userAgent;
  let geoLocation =  ''
          this._pocnService.withdrawGroupJoinRequest(token,data.groupId,type,ipAddressV4,ipAddressV6,device,channel,geoLocation).subscribe(
            (response: any) => {
              if (response.data.withdrawGroupJoinRequest.groupStatusResponse.status === 'success') {
                // const index: number = this.myPendingRequestGroups.indexOf(data);
                const spanName = "withdraw-join-request-grp-btn";
                let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                  groupId: data.groupId,
              }
              const eventName = 'withdraw join request';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully withdraw join request' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
                this.withdrawJoinRequest = true;
               this.content.scrollToTop(3000);
        setTimeout(function () {
          this.withdrawJoinRequest = false;
        }.bind(this), 3000);
                this.pendingGroupJoinRequests();
                // if (index !== -1) {
                //   this.myPendingRequestGroups.splice(index, 1);
                // }
                // if(this.myPendingRequestGroups.length < 1){
                //   this.groupPendingRequestEmptyMessage = true
                // }
              }
              else{
                const spanName = "withdraw-join-request-grp-btn";
                let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                  groupId: data.groupId,
              }
              const eventName = 'withdraw join request';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to withdraw join request' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              }
        })

}
groupRecommendationBySpecialty() {
  this.specialityLoaderStatus = true;
  const startSet = 0;
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  this._pocnService.getUserRecommendedGroupsSpecialty(token).subscribe(({ data }) => {
    this.groupRecommendationByType();
    this.groupRecoSpecilality = data['groupRecommendationBySpecialty']['data'];
    // this.getLocationCityConnections();
    if (this.groupRecoSpecilality === null || (this.groupRecoSpecilality != null && this.groupRecoSpecilality.length == 0)) {
      // if (this.myConnectionRecommendationData.length == 0) {
      this.connectionRecommendationMessage = true;
    }
    else {
      this.connectionRecommendationMessage = false;
      // this.showSpeciality = true;
    }
    this.specialityLoaderStatus = false;
    this.groupRecoSpecilality = JSON.parse(JSON.stringify(data['groupRecommendationBySpecialty'].data));


    this.groupRecoSpecilality.forEach((field, index) => {
    let grpSubImageUrl = environment.grpImgUrl + field.bannerFileName + '.' + field.bannerExtension + '?lastmod=' + Math.random();
    var encoded_url = btoa(grpSubImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
    var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
     "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
     //console.log(path)
     var shaObj = new jsSHA("SHA-256", "BYTES")
     shaObj.setHMACKey(environment.imageProxyKey, "HEX");
     shaObj.update(this.hex2a(environment.imageProxySalt));
     shaObj.update(path);
    var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

    field.grpSubImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();

    });
  });
}
groupRecommendationByType() {
  this.typeLoaderStatus = true;
  const startSet = 0;
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  this._pocnService.groupRecommendationByType(token).subscribe(({ data }) => {
    this.groupRecommendationByLocation();
    this.groupRecoType = data['groupRecommendationByType']['data'];
    // this.getLocationCityConnections();
    if (this.groupRecoType === null || (this.groupRecoType != null && this.groupRecoType.length == 0)) {
      // if (this.myConnectionRecommendationData.length == 0) {
      this.connectionRecoMessageBytype = true;
    }
    else {
      this.connectionRecoMessageBytype = false;
      // this.showSpeciality = true;
    }
    this.typeLoaderStatus = false;
    this.groupRecoType = JSON.parse(JSON.stringify(data['groupRecommendationByType'].data));


    this.groupRecoType.forEach((field, index) => {
    let grpSubImageUrl = environment.grpImgUrl + field.bannerFileName + '.' + field.bannerExtension + '?lastmod=' + Math.random();
    var encoded_url = btoa(grpSubImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
    var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
     "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
     //console.log(path)
     var shaObj = new jsSHA("SHA-256", "BYTES")
     shaObj.setHMACKey(environment.imageProxyKey, "HEX");
     shaObj.update(this.hex2a(environment.imageProxySalt));
     shaObj.update(path);
    var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

    field.grpSubImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
    });
});
}
groupRecommendationByLocation() {
  this.locationLoaderStatus = true;
  const startSet = 0;
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  this._pocnService.groupRecommendationByLocation(token).subscribe(({ data }) => {
    this.groupRecommendationByTa();
    this.groupRecoLocation = data['groupRecommendationByLocation']['data'];
    // this.getLocationCityConnections();
    if (this.groupRecoLocation === null || (this.groupRecoLocation != null && this.groupRecoLocation.length == 0)) {
      // if (this.myConnectionRecommendationData.length == 0) {
      this.connectionLocationMessage = true;
    }
    else {
      this.connectionLocationMessage = false;
      // this.showSpeciality = true;
    }
    this.locationLoaderStatus = false;
    this.groupRecoLocation = JSON.parse(JSON.stringify(data['groupRecommendationByLocation'].data));


    this.groupRecoLocation.forEach((field, index) => {
    let grpSubImageUrl = environment.grpImgUrl + field.bannerFileName + '.' + field.bannerExtension + '?lastmod=' + Math.random();
    var encoded_url = btoa(grpSubImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
    var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
     "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
     //console.log(path)
     var shaObj = new jsSHA("SHA-256", "BYTES")
     shaObj.setHMACKey(environment.imageProxyKey, "HEX");
     shaObj.update(this.hex2a(environment.imageProxySalt));
     shaObj.update(path);
    var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

    field.grpSubImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
    });
  });
}
groupRecommendationByTa() {
  this.taLoaderStatus = true;
  const startSet = 0;
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  this._pocnService.groupRecommendationByTa(token).subscribe(({ data }) => {
    this.groupRecommendationByName();
    this.groupRecoTa = data['groupRecommendationByTa']['data'];
    // this.getLocationCityConnections();
    if (this.groupRecoTa === null || (this.groupRecoTa != null && this.groupRecoTa.length == 0)) {
      // if (this.myConnectionRecommendationData.length == 0) {
      this.connectionTaMessage = true;
    }
    else {
      this.connectionTaMessage = false;
      // this.showSpeciality = true;
    }
    this.taLoaderStatus = false;
    this.groupRecoTa = JSON.parse(JSON.stringify(data['groupRecommendationByTa'].data));


    this.groupRecoTa.forEach((field, index) => {
    let grpSubImageUrl = environment.grpImgUrl + field.bannerFileName + '.' + field.bannerExtension + '?lastmod=' + Math.random();
    var encoded_url = btoa(grpSubImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
    var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
     "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
     //console.log(path)
     var shaObj = new jsSHA("SHA-256", "BYTES")
     shaObj.setHMACKey(environment.imageProxyKey, "HEX");
     shaObj.update(this.hex2a(environment.imageProxySalt));
     shaObj.update(path);
    var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

    field.grpSubImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
    });
  });
}
groupRecommendationByName() {
  this.nameLoaderStatus = true;
  const startSet = 0;
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  this._pocnService.groupRecommendationByName(token).subscribe(({ data }) => {
    this.groupRecoName = data['groupRecommendationByName']['data'];
    // this.getLocationCityConnections();
    if (this.groupRecoName === null || (this.groupRecoName != null && this.groupRecoName.length == 0)) {
      // if (this.myConnectionRecommendationData.length == 0) {
      this.connectionNameMessage = true;
    }
    else {
      this.connectionNameMessage = false;
      // this.showSpeciality = true;
    }
    this.nameLoaderStatus = false;
    this.groupRecoName = JSON.parse(JSON.stringify(data['groupRecommendationByName'].data));


    this.groupRecoName.forEach((field, index) => {
    let grpSubImageUrl = environment.grpImgUrl + field.bannerFileName + '.' + field.bannerExtension + '?lastmod=' + Math.random();
    var encoded_url = btoa(grpSubImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
    var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
     "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
     //console.log(path)
     var shaObj = new jsSHA("SHA-256", "BYTES")
     shaObj.setHMACKey(environment.imageProxyKey, "HEX");
     shaObj.update(this.hex2a(environment.imageProxySalt));
     shaObj.update(path);
    var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

    field.grpSubImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
    });
  });
}
groupRecommendationByTags() {
  this.tagsLoaderStatus = true;
  const startSet = 0;
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  this._pocnService.groupRecommendationByTags(token).subscribe(({ data }) => {
    this.groupRecoTags = data['groupRecommendationByTags']['data'];
    // this.getLocationCityConnections();
    if (this.groupRecoTags === null || (this.groupRecoTags != null && this.groupRecoTags.length == 0)) {
      // if (this.myConnectionRecommendationData.length == 0) {
      this.connectionTagsMessage = true;
    }
    else {
      this.connectionTagsMessage = false;
      // this.showSpeciality = true;
    }
    this.tagsLoaderStatus = false;
    this.groupRecoTags = JSON.parse(JSON.stringify(data['groupRecommendationByTags'].data));


    this.groupRecoTags.forEach((field, index) => {
    let grpSubImageUrl = environment.grpImgUrl + field.bannerFileName + '.' + field.bannerExtension + '?lastmod=' + Math.random();
    var encoded_url = btoa(grpSubImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
    var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
     "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
     //console.log(path)
     var shaObj = new jsSHA("SHA-256", "BYTES")
     shaObj.setHMACKey(environment.imageProxyKey, "HEX");
     shaObj.update(this.hex2a(environment.imageProxySalt));
     shaObj.update(path);
    var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

    field.grpSubImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
    });
  });
}
getMySentInvitationRequest(){
  // const currentUserId = this._pocnLocalStorageManager.getData("userId");
  this._pocnService.getMySentInvitationRequest(this.token).subscribe(({ data }) => {
    this.invitationsSentLoader = false;
    this.getMyReceivedInvitationRequest();
    this.showInviteSent = true;
    this.sentInvitation = data['getMySentInvitationRequest']['data'];
    if( this.sentInvitation.length>0){
      this.sentInviteMsg = false;

    }
    else{
      this.sentInviteMsg = true;
    }
    this.sentInvitation = JSON.parse(JSON.stringify(data['getMySentInvitationRequest']['data']));
    this.sentInvitation.forEach((field, index) => {
      let grpSubImageUrl = environment.grpImgUrl + field.bannerFileName + '.' + field.bannerExtension + '?lastmod=' + Math.random();

      var encoded_url = btoa(grpSubImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
      var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
       "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
       //console.log(path)
       var shaObj = new jsSHA("SHA-256", "BYTES")
       shaObj.setHMACKey(environment.imageProxyKey, "HEX");
       shaObj.update(this.hex2a(environment.imageProxySalt));
       shaObj.update(path);
      var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

      field.grpSubImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
      });
    this.sentInvitation.forEach((field, index) => {


      let grpProfileImageUrl = environment.postProfileImgUrl + field.memberUserId + '.' + field.memberImageExtension + '?lastmod=' + Math.random();
    var encoded_url = btoa(grpProfileImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
    var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
     "/g:" + "no"  + "/" + encoded_url + "." + field.memberImageExtension;
     //console.log(path)
     var shaObj = new jsSHA("SHA-256", "BYTES")
     shaObj.setHMACKey(environment.imageProxyKey, "HEX");
     shaObj.update(this.hex2a(environment.imageProxySalt));
     shaObj.update(path);
    var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

    field.grpProfileImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();

    });

  });
}
getMyReceivedInvitationRequest(){
  this.invitationsRecLoader = true;
  this._pocnService.getMyReceivedInvitationRequest(this.token).subscribe(({ data }) => {
    this.pendingGroupJoinRequests();
    this.showInviteRec = true;
    this.recInvitation = data['getMyReceivedInvitationRequest']['data'];
    if( this.recInvitation.length>0){
      this.recInviteMsg = false;
    }
    else{
      this.recInviteMsg = true;
    }
    this.invitationsRecLoader = false;
    this.recInvitation = JSON.parse(JSON.stringify(data['getMyReceivedInvitationRequest']['data']));
    this.recInvitation.forEach((field, index) => {
      let grpSubImageUrl = environment.grpImgUrl + field.bannerFileName + '.' + field.bannerExtension + '?lastmod=' + Math.random();

      var encoded_url = btoa(grpSubImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
      var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
       "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
       //console.log(path)
       var shaObj = new jsSHA("SHA-256", "BYTES")
       shaObj.setHMACKey(environment.imageProxyKey, "HEX");
       shaObj.update(this.hex2a(environment.imageProxySalt));
       shaObj.update(path);
      var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

      field.grpSubImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
      });
    this.recInvitation.forEach((field, index) => {


      let grpProfileImageUrl = environment.postProfileImgUrl + field.memberUserId + '.' + field.memberImageExtension + '?lastmod=' + Math.random();
    var encoded_url = btoa(grpProfileImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
    var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
     "/g:" + "no"  + "/" + encoded_url + "." + field.memberImageExtension;
     //console.log(path)
     var shaObj = new jsSHA("SHA-256", "BYTES")
     shaObj.setHMACKey(environment.imageProxyKey, "HEX");
     shaObj.update(this.hex2a(environment.imageProxySalt));
     shaObj.update(path);
    var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

    field.grpProfileImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();

    });
  });
}
acceptInvitationRequest(data){
 let acceptInviteData = {
  accessToken: this.token,
  groupId: data.groupUuid,
  invitedUserId: data.memberUserId,
  ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
  ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
  device: this.deviceType,
  channel: this.device.userAgent,
  geoLocation: ''
}

  this._pocnService.acceptInvitationRequest(acceptInviteData).subscribe(
    (response: any) => {
      if (response.data.acceptInvitationRequest.groupStatusResponse.status  === 'Success') {
        // this.showGroupCreationAlert("Accept Invitation Successfully.");
        const spanName = "accept-invitation-request-grp-btn";
        let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
          groupId: data.groupUuid,
        invitedUserId: data.memberUserId
      }
      const eventName = 'accept invitation request';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully accept invitation request' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
        this.content.scrollToTop(3000);
        this.acceptInvitRequest = true;
        setTimeout(function () {
          this.acceptInvitRequest = false;
        }.bind(this), 3000);
        this.getMyReceivedInvitationRequest();
      }
      else{
        const spanName = "accept-invitation-request-grp-btn";
        let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
          groupId: data.groupUuid,
        invitedUserId: data.memberUserId
      }
      const eventName = 'accept invitation request';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to accept invitation request' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
      }
    });
}
rejectInvitationRequest(data){
  let rejectInviteData = {
    accessToken: this.token,
    groupId: data.groupUuid,
    invitedUserId: data.memberUserId,
    ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
    ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
    device: this.deviceType,
    channel: this.device.userAgent,
    geoLocation: ''
  }

   this._pocnService.rejectInvitationRequest(rejectInviteData).subscribe(
     (response: any) => {
       if (response.data.rejectInvitationRequest.groupStatusResponse.status  === 'Success') {
        const spanName = "reject-invitation-request-grp-btn";
        let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
          groupId: data.groupUuid,
        invitedUserId: data.memberUserId
      }
      const eventName = 'reject invitation request';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully reject invitation request' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
        this.content.scrollToTop(3000);
        this.rejectInvitRequest = true;
        setTimeout(function () {
          this.rejectInvitRequest = false;
        }.bind(this), 3000);
         this.getMyReceivedInvitationRequest();
       }
       else{
        const spanName = "reject-invitation-request-grp-btn";
        let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
          groupId: data.groupUuid,
        invitedUserId: data.memberUserId
      }
      const eventName = 'reject-invitation-request';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to reject invitation request' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
       }
     });
 }
withdrawSentInvitationRequest(sentInvite){
  // Regular expression to check if string is a valid UUID
const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
// String with valid UUID separated by dash
const str = sentInvite.memberUserId;
let withdrawInviteData;
regexExp.test(str); // true
if(regexExp.test(str)== true){
  withdrawInviteData = {
    accessToken: this.token,
    groupId: sentInvite.groupUuid,
    npi:'',
    userId: sentInvite.memberUserId,
    ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
    ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
    device: this.deviceType,
    channel: this.device.userAgent,
    geoLocation: ''
  }
}
  else{
    withdrawInviteData = {
      accessToken: this.token,
      groupId: sentInvite.groupUuid,
      npi:sentInvite.memberUserId,
      userId: '',
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
      ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      channel: this.device.userAgent,
      geoLocation: ''
    }
  }

   this._pocnService.withdrawSentInvitationRequest(withdrawInviteData).subscribe(
     (response: any) => {
       if (response.data.withdrawSentInvitationRequest.groupStatusResponse.status  === 'Success') {
        const spanName = "withdraw-sent-invitation-request-grp-btn";
        let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
          groupId: sentInvite.groupUuid,
      }
      const eventName = 'withdraw sent invitation request';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully withdraw sent invitation request' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
        this.content.scrollToTop(3000);
        this.withdrawInvitRequest = true;
        setTimeout(function () {
          this.withdrawInvitRequest = false;
        }.bind(this), 3000);
         this.getMySentInvitationRequest();
       }
       else{
        const spanName = "withdraw-sent-invitation-request-grp-btn";
        let attributes = {
          userId: this._pocnLocalStorageManager.getData("userId"),
          firstName: this._pocnLocalStorageManager.getData("firstName"),
          lastName: this._pocnLocalStorageManager.getData("lastName"),
          userEmail:this._pocnLocalStorageManager.getData("userEmail"),
          groupId: sentInvite.groupUuid,
      }
      const eventName = 'withdraw sent invitation request';
      const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to withdraw sent invitation request' }
      this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
          this.telemetry.parentTrace = result;
      })
       }
     });
 }
 onImgError(event,fileName = '', extension = ''){
  event.target.src = 'assets/images-pocn/white-group-default-thumbnail.svg'
 }
 onBannerImgError(event,fileName = '', extension = ''){
  event.target.src = 'assets/images-pocn/group-default-banner.png'
 }
 onUserImgError(event){
  event.target.src = 'assets/images-pocn/group-default-thumbnail.svg'
 }

 backClose(){
  this.showSearch = false;
  this.searchText = '';
 }
 groupRecommendationByPocn() {
  this.pocnLoaderStatus = true;
  const startSet = 0;
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  this._pocnService.groupRecommendationByPocn(token).subscribe(({ data }) => {
    this.groupRecommendationBySpecialty();
    this.groupRecoPocn = data['groupRecommendationByPocn']['data'];
    if (this.groupRecoPocn === null || (this.groupRecoPocn != null && this.groupRecoPocn.length == 0)) {
      // if (this.myConnectionRecommendationData.length == 0) {
      this.connectionPocnMessage = true;
    }
    else {
      this.connectionPocnMessage = false;
      // this.showSpeciality = true;
    }
    this.pocnLoaderStatus = false;
    this.groupRecoPocn = JSON.parse(JSON.stringify(data['groupRecommendationByPocn'].data));


    this.groupRecoPocn.forEach((field, index) => {
    let grpSubImageUrl = environment.grpImgUrl + field.bannerFileName + '.' + field.bannerExtension + '?lastmod=' + Math.random();
    var encoded_url = btoa(grpSubImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
    var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
     "/g:" + "no"  + "/" + encoded_url + "." + field.bannerExtension;
     //console.log(path)
     var shaObj = new jsSHA("SHA-256", "BYTES")
     shaObj.setHMACKey(environment.imageProxyKey, "HEX");
     shaObj.update(this.hex2a(environment.imageProxySalt));
     shaObj.update(path);
    var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

    field.grpSubImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
    });
  });
}
async close(){
  await this.modalController.dismiss();
}
showViewDetail(groupId){
  this.router.navigateByUrl('tablinks/groups/group-details-view/' + groupId ,{ state: {  tabMsg: 'pendingTab'} } );

}
ionViewDidEnter() {
  this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
  });
  this.subClick();
  if (event instanceof NavigationEnd) {
    this.refetchPost = this.location.getState();
    if(this.refetchPost.groupMsg == "groups"){
      this.getUserGroups();
    }
   if(this.refetchPost.tabMsg == 'groupManageTab'){
    this.tabType = 'managed';
    this.getUserGroups();
   }
   if(this.refetchPost.tabMsg == 'groupSubscribeTab'){
    this.tabType = 'subscribed';
    // this.recClick();
    this.subClick() ;
   }
   if(this.refetchPost.tabMsg == 'reccTab'){
    this.tabType = 'recommended';
    this.recClick();
   }
   if(this.refetchPost.tabMsg == 'groupPendingTab'){
    this.tabType = 'pending';
    this.pendingClick();
   }
  }
}
ionViewDidLeave() {
this.backButtonSubscription.unsubscribe();
}
getMyConnectionsRequestNotification(){
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  this._pocnService.getMyConnectionsRequestNotification(token)?.subscribe(({ data }) => {
    this.notificationData = data['getMyConnectionsRequestNotification'].data;
    this.requestorCount = data['getMyConnectionsRequestNotification'].data.requestorCount;
    this.requestorNames = data['getMyConnectionsRequestNotification'].data.requestorNames;
    if(this.requestorCount == 0){
     this.showNotification = false;
    }
     if(this.requestorCount == 1 || this.requestorCount == 2){
      this.showNotification = true;
    }
     if(this.requestorCount > 2){
      this.showConNotification = true;
      this.conNotificationData = this.requestorNames.split(',');
      this.countData = this.requestorCount-2;
      this.notificationName = this.conNotificationData[0] + ',' +this.conNotificationData[1];
     }

  });
}
dismiss(){
  const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  this._pocnService.updateMyConnectionsRequestNotification(token).subscribe(({ data }) => {
    this.showNotification = false;
    this.showConNotification = false;
  })

}
}
