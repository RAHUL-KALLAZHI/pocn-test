import { Component, OnInit, ViewChild } from '@angular/core';
//import { Geolocation } from '@capacitor/geolocation';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { OverlayPopoverPage } from "../overlay-popover/overlay-popover.page";
import { ModalController } from '@ionic/angular';
import { CreateRoomResponse } from './../../services/type';
import { Location } from '@angular/common';
import { SharePostResponse } from './../../services/type';
import { PublicProfilePage } from '../public-profile/public-profile.page';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { environment } from 'src/environments/environment';
import jsSHA from 'jssha';
import { LoadingService } from 'src/app/services/loading.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-user-sharepage',
  templateUrl: './user-sharepage.page.html',
  styleUrls: ['./user-sharepage.page.scss'],
})
export class UserSharepagePage implements OnInit {
    @ViewChild(IonContent) content: IonContent
  public myUserDialerData: any[];
  public hcpVerified : number;
  public phoneLinked: number;
  public verificationType: string;
  userId: string;
  token: string;
  public userRoomData: string;
  grpErrorIconMsg;
  grpErrorBannerMsg;
  grpErrorMsg;
  userIp = '';
  deviceType: string = '';
  searchText;
  geolocationPosition: string = '';
  userAgent: string;
  userData: any;
  postId: any;
  eventUserId: any[] = [];
  defaultImg ="assets/images-pocn/group-default-thumbnail.svg";
  public refetchData;
  public userSearchData;
  showSearchData: boolean = true;
  hideSearchData: boolean = false;
  emptyShowResult: boolean = true;
  searchLoaderStatus: boolean = true;
  grpSubImageUrl;
  profileImg = "assets/images-pocn/group-default-thumbnail.svg";
  showSharePostSuccess: boolean = true;
  hideShareUserbutton: boolean;
  constructor(private router:Router,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    private deviceService: DeviceDetectorService,
    private httpClient: HttpClient,
    private location:Location,
    public telemetry: TelemetryService,
    public loading: LoadingService,
    ) {
      this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
//       this.postId = this.location.getState();
// console.log(this.postId )
router.events.subscribe(event => {
  if (event instanceof NavigationEnd) {
    this.refetchData = this.location.getState();
    console.log(this.refetchData)
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
    this.getUserProfile();
    this.getDialerCaller();
    this.providerUserInfos();
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
  this.userId = this._pocnLocalStorageManager.getData("userId");

  // this._pocnService.getUserProfile(this.token).subscribe(({ data }) => {
  // this.userId = data['getUserFullProfile'].data['userBasicProfile']['userId'];
  // },
  //   (error) => {
  //       this.router.navigate(['/'])
  //   });
}
getDialerCaller() {
    this._pocnService.getDialerCaller(this.token)?.subscribe(({ data }) => {
    this.myUserDialerData = data['getDialerCaller'].data;
  })
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
          if(setSuccess.hcpVerified == 0 && setSuccess.phoneLinked == 1 &&  this.myUserDialerData.length > 0 && this.verificationType == 'Manual' ){
            this.router.navigate(['/dialer'])
            this.presentLoading();
          } else{
            this.router.navigateByUrl('/connect', { state: { tabName: 'post' , type: type} });
          }
      }
    }
  })
}

