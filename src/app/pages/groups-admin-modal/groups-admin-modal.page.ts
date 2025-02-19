import { Component, OnInit, ViewChild } from '@angular/core';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import {  ModalController } from '@ionic/angular';
// import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { IonContent } from '@ionic/angular';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-groups-admin-modal',
  templateUrl: './groups-admin-modal.page.html',
  styleUrls: ['./groups-admin-modal.page.scss'],
})
export class GroupsAdminModalPage implements OnInit {

  token: string;
  memberDetails = [];
  adminDetails = [];
  myGroupLoader : boolean = true;
  showMsg : boolean = true;
  showMemebrMsg : boolean = true;
  disableRemove: boolean = false;
  groupId;
  ownerGrpRequest: boolean = false;
  imageUrl = environment.postProfileImgUrl;
  defaultImg ="assets/images-pocn/group-default-thumbnail.svg";
  userIp = '';
  deviceType: string = '';
  @ViewChild(IonContent) content: IonContent;
  constructor(
    private _pocnService: GraphqlDataService,
    private router:Router,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    public alertController: AlertController,
    public telemetry: TelemetryService,
    private deviceService: DeviceDetectorService,
    private httpClient: HttpClient,
    ) {
      this.token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "group-admin-popover";
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
    this.groupMembersListsCount();
  }
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
  groupMembersListsCount(){
    const userId = this._pocnLocalStorageManager.getData("userId");
    this._pocnService.groupMembersLists(this.groupId)?.subscribe(({ data }) => {
      console.log(data);
      // this.memberDetails =  data['groupMembersLists'].nodes.filter((x) => {
        // if(x.ownerId == userId){
        //  return x.roleId == 1 
        // }
      // })
    
     this.adminDetails = data.groupMembersLists.nodes.filter(x => 
      (x.status == 1 && x.roleId == 1 && x.ownerUserId != x.memberUserId));
     console.log(this.adminDetails);
     if(this.adminDetails.length == 0){
       this.showMsg = true;
     }
     else{
       this.showMsg = false;
     }
     this.memberDetails = data.groupMembersLists.nodes.filter(x => 
      (x.status == 1 && x.roleId == 2 ));
     console.log(this.memberDetails);
     if(this.memberDetails.length == 0){
       this.showMemebrMsg = true;
     }
     else{
       this.showMemebrMsg = false;
     }
     this.myGroupLoader = false;
     let activeMembers = data.groupMembersLists.nodes.filter(x => (x.status == 1 && x.roleId == 2));
      console.log(activeMembers);
    });
  }
  async close() {
    await this.modalController.dismiss();
  }
  makeGroupOwner(data){
    console.log(data);
    this.disableRemove = true;
   let removeMemberData = {
    accessToken: this.token,
    groupId: data.groupId,
    userId: data.memberUserId,
    userFullName: data.fullName,
     ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
    ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
    device: this.deviceType,
    channel: this.device.userAgent,
    geoLocation: ''
  }
  console.log(removeMemberData);
    this._pocnService.makeGroupOwner(removeMemberData).subscribe(
      (response: any) => {
        console.log(response);
        if (response.data.makeGroupOwner.groupStatusResponse.status  === 'Success') {
          const spanName = "make-group-owner-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupId: data.groupId,
          }
          console.log(attributes);
          const eventName = 'make group owner';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully make as group owner' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
          this.content.scrollToTop(3000);
          this.ownerGrpRequest = true;
          setTimeout(function () {
            this.ownerGrpRequest = false;
            this.modalController.dismiss('makeOwner');
          }.bind(this), 3000);
         
          // this.modalController.dismiss('makeOwner');
        }
        else{
          this.disableRemove = false;
          const spanName = "make-group-owner-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              groupId: data.groupId,
          }
          console.log(attributes);
          const eventName = 'make group owner';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to make group owner' }
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

}
