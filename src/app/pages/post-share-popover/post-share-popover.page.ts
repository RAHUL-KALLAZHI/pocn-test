import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController} from "@ionic/angular";
import { SharePostResponse } from './../../services/type';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { HttpClient } from '@angular/common/http';
//import { Geolocation } from '@capacitor/geolocation';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-post-share-popover',
  templateUrl: './post-share-popover.page.html',
  styleUrls: ['./post-share-popover.page.scss'],
})
export class PostSharePopoverPage implements OnInit {
  userIp: string = '';
  userAgent: any;
  deviceType: string = '';
  geolocationPosition: string = '';
  @Input() postId: string;
  @Input() groupId: string;
  eventUserId: any[] = [];
  groupRequestStatus = [];
  userConnectionExist = [];
  showGrpDetails : boolean = false;
  showConnection : boolean = false;
  showUserPost  : boolean = false;
  showSkelton: boolean = true;
  constructor(private router:Router,
    private popoverCtrl: PopoverController,
    private _pocnService: GraphqlDataService,
    private deviceService: DeviceDetectorService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private httpClient: HttpClient,
    public telemetry: TelemetryService,

    ) { }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-' + "post-share-popover";
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
    this.loadIp();
    this.getUserGroups();
    this.getUserConnectionExistPost();
    this.userAgent = this.detectBrowserName() + ',' + this.detectBrowserVersion();
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
      //this.getPosition();
   
     

  }
  // getPosition(): any {
  //   Geolocation.getCurrentPosition().then(coordinates => {
  //     this.geolocationPosition = coordinates.coords.latitude + ',' + coordinates.coords.longitude;
  //   }).catch((error) => {
  //     this.geolocationPosition = "";
  //     console.log('Error getting location', error);
  //   });
  // }
  //device details
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

//for fetching ipaddress
loadIp() {
  this.httpClient.get('https://jsonip.com').subscribe(
    (value:any) => {
      this.userIp = value.ip;
    },
    (error) => {
      console.log(error);
    }
  );

}
  async close(data) {
    await this.popoverCtrl.dismiss(data);
  }
  shareGroup(){
    // console.log(this.postId)
    // const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    // let  postGroupData = {
    //   accessToken:token,
    //   typeItemId: this._pocnLocalStorageManager.getData("userId"),
    //   postId: this.postId,
    //   ipAddress: this.userIp,
    //   geoLocation: '',
    //   device: this.deviceType,
    //   class: "class" ,
    //   channel: this.device.userAgent,
    //   audienceType: '3'
    // }
    // console.log(postGroupData)

    // this._pocnService.sharePost(postGroupData).subscribe(
    //   (response: SharePostResponse) => {
    //     if(response.data) {

         // if(response.data.sharePost.postStatusResponse.status === "success") {
          this.router.navigateByUrl('/group-sharepage',{ state: {  postId: this.postId} } );
            this.close('group');
    //         console.log(response.data.sharePost.postStatusResponse.status)
    //       }
    //     }
    //   }
    // );
  }
  shareConnection(){
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this.eventUserId.push(this._pocnLocalStorageManager.getData("userId"));
    let  postShareData = {
      accessToken:token,
      typeItemId: this.eventUserId,
      postId: this.postId,
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      geoLocation: '',
      device: this.deviceType,
      class: "class" ,
      channel: this.device.userAgent,
      audienceType: '1'
    }
    this._pocnService.sharePost(postShareData).subscribe(
      (response: SharePostResponse) => {
        if(response.data) {
          if(response.data.sharePost.postStatusResponse.status === "success") {
            this.close('connection');
            const spanName = "post-share-connection-btn";
            let attributes = {
                userId: this._pocnLocalStorageManager.getData("userId"),
                firstName: this._pocnLocalStorageManager.getData("firstName"),
                lastName: this._pocnLocalStorageManager.getData("lastName"),
                userEmail:this._pocnLocalStorageManager.getData("userEmail"),
                postId:this.postId
            }
            const eventName = 'post share connection';
            const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully shared post' }
            this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                this.telemetry.parentTrace = result;
            })
          }
        }
      }
    );
  }
  shareUser(){
    console.log(this.postId)
    // this.router.navigate(['/user-sharepage']);
    //  this.router.navigateByUrl('/user-sharepage',{ state: {  postId: this.postId} } );
    //         this.close('user');
    // const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    // let  postUserData = {
    //   accessToken:token,
    //   typeItemId: this._pocnLocalStorageManager.getData("userId"),
    //   postId: this.postId,
    //   ipAddress: this.userIp,
    //   geoLocation: this.geolocationPosition,
    //   device: this.deviceType,
    //   class: "class",
    //   channel: this.userAgent,
    //   audienceType: '2'
    // }
    // this._pocnService.sharePost(postUserData).subscribe(
    //   (response: SharePostResponse) => {
    //     if(response.data) {
    //       if(response.data.sharePost.postStatusResponse.status === "success") {
     this.router.navigateByUrl('/user-sharepage',{ state: {  postId: this.postId} } );
    this.close('user');
    //         console.log(response.data.sharePost.postStatusResponse.status)
    //       }
    //     }
    //   }
    // );
  }
  
  getUserGroups(){
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");

    const userId = this._pocnLocalStorageManager.getData("userId");
    this._pocnService.getUserGroups(token)?.subscribe(({ data }) => {

      this.groupRequestStatus = data['getUserGroups']['data'];
      this.showUserPost = true;
      this.showSkelton = false;
      console.log(this.groupRequestStatus);
      console.log(this.groupRequestStatus.length);
      if(this.groupRequestStatus.length==0){
        this.showGrpDetails = false;
      }
      else{
        this.showGrpDetails = true;
      }
    });
  }
  getUserConnectionExistPost() {
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    this._pocnService.getMyConnections(token)?.subscribe(({ data }) => {
      this.userConnectionExist = data['getMyConnections']['data'];
      console.log(this.userConnectionExist);
      this.showSkelton = false;
      if(this.userConnectionExist.length == 0){
        this.showConnection = false;
      }
      else{
        this.showConnection = true;
      }
      // this.getUserConnectionRequestExistPostt();
    });
}
}