goToVideoCall(){
  let createRoom: any;
  createRoom = {
          accessToken: this.token,
          channel: this.device.userAgent,
          ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
          device: this.deviceType,
          geoLocation:'',
        }
  this._pocnService.createRoom(createRoom).subscribe(
    (response: CreateRoomResponse) => {
      if(response.data.createRoom.updateConnectionResponse.status === 'success') {
        this.userRoomData = response.data.createRoom.updateConnectionResponse.data;
      }
      this.router.navigateByUrl('/dialer2', { state: { userDataId: this.userRoomData} });
  });
}
providerUserInfos(){
  this.loading.present();
  let pageNumber = 1;
  let itemsPerPage = 250;
  let searchData = '';
  this._pocnService.getPostUserSearch(this.token,searchData,pageNumber, itemsPerPage)?.subscribe(({ data }) => {
    this.userData = data['getRegisteredUsersConnection']['appConnection'];
    if(this.loading.isLoading) {
      this.loading.dismiss();
    }
   this.userData.forEach((pst, index) => {
     let profileImgUrl = environment.postProfileImgUrl + pst.userId + '.' + pst.fileExtension + '?lastmod=' + Math.random();
     var encoded_url = btoa(profileImgUrl).replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
     var path = "/rs:" + "fit" + ":" + "300" + ":" + "400" + ":" + 0 +
      "/g:" + "no"  + "/" + encoded_url + "." + pst.fileExtension;
      //console.log(path)
      var shaObj = new jsSHA("SHA-256", "BYTES")
      shaObj.setHMACKey(environment.imageProxyKey, "HEX");
      shaObj.update(this.hex2a(environment.imageProxySalt));
      shaObj.update(path);
     var hmac = shaObj.getHMAC("B64").toString().replace(/=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
     pst.profileImgUrl = environment.imageProxyUrl + "/" + hmac + path + '?lastmod=' + Math.random();
     // pst.profileImgUrl = environment.postProfileImgUrl + pst.userId + '.' + pst.fileExtension + '?lastmod=' + Math.random();
    });
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
filterItems(ev: any) {
  // this.getIds();

   let val = ev.target.value;
   console.log(val)
   if (val && val.trim() !== '') {

     // this.connectId =  this.connectId.filter(function(item) {
     //   return item.name.toLowerCase().includes(val.toLowerCase());
     // });
   }
 }
 searchUserData(searchData: any){
  let pageNumber = 1;
  let itemsPerPage = 250;
  this.searchLoaderStatus = false;
  this._pocnService.getPostUserSearch(this.token,searchData,pageNumber, itemsPerPage).subscribe(({ data }) => {
   this.userSearchData =  data['getRegisteredUsersConnection']['appConnection'];
    let searchText = searchData;
    if(this.userSearchData && searchData != ''){
      this.searchLoaderStatus = true;
      this.showSearchData = false;
      this.hideSearchData = true;
      this.emptyShowResult = true;
    } else if(this.userSearchData == 0){
      this.searchLoaderStatus = true;
      this.showSearchData = true;
      this.hideSearchData = true;
      this.emptyShowResult = false;
    }
    else{
        this.searchLoaderStatus = true;
        searchText = '';
        this.providerUserInfos();
        this.showSearchData = true;
        this.hideSearchData = false;
        this.emptyShowResult = true;
    }
  });

}
setCheck(eventData) {
  if(this.eventUserId.includes(eventData)) {
    this.eventUserId = this.eventUserId.filter((value)=>value!=eventData);
console.log(this.eventUserId)
  } else {
    this.eventUserId.push(eventData)
    console.log(this.eventUserId)

  }
 }
shareUserPost(){
  this.hideShareUserbutton = false;
  if(this.refetchData.postId){
   this.postId = this.refetchData.postId;
  }
  if(this.eventUserId.length > 0){
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    let  postUserData = {
      accessToken:token,
      typeItemId:  this.eventUserId,
      postId:  this.postId,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      geoLocation: '',
      device: this.deviceType,
      class: "class",
      channel: this.device.userAgent,
      audienceType: '2'
    }
    console.log(postUserData)
    this._pocnService.sharePost(postUserData).subscribe(
      (response: SharePostResponse) => {
        if(response.data) {
          if(response.data.sharePost.postStatusResponse.status === "success") {
            this.hideShareUserbutton = true;
            this.content.scrollToTop(100);
            this.showSharePostSuccess = false;
             setTimeout(function () {
          this.showSharePostSuccess = true;
          this.router.navigateByUrl('/tablinks/post',{ state: {  postMsg: 'sharePost'} } );
        }.bind(this), 2500);
            const spanName = "post-share-user-btn";
            let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                postId:  this.postId,
            }
            const eventName = 'post share user';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully shared post' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
          }
        }
      }
    );
  }
}
async basicProfileClick(userId){
  let postData;
  postData = {
    userId: userId,
  }
  const popover = await this.modalController.create({
    // component: PostPublicProfilePage,
    // cssClass: 'post-profile-modal',
    component: PublicProfilePage,
    cssClass: 'public-profile-modal',
    componentProps: {
      'memberId': postData,
      'type': 'pocnUser'
    }
  });
  popover.onDidDismiss().then((modalDataResponse) => {

  });
  await popover.present();
}
// onProfileImgError(event){
//   event.target.src = "assets/images-pocn/group-default-thumbnail.svg";
// }
onProfileImgError(event,userId, extension = ''){
   if(extension!='' &&  extension!=null){
    event.target.src =  environment.postProfileImgUrl + userId + '.' + extension ;
    //environment.postProfileImgUrl + fileName +'.' +extension;
   }
  else{
  event.target.src = 'assets/images-pocn/group-default-thumbnail.svg'
 }

 //Do other stuff with the event.target
 }
hex2a(hexx:any) {
  var hex = hexx.toString() //force conversion
  var str = ''
  for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  return str
}
}

