import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { CookieManager } from "./../../services/cookie-manager";
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { TokenManager } from "./../../services/token-manager";
import { Router ,ActivatedRoute,Params, NavigationEnd} from '@angular/router';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
// import { Geolocation } from '@capacitor/geolocation';
import { DeviceDetectorService } from 'ngx-device-detector';
import {  ModalController } from '@ionic/angular';
import { GroupPublicProfilePage } from '../group-public-profile/group-public-profile.page';
import { NgForm } from '@angular/forms';
import { InviteGroupPagePage } from '../invite-group-page/invite-group-page.page';
import { GroupPostSharePopoverPage } from "../group-post-share-popover/group-post-share-popover.page";
import { IonContent } from '@ionic/angular';
import { DeleteGroupConfirmPopoverPage } from '../delete-group-confirm-popover/delete-group-confirm-popover.page';
import { Observable, Subscriber, ReplaySubject } from 'rxjs';
import jsSHA from 'jssha';
import { LoadingService } from 'src/app/services/loading.service';
import { Location } from '@angular/common'
import { StateNode,SpecialityNode, TherapeuticAreaNode, RegionalNode, ScopeNode, CreateRoomResponse} from './../../services/type';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoPlugin } from 'src/plugins/imagePicker';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-group-details-edit',
  templateUrl: './group-details-edit.page.html',
  styleUrls: ['./group-details-edit.page.scss'],
})
export class GroupDetailsEditPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('pickImageInput ') pickImageInput : ElementRef;
  appPlatform: string = Capacitor.getPlatform();
  profileImg = "assets/images-pocn/join-request.png";
  public groupTagLine;
  public groupData;
  groupIdData;
  imageUrl = environment.postProfileImgUrl;
  ownerUserIdData;
  public groupDescription;
  public groupSpecialty;
  public groupTags;
  public groupTherapeuticArea;
  public groupIcon;
  public groupBanner;
  public groupName;
  defaultImg ="assets/images-pocn/group-default-thumbnail.svg";
  public controlledGroup;
  public membersList;
  public showGrpDetails : boolean = false;
  public pendingMembers;
  public type;
  public specialty;
  grpDetails : any[];
  memberDetails : any[];
  public scope;
  public groupScope;
  public memberInvite: boolean = false;
  public joinBtn: boolean = false;
  public canceljoinBtn: boolean = false;
  public therapeuticArea;
  public joinRequestEmptyMessage: boolean = false;
  tabType = 'posts';
  memberTotalCount;
  memberTotalCountOnly;
  membersCountLabel= 'Member';
  adminUserId;
  showGroupNameInput: boolean = false;
  showMemberData: boolean = false;
  userId;
  geolocationPosition: string = '';
  loggedInUserId;
  public adminView: boolean = false;
  noSpacesRegex = /.*\S.*/;
  background = {
    backgroundImage:
      'url(assets/images-pocn/sky-bg.jpg)',
  };
  @ViewChild("groupNameInput") groupNameInput;
  public groupDetails ={
    controlledGroup: false,
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
  groupId;
  grpType;
  userIp = '';
  deviceType: string = '';
  userAgent: string;
  showGrpNameInput : boolean = true;
  groupDesc: string;
  showGrpDescInput : boolean = true;
  showGrpTags : boolean = true;
  radioValue;
  disableSub: boolean = false;
  public enrollment;
  specialityType: SpecialityNode[] = [];

  subCount;
  topicsOfInterestList  = [];
  therapeuticAreaList= [];
  therapeuticList: TherapeuticAreaNode[] = [];
  viewSpeciality : boolean = true;
  specialtyText;
  specialtyCode;
  viewTherapeutic: boolean = true;
  viewSelectLocation: boolean = true;
  showPostSuccess: boolean = true;
  errGrpName: boolean = true;
  errGrpDesc: boolean = true;
  public groupScopMasters:ScopeNode[] = [];;
  postFileName = "";
  fileSize: any;
  fileType: string;
  fileDate: string;
  idfileErrorStatus:boolean = false;
  errorMsg = '';
  postImageErrorMsg: boolean = false;
  showMsg: boolean = false;
  postErrorMsg = '';
  resumeFileType = ["image/jpeg", "image/jpg", "image/png","image/PNG", "image/JPG", "image/JPEG"];
  postFileType;
  showImage;
  attachmentTypeContent ;
  showImageData;
  bannerFileName;
  bannerExtension;
  grpEditImageUrl;
  public regionalMasters: RegionalNode[] = [];
  stateList;
  viewSelectRegion: boolean = true;
  viewSelectState: boolean = true;
  grpNameWhiteSpaceCheck: boolean = true;
  showBanner: boolean = true;
  relatedGrpDetails : any[];
  grpDescWhiteSpaceCheck: boolean = true;
  errLocation: boolean = true;
  errProviderType: boolean = true;
  stateListTemp: any;
  stateData: StateNode[] = [];
  public specialityListTemp: any;
  public therapeuticAreaListTemp = {title: "" };
  regionalListTemp: any;
  locationListTemp: any;
  public specialityData;
  currentUrl;
  refetchData;
  public hcpVerified : number;
  public phoneLinked: number;
  public verificationType: string;
  public userRoomData: string;

  constructor(private router: Router,
    private _pocnService: GraphqlDataService,
    private _pocnCookieManager: CookieManager,
    private _pocnLocalStorageManager: LocalStorageManager,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private deviceService: DeviceDetectorService,
    public modalController: ModalController,
    private tokenManager: TokenManager,public alertController: AlertController,
    public loading: LoadingService,
    private location: Location,
    public telemetry: TelemetryService,
    ) {
      this.route.params.subscribe((params: Params) => {
        this.groupId = params.groupId;
        this.grpType = params.type;
      })
      router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.refetchData = this.location.getState();
        };
      });
    }
  ngOnInit() {
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
    this.loading.present();
    let token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    if(token == "" || token == null){
      this.router.navigate(["/"]);
    }
    this.getRegionalMasters();
    this.getStates();
    this.getGroupScopMasters();
    this.getUserGroupDetail();
    this.getSpecialityType();
    this.getRelatedGroups();
    //this.groupMembersLists();
    this.groupMembersListsCount();
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
  // this.getPosition();
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
  getGroupScopMasters = () => {
    this._pocnService.groupScopMasters().subscribe(({ data }) => {
    this.groupScopMasters = data.groupScopMasters.nodes;
    });
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
  getSpecialityType = () => {
    this._pocnService.getSpecialityType().subscribe(({ data }) => {
    this.specialityType = data.masterSpecialties.nodes;
    });
  }
  getUserGroupDetail(){
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    const userId = this._pocnLocalStorageManager.getData("userId");

    this.userId = userId;
    this.loggedInUserId = userId;
    const groupId = this.router.url.split('?')[0].split('/').pop();
    this.groupIdData = groupId;
    this._pocnService.getUserGroupDetail(token,groupId)?.subscribe(({ data }) => {
      if(this.loading.isLoading){
        this.loading.dismiss();
      }
      this.grpDetails =  data['getUserGroupDetail'].data.filter((x) => {
        console.log(userId +'----------' + x.memberUserId.toLowerCase());
        if(x.memberUserId.toLowerCase() == userId){
         return x.roleId
        }
     });
     if(this.grpDetails.length == 0){
       this.showGrpDetails = true;
     }
     else{
      this.showGrpDetails = false;
     }
     this.groupTagLine = data['getUserGroupDetail'].data[0].tagLine;
     this.groupDescription = data['getUserGroupDetail'].data[0].description;
     this.groupSpecialty = data['getUserGroupDetail'].data[0].specialty;
     this.groupTags = data['getUserGroupDetail'].data[0].tags;
     this.groupTherapeuticArea = data['getUserGroupDetail'].data[0].therapeuticArea;
     this.groupIcon = data['getUserGroupDetail'].data[0].groupIcon;
     this.groupBanner = data['getUserGroupDetail'].data[0].groupBanner;
     this.groupName = data['getUserGroupDetail'].data[0].name;
     this.memberInvite = data['getUserGroupDetail'].data[0].memberInvite;
     this.adminUserId = data['getUserGroupDetail'].data[0].ownerUserId;
     let ownerUserId = data['getUserGroupDetail'].data[0].ownerUserId;
     this.ownerUserIdData = ownerUserId;
     this.groupScope = data['getUserGroupDetail'].data[0].groupScope;
     this.scope = data['getUserGroupDetail'].data[0].scope;
     this.specialty = data['getUserGroupDetail'].data[0].specialty;
     this.type = data['getUserGroupDetail'].data[0].type;
     this.therapeuticArea = data['getUserGroupDetail'].data[0].therapeuticArea;
     this.controlledGroup = data['getUserGroupDetail'].data[0].controlledGroup;
     this.enrollment = data['getUserGroupDetail'].data[0].enrollment;
     this.subCount = data['getUserGroupDetail'].data[0].countMembers;
     this.bannerFileName = data['getUserGroupDetail'].data[0].bannerFileName;
     this.bannerExtension = data['getUserGroupDetail'].data[0].bannerExtension;
     let stateTemp =  this.stateList.filter((obj) => {
      return obj.statevalue === this.scope;
    });

    if(stateTemp.length>0){
      this.stateListTemp = {id: stateTemp[0].id,statename: stateTemp[0].statename, statevalue: stateTemp[0].statevalue};
    }
    else{
      this.stateListTemp = {id: '',statename: '', statevalue: ''};
    }
    let specialityTemp =  this.specialityType.filter((obj) => {
      return obj.specialtyName === this.specialty;
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
    let locationTemp =  this.groupScopMasters.filter((obj) => {
      return obj.scopeTitle === this.groupScope;
    });

    if(locationTemp.length>0){
      this.locationListTemp = {
        scopeId: locationTemp[0].scopeId,
        scopeTitle: locationTemp[0].scopeTitle,

      };
    }
    else{
      this.locationListTemp = {
        scopeId: '',
        scopeTitle: '',

      };
    }
    console.log("****************************");
    console.log(this.specialityListTemp.specialtyCode);
    console.log(this.specialty);
    console.log(this.therapeuticArea);
    console.log("hiiii");
    console.log("get tp listttt");

    this._pocnService.getTherapeuticArea(this._pocnLocalStorageManager.getData("pocnApiAccessToken"), this.specialityListTemp.specialtyCode).subscribe(({ data }) => {
     this.therapeuticAreaList = data['getTherapeuticAreasSpecCode']['data'];
     console.log("get tp listttt");
     console.log(this.therapeuticAreaList);
     if (data['getTherapeuticAreasSpecCode']['data'] != null) {
       data['getTherapeuticAreasSpecCode']['data'].forEach((field, item) => {
         let index = this.topicsOfInterestList.findIndex(x => x.title === field.therapeuticAreas);
         if(index === -1) {
           this.topicsOfInterestList.push({title: field.therapeuticAreas });
           console.log(this.topicsOfInterestList);
         }
       })



      let filterTpArea =  this.topicsOfInterestList.filter((obj) => {
        return obj.title === this.therapeuticArea;
      });

      console.log(this.therapeuticArea);
      console.log(filterTpArea);
      console.log(filterTpArea[0].title);

      console.log(this.therapeuticAreaListTemp);
      this.therapeuticAreaListTemp = {title:''};
      console.log("++++++++++++++++++++++++++++++++++++++++++++");
      this.therapeuticAreaListTemp = {title: filterTpArea[0].title };


      console.log(this.topicsOfInterestList);


      console.log(this.therapeuticAreaListTemp);


     }
     // else{
     //   this.topicsOfInterestList = [];
     // }
   });

  console.log("*****************************");

//     let therapeuticTemp =  this.topicsOfInterestList.filter((obj) => {

//       return obj.therapeuticAreas === this.therapeuticArea;

//     });
//    // console.log( therapeuticTemp[0].therapeuticAreas)
// console.log(this.therapeuticArea)

//     if(therapeuticTemp.length>0){
//       console.log(therapeuticTemp)
//       this.therapeuticAreaListTemp = {
//         id  : 4,
//         therapeuticAreas: 'therapeutic4'
//       };
//     }
//     else{
//       this.therapeuticAreaListTemp = {
//         therapeuticCode: '',
//         therapeuticName: ''
//       };
//     }

    let regionalTemp =  this.regionalMasters.filter((obj) => {
      return obj.title === this.scope;
    });

    if(regionalTemp.length>0){
      this.regionalListTemp = {
        regionalId: regionalTemp[0].regionalId,
        title: regionalTemp[0].title,
      };
    }
    else{
      this.regionalListTemp = {
        regionalId: '',
        title: '',

      };
    }

     let grpEditImageUrl = environment.grpImgUrl + this.bannerFileName + '.' + this.bannerExtension + '?lastmod=' + Math.random();

     var encoded_url = btoa(grpEditImageUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
     var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
      "/g:" + "no"  + "/" + encoded_url + "." + this.bannerExtension;
      //console.log(path)
      var shaObj = new jsSHA("SHA-256", "BYTES")
      shaObj.setHMACKey(environment.imageProxyKey, "HEX");
      shaObj.update(this.hex2a(environment.imageProxySalt));
      shaObj.update(path);
     var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');

     this.grpEditImageUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
     if(ownerUserId == userId) {   // admin login
       //this.memberInvite = true;
       this.adminView = true;
     }
     if(this.groupBanner != ''){
       this.background = { backgroundImage:'url('+this.groupBanner+')'};
     }

    //  this.getUserGroups();
    },
    (error) => {
        this.router.navigate(['/'])
    });
   }

   blurFunction(type: string) {
    switch (type) {
      case "groupName":
        this.getUserGroupDetail();
        this.showGrpNameInput = true;
        break;

      case "groupDesc":
          this.getUserGroupDetail();
          this.showGrpDescInput = true;
        break;
      case "groupTag":
        this.getUserGroupDetail();
        this.showGrpTags = true;
        break;
    }
  console.log(type);
  }
  setFirstname(e:any){
    this.groupDetails.groupName = e.target.value;
  }
  addContactGroupName() {
    this.showGroupNameInput = true;
    this.groupNameInput.setFocus();
  }
  groupMembersListsData(){
    // this.showMemberData = true;
    const currentUserId = this._pocnLocalStorageManager.getData("userId");
    // const groupId = this.router.url.split('?')[0].split('/').pop();
    console.log("hiii");
    this._pocnService.groupMembersLists(this.groupId).subscribe(({ data }) => {
      let activeMembers = data.groupMembersLists.nodes.filter(x => (x.status == 1 && x.roleId ==2))
      this.memberTotalCount = activeMembers.length;
      this.memberTotalCountOnly = activeMembers.length;
      this.membersList = activeMembers;
      console.log(this.membersList.length);
      if(this.membersList.length == 0){
        this.showMsg = true;
        this.showMemberData = false;
        this.groupMembersListsCount();
      }
      else{
        this.showMsg = false;
        this.showMemberData = true;
      }
      // if(this.membersList.length == 0){
      //   this.showMemberData = false;
      // }

    });
  }
  // groupMembersListsCount(){

  //   this._pocnService.groupMembersLists(this.groupId).subscribe(({ data }) => {
  //     let activeMembers = data.groupMembersLists.nodes.filter(x => x.status == 1)
  //     this.memberTotalCount = activeMembers.length;
  //     this.memberTotalCountOnly = activeMembers.length;
  //     this.membersList = activeMembers;
  //     console.log(this.membersList);
  //     console.log(this.memberTotalCountOnly);
  //   });
  // }
  groupMembersListsCount(){

    this._pocnService.groupMembersLists(this.groupId)?.subscribe(({ data }) => {
      console.log(data);
      this.memberDetails =  data['groupMembersLists'].nodes.filter((x) => {
        // if(x.memberUserId == userId){
         return x.roleId == 1
        // }
      })
      console.log(this.memberDetails);
      let activeMembers = data.groupMembersLists.nodes.filter(x => (x.status == 1 && x.roleId == 2));
      console.log(activeMembers);
      this.memberTotalCount = activeMembers.length;
      this.memberTotalCountOnly = activeMembers.length;
      this.membersList = activeMembers;
      console.log(this.membersList);
      console.log(this.memberTotalCountOnly);
      if(this.membersList.length == 0){
        this.disableSub = true;
      }
      else{
        this.disableSub = false;
      }
    });
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
    //get location
    // getCurrentPosition = async () => {
    //   const coordinates = await Geolocation.getCurrentPosition();
    //   this.geolocationPosition = coordinates.coords.latitude + ',' + coordinates.coords.longitude;
    // };
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
    detectBrowserVersion() {
      let userAgent = navigator.userAgent, tem,
        matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

      if (/trident/i.test(matchTest[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
        return 'IE ' + (tem[1] || '');
      }
      if (matchTest[1] === 'Chrome') {
        tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
      matchTest = matchTest[2] ? [matchTest[1], matchTest[2]] : [navigator.appName, navigator.appVersion, '-?'];
      if ((tem = userAgent.match(/version\/(\d+)/i)) != null) matchTest.splice(1, 1, tem[1]);
      return matchTest.join(' ');
    }
    updateGrpNmae(f:NgForm){
      if(f.value['groupName']){
          if (f.value['groupName'].replace(/\s/g, '').length) {
            this.grpNameWhiteSpaceCheck = true;
          } else {
            this.grpNameWhiteSpaceCheck = false;
          }
        this.errGrpName = true;
        if(f.value['groupName'] && this.grpNameWhiteSpaceCheck == true ){
          let contactProfileDetails = {
            accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
            groupName: f.value['groupName'],
            groupUpdateLog: {
                class: 'class',
                channel: this.userAgent,
                ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
                device: this.deviceType,
                geoLocation: '',
                },
              groupUuid: this.groupId
          }
          this._pocnService.updateGroupName(contactProfileDetails).subscribe(
            (response: any) => {
              if (response.data.updateGroupName.groupStatusResponse.status === 'success') {
                const spanName = "update-grp-name-btn";
                let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                  groupUuid: this.groupId,
              }
              console.log(attributes);
              const eventName = 'update group name';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully update group name' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
                this.getUserGroupDetail();
                this.showGrpNameInput = true;
                }
              else{
                const spanName = "update-grp-desc-btn";
                let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                  groupUuid: this.groupId,
              }
              console.log(attributes);
              const eventName = 'update group desc';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update group name' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              }
          });
        }
      }else{
          this.errGrpName = false;
          this.grpNameWhiteSpaceCheck = true;
        }
      }
      updateGrpDescription(f:NgForm){
        console.log(f.value)
        if(this.groupDescription){
          if (this.groupDescription.replace(/\s/g, '').length) {
            this.grpDescWhiteSpaceCheck = true;
          } else {
            this.grpDescWhiteSpaceCheck = false;
          }
          this.errGrpDesc = true;
          if(this.groupDescription && this.grpDescWhiteSpaceCheck == true ){
            let contactProfileDetails = {
              accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
              groupDescription: this.groupDescription,
              groupUpdateLog: {
                  channel: this.userAgent,
                  ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
                  device: this.deviceType,
                  geoLocation: '',
                  },
                groupUuid: this.groupId
            }
            console.log(contactProfileDetails)
              this._pocnService.updateGroupDescription(contactProfileDetails).subscribe(
                (response: any) => {
                  if (response.data.updateGroupDescription.groupStatusResponse.status === 'success') {
                    const spanName = "update-grp-desc-btn";
                    let attributes = {
                      userId: this._pocnLocalStorageManager.getData("userId"),
                      firstName: this._pocnLocalStorageManager.getData("firstName"),
                      lastName: this._pocnLocalStorageManager.getData("lastName"),
                      userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                      groupUuid: this.groupId,
                  }
                  console.log(attributes);
                  const eventName = 'update group desc';
                  const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully update group desc' }
                  this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                      this.telemetry.parentTrace = result;
                  })
                    this.getUserGroupDetail();
                    this.showGrpDescInput = true;
                    }
                  else{
                    const spanName = "update-grp-desc-btn";
                    let attributes = {
                      userId: this._pocnLocalStorageManager.getData("userId"),
                      firstName: this._pocnLocalStorageManager.getData("firstName"),
                      lastName: this._pocnLocalStorageManager.getData("lastName"),
                      userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                      groupUuid: this.groupId,
                  }
                  console.log(attributes);
                  const eventName = 'update group desc';
                  const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update group desc' }
                  this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                      this.telemetry.parentTrace = result;
                  })
                  }
              });
          }
         } else{
            this.errGrpDesc = false;
            this.grpDescWhiteSpaceCheck = true;
           }
       }
        updateGrpTags(f:NgForm){
          console.log(f.value)
          let contactProfileDetails = {
            accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
            groupUpdateLog: {
                class: 'class',
                channel: this.userAgent,
                ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
                device: this.deviceType,
                geoLocation: '',
                },
              groupUuid: this.groupId,
              groupTags: this.groupTags,
          }
          console.log(contactProfileDetails)
            this._pocnService.updateGroupTags(contactProfileDetails).subscribe(
              (response: any) => {
                if (response.data.updateGroupTags.groupStatusResponse.status === 'success') {
                  const spanName = "update-grp-tags-btn";
                  let attributes = {
                    userId: this._pocnLocalStorageManager.getData("userId"),
                    firstName: this._pocnLocalStorageManager.getData("firstName"),
                    lastName: this._pocnLocalStorageManager.getData("lastName"),
                    userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                    groupUuid: this.groupId,
                }
                console.log(attributes);
                const eventName = 'update group tags';
                const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully update group tags' }
                this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                    this.telemetry.parentTrace = result;
                })
                  this.getUserGroupDetail();
                  this.showGrpTags = true;
                  }
                else{
                  const spanName = "update-grp-tags-btn";
                  let attributes = {
                    userId: this._pocnLocalStorageManager.getData("userId"),
                    firstName: this._pocnLocalStorageManager.getData("firstName"),
                    lastName: this._pocnLocalStorageManager.getData("lastName"),
                    userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                    groupUuid: this.groupId,
                }
                console.log(attributes);
                const eventName = 'update group tags';
                const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully update group tags' }
                this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                    this.telemetry.parentTrace = result;
                })
                }
            });
          }
    async showPublicProfileModal(memberData, type) {
      console.log(this.groupId);
      console.log(memberData);
      const popover = await this.modalController.create({
        component: GroupPublicProfilePage,
        cssClass: 'public-profile-modal',
        componentProps: {
          'memberId': memberData,
          "type": type,
          "groupId": this.groupId ,
          onClick: (type) => {
            if(type == 'makeOwner'){
              // this.router.navigate(['/tablinks/groups']);'
              this.router.navigateByUrl('/tablinks/groups' ,{ state: {  tabMsg: 'groupManageTab'} } );
              popover.dismiss();
            }
          }
        }

      });
      popover.onDidDismiss().then((modalDataResponse) => {
        console.log("hiii",modalDataResponse);
        if (modalDataResponse.data == 'makeOwner') {
          console.log("hiii",modalDataResponse);
          this.groupMembersListsCount();
          popover.dismiss();

        }
        if (modalDataResponse.data == 'remove') {
          this.groupMembersListsCount();
          popover.dismiss();

        }
        if (modalDataResponse.data == 'adminProfile') {
          this.groupMembersListsCount();
          popover.dismiss();

        }
        if (modalDataResponse.data == 'memebrInvite') {
          this.groupMembersListsData();
          popover.dismiss();

        }
      });
      await popover.present();
    }
    showGrpName(){
      this.showGrpNameInput = false;
    }
    showDescGroup(){
      this.showGrpDescInput = false;
    }
    showGrpTag(){
      this.showGrpTags = false;
    }
    showValue(){
      console.log(this.radioValue);
    }
    changeGender(event){
      console.log(event.target.value);
    }
    backClick(){
      this.showMemberData = false;
      this.groupMembersListsCount();
    }
    async groupMembersLists(){
      const currentUserId = this._pocnLocalStorageManager.getData("userId");
      // const groupId = this.router.url.split('?')[0].split('/').pop();

      this._pocnService.groupMembersLists(this.groupId).subscribe(({ data }) => {
        let activeMembers = data.groupMembersLists.nodes.filter(x => (x.status == 1 && x.roleId==2))
        console.log(activeMembers);
        this.memberTotalCount = activeMembers.length;
        this.memberTotalCountOnly = activeMembers.length;
        if(this.memberTotalCount > 1){
          this.membersCountLabel = "Members";
          this.memberTotalCount = this.memberTotalCount + " Members"
        }
        else{
          this.membersCountLabel = "Member";
          this.memberTotalCount = this.memberTotalCount + " Member"
        }
        this.membersList = activeMembers;
        console.log(this.membersList);
        let activeMemberCheck = data.groupMembersLists.nodes.filter(x => x.status == 0 && x.memberUserId == currentUserId)
        if (activeMemberCheck.length > 0){
          this.canceljoinBtn = true;
          this.joinBtn = false;
        }
        else{
          //this.joinBtn = false;
          //this.canceljoinBtn = true;

        }


        // data to display in join requests section
            //console.log();
            let pendingMembers = data.groupMembersLists.nodes.filter(x => x.status == 0)

            this.pendingMembers = pendingMembers;
            if(this.pendingMembers.length < 1){
              this.joinRequestEmptyMessage = true

            }


      });
      const popover = await this.modalController.create({
        component: InviteGroupPagePage,
        cssClass: 'invite-group-modal',
        componentProps: {
          "groupId": this.groupId ,
        }
      });
      // popover.onDidDismiss().then((modalDataResponse) => {
      //   if(modalDataResponse.data == 'confirm-delete'){
      //     this._pocnService.withdrawGroupJoinRequest(token,groupId,type).subscribe(
      //       (response: any) => {
      //         if (response.data.withdrawJoinRequest.groupStatusResponse.status === 'success') {
      //           //alert("You are no longer a member of this group" );
      //           this.router.navigate(['/tablinks/groups'])
      //         }
      //       },
      //       (error) => {
      //           this.router.navigate(['/'])
      //       });
      //   }
      //   else{
      //     this.close('');
      //   }
      // });
      await popover.present();
    }
    getEnrollmentValue(event){
      console.log(event.target.value);
      let contactProfileDetails = {
        accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
        groupUpdateLog: {
            class: 'class',
            channel: this.userAgent,
            ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
            device: this.deviceType,
            geoLocation: '',
            },
          groupUuid: this.groupId,
          groupEnrollment: event.target.value,

      }
      console.log(contactProfileDetails)
        this._pocnService.updateGroupEnrollment(contactProfileDetails).subscribe(
          (response: any) => {
            if (response.data.updateGroupEnrollment.groupStatusResponse.status === 'success') {
              const spanName = "update-grp-enrollment-btn";
              let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                groupUuid: this.groupId,
            }
            console.log(attributes);
            const eventName = 'update group enrollment';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully update group enrollment' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
              this.getUserGroupDetail();
             // this.viewSpeciality = true;
              }
            else{
              const spanName = "update-grp-enrollment-btn";
              let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                groupUuid: this.groupId,
            }
            console.log(attributes);
            const eventName = 'update group enrollment';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update group enrollment' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
            }
        });
    }
    getPrivateValue(event){
      console.log(event);
    }
    getSpeciality(selectedValueCode,selectedValueName) {
      let contactProfileDetails = {
        accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
        groupUpdateLog: {
            class: 'class',
            channel: this.userAgent,
            ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
            device: this.deviceType,
            geoLocation: '',
            },
          groupUuid: this.groupId,
          specialtyCode: selectedValueCode,
          specialtyText : selectedValueName,

      }
      console.log(contactProfileDetails)
        this._pocnService.updateGroupSpecialty(contactProfileDetails).subscribe(
          (response: any) => {
            if (response.data.updateGroupSpecialty.groupStatusResponse.status === 'success') {
              const spanName = "update-grp-specialty-btn";
              let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                groupUuid: this.groupId,
            }
            console.log(attributes);
            const eventName = 'update group specialty';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully update group specialty' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
              this.getUserGroupDetail();
              this.viewSpeciality = true;
              }
            else{
              const spanName = "update-grp-specialty-btn";
              let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                groupUuid: this.groupId,
            }
            console.log(attributes);
            const eventName = 'update group specialty';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update group specialty' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
            }
        });
      this._pocnService.getTherapeuticArea(this._pocnLocalStorageManager.getData("pocnApiAccessToken"), selectedValueCode).subscribe(({ data }) => {
        this.therapeuticAreaList = data['getTherapeuticAreasSpecCode']['data'];
        if (data['getTherapeuticAreasSpecCode']['data'] != null) {
          data['getTherapeuticAreasSpecCode']['data'].forEach((field, item) => {
            let index = this.topicsOfInterestList.findIndex(x => x.title === field.therapeuticAreas);
            if(index === -1) {
              this.topicsOfInterestList.push({title: field.therapeuticAreas });
              console.log(this.topicsOfInterestList);
            }
          })

        }
        // else{
        //   this.topicsOfInterestList = [];
        // }
      });

    }
    updateTherapeuticArea(selectedValueCode) {
      console.log(selectedValueCode);

      let contactProfileDetails = {
        accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
        groupUpdateLog: {
            class: 'class',
            channel: this.userAgent,
            ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
            device: this.deviceType,
            geoLocation: '',
            },
          groupUuid: this.groupId,
          therapeuticArea: selectedValueCode.title,
      }
      console.log(contactProfileDetails)
      console.log(this.groupScope)
        this._pocnService.updateGroupTherapeutics(contactProfileDetails).subscribe(
          (response: any) => {
            if (response.data.updateGroupTherapeutics.groupStatusResponse.status === 'success') {
              const spanName = "update-grp-therapeutic-area-btn";
              let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                groupUuid: this.groupId,
            }
            console.log(attributes);
            const eventName = 'update group therapeutic area';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully update group therapeutic area' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
              this.getUserGroupDetail();
             this.viewTherapeutic = true;
              }
            else{
              const spanName = "update-grp-therapeutic-area-btn";
              let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                groupUuid: this.groupId,
            }
            console.log(attributes);
            const eventName = 'update group therapeutic area';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update group therapeutic area' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
            }
        });
    }
    hideSpeciality(){
      this.getUserGroupDetail()
      this.viewSpeciality = false;
    }
    showSelectTherapeutic(){
      this.viewTherapeutic = false;
    }
    viewLocation(){
      this.viewSelectLocation = false;
    }
    viewRegion(){
      this.viewSelectRegion = false;
    }
    viewState(){
      this.viewSelectState = false;
    }
    getProviderValue(event){
      console.log(event.target.value)
      if(event.target.value){
        this.errProviderType = true;
        let contactProfileDetails = {
          accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
          groupUpdateLog: {
              class: 'class',
              channel: this.userAgent,
              ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
              device: this.deviceType,
              geoLocation: '',
              },
            groupUuid: this.groupId,
            groupProviderType: event.target.value,
        }
        console.log(contactProfileDetails)
          this._pocnService.updateGroupProviderType(contactProfileDetails).subscribe(
            (response: any) => {
              if (response.data.updateGroupProviderType.groupStatusResponse.status === 'success') {
                const spanName = "update-grp-providetype-btn";
              let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                groupUuid: this.groupId,
            }
            console.log(attributes);
            const eventName = 'update group providetype';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully update group providetype' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
                this.getUserGroupDetail();
              }
              else{
                const spanName = "update-grp-providetype-btn";
                let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                  groupUuid: this.groupId,
              }
              console.log(attributes);
              const eventName = 'update group providetype';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update group providetype' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })
              }
          });
      }
      else{
        this.errProviderType = false;
      }
    }
    async groupShareLists(groupName){
      console.log(environment.groupLink);
      console.log(this.router.url);
      var lastPart = this.router.url.split("/").pop();
      console.log(lastPart);
      // this.currentUrl = groupName + ':-' + environment.groupLink + this.router.url;
       this.currentUrl = groupName + ':-' + environment.groupLink + '/group-detail/' + lastPart;
       console.log( this.currentUrl);
      const popover = await this.modalController.create({
          component: GroupPostSharePopoverPage,
          cssClass: 'invite-modal',
          componentProps: {
            'groupId' : this.groupId,
            'currentUrl':this.currentUrl,
            'groupName':groupName
          },
        });
        popover.onDidDismiss().then((modalDataResponse) => {
          if(modalDataResponse && modalDataResponse.data == 'success'){
            this.showPostSuccess = false;
            this.content.scrollToTop(3000);
            setTimeout(function () {
              this.showPostSuccess = true;
            }.bind(this), 3000);
          }

        });
       await popover.present();
    }
  //   async leaveGroup(){
  //     // this.leaveButton = true;
  //    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
  //    const groupId = this.router.url.split('?')[0].split('/').pop();
  //    let type = "remove";
  //    const popover = await this.modalController.create({
  //      component: DeleteGroupConfirmPopoverPage,
  //      cssClass: 'reject-modal',
  //    });
  //    popover.onDidDismiss().then((modalDataResponse) => {
  //      if(modalDataResponse.data == 'confirm-delete'){
  //        this._pocnService.withdrawGroupJoinRequest(token,groupId,type).subscribe(
  //          (response: any) => {
  //            if (response.data.withdrawGroupJoinRequest.groupStatusResponse.status === 'success') {
  //              //alert("You are no longer a member of this group" );
  //              this.content.scrollToTop(3000);
  //             //  this.getUserGroupRequestStatus();
  //             //  this.leaveGrp= true;
  //              setTimeout(function () {
  //                this.leaveGrp= false;
  //              }.bind(this), 3000);
  //              // this.router.navigate(['/tablinks/groups'])
  //             //  this.leaveButton = false;
  //            }
  //          },
  //          (error) => {
  //              this.router.navigate(['/'])
  //          });
  //      }
  //      else{
  //        this.close('');
  //      }
  //    });
  //    await popover.present();
  //  }
  goToGroups(){
  //  this.router.navigateByUrl('group-detail/' + this.groupId,{ state: {  groupMsg: 'groupEditDetail'} } );
  history.back();
  }
  updateGroupMemberInvite(f:NgForm,event){
    let memberInviteValue;
    if(event.detail.checked == true){
      memberInviteValue = 1;
    }
    else{
      memberInviteValue = 0;
    }
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
      groupUuid: this.groupId,
      memberInvite: memberInviteValue,
      groupUpdateLog: {
          class: 'class',
          channel: this.userAgent,
          ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
          device: this.deviceType,
          geoLocation: '',
          }

    }
      this._pocnService.updateGroupMemberInvite(contactProfileDetails).subscribe(
        (response: any) => {
          if (response.data.updateGroupMemberInvite.groupStatusResponse.status === 'success') {
            const spanName = "update-grp-member-invite-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId,
          }
          console.log(attributes);
          const eventName = 'update group member invite';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully update member invite' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
            this.getUserGroupDetail();
           // this.viewSpeciality = true;
            }
          else{
            const spanName = "update-grp-member-invite-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId,
          }
          console.log(attributes);
          const eventName = 'update group member invite';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update member invite' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
          }
      });

    }
    // convertToBase64(file : File) : Observable<string> {
    //   const result  = new ReplaySubject<any>(1);
    //   const reader  = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = () => {result.next(reader.result)};
    //   return result;
    // }
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
      console.log("...clicked");
      let permissions: any;
      let permissionList: any;
      let image: any;
      switch (this.appPlatform) {
        case 'web':
          this.pickImageInput.nativeElement.click()
          break;
        case 'android':
            console.log("...clicked");
          try {
            permissions = await Camera.requestPermissions();
          } catch (error) {
            console.log(error)
          }
          permissionList = await Camera.checkPermissions();
          console.log("checking permissions.....", permissionList, permissions)
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
            console.log(error)
          }
          permissionList = await Camera.checkPermissions();
          console.log("checking permissions.....", permissionList, permissions)
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
              console.log(error)
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
              console.log(error);
              return;
            }
          }else {
            this.presentAlert()
          }
          break;
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

    galleryImageUploads(image){
      this.showBanner = false;
      const file  = `data:image/jpeg;base64,${image}`;
      this.fileType = 'jpeg';
      let fileFormat = `image/${this.fileType}`
      let fileName = new Date().toLocaleString()
      const buffer: any = file.substring(file.indexOf(',') + 1);
      this.fileSize =  buffer.length / 1000000;
       this.fileDate= '';
       if(this.resumeFileType.includes(fileFormat)){
         this.showImageData = false;
         this.idfileErrorStatus = false;
         this.postImageErrorMsg = false;
         if (
           fileFormat == 'image/png' ||
           fileFormat == 'image/PNG' ||
           fileFormat == 'image/JPEG' ||
           fileFormat == 'image/JPG' ||
           fileFormat == 'image/jpg' ||
           fileFormat == 'image/jpeg'
         ) {
           this.postFileType = fileFormat;
           if (this.fileSize <= 12) {
             this.attachmentTypeContent = file;
             this.showImage = false;
             const token =
               this._pocnLocalStorageManager.getData('pocnApiAccessToken');
             let contactProfileDetails = {
               accessToken: token,
               groupUuid: this.groupId,
               groupUpdateLog: {
                 class: 'class',
                 channel: this.userAgent,
                 ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
                 ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),                
                 device: this.deviceType,
                 geoLocation: '',
               },
               groupBanner: this.attachmentTypeContent,
               bannerExtension: this.fileType,
             };
             this._pocnService
               .updateGroupBannerImage(contactProfileDetails)
               .subscribe((response: any) => {
                 if (
                   response.data.updateGroupBannerImage.groupStatusResponse
                     .status === 'success'
                 ) {
                   this.getUserGroupDetail();
                 }
               });
           }
         } else {
           this.postImageErrorMsg = true;
           let errorMsg = 'Maximum file upload size is restricted to 12 MB.';
           this.postErrorMsg = errorMsg;
         }
     }
    else{
     this.idfileErrorStatus = true;
     this.errorMsg = "Upload failed. Please select a valid file format (pdf, Jpg, png, jpeg,mp4, mp3, mpeg, wav).";
    }
   }

    postImageUploads(event){
     this.showBanner = false;
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
            const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
            // if(this.postFileName){
            //   this.attachmentTypeContent = this.attachmentTypeContent;
            //   this.fileType = this.fileType;
            // }
            // else{
            //   this.attachmentTypeContent = '';
            //   this.fileType =  '';
            // }
            let contactProfileDetails = {
              accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
              groupUuid: this.groupId,
              groupUpdateLog: {
                  class: 'class',
                  channel: this.userAgent,
                  ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
                  device: this.deviceType,
                  geoLocation: '',
                  },
                  groupBanner:this.attachmentTypeContent ,
                  bannerExtension:this.fileType
            }
            this._pocnService.updateGroupBannerImage(contactProfileDetails).subscribe(
              (response: any) => {
                if (response.data.updateGroupBannerImage.groupStatusResponse.status === 'success') {
                  this.getUserGroupDetail();
                  }
            });
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
    this.errorMsg = "Upload failed. Please select a valid file format (pdf, Jpg, png, jpeg,mp4, mp3, mpeg, wav).";
   }
  }
  hex2a(hexx:any) {
    var hex = hexx.toString() //force conversion
    var str = ''
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    return str
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
 
getLocation(selectedValueCode){
  if(selectedValueCode){
    this.errLocation = true;
    let contactProfileDetails = {
      accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
      groupUpdateLog: {
          class: 'class',
          channel: this.userAgent,
          ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
          device: this.deviceType,
          geoLocation: '',
          },
        groupUuid: this.groupId,
        groupLocation: selectedValueCode.scopeTitle,
    }
      this._pocnService.updateGroupLocation(contactProfileDetails).subscribe(
        (response: any) => {
          if (response.data.updateGroupLocation.groupStatusResponse.status === 'success') {
            const spanName = "update-grp-location-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId,
          }
          console.log(attributes);
          const eventName = 'update group location';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully update group location' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
            this.getUserGroupDetail();
            this.viewSelectLocation = true;
            }
          else{
            const spanName = "update-grp-location-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId,
          }
          console.log(attributes);
          const eventName = 'update group location';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update group location' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
          }
      });
  }
  else{
    this.errLocation = false;
  }
}
updateGroupState(selectedValueCode){
  let contactProfileDetails = {
    accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
    groupUpdateLog: {
        class: 'class',
        channel: this.userAgent,
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        geoLocation: '',
        },
      groupUuid: this.groupId,
      groupState: selectedValueCode.statevalue,
  }
    this._pocnService.updateGroupState(contactProfileDetails).subscribe(
      (response: any) => {
        if (response.data.updateGroupState.groupStatusResponse.status === 'success') {
          const spanName = "update-grp-state-btn";
            let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupUuid: this.groupId,
          }
          console.log(attributes);
          const eventName = 'update group state';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully update group state' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
          this.getUserGroupDetail();
          this.viewSelectState = true;
          }
        else{
          const spanName = "update-grp-state-btn";
          let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            groupUuid: this.groupId,
        }
        console.log(attributes);
        const eventName = 'update group state';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update group state' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
        }
    });
}
updateGroupRegion(selectedValueCode){
  let contactProfileDetails = {
    accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
    groupUpdateLog: {
        class: 'class',
        channel: this.userAgent,
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        device: this.deviceType,
        geoLocation: '',
        },
      groupUuid: this.groupId,
      groupState: selectedValueCode.title,
  }
    this._pocnService.updateGroupState(contactProfileDetails).subscribe(
      (response: any) => {
        if (response.data.updateGroupState.groupStatusResponse.status === 'success') {
          const spanName = "update-grp-region-btn";
          let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            groupUuid: this.groupId,
            groupState: selectedValueCode.title
        }
        console.log(attributes);
        const eventName = 'update group region';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully update group region' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
          this.getUserGroupDetail();
          this.viewSelectRegion = true;
          }
        else{
          const spanName = "update-grp-region-btn";
          let attributes = {
            userId: this._pocnLocalStorageManager.getData("userId"),
            firstName: this._pocnLocalStorageManager.getData("firstName"),
            lastName: this._pocnLocalStorageManager.getData("lastName"),
            userEmail:this._pocnLocalStorageManager.getData("userEmail"),
            groupUuid: this.groupId,
            groupState: selectedValueCode.title
        }
        console.log(attributes);
        const eventName = 'update group region';
        const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to update group region' }
        this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
            this.telemetry.parentTrace = result;
        })
        }
    });
}
getRelatedGroups(){
  let accessToken = this._pocnLocalStorageManager.getData("pocnApiAccessToken")
   this._pocnService.relatedGroups(accessToken,this.groupId)?.subscribe(({ data }) => {
     this.relatedGrpDetails =  data['relatedGroups'].data;
     this.relatedGrpDetails = JSON.parse(JSON.stringify(data['relatedGroups'].data));


         this.relatedGrpDetails.forEach((field, index) => {
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
showGroupDetail(group){
  this.router.navigateByUrl('tablinks/groups/group-details-view/' + group.groupUuid,{ state: {  groupMsg: 'relatedGrp'} } );
  // this.router.navigate(['/group-details-view/' + group.groupUuid ]);
}
close(){
  if(this.refetchData.groupMsg=="relatedGrp" ){
    history.back();
   }
   else{
  this.router.navigateByUrl('/tablinks/groups' ,{ state: {  tabMsg: 'groupManageTab'} } );
   }
   if(this.refetchData.postDetailMsg=="editClose" ){
    this.router.navigate(['/tablinks/post'])
  }
}
patientConnectStatusCalls(type){
  this._pocnService.patientConnectStatusCalls(this._pocnLocalStorageManager.getData("userId").toUpperCase( )).subscribe(({ data }) => {
    if(data.patientConnectStatusCalls.nodes != ''){
      let setSuccess ;
      setSuccess = data.patientConnectStatusCalls.nodes[0];
      this.hcpVerified = setSuccess.hcpVerified;
      this.phoneLinked = setSuccess.phoneLinked;
      this.verificationType = setSuccess.verificationType;
      if(setSuccess.patientConnectRegistrationStatus == 1){
        if(type == 'audio'){
          this.router.navigate(['/dialer'])
        }
        else{
          this.goToVideoCall();
        }
      } else{
          // if(setSuccess.hcpVerified == 0 && setSuccess.phoneLinked == 1 &&  this.myUserDialerData.length > 0 && this.verificationType == 'Manual' ){
          //   this.router.navigate(['/dialer'])
          //   this.presentLoading();
          // } else{
            this.router.navigateByUrl('/connect', { state: { tabName: 'groups' , type: type} });
         // }
      }
    }
  })
}

goToVideoCall(){
  let createRoom: any;
  createRoom = {
          accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
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
}
