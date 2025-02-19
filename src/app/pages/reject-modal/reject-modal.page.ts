
import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import { OverlayPopoverPage } from "../overlay-popover/overlay-popover.page";
import {  ModalController } from '@ionic/angular';
import { CreateRoomResponse } from './../../services/type';
import { PublicProfilePage } from '../public-profile/public-profile.page';
import { MdmProfilePage } from '../mdm-profile/mdm-profile.page';
import { AlertController } from '@ionic/angular';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
// import { Geolocation } from '@capacitor/geolocation';
import { TelemetryService } from 'src/app/services/telemetry.service';
@Component({
  selector: 'app-reject-modal',
  templateUrl: './reject-modal.page.html',
  styleUrls: ['./reject-modal.page.scss'],
})
export class RejectModalPage implements OnInit {
  @Input() requestConnection: string;
  @Input() type: string;
  userIp = '';
  geolocationPosition: string = '';
  deviceType: string = '';
  constructor(private router:Router,
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    public alertController: AlertController,
    private deviceService: DeviceDetectorService,
    private httpClient: HttpClient,
    public telemetry: TelemetryService,
  ) { }

  ngOnInit() {
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+ "reject-popover";
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
    // this.getPosition();
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
  }
   //get location
  //  getCurrentPosition = async () => {
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

  async close() {
    await this.modalController.dismiss();
  }
  rejectRequest(){
    console.log(this.requestConnection);
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken");
    const connectionRejectData = {
      accessToken: token,
      connectionRequestId: this.requestConnection['connectionRequestId'],
      rejectReason: '',
      ipAddressV4: this._pocnLocalStorageManager.getData("ipv4"),
ipAddressV6: this._pocnLocalStorageManager.getData("ipv6"),
      device: this.deviceType,
      channel: this.device.userAgent,
      geoLocation: this.geolocationPosition
    }
    console.log(connectionRejectData);
    this._pocnService.submitRejectConnectionRequest(connectionRejectData).subscribe(
      (response: any) => {
        console.log("hiiiiiiii1222222");
        this._pocnService.sendRejectConnectionRequestMail(connectionRejectData).subscribe(
          (response: any) => {
            console.log("mail send succsfully");
          })
        console.log(response);
        if (response.data.submitRejectConnectionRequest.connectionUpdateResponse.status === 'Success') {
          const spanName = "reject-request-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              connectionRequestId: this.requestConnection['connectionRequestId']
          }
          console.log(attributes);
          const eventName = 'reject request';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully reject connection request' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
          this.modalController.dismiss('incomingRequest');
          }
      else{
        const spanName = "reject-request-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              connectionRequestId: this.requestConnection['connectionRequestId']
          }
          console.log(attributes);
          const eventName = 'reject request';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to reject connection request' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
      }


      });
}
}
