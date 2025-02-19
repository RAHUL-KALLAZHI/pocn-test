
import { Component, OnInit, Input} from '@angular/core';
import { GraphqlDataService } from './../../services/graphql-data.service';
import { LocalStorageManager } from "./../../services/local-storage-manager";
import {  ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
//import { Geolocation } from '@capacitor/geolocation';
import { TelemetryService } from 'src/app/services/telemetry.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cancel-connection-modal',
  templateUrl: './cancel-connection-modal.page.html',
  styleUrls: ['./cancel-connection-modal.page.scss'],
})
export class CancelConnectionModalPage implements OnInit {

  @Input() requestConnection: string;
  @Input() type: string;
  userIp = '';
  deviceType: string = '';
  geolocationPosition: string = ''; 
  hideButton :boolean = false;
  constructor(
    private _pocnService: GraphqlDataService,
    private _pocnLocalStorageManager: LocalStorageManager,
    public modalController: ModalController,
    public alertController: AlertController,
    private deviceService: DeviceDetectorService,
    private httpClient: HttpClient,
    public telemetry: TelemetryService,
    private router: Router,

  ) { }

  ngOnInit() {
    // this.getPosition();
    const spanName = "page-view" + this.router.url.replace(/\//g, '-') + '-'+"cancel-connection-popover";
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
    this.hideButton = false;
  }
  withdrawConnectionRequest() {
    this.hideButton = true;
    console.log(this.requestConnection);
    const token = this._pocnLocalStorageManager.getData("pocnApiAccessToken")
    // const deviceData= {
      const  ipAddressV4= this._pocnLocalStorageManager.getData("ipv4");
      const  ipAddressV6= this._pocnLocalStorageManager.getData("ipv6");
      const device= this.deviceType;
      const channel=this.device.userAgent;
      const geoLocation = ''
    // }
    this._pocnService.withdrawConnectionRequest(token,this.requestConnection['targetUserId'],ipAddressV4,ipAddressV6, device,channel,geoLocation).subscribe(
      (response: any) => {
        if (response.data.withdrawConnectionRequest.connectionUpdateResponse.status === 'success') {
          this.hideButton = false;
          this.modalController.dismiss('outgoingRequest');
          const spanName = "withdraw-connection-request-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              targetUser:this.requestConnection['destFullName']
          }
          console.log(attributes);
          const eventName = 'withdraw connection request';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'success', 'message': 'successfully cancelled connection request' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
        }
      else{
        const spanName = "withdraw-connection-request-btn";
          let attributes = {
              userId: this._pocnLocalStorageManager.getData("userId"),
              firstName: this._pocnLocalStorageManager.getData("firstName"),
              lastName: this._pocnLocalStorageManager.getData("lastName"),
              userEmail:this._pocnLocalStorageManager.getData("userEmail"),
              targetUser:this.requestConnection['destFullName']
          }
          console.log(attributes);
          const eventName = 'withdraw connection request';
          const event =  { 'userEmail': this._pocnLocalStorageManager.getData("userEmail"), 'status': 'failed', 'message': 'failed to cancelled connection request' }
          this.telemetry.sendTrace(spanName, attributes, eventName, event).then((result: string) => {
              this.telemetry.parentTrace = result;
          })
      }
      },
      (error) => {
          console.log('there was an error sending the query', error);
          // this.router.navigate(['/'])
      });
  }
}
