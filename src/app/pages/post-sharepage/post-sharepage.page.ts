import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { OverlayPopoverPage } from "../overlay-popover/overlay-popover.page";
import { ModalController } from '@ionic/angular';
import { CreateRoomResponse } from './../../services/type';
import { TelemetryService } from 'src/app/services/telemetry.service';

@Component({
  selector: 'app-post-sharepage',
  templateUrl: './post-sharepage.page.html',
  styleUrls: ['./post-sharepage.page.scss'],
})
export class PostSharepagePage implements OnInit {
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
  geolocationPosition: string = '';
  userAgent: string;
  constructor(
    private router:Router,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    private deviceService: DeviceDetectorService,
    private httpClient: HttpClient,
    public telemetry: TelemetryService,
  ) {
    this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
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
      this.getPosition();
      this.loadIp();
  }
  //get location
  // getCurrentPosition = async () => {
  //   const coordinates = await Geolocation.getCurrentPosition();
  //   this.geolocationPosition = coordinates.coords.latitude + ',' + coordinates.coords.longitude;
  // };
  getPosition(): any {
    Geolocation.getCurrentPosition().then(coordinates => {
      this.geolocationPosition = coordinates.coords.latitude + ',' + coordinates.coords.longitude;
    }).catch((error) => {
      this.geolocationPosition = "";
      console.log('Error getting location', error);
    });
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
}
