import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { DeviceDetectorService } from 'ngx-device-detector';
// import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialer-edit-popover',
  templateUrl: './dialer-edit-popover.page.html',
  styleUrls: ['./dialer-edit-popover.page.scss'],
})
export class DialerEditPopoverPage implements OnInit {
  public myUserDialerData: any[];
  public token: string;
  removeIconDisabled: boolean= false;
  disableClass= "ion-no-padding";
  userAgent: string;
  userIp = '';
  deviceType: string = '';
  geolocationPosition: string = '';
  constructor(private modalController: ModalController,
    public alertController: AlertController,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private http: HttpClient,
    private deviceService: DeviceDetectorService,
    private router:Router,
    public telemetry:TelemetryService) {
      this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') +'-'+ "edit-dialer-popover";
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
    this.getDialerCaller();
    this.userAgent = this.detectBrowserName() + ',' + this.detectBrowserVersion();
    this.loadIp();
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
  //load ipaddress
  loadIp() {
    this.http.get('https://jsonip.com').subscribe(
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
  getDialerCaller() {
    this._pocnService.getDialerCaller(this.token)?.subscribe(({ data }) => {
      this.myUserDialerData = data['getDialerCaller'].data;
      if(this.myUserDialerData){
        if(this.myUserDialerData.length == 1){
          this.disableClass= "ion-no-padding disable-btn";
          this.removeIconDisabled = true;
        }
        else{
          this.disableClass= "ion-no-padding";
          this.removeIconDisabled = false;
        }
      }
    })
  }
  async close() {
    await this.modalController.dismiss();
    //this.getUserProfile();
  }
  //remove callerId
 async removeCallerDataId(e:any, ind) {
  if(this.myUserDialerData.length > 1){
    const alert = await this.alertController.create({
      cssClass: 'my-alert',
      header: 'Do you want to remove this?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            const arr: string[] =this.myUserDialerData;
            const index = arr.indexOf(e);
            if (index !== -1) {
              this.myUserDialerData = this.myUserDialerData.filter(item => item !== item);
              let setCallerRemove = [];
              setCallerRemove = this.myUserDialerData;
              let removeData = {
                accessToken: this._pocnLocalStorageManager.getData("pocnApiAccessToken"),
                removeId:e.callerUuid,
                channel: this.userAgent,
                ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
                ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
                device: this.deviceType,
                geoLocation:'',
              }
              this._pocnService.removeCallerId(removeData).subscribe(
                (response: any) => {
                  if (response.data.removeCallerId.updateConnectionResponse.status === 'success') {
                    const spanName = "dialer-remove-callerid-btn";
                    let attributes = {
                        userId: this._pocnLocalStorageManager.getData("userId"),
                        firstName: this._pocnLocalStorageManager.getData("firstName"),
                        lastName: this._pocnLocalStorageManager.getData("lastName"),
                        userEmail:this._pocnLocalStorageManager.getData("userEmail")
                    }
                    const eventName = 'dialer remove caller data';
                    const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully removed caller data' }
                    this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                        this.telemetry.parentTrace = result;
                    })
                    this.getDialerCaller();
                  }
                });
            }
          },
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
  }
  // for one case cant delete
  if(this.myUserDialerData.length == 1){
    this.disableClass= "ion-no-padding disable-btn";
    this.removeIconDisabled = true;
  }
}

}
