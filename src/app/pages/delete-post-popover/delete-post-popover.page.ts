import { Component, OnInit, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { HttpClient } from '@angular/common/http';
// import { Geolocation } from '@capacitor/geolocation';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { DeletePostResponse } from './../../services/type';
import { PopoverController} from "@ionic/angular";
import { ModalController } from '@ionic/angular';
import { DeletePostConfirmPopoverPage } from "../delete-post-confirm-popover/delete-post-confirm-popover.page";
import { LoadingService } from 'src/app/services/loading.service';
import { Router} from '@angular/router';
import { TelemetryService } from 'src/app/services/telemetry.service';

@Component({
  selector: 'app-delete-post-popover',
  templateUrl: './delete-post-popover.page.html',
  styleUrls: ['./delete-post-popover.page.scss'],
})
export class DeletePostPopoverPage implements OnInit {
  @Input() postId: string;
  @Input() groupData: string;
  @Input() groupId: string;

  userIp: string = '';
  userAgent: any;
  deviceType: string = '';
  geolocationPosition: string = '';
  constructor(
    private popoverCtrl: PopoverController,
    private _pocnService: GraphqlDataService,
    private deviceService: DeviceDetectorService,
    private _pocnLocalStorageManager: LocalStorageManager,
    private httpClient: HttpClient,
    private modalController: ModalController,
    public loading: LoadingService,
    private router: Router,
    public telemetry: TelemetryService,

    ) { }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-')+ '-' +"delete-post-popover";
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
     // this.getPosition();
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
async removePostsData() {
  const popover = await this.modalController.create({
    component: DeletePostConfirmPopoverPage,
    cssClass: 'reject-modal',
  });

  popover.onDidDismiss().then((modalDataResponse) => {
    if(modalDataResponse.data == 'confirm-delete'){
      this.deletePost();
    }
    else{
      this.close('');
    }
  });
  await popover.present();
}
  deletePost(){
      const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
      let  postDeleteData = {
        accessToken:token,
        postId: this.postId,
        ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
        ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
        geoLocation: '',
        device: this.deviceType,
        channel: this.userAgent,
      }
      this._pocnService.deletePost(postDeleteData).subscribe(
        (response: DeletePostResponse) => {
          if(response.data) {
            // if(response.data.createPost.postStatusResponse.data === "") {
            //   this.close('success');
            //   //console.log(response.data.createPost.PostStatusResponse.status)
            // }
           if(this.groupData == "groupDelete") {
            if(response.data.deletePost.postStatusResponse.status === "success") {
              this.close('groupDelete');
              const spanName = "group-post-delete-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'group post delete';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully deleted group post' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })            }
           }
           else{
            if(response.data.deletePost.postStatusResponse.status === "success") {
              this.close('delete');
              const spanName = "post-delete-btn";
              let attributes = {
                  userId: this._pocnLocalStorageManager.getData("userId"),
                  firstName: this._pocnLocalStorageManager.getData("firstName"),
                  lastName: this._pocnLocalStorageManager.getData("lastName"),
                  userEmail:this._pocnLocalStorageManager.getData("userEmail")
              }
              const eventName = 'post delete';
              const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully deleted post' }
              this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
                  this.telemetry.parentTrace = result;
              })             }
           }
          }
        }
      );
  }
}
